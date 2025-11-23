const fs = require('fs').promises;
const path = require('path');

class ContentGenerator {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.prompts = null;
        this.siteStructures = null;
    }

    async initialize() {
        const promptsPath = path.join(__dirname, '..', 'config', 'prompts.json');
        const structuresPath = path.join(__dirname, '..', 'config', 'site-structures.json');

        this.prompts = JSON.parse(await fs.readFile(promptsPath, 'utf8'));
        this.siteStructures = JSON.parse(await fs.readFile(structuresPath, 'utf8'));
    }

    /**
     * Génère tout le contenu du site
     */
    async generateSiteContent(analysis, branding, keywords, structure) {
        console.log('🤖 Génération du contenu du site...');

        const content = {
            pages: {},
            metadata: {
                generatedAt: new Date().toISOString(),
                theme: analysis.theme,
                tone: analysis.tone
            }
        };

        // Générer le contenu pour chaque page définie dans la structure
        for (const pageType of structure.pages) {
            if (pageType === 'blog') continue; // Le blog est géré séparément

            console.log(`  📝 Génération de la page: ${pageType}`);

            try {
                const pageContent = await this.generatePageContent(
                    pageType,
                    analysis,
                    branding,
                    keywords
                );
                content.pages[pageType] = pageContent;

                // Délai pour éviter la surcharge de l'API
                await this.delay(2000);
            } catch (error) {
                console.error(`  ❌ Erreur pour ${pageType}:`, error.message);
                // Utiliser le fallback adaptatif selon le thème détecté
                const detectedTheme = analysis.theme || 'general';
                content.pages[pageType] = this.getThemeAdaptiveContent(pageType, branding, detectedTheme);
            }
        }

        return content;
    }

    /**
     * Génère le contenu pour une page spécifique
     */
    async generatePageContent(pageType, analysis, branding, keywords) {
        // Sélectionner les mots-clés pertinents pour cette page
        const pageKeywords = this.selectPageKeywords(keywords, pageType);

        // Normaliser le nom de la page (FR -> EN)
        const normalizedPageType = this.normalizePageType(pageType);

        // Pour la page home, utiliser le prompt one-page complet
        const promptKey = normalizedPageType === 'home' ? 'onepage' : normalizedPageType;

        // Préparer le prompt spécifique à la page
        const promptTemplate = this.prompts.content[promptKey];
        if (!promptTemplate) {
            // Utiliser le fallback adaptatif selon le thème détecté
            const detectedTheme = analysis.theme || 'general';
            return this.getThemeAdaptiveContent(pageType, branding, detectedTheme);
        }

        const prompt = this.fillPromptTemplate(promptTemplate, {
            theme: analysis.theme,
            brandName: branding.brandName,
            tagline: branding.tagline,
            valueProposition: branding.valueProposition,
            tone: analysis.tone,
            sector: analysis.sector,
            businessType: analysis.businessType,
            keywords: pageKeywords.join(', ')
        });

        // Générer le contenu via l'API
        const response = await this.apiClient.generateContent(prompt);

        // Parser et structurer la réponse
        const content = this.parsePageContent(response, pageType);

        // Générer les métadonnées SEO
        content.meta = await this.generatePageMeta(
            pageType,
            branding,
            analysis.theme,
            pageKeywords[0]
        );

        return content;
    }

    /**
     * Parse le contenu généré en structure utilisable
     */
    parsePageContent(rawContent, pageType) {
        const content = {
            raw: rawContent,
            sections: {}
        };

        // Extraction basique des sections
        // Pour la page d'accueil (one-page complète)
        if (pageType === 'home') {
            // Section Hero
            content.hero_title = this.extractStructuredSection(rawContent, 'TITRE PRINCIPAL') || 'Bienvenue';
            content.hero_subtitle = this.extractStructuredSection(rawContent, 'SOUS-TITRE') || 'Découvrez nos services';
            content.hero_content = this.extractStructuredSection(rawContent, 'SECTION HERO') || 'Contenu de présentation.';

            // Propositions de valeur / Features
            const propositions = this.extractStructuredSection(rawContent, 'PROPOSITIONS DE VALEUR');
            if (propositions) {
                content.features_content = this.formatBulletPoints(propositions);
                content.features_title = 'Nos Atouts';
            } else {
                content.features_content = '<ul><li>Service de qualité</li></ul>';
                content.features_title = 'Nos Atouts';
            }

            // Services
            const services = this.extractStructuredSection(rawContent, 'NOS SERVICES');
            if (services) {
                content.services_title = 'Nos Services';
                content.services_content = this.formatServicesContent(services);
            }

            // About / À propos
            const about = this.extractStructuredSection(rawContent, 'À PROPOS');
            if (about) {
                content.about_title = 'À Propos';
                content.about_content = '<p>' + about.replace(/\n\n/g, '</p><p>') + '</p>';
            }

            // Pricing / Tarifs
            const pricing = this.extractStructuredSection(rawContent, 'TARIFS');
            if (pricing) {
                content.pricing_title = 'Nos Tarifs';
                content.pricing_content = this.formatPricingContent(pricing);
            }

            // Témoignages
            const testimonials = this.extractStructuredSection(rawContent, 'TÉMOIGNAGES');
            if (testimonials) {
                content.testimonials_title = 'Témoignages';
                content.testimonials_content = this.formatTestimonials(testimonials);
            }

            // Contact
            const contact = this.extractStructuredSection(rawContent, 'CONTACT');
            if (contact) {
                content.contact_title = 'Contact';
                content.contact_content = this.formatContactInfo(contact);
            }

            // Pourquoi nous choisir / Benefits
            const pourquoi = this.extractStructuredSection(rawContent, 'POURQUOI NOUS CHOISIR');
            if (pourquoi) {
                content.benefits_content = this.formatBulletPoints(pourquoi);
                content.benefits_title = 'Pourquoi nous choisir';
            }

            // CTA
            const cta = this.extractStructuredSection(rawContent, 'APPEL À L\'ACTION');
            content.cta_primary = cta || 'Commencer';
            content.cta_title = 'Prêt à Commencer ?';
            content.cta_text = 'Contactez-nous dès maintenant';
            content.cta_button = content.cta_primary;

            // Preuve sociale
            const preuve = this.extractStructuredSection(rawContent, 'PREUVE SOCIALE');
            if (preuve) {
                content.social_proof = preuve;
            }
        }

        // Pour les services
        if (pageType === 'services') {
            content.services_title = 'Nos Services';
            content.services_content = this.formatServicesContent(rawContent);
        }

        // Pour pricing
        if (pageType === 'pricing') {
            content.pricing_title = 'Nos Tarifs';
            content.pricing_content = this.formatPricingContent(rawContent);
        }

        // Pour about
        if (pageType === 'about') {
            content.about_title = 'À Propos';
            content.about_content = this.formatAboutContent(rawContent);
        }

        // Pour contact
        if (pageType === 'contact') {
            content.contact_title = 'Contactez-nous';
            content.contact_content = this.formatContactContent(rawContent);
        }

        // Titre générique de features
        content.features_title = content.features_title || 'Nos Atouts';
        content.benefits_title = content.benefits_title || 'Vos Avantages';
        content.cta_title = content.cta_title || 'Prêt à Commencer ?';
        content.cta_text = content.cta_text || 'Contactez-nous dès maintenant pour discuter de votre projet';
        content.cta_button = content.cta_button || 'Nous Contacter';

        return content;
    }

    /**
     * Formate le contenu des services
     */
    formatServicesContent(raw) {
        const services = [];
        const serviceMatches = raw.matchAll(/###?\s*(.*?)\n([\s\S]*?)(?=\n###?|$)/g);

        for (const match of serviceMatches) {
            services.push(`
                <div class="service-item">
                    <h3>${match[1]}</h3>
                    <div>${this.cleanContent(match[2])}</div>
                </div>
            `);
        }

        return services.join('\n') || this.cleanContent(raw);
    }

    /**
     * Formate le contenu des tarifs
     */
    formatPricingContent(raw) {
        // Chercher les plans tarifaires
        const plansMatch = raw.match(/plans? tarifaires?[:\s]*([\s\S]*?)(?=Tableau|FAQ|Garanties|$)/i);
        if (plansMatch) {
            return this.formatPricingPlans(plansMatch[1]);
        }
        return this.cleanContent(raw);
    }

    /**
     * Formate les plans tarifaires
     */
    formatPricingPlans(plansText) {
        const plans = [];
        const planMatches = plansText.matchAll(/###?\s*(.*?)\n.*?(\d+[\s€].*?)\n([\s\S]*?)(?=\n###?|$)/g);

        for (const match of planMatches) {
            plans.push(`
                <div class="pricing-card">
                    <h3>${match[1]}</h3>
                    <div class="price">${match[2]}</div>
                    <div class="features">${this.cleanContent(match[3])}</div>
                    <button class="btn-select-plan">Choisir ce plan</button>
                </div>
            `);
        }

        return `<div class="pricing-grid">${plans.join('\n')}</div>`;
    }

    /**
     * Formate le contenu About
     */
    formatAboutContent(raw) {
        const sections = [];

        // Histoire
        const historyMatch = raw.match(/Histoire[:\s]*([\s\S]*?)(?=Mission|Vision|Valeurs|Équipe|$)/i);
        if (historyMatch) {
            sections.push(`
                <section class="about-history">
                    <h2>Notre Histoire</h2>
                    <div>${this.cleanContent(historyMatch[1])}</div>
                </section>
            `);
        }

        // Mission et Vision
        const missionMatch = raw.match(/Mission[:\s]*([\s\S]*?)(?=Vision|Valeurs|Équipe|$)/i);
        if (missionMatch) {
            sections.push(`
                <section class="about-mission">
                    <h2>Notre Mission</h2>
                    <div>${this.cleanContent(missionMatch[1])}</div>
                </section>
            `);
        }

        return sections.join('\n') || this.cleanContent(raw);
    }

    /**
     * Formate le contenu Contact
     */
    formatContactContent(raw) {
        return `
            <div class="contact-wrapper">
                <div class="contact-form">
                    <form>
                        <div class="form-group">
                            <label>Nom</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit">Envoyer</button>
                    </form>
                </div>
                <div class="contact-info">
                    ${this.cleanContent(raw)}
                </div>
            </div>
        `;
    }

    /**
     * Formate les informations de contact simples
     */
    formatContactInfo(raw) {
        return '<div class="contact-info">' + raw.replace(/\n/g, '<br>') + '</div>';
    }

    /**
     * Formate les témoignages
     */
    formatTestimonials(raw) {
        const testimonials = [];
        const quotes = raw.split(/\n\n/).filter(t => t.trim());

        quotes.forEach(quote => {
            const quoteMatch = quote.match(/"([^"]+)"/);
            const authorMatch = quote.match(/[-–]\s*(.+)$/m);

            if (quoteMatch) {
                testimonials.push(`
                    <div class="testimonial">
                        <blockquote>"${quoteMatch[1]}"</blockquote>
                        ${authorMatch ? `<cite>– ${authorMatch[1]}</cite>` : ''}
                    </div>
                `);
            }
        });

        return testimonials.length > 0
            ? `<div class="testimonials-grid">${testimonials.join('')}</div>`
            : '<p>Témoignages à venir</p>';
    }

    /**
     * Génère les métadonnées SEO pour une page
     */
    async generatePageMeta(pageType, branding, theme, mainKeyword) {
        const prompt = this.prompts.seo.meta
            .replace('{pageType}', pageType)
            .replace('{brandName}', branding.brandName)
            .replace('{theme}', theme)
            .replace('{mainKeyword}', mainKeyword || theme);

        try {
            const response = await this.apiClient.generateContent(prompt);
            return this.parseMetaContent(response);
        } catch (error) {
            return this.getDefaultMeta(pageType, branding);
        }
    }

    /**
     * Parse les métadonnées générées
     */
    parseMetaContent(raw) {
        const meta = {
            title: this.extractSection(raw, 'Title:', '\n') || '',
            description: this.extractSection(raw, 'Meta description:', '\n') || '',
            keywords: this.extractSection(raw, 'mots-clés:', '\n') || '',
            ogTitle: this.extractSection(raw, 'Open Graph title:', '\n') || '',
            ogDescription: this.extractSection(raw, 'Open Graph description:', '\n') || ''
        };

        // Nettoyer et limiter la longueur
        meta.title = meta.title.substring(0, 60);
        meta.description = meta.description.substring(0, 160);

        return meta;
    }

    /**
     * Normalise le nom de page (FR -> EN)
     */
    normalizePageType(pageType) {
        const pageTypeMapping = {
            'tarifs': 'pricing',
            'apropos': 'about',
            'a-propos': 'about',
            'equipe': 'team',
            'temoignages': 'testimonials',
            'contact': 'contact',
            'accueil': 'home',
            'services': 'services',
            'portefeuille': 'portfolio',
            'travaux': 'portfolio',
            'work': 'portfolio',
            'expertise': 'services',
            'methodology': 'services',
            'methodologie': 'services',
            'features': 'services',
            'fonctionnalites': 'services',
            'courses': 'services',
            'cours': 'services',
            'instructors': 'team',
            'formateurs': 'team',
            'solutions': 'services',
            'industries': 'services',
            'company': 'about',
            'entreprise': 'about',
            'careers': 'about',
            'carrieres': 'about',
            'docs': 'faq',
            'documentation': 'faq'
        };

        return pageTypeMapping[pageType.toLowerCase()] || pageType;
    }

    /**
     * Sélectionne les mots-clés pour une page
     */
    selectPageKeywords(allKeywords, pageType) {
        const distribution = {
            home: { start: 0, count: 5 },
            services: { start: 5, count: 8 },
            pricing: { start: 13, count: 5 },
            about: { start: 18, count: 4 },
            contact: { start: 22, count: 3 },
            portfolio: { start: 25, count: 5 },
            lexique: { start: 0, count: 30 }
        };

        const config = distribution[pageType] || { start: 0, count: 5 };
        return allKeywords.slice(config.start, config.start + config.count);
    }

    /**
     * Remplit un template de prompt
     */
    fillPromptTemplate(template, variables) {
        let filled = template;
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{${key}}`, 'g');
            filled = filled.replace(regex, value);
        }
        return filled;
    }

    /**
     * Extrait une section de texte
     */
    extractSection(text, startMarker, endMarker) {
        const startIndex = text.indexOf(startMarker);
        if (startIndex === -1) return '';

        const start = startIndex + startMarker.length;
        const endIndex = endMarker ? text.indexOf(endMarker, start) : text.length;

        if (endIndex === -1) return text.substring(start).trim();
        return text.substring(start, endIndex).trim();
    }

    /**
     * Formate du texte en liste HTML
     */
    formatAsList(text) {
        const items = text.split(/\n|•|-|\d\./)
            .map(item => item.trim())
            .filter(item => item.length > 0);

        return `
            <ul>
                ${items.map(item => `<li>${item}</li>`).join('\n')}
            </ul>
        `;
    }

    /**
     * Extrait le texte du CTA
     */
    extractCTA(text) {
        const ctaWords = ['Commencer', 'Démarrer', 'Contacter', 'Essayer', 'Découvrir'];
        for (const word of ctaWords) {
            if (text.includes(word)) {
                return word;
            }
        }
        return 'En savoir plus';
    }

    /**
     * Nettoie le contenu HTML
     */
    cleanContent(text) {
        // Appliquer d'abord le nettoyage des artifacts de l'API
        let cleaned = this.sanitizeApiArtifacts(text);

        // Puis nettoyer le markdown standard
        cleaned = cleaned
            .replace(/```html?/g, '')
            .replace(/```/g, '')
            .replace(/\*\*/g, '')
            .replace(/^\s*[-*]\s+/gm, '')
            .trim();

        return cleaned;
    }

    /**
     * Système de fallback intelligent adaptatif au thème
     */
    getThemeAdaptiveContent(pageType, branding, detectedTheme = 'general') {
        const themeAdaptations = {
            'pets': {
                vocabulary: ['découvrez', 'explorez', 'partagez', 'profitez'],
                tone: 'friendly',
                features: ['Conseils experts', 'Communauté bienveillante', 'Ressources utiles'],
                cta: 'Découvrir nos conseils'
            },
            'business': {
                vocabulary: ['développez', 'optimisez', 'transformez', 'réussissez'],
                tone: 'professional',
                features: ['Solutions sur mesure', 'Expertise reconnue', 'Résultats mesurables'],
                cta: 'Demander un devis'
            },
            'tech': {
                vocabulary: ['innovez', 'créez', 'développez', 'automatisez'],
                tone: 'modern',
                features: ['Technologies avancées', 'Performance optimale', 'Support technique'],
                cta: 'Commencer gratuitement'
            },
            'creative': {
                vocabulary: ['créez', 'inspirez', 'imaginez', 'réalisez'],
                tone: 'artistic',
                features: ['Créativité sans limites', 'Outils professionnels', 'Portfolio showcase'],
                cta: 'Voir notre portfolio'
            },
            'general': {
                vocabulary: ['découvrez', 'explorez', 'profitez', 'partagez'],
                tone: 'neutral',
                features: ['Qualité', 'Fiabilité', 'Satisfaction'],
                cta: 'En savoir plus'
            }
        };

        const adaptation = themeAdaptations[detectedTheme] || themeAdaptations['general'];

        return this.getDefaultPageContent(pageType, branding, adaptation);
    }

    /**
     * Contenu par défaut pour une page avec adaptation thématique
     */
    getDefaultPageContent(pageType, branding, themeAdaptation = null) {
        // Adapter selon le thème si fourni
        const features = themeAdaptation ? themeAdaptation.features : ['Qualité', 'Fiabilité', 'Satisfaction'];
        const ctaText = themeAdaptation ? themeAdaptation.cta : 'En savoir plus';
        const actionVerb = themeAdaptation && themeAdaptation.vocabulary[0] ? themeAdaptation.vocabulary[0] : 'découvrez';

        const defaults = {
            home: {
                hero_title: branding.brandName || 'Bienvenue',
                hero_subtitle: branding.tagline || `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} notre univers`,
                features_content: `<ul>${features.map(f => `<li>${f}</li>`).join('')}</ul>`,
                benefits_content: '<ul><li>Service personnalisé</li><li>Équipe expérimentée</li><li>Accompagnement complet</li></ul>',
                cta_primary: ctaText,
                cta_title: `Prêt à ${actionVerb} ?`,
                cta_text: branding.valueProposition || `${actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} ce que nous avons à vous offrir`,
                cta_button: ctaText
            },
            services: {
                services_title: 'Ce que nous proposons',
                services_content: `<p>Découvrez notre sélection de contenus et services adaptés à vos centres d'intérêt.</p>`
            },
            pricing: {
                pricing_title: 'Informations',
                pricing_content: '<p>Contactez-nous pour plus de détails.</p>'
            },
            about: {
                about_title: 'À Propos',
                about_content: `<p>Bienvenue sur ${branding.brandName || 'notre site'}. ${branding.tagline || 'Nous sommes ravis de partager notre passion avec vous.'}</p>`
            },
            contact: {
                contact_title: 'Contact',
                contact_content: '<p>Nous sommes à votre écoute.</p>'
            }
        };

        return defaults[pageType] || {};
    }

    /**
     * Métadonnées par défaut
     */
    getDefaultMeta(pageType, branding) {
        const pageTitles = {
            home: '',
            services: 'Services',
            pricing: 'Tarifs',
            about: 'À Propos',
            contact: 'Contact'
        };

        const suffix = pageTitles[pageType] ? ` | ${pageTitles[pageType]}` : '';

        return {
            title: `${branding.brandName}${suffix}`,
            description: branding.valueProposition.substring(0, 160),
            keywords: branding.brandName.toLowerCase(),
            ogTitle: `${branding.brandName}${suffix}`,
            ogDescription: branding.valueProposition.substring(0, 160)
        };
    }

    /**
     * Nettoie les labels structurels de l'API (TITRE PRINCIPAL, SOUS-TITRE, etc.)
     */
    sanitizeApiArtifacts(text) {
        if (!text) return text;

        // Liste des labels structurels à supprimer
        const structuralLabels = [
            'TITRE PRINCIPAL',
            'SOUS-TITRE',
            'SECTION HERO',
            'PROPOSITIONS DE VALEUR',
            'POURQUOI NOUS CHOISIR',
            'APPEL À L\'ACTION',
            'AVANTAGES',
            'FEATURES',
            'BÉNÉFICES',
            'SERVICES',
            'TARIFS',
            'À PROPOS',
            'CONTACT',
            'CTA'
        ];

        let cleaned = text;

        // Supprimer les labels avec leurs deux-points (sensible à la casse)
        structuralLabels.forEach(label => {
            const regex = new RegExp(`\\b${label}\\s*:`, 'gi');
            cleaned = cleaned.replace(regex, '');
        });

        // Supprimer les lignes vides consécutives créées par la suppression
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        // Nettoyer les espaces au début/fin
        cleaned = cleaned.trim();

        return cleaned;
    }

    /**
     * Extrait une section structurée (nouveau format)
     */
    extractStructuredSection(text, sectionName) {
        // Essayer d'abord le format avec ═══
        const regexWithBorders = new RegExp(`═+\\s*${sectionName}\\s*═+\\s*\\n([\\s\\S]*?)(?=\\n\\s*═+\\s*[A-Z]|$)`, 'i');
        let match = text.match(regexWithBorders);

        // Si pas trouvé, essayer le format simple avec :
        if (!match) {
            const regexSimple = new RegExp(`${sectionName}:\\s*([\\s\\S]*?)(?=\\n\\n[A-Z][A-Z ]+:|═+|$)`, 'i');
            match = text.match(regexSimple);
        }

        if (!match || !match[1]) return '';

        // Nettoyer le markdown et les artifacts
        let content = match[1].trim()
            .replace(/\*\*(.*?)\*\*/g, '$1')  // Supprimer **gras**
            .replace(/\*(.*?)\*/g, '$1')      // Supprimer *italique*
            .replace(/^#+\s*/gm, '')          // Supprimer # titres
            .replace(/^\n+|\n+$/g, '')        // Supprimer lignes vides début/fin
            .replace(/\n{3,}/g, '\n\n')       // Max 2 lignes vides consécutives
            .replace(/\[.*?\]/g, '')          // Supprimer les [instructions entre crochets]
            .trim();

        // Supprimer les autres sections qui auraient pu être incluses par erreur
        content = content.split(/\n\s*═+\s*[A-Z]/)[0].trim();
        content = content.split(/\n\n[A-Z][A-Z ]+:/)[0].trim();

        // 🆕 Appliquer le nettoyage des artifacts de l'API
        content = this.sanitizeApiArtifacts(content);

        return content;
    }

    /**
     * Formate les bullet points en HTML
     */
    formatBulletPoints(text) {
        // Gérer le format avec ▸ TITRE: ... DESCRIPTION: ...
        const structuredItems = text.split(/▸/).filter(item => item.trim());

        if (structuredItems.length > 0 && text.includes('TITRE:')) {
            const features = structuredItems.map(item => {
                const titleMatch = item.match(/TITRE:\s*([^\n]+)/i);
                const descMatch = item.match(/DESCRIPTION:\s*([^\n▸]+)/i);

                if (titleMatch && descMatch) {
                    return `<li><strong>${titleMatch[1].trim()}</strong><br>${descMatch[1].trim()}</li>`;
                } else if (titleMatch) {
                    return `<li><strong>${titleMatch[1].trim()}</strong></li>`;
                }
                return '';
            }).filter(f => f);

            if (features.length > 0) {
                return `<ul class="features-list">${features.join('')}</ul>`;
            }
        }

        // Format classique avec •, -, *
        const lines = text.split('\n').filter(line => line.trim());
        const items = lines
            .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('▸'))
            .map(line => line.replace(/^[•\-*▸]\s*/, '').trim())
            .filter(item => item.length > 0);

        if (items.length === 0) {
            return '<ul><li>Service de qualité</li><li>Équipe experte</li><li>Support client</li></ul>';
        }

        return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    /**
     * Délai utilitaire
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ContentGenerator;