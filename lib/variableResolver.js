/**
 * Système de Résolution Automatique des Variables
 * Remplit automatiquement les variables manquantes dans les templates
 */

class VariableResolver {
    constructor(config = {}) {
        this.config = {
            language: config.language || 'fr',
            generateMissing: config.generateMissing !== false,
            warnOnMissing: config.warnOnMissing !== false,
            ...config
        };

        // Dictionnaire de valeurs par défaut intelligentes
        this.defaultValues = this.initializeDefaults();
        this.generatedValues = new Map();
    }

    /**
     * Initialise les valeurs par défaut
     */
    initializeDefaults() {
        return {
            // Navigation
            nav_home: 'Accueil',
            nav_services: 'Services',
            nav_about: 'À propos',
            nav_team: 'Équipe',
            nav_blog: 'Blog',
            nav_contact: 'Contact',
            nav_features: 'Fonctionnalités',
            nav_testimonials: 'Témoignages',
            nav_pricing: 'Tarifs',
            nav_portfolio: 'Portfolio',
            nav_faq: 'FAQ',
            nav_login: 'Connexion',
            nav_signup: 'Inscription',
            nav_cta_text: 'Commencer',

            // Sections
            section_services_title: 'Nos Services',
            section_about_title: 'À Propos de Nous',
            section_team_title: 'Notre Équipe',
            section_blog_title: 'Blog & Actualités',
            section_contact_title: 'Contactez-Nous',
            section_features_title: 'Fonctionnalités',
            section_testimonials_title: 'Témoignages Clients',
            section_pricing_title: 'Nos Tarifs',
            section_portfolio_title: 'Notre Portfolio',
            section_faq_title: 'Questions Fréquentes',

            // Call to Actions
            cta_primary: 'Commencer maintenant',
            cta_secondary: 'En savoir plus',
            cta_contact: 'Nous contacter',
            cta_demo: 'Demander une démo',
            cta_quote: 'Demander un devis',
            cta_download: 'Télécharger',
            cta_learn_more: 'En savoir plus',
            cta_get_started: 'Démarrer',
            cta_sign_up: 'S\'inscrire',
            cta_subscribe: 'S\'abonner',

            // Footer
            footer_text: 'Tous droits réservés.',
            footer_copyright: '© 2024 Tous droits réservés',
            footer_privacy: 'Politique de confidentialité',
            footer_terms: 'Conditions d\'utilisation',
            footer_sitemap: 'Plan du site',
            privacy_url: '/privacy.html',
            terms_url: '/terms.html',
            privacy_text: 'Confidentialité',
            terms_text: 'Mentions légales',

            // Newsletter
            newsletter_title: 'Restez informé',
            newsletter_text: 'Abonnez-vous à notre newsletter pour recevoir nos dernières actualités.',
            newsletter_placeholder: 'Votre adresse email',
            newsletter_button: 'S\'abonner',
            newsletter_cta: 'Rejoignez notre newsletter',

            // Social
            social_facebook: 'https://facebook.com',
            social_twitter: 'https://twitter.com',
            social_linkedin: 'https://linkedin.com',
            social_instagram: 'https://instagram.com',
            social_youtube: 'https://youtube.com',

            // Descriptors (pets specific but can be generic)
            descriptor_adorable: 'adorable',
            descriptor_mignon: 'mignon',
            descriptor_doux: 'doux',
            descriptor_affectueux: 'affectueux',
            descriptor_ludique: 'ludique',
            descriptor_professionnel: 'professionnel',
            descriptor_expert: 'expert',
            descriptor_qualité: 'de qualité',
            descriptor_innovant: 'innovant',
            descriptor_fiable: 'fiable',

            // Generic content
            hero_subtitle: 'Découvrez nos solutions',
            hero_description: 'Votre partenaire de confiance pour tous vos besoins',
            about_intro: 'Nous sommes une équipe passionnée dédiée à fournir les meilleurs services.',
            services_intro: 'Découvrez notre gamme complète de services adaptés à vos besoins.',
            contact_intro: 'N\'hésitez pas à nous contacter pour toute question.',

            // Common placeholders
            phone: '+33 1 23 45 67 89',
            email: 'contact@example.com',
            address: 'Paris, France',
            business_hours: 'Lun-Ven: 9h-18h',

            // Meta defaults
            og_image: '/assets/og-image.jpg',
            meta_keywords: 'service, qualité, professionnel',

            // Site URLs
            site_url: 'https://example.com',
            home_url: '/',
            blog_url: '/blog.php',
            services_url: '/services.html',
            about_url: '/about.html',
            contact_url: '/contact.html',
            pricing_url: '/pricing.html'
        };
    }

    /**
     * Détecte toutes les variables non remplies dans un contenu
     */
    findMissingVariables(content) {
        const regex = /\{([^}]+)\}/g;
        const variables = new Set();
        let match;

        while ((match = regex.exec(content)) !== null) {
            variables.add(match[1]);
        }

        return Array.from(variables);
    }

    /**
     * Résout une variable unique
     */
    resolveVariable(variableName, context = {}) {
        // 1. Vérifier dans le contexte fourni
        if (context[variableName] !== undefined) {
            return context[variableName];
        }

        // 2. Vérifier dans les valeurs déjà générées
        if (this.generatedValues.has(variableName)) {
            return this.generatedValues.get(variableName);
        }

        // 3. Vérifier dans les valeurs par défaut
        if (this.defaultValues[variableName] !== undefined) {
            return this.defaultValues[variableName];
        }

        // 4. Générer une valeur intelligente basée sur le nom
        if (this.config.generateMissing) {
            const generated = this.generateSmartValue(variableName, context);
            this.generatedValues.set(variableName, generated);
            return generated;
        }

        // 5. Retourner placeholder visible
        return `[${variableName}]`;
    }

    /**
     * Génère une valeur intelligente basée sur le nom de la variable
     */
    generateSmartValue(variableName, context) {
        const name = variableName.toLowerCase();

        // Navigation items
        if (name.startsWith('nav_')) {
            const section = name.replace('nav_', '');
            return this.capitalize(section.replace(/_/g, ' '));
        }

        // Section titles
        if (name.includes('_title')) {
            const section = name.replace('_title', '').replace('section_', '');
            return this.capitalize(section.replace(/_/g, ' '));
        }

        // URLs
        if (name.includes('_url')) {
            const page = name.replace('_url', '');
            return `/${page.replace(/_/g, '-')}.html`;
        }

        // Buttons/CTAs
        if (name.startsWith('cta_') || name.includes('_button')) {
            return 'En savoir plus';
        }

        // Descriptors
        if (name.startsWith('descriptor_')) {
            const descriptor = name.replace('descriptor_', '');
            return descriptor.replace(/_/g, ' ');
        }

        // Social links
        if (name.startsWith('social_')) {
            const platform = name.replace('social_', '');
            return `https://${platform}.com`;
        }

        // Text content
        if (name.includes('_text') || name.includes('_description')) {
            return 'Contenu à personnaliser';
        }

        // Placeholder générique basé sur le contexte
        if (context.businessName) {
            if (name.includes('name') || name.includes('brand')) {
                return context.businessName;
            }
        }

        if (context.sector) {
            if (name.includes('sector') || name.includes('industry')) {
                return context.sector;
            }
        }

        // Valeur par défaut intelligente
        return this.capitalize(variableName.replace(/_/g, ' '));
    }

    /**
     * Résout toutes les variables dans un contenu
     */
    resolveAll(content, context = {}) {
        const missingVariables = this.findMissingVariables(content);

        if (missingVariables.length > 0 && this.config.warnOnMissing) {
            console.log(`⚠️  ${missingVariables.length} variables à résoudre`);
        }

        let resolvedContent = content;
        const resolutions = {
            total: missingVariables.length,
            resolved: 0,
            fromContext: 0,
            fromDefaults: 0,
            generated: 0,
            unresolved: []
        };

        for (const variable of missingVariables) {
            const originalValue = `{${variable}}`;

            // Déterminer la source de résolution
            let resolvedValue;
            let source;

            if (context[variable] !== undefined) {
                resolvedValue = context[variable];
                source = 'context';
                resolutions.fromContext++;
            } else if (this.defaultValues[variable] !== undefined) {
                resolvedValue = this.defaultValues[variable];
                source = 'default';
                resolutions.fromDefaults++;
            } else {
                resolvedValue = this.generateSmartValue(variable, context);
                source = 'generated';
                resolutions.generated++;
            }

            // Remplacer dans le contenu
            resolvedContent = resolvedContent.replace(
                new RegExp(`\\{${this.escapeRegex(variable)}\\}`, 'g'),
                resolvedValue
            );

            resolutions.resolved++;
        }

        // Afficher le résumé
        if (resolutions.total > 0) {
            console.log(`  ✅ ${resolutions.resolved}/${resolutions.total} variables résolues`);
            console.log(`     Contexte: ${resolutions.fromContext}, Défaut: ${resolutions.fromDefaults}, Généré: ${resolutions.generated}`);
        }

        return {
            content: resolvedContent,
            stats: resolutions
        };
    }

    /**
     * Génère un contexte enrichi à partir des données disponibles
     */
    enrichContext(baseContext) {
        const enriched = { ...baseContext };

        // Enrichir avec le businessName si disponible
        if (baseContext.businessName) {
            enriched.site_name = baseContext.businessName;
            enriched.brand_name = baseContext.businessName;
            enriched.company_name = baseContext.businessName;
        }

        // Enrichir avec le sector
        if (baseContext.sector) {
            enriched.industry = baseContext.sector;
            enriched.business_type = baseContext.sector;
        }

        // Enrichir avec les keywords
        if (baseContext.keyword) {
            enriched.primary_keyword = baseContext.keyword;
            enriched.meta_keywords = baseContext.keyword;
        }

        // Enrichir avec le slogan
        if (baseContext.slogan) {
            enriched.tagline = baseContext.slogan;
            enriched.hero_subtitle = baseContext.slogan;
        }

        // Générer des valeurs dérivées
        if (baseContext.domain) {
            enriched.site_url = `https://${baseContext.domain}`;
            enriched.home_url = `https://${baseContext.domain}`;
        }

        return enriched;
    }

    /**
     * Capitalise la première lettre
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Échappe les caractères spéciaux pour regex
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Obtient les statistiques de résolution
     */
    getStats() {
        return {
            defaultValuesCount: Object.keys(this.defaultValues).length,
            generatedValuesCount: this.generatedValues.size,
            totalAvailable: Object.keys(this.defaultValues).length + this.generatedValues.size
        };
    }

    /**
     * Affiche un rapport des variables disponibles
     */
    generateReport() {
        const stats = this.getStats();

        let report = `
═══════════════════════════════════════════════════════════════════
                    VARIABLE RESOLVER - RAPPORT
═══════════════════════════════════════════════════════════════════

📊 STATISTIQUES:

  Valeurs par défaut:     ${stats.defaultValuesCount}
  Valeurs générées:       ${stats.generatedValuesCount}
  Total disponible:       ${stats.totalAvailable}

📋 CATÉGORIES DE VARIABLES:

`;

        // Grouper par catégorie
        const categories = {
            'Navigation': [],
            'Sections': [],
            'CTA': [],
            'Footer': [],
            'Newsletter': [],
            'Social': [],
            'Descriptors': [],
            'Autres': []
        };

        for (const [key, value] of Object.entries(this.defaultValues)) {
            if (key.startsWith('nav_')) categories['Navigation'].push(key);
            else if (key.startsWith('section_')) categories['Sections'].push(key);
            else if (key.startsWith('cta_')) categories['CTA'].push(key);
            else if (key.startsWith('footer_') || key.includes('privacy') || key.includes('terms')) categories['Footer'].push(key);
            else if (key.startsWith('newsletter_')) categories['Newsletter'].push(key);
            else if (key.startsWith('social_')) categories['Social'].push(key);
            else if (key.startsWith('descriptor_')) categories['Descriptors'].push(key);
            else categories['Autres'].push(key);
        }

        for (const [category, variables] of Object.entries(categories)) {
            if (variables.length > 0) {
                report += `  ${category}: ${variables.length} variables\n`;
            }
        }

        report += `\n═══════════════════════════════════════════════════════════════════\n`;

        return report;
    }

    /**
     * Ajoute des valeurs personnalisées
     */
    addCustomValues(values) {
        Object.assign(this.defaultValues, values);
    }

    /**
     * Réinitialise les valeurs générées
     */
    reset() {
        this.generatedValues.clear();
    }
}

module.exports = VariableResolver;
