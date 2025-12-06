/**
 * Semantic Site Generator - Générateur de Sites Sémantiques
 * Génère des sites onepage 100% cohérents avec la thématique
 *
 * Utilise le SemanticEntityEngine pour produire du contenu
 * sémantiquement, grammaticalement et thématiquement cohérent
 */

const fs = require('fs').promises;
const path = require('path');
const SemanticEntityEngine = require('./semanticEntityEngine');
const ThematicContentLibrary = require('./thematicContentLibrary');

class SemanticSiteGenerator {
    constructor() {
        this.semanticEngine = new SemanticEntityEngine();
        this.contentLibrary = new ThematicContentLibrary();
        this.outputDir = null;
    }

    /**
     * Génère un site complet à partir de keywords
     */
    async generateSite(keywords, outputPath, options = {}) {
        console.log('====================================================');
        console.log(' SEMANTIC SITE GENERATOR v2.0');
        console.log('====================================================');
        console.log('');

        // 1. Détecter le thème
        const detectedTheme = this.semanticEngine.detectTheme(keywords);
        console.log(`Theme detecte: ${detectedTheme}`);

        // 2. Générer le branding
        const branding = this.generateBranding(keywords, detectedTheme);
        console.log(`Marque generee: ${branding.brandName}`);

        // 3. Générer le contenu sémantique
        const semanticContent = this.semanticEngine.generateOnepageContent(detectedTheme, branding);
        console.log('Contenu semantique genere');

        // 4. Préparer les variables du template
        const templateVariables = this.prepareTemplateVariables(
            branding,
            semanticContent,
            detectedTheme,
            keywords
        );

        // 5. Charger et remplir le template
        const templatePath = path.join(__dirname, '..', 'templates', 'layouts', 'layout-universal-onepage.html');
        let html = await fs.readFile(templatePath, 'utf8');

        // 6. Remplacer toutes les variables
        html = this.replaceAllVariables(html, templateVariables);

        // 7. Créer le dossier de sortie
        this.outputDir = outputPath;
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'blog'), { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'assets'), { recursive: true });

        // 8. Écrire les fichiers
        await fs.writeFile(path.join(this.outputDir, 'index.html'), html);
        console.log(`Site genere: ${path.join(this.outputDir, 'index.html')}`);

        // 9. Créer le blog listing
        await this.createBlogListing(branding, semanticContent, detectedTheme);

        // 10. Créer le .htaccess
        await this.createHtaccess();

        // 11. Créer le fichier de configuration
        await this.createSiteConfig(branding, detectedTheme, keywords);

        console.log('');
        // 12. Validation sémantique
        const validationReport = this.validateSemanticCoherence(html, detectedTheme, branding);
        if (validationReport.issues.length > 0) {
            console.log('');
            console.log('AVERTISSEMENTS DE COHERENCE:');
            validationReport.issues.forEach(issue => console.log(`  - ${issue}`));
        }

        // 13. Sauvegarder le rapport de validation
        await this.saveValidationReport(validationReport, detectedTheme, branding);

        console.log('');
        console.log('====================================================');
        console.log(' GENERATION TERMINEE');
        console.log(`Score de coherence: ${validationReport.score}/100`);
        console.log('====================================================');

        return {
            outputDir: this.outputDir,
            theme: detectedTheme,
            branding,
            semanticContent,
            validationReport
        };
    }

    /**
     * Valide la cohérence sémantique du contenu généré
     */
    validateSemanticCoherence(html, theme, branding) {
        const thematicContent = this.contentLibrary.getThemeContent(theme);
        const issues = [];
        let score = 100;

        // 1. Vérifier qu'aucun mot à éviter n'est présent (avec word boundaries)
        const htmlLower = html.toLowerCase();
        const wordsToAvoid = thematicContent?.avoid || [];

        for (const word of wordsToAvoid) {
            // Utiliser une regex avec word boundaries pour éviter les faux positifs
            const wordRegex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
            if (wordRegex.test(htmlLower)) {
                issues.push(`Mot incohérent détecté: "${word}" (à éviter pour le thème ${theme})`);
                score -= 5;
            }
        }

        // 2. Vérifier la présence du lien Blog
        if (!html.includes('href="/blog/') && !html.includes('href="/blog"')) {
            issues.push('Lien vers le Blog manquant dans la navigation');
            score -= 10;
        }

        // 3. Vérifier la cohérence des couleurs
        if (thematicContent?.colors?.primary) {
            if (!html.includes(thematicContent.colors.primary)) {
                issues.push(`Couleur primaire du thème non utilisée (${thematicContent.colors.primary})`);
                score -= 5;
            }
        }

        // 4. Vérifier la présence de vocabulaire thématique
        const vocabulary = thematicContent?.vocabulary;
        if (vocabulary) {
            const nouns = vocabulary.nouns || [];
            let vocabularyMatches = 0;

            for (const noun of nouns.slice(0, 10)) {
                if (htmlLower.includes(noun.toLowerCase())) {
                    vocabularyMatches++;
                }
            }

            if (vocabularyMatches < 3) {
                issues.push(`Vocabulaire thématique insuffisant (${vocabularyMatches}/10 termes clés trouvés)`);
                score -= 10;
            }
        }

        // 5. Vérifier les balises SEO essentielles
        if (!html.includes('<title>') || !html.includes('</title>')) {
            issues.push('Balise title manquante');
            score -= 5;
        }

        if (!html.includes('name="description"')) {
            issues.push('Meta description manquante');
            score -= 5;
        }

        // 6. Vérifier la structure HTML
        const requiredSections = ['hero', 'services', 'testimonials', 'contact', 'footer'];
        for (const section of requiredSections) {
            if (!htmlLower.includes(`id="${section}"`) && !htmlLower.includes(`class="${section}"`)) {
                // Recherche alternative
                if (!htmlLower.includes(section)) {
                    issues.push(`Section "${section}" potentiellement manquante`);
                    score -= 2;
                }
            }
        }

        // Normaliser le score
        score = Math.max(0, Math.min(100, score));

        return {
            isValid: score >= 70,
            score,
            issues,
            theme,
            brandName: branding.brandName,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Sauvegarde le rapport de validation
     */
    async saveValidationReport(report, theme, branding) {
        const reportPath = path.join(this.outputDir, 'validation-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        console.log(`Rapport de validation: ${reportPath}`);
    }

    /**
     * Génère le branding à partir des keywords
     */
    generateBranding(keywords, theme) {
        const mainKeyword = keywords[0] || 'Business';

        // Générer un nom de marque intelligent
        const brandName = this.generateBrandName(mainKeyword, theme);

        // Générer un tagline
        const tagline = this.generateTagline(theme, mainKeyword);

        return {
            brandName,
            tagline,
            domain: this.slugify(brandName) + '.fr',
            mainKeyword
        };
    }

    /**
     * Génère un nom de marque intelligent
     */
    generateBrandName(keyword, theme) {
        const prefixes = {
            pets: ['Pet', 'Paw', 'Animo', 'Compa', 'Fidele'],
            tech: ['Tech', 'Digi', 'Nova', 'Cyber', 'Cloud'],
            business: ['Pro', 'Elite', 'Premier', 'Expert', 'Conseil'],
            ecommerce: ['Shop', 'Store', 'Market', 'Boutique', 'Click'],
            creative: ['Studio', 'Creative', 'Design', 'Art', 'Vision'],
            health: ['Sante', 'Vita', 'Care', 'Med', 'Bien'],
            realestate: ['Immo', 'Habitat', 'Maison', 'Pierre', 'Home'],
            education: ['Edu', 'Learn', 'Academy', 'Campus', 'Skills'],
            food: ['Saveur', 'Gout', 'Chef', 'Table', 'Bistro'],
            legal: ['Lex', 'Droit', 'Justice', 'Conseil', 'Cabinet'],
            fitness: ['Fit', 'Sport', 'Active', 'Move', 'Gym'],
            finance: ['Finance', 'Patri', 'Invest', 'Capital', 'Conseil'],
            general: ['Pro', 'Expert', 'Plus', 'Solution', 'Services']
        };

        const suffixes = {
            pets: ['Club', 'Care', 'Love', 'Friend', 'World'],
            tech: ['Hub', 'Lab', 'Solutions', 'Cloud', 'AI'],
            business: ['Conseil', 'Group', 'Partners', 'Solutions', 'Experts'],
            ecommerce: ['Express', 'Direct', 'Plus', 'Online', 'Deal'],
            creative: ['Lab', 'Works', 'Co', 'Agency', 'House'],
            health: ['Plus', 'Care', 'Center', 'Life', 'Zen'],
            realestate: ['Conseil', 'Expert', 'Partners', 'Service', 'Pro'],
            education: ['Plus', 'Pro', 'Expert', 'Master', 'Lab'],
            food: ['House', 'Lab', 'Art', 'Gourmet', 'Chef'],
            legal: ['Avocats', 'Partners', 'Conseil', 'Expert', 'Droit'],
            fitness: ['Club', 'Zone', 'Center', 'Pro', 'Plus'],
            finance: ['Expert', 'Partners', 'Conseil', 'Plus', 'Pro'],
            general: ['Expert', 'Plus', 'Pro', 'Solutions', 'Services']
        };

        const themePrefixes = prefixes[theme] || prefixes.general;
        const themeSuffixes = suffixes[theme] || suffixes.general;

        // Choisir aléatoirement
        const prefix = themePrefixes[Math.floor(Math.random() * themePrefixes.length)];
        const suffix = themeSuffixes[Math.floor(Math.random() * themeSuffixes.length)];

        // Combiner intelligemment
        const cleanKeyword = this.capitalizeFirst(keyword.split(' ')[0]);

        // Options de nom
        const options = [
            `${prefix}${cleanKeyword}`,
            `${cleanKeyword}${suffix}`,
            `${prefix} ${suffix}`,
            `${cleanKeyword} ${suffix}`
        ];

        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * Génère un tagline adapté au thème
     */
    generateTagline(theme, keyword) {
        const taglines = {
            pets: [
                `Le meilleur pour votre compagnon`,
                `Parce que votre animal le vaut bien`,
                `Des conseils d'experts pour animaux heureux`,
                `Votre partenaire pour le bien-être animal`
            ],
            tech: [
                `La technologie au service de votre croissance`,
                `Innovez. Automatisez. Accélérez.`,
                `Des solutions tech qui font la différence`,
                `Votre transformation digitale commence ici`
            ],
            business: [
                `Votre succès, notre engagement`,
                `Des solutions pour entreprises ambitieuses`,
                `Accompagnement stratégique personnalisé`,
                `Vers l'excellence avec vous`
            ],
            ecommerce: [
                `Des produits de qualité, livrés chez vous`,
                `Shopping en toute confiance`,
                `La qualité accessible à tous`,
                `Faites-vous plaisir, vous le méritez`
            ],
            creative: [
                `Des créations qui marquent les esprits`,
                `L'art au service de votre image`,
                `Design with purpose`,
                `Votre vision, notre création`
            ],
            health: [
                `Votre santé, notre priorité`,
                `Prenez soin de vous`,
                `Des soins personnalisés pour chacun`,
                `Votre bien-être entre de bonnes mains`
            ],
            realestate: [
                `Trouvez le bien de vos rêves`,
                `L'immobilier en toute confiance`,
                `Votre projet immobilier mérite le meilleur`,
                `20 ans d'expertise à votre service`
            ],
            education: [
                `Développez vos compétences`,
                `Apprenez aujourd'hui, réussissez demain`,
                `Des formations qui ouvrent des portes`,
                `Votre potentiel n'attend que vous`
            ],
            food: [
                `Une cuisine qui éveille vos sens`,
                `Le goût de l'excellence`,
                `Des saveurs qui racontent une histoire`,
                `Le plaisir de bien manger`
            ],
            legal: [
                `Votre droit, notre combat`,
                `Le droit à vos côtés`,
                `Des solutions juridiques sur-mesure`,
                `Défendre vos intérêts avec détermination`
            ],
            fitness: [
                `Révélez le meilleur de vous-même`,
                `Votre transformation commence ici`,
                `Du sport, des résultats, du plaisir`,
                `Dépassez vos limites`
            ],
            finance: [
                `Construisez votre avenir financier`,
                `Votre patrimoine mérite le meilleur conseil`,
                `Des solutions adaptées à votre vie`,
                `Protégez ce qui compte vraiment`
            ],
            general: [
                `À votre service`,
                `Votre partenaire de confiance`,
                `L'excellence à votre service`,
                `Des solutions adaptées à vos besoins`
            ]
        };

        const themeTaglines = taglines[theme] || taglines.general;
        return themeTaglines[Math.floor(Math.random() * themeTaglines.length)];
    }

    /**
     * Prépare toutes les variables du template
     * Utilise ThematicContentLibrary pour un contenu ultra-cohérent
     */
    prepareTemplateVariables(branding, semanticContent, theme, keywords) {
        // Récupérer le contenu enrichi de la bibliothèque thématique
        const thematicContent = this.contentLibrary.getThemeContent(theme);
        const themeData = this.semanticEngine.themes[theme] || this.semanticEngine.themes.general;

        // Utiliser les couleurs de la bibliothèque thématique
        const colors = thematicContent?.colors || semanticContent.meta.colorSuggestion;

        // Générer du contenu cohérent depuis la bibliothèque
        const heroContent = this.contentLibrary.generateHeroContent(theme);
        const aboutContent = this.contentLibrary.generateAboutContent(theme);
        const services = this.contentLibrary.generateServices(theme);
        const testimonials = this.contentLibrary.generateTestimonials(theme);
        const stats = this.contentLibrary.generateStats(theme);
        const ctas = this.contentLibrary.generateCTAs(theme);

        // Générer des phrases enrichies avec vocabulaire thématique
        const vocabulary = thematicContent?.vocabulary || {};
        const thematicPhrase = this.generateThematicPhrase(theme, vocabulary);
        const sectorName = thematicContent?.identity?.sector || 'nos services';

        // Variables de base
        const variables = {
            // Meta - Enrichie avec vocabulaire thématique
            meta_title: `${branding.brandName} | ${branding.tagline}`,
            meta_description: `${branding.tagline}. ${thematicPhrase} Experts en ${sectorName.toLowerCase()}.`,
            meta_keywords: keywords.join(', '),

            // Branding
            brand_name: branding.brandName,
            brand_initial: branding.brandName.charAt(0).toUpperCase(),
            tagline: branding.tagline,

            // Couleurs
            color_primary: colors.primary,
            color_secondary: colors.secondary,
            color_accent: colors.accent,
            color_text: '#1f2937',
            color_background: '#f9fafb',

            // Framework (vide pour le template universel)
            framework_css: '',
            framework_js: '',

            // Navigation
            nav_item_1: themeData.navigation[0] || 'Accueil',
            nav_item_2: themeData.navigation[1] || 'Services',
            nav_item_3: themeData.navigation[2] || 'À Propos',
            nav_item_4: themeData.navigation[3] || 'Témoignages',
            nav_cta_text: 'Contact',

            // Hero - Utilise ThematicContentLibrary pour contenu ultra-cohérent
            hero_badge_text: heroContent.badge || this.getHeroBadge(theme),
            hero_title: heroContent.title || semanticContent.hero.title,
            hero_subtitle: heroContent.subtitle || semanticContent.hero.subtitle,
            hero_visual_icon: this.getThemeIcon(theme),

            // CTA - Utilise les CTAs thématiques
            cta_primary: ctas?.primary?.[0] || semanticContent.hero.cta,
            cta_secondary: ctas?.secondary?.[0] || semanticContent.hero.secondaryCta,
            cta_title: this.getCTATitle(theme),
            cta_text: ctas?.newsletter || semanticContent.ctaFinal.subtitle,
            cta_button: ctas?.primary?.[0] || semanticContent.ctaFinal.button,

            // Stats - Utilise les stats thématiques enrichies
            stat_1_number: stats[0]?.number || '100+',
            stat_1_label: stats[0]?.label || 'Clients satisfaits',
            stat_2_number: stats[1]?.number || '98%',
            stat_2_label: stats[1]?.label || 'Satisfaction',
            stat_3_number: stats[2]?.number || '10+',
            stat_3_label: stats[2]?.label || 'D\'expérience',
            stat_4_number: stats[3]?.number || '24/7',
            stat_4_label: stats[3]?.label || 'Support',

            // Services - Utilise les services thématiques détaillés
            section_badge_text: thematicContent?.identity?.sector || 'Nos Services',
            services_title: `Nos ${thematicContent?.identity?.sector || 'Services'}`,
            services_subtitle: `Découvrez ce que nous pouvons faire pour vous`,

            service_1_icon: services[0]?.icon || '🎯',
            service_1_title: services[0]?.name || 'Service 1',
            service_1_description: services[0]?.description || 'Description du service',

            service_2_icon: services[1]?.icon || '⚡',
            service_2_title: services[1]?.name || 'Service 2',
            service_2_description: services[1]?.description || 'Description du service',

            service_3_icon: services[2]?.icon || '🔧',
            service_3_title: services[2]?.name || 'Service 3',
            service_3_description: services[2]?.description || 'Description du service',

            service_4_icon: services[3]?.icon || '🛡️',
            service_4_title: services[3]?.name || 'Service 4',
            service_4_description: services[3]?.description || 'Description du service',

            // Features - Utilise les valeurs thématiques
            features_title: 'Pourquoi nous choisir',
            features_subtitle: aboutContent.values?.join(' • ') || 'Ce qui nous rend uniques',

            feature_1_icon: '✓',
            feature_1_title: aboutContent.values?.[0] || 'Qualité',
            feature_1_description: this.getFeatureDescription(theme, 0),

            feature_2_icon: '✓',
            feature_2_title: aboutContent.values?.[1] || 'Fiabilité',
            feature_2_description: this.getFeatureDescription(theme, 1),

            feature_3_icon: '✓',
            feature_3_title: aboutContent.values?.[2] || 'Support',
            feature_3_description: this.getFeatureDescription(theme, 2),

            // Testimonials - Utilise les témoignages thématiques ultra-réalistes
            testimonials_badge: 'Témoignages',
            testimonials_title: 'Ils nous font confiance',
            testimonials_subtitle: this.getTestimonialsSubtitle(theme),

            testimonial_1_text: testimonials[0]?.text || 'Excellent service !',
            testimonial_1_author: testimonials[0]?.author || 'Client A',
            testimonial_1_position: testimonials[0]?.role || 'Client',
            testimonial_1_initials: testimonials[0]?.avatar || this.getInitials(testimonials[0]?.author || 'CA'),

            testimonial_2_text: testimonials[1]?.text || 'Je recommande vivement !',
            testimonial_2_author: testimonials[1]?.author || 'Client B',
            testimonial_2_position: testimonials[1]?.role || 'Client',
            testimonial_2_initials: testimonials[1]?.avatar || this.getInitials(testimonials[1]?.author || 'CB'),

            testimonial_3_text: testimonials[2]?.text || 'Parfait, merci !',
            testimonial_3_author: testimonials[2]?.author || 'Client C',
            testimonial_3_position: testimonials[2]?.role || 'Client',
            testimonial_3_initials: testimonials[2]?.avatar || this.getInitials(testimonials[2]?.author || 'CC'),

            // About - Utilise le storytelling thématique
            about_title: 'Notre Histoire',
            about_content: aboutContent.story || themeData.aboutContent,
            about_feature_1: aboutContent.mission || 'Une équipe passionnée et expérimentée',
            about_feature_2: `Nos valeurs : ${aboutContent.values?.slice(0, 3).join(', ') || 'qualité, transparence, engagement'}`,
            about_feature_3: 'Un accompagnement personnalisé pour chaque client',
            about_visual_icon: this.getThemeIcon(theme),

            // Blog Preview
            blog_section_title: 'Nos derniers articles',
            blog_1_icon: '📝',
            blog_1_category: this.getBlogCategory(theme),
            blog_1_title: this.getBlogTitle(theme, 1),
            blog_1_excerpt: 'Découvrez nos conseils et astuces dans cet article complet...',

            blog_2_icon: '💡',
            blog_2_category: this.getBlogCategory(theme),
            blog_2_title: this.getBlogTitle(theme, 2),
            blog_2_excerpt: 'Tout ce que vous devez savoir pour réussir...',

            blog_3_icon: '🎯',
            blog_3_category: this.getBlogCategory(theme),
            blog_3_title: this.getBlogTitle(theme, 3),
            blog_3_excerpt: 'Les meilleures pratiques pour optimiser vos résultats...',

            // Footer
            footer_tagline: themeData.footerTagline,
            contact_email: `contact@${this.slugify(branding.brandName)}.fr`,
            contact_phone: '+33 1 23 45 67 89',
            contact_address: 'Paris, France',
            copyright_text: `© ${new Date().getFullYear()} ${branding.brandName}. Tous droits réservés.`
        };

        return variables;
    }

    /**
     * Remplace toutes les variables dans le HTML
     */
    replaceAllVariables(html, variables) {
        let result = html;

        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`{${key}}`, 'g');
            result = result.replace(regex, value || '');
        }

        // Nettoyer les variables non remplacées
        result = result.replace(/{[a-zA-Z_][a-zA-Z0-9_]*}/g, '');

        return result;
    }

    /**
     * Crée le blog listing
     */
    async createBlogListing(branding, semanticContent, theme) {
        const colors = semanticContent.meta.colorSuggestion;

        const blogHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog | ${branding.brandName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-primary: ${colors.primary};
            --color-secondary: ${colors.secondary};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f9fafb; color: #1f2937; }
        .navbar { background: white; padding: 1rem 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .navbar-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .navbar-brand { font-size: 1.5rem; font-weight: 800; color: var(--color-primary); text-decoration: none; }
        .navbar-links { display: flex; gap: 1.5rem; }
        .navbar-links a { color: #4b5563; text-decoration: none; font-weight: 500; }
        .navbar-links a:hover { color: var(--color-primary); }
        .hero { background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: white; padding: 80px 2rem; text-align: center; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.125rem; opacity: 0.9; }
        .container { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
        .articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .article-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.3s, box-shadow 0.3s; }
        .article-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .article-image { height: 200px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem; }
        .article-content { padding: 1.5rem; }
        .article-category { display: inline-block; background: rgba(99, 102, 241, 0.1); color: var(--color-primary); padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.75rem; }
        .article-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #1f2937; }
        .article-excerpt { color: #6b7280; line-height: 1.6; }
        .article-meta { display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 0.875rem; }
        .empty-state { text-align: center; padding: 4rem 2rem; }
        .empty-state h2 { font-size: 1.5rem; margin-bottom: 1rem; color: #4b5563; }
        .footer { background: #1f2937; color: white; padding: 3rem 2rem; text-align: center; margin-top: 4rem; }
        .footer a { color: white; text-decoration: none; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="navbar-container">
            <a href="/" class="navbar-brand">${branding.brandName}</a>
            <div class="navbar-links">
                <a href="/">Accueil</a>
                <a href="/blog/">Blog</a>
                <a href="/#contact">Contact</a>
            </div>
        </div>
    </nav>

    <section class="hero">
        <h1>Notre Blog</h1>
        <p>Découvrez nos articles, conseils et actualités</p>
    </section>

    <div class="container">
        <div class="articles-grid" id="articles-container">
            <!-- Les articles seront chargés dynamiquement -->
        </div>
        <div class="empty-state" id="empty-state" style="display: none;">
            <h2>Aucun article pour le moment</h2>
            <p>Revenez bientôt pour découvrir nos premiers articles !</p>
        </div>
    </div>

    <footer class="footer">
        <p>© ${new Date().getFullYear()} ${branding.brandName} | <a href="/">Retour à l'accueil</a></p>
    </footer>

    <script>
        // Charger les articles depuis le dossier blog
        async function loadArticles() {
            const container = document.getElementById('articles-container');
            const emptyState = document.getElementById('empty-state');

            try {
                const response = await fetch('/blog/articles-index.json');
                if (!response.ok) throw new Error('No articles');

                const articles = await response.json();

                if (articles.length === 0) {
                    emptyState.style.display = 'block';
                    return;
                }

                container.innerHTML = articles.map(article => \`
                    <article class="article-card">
                        <div class="article-image">📝</div>
                        <div class="article-content">
                            <span class="article-category">\${article.category || 'Article'}</span>
                            <h2 class="article-title">\${article.title}</h2>
                            <p class="article-excerpt">\${article.excerpt || ''}</p>
                            <div class="article-meta">
                                <span>\${article.date || ''}</span>
                                <span>\${article.readTime || '5 min'} de lecture</span>
                            </div>
                        </div>
                    </article>
                \`).join('');
            } catch (e) {
                emptyState.style.display = 'block';
            }
        }

        loadArticles();
    </script>
</body>
</html>`;

        await fs.writeFile(path.join(this.outputDir, 'blog', 'index.html'), blogHtml);
        console.log('Blog listing cree: blog/index.html');

        // Créer un index vide
        await fs.writeFile(
            path.join(this.outputDir, 'blog', 'articles-index.json'),
            '[]'
        );
    }

    /**
     * Crée le .htaccess
     */
    async createHtaccess() {
        const htaccess = `# Configuration Apache
DirectoryIndex index.html index.php

RewriteEngine On

# Redirection vers HTTPS (décommenter si besoin)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Blog
RewriteRule ^blog/?$ /blog/index.html [L]

# Supprimer l'extension .html
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^([^/]+)/?$ $1.html [L]

# Cache navigateur
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Compression Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
`;

        await fs.writeFile(path.join(this.outputDir, '.htaccess'), htaccess);
        console.log('.htaccess cree');
    }

    /**
     * Crée le fichier de configuration du site
     */
    async createSiteConfig(branding, theme, keywords) {
        const config = {
            version: '2.0',
            generatedAt: new Date().toISOString(),
            branding: {
                name: branding.brandName,
                tagline: branding.tagline,
                domain: branding.domain
            },
            theme,
            keywords,
            seo: {
                title: `${branding.brandName} | ${branding.tagline}`,
                description: `${branding.tagline}. Découvrez nos services.`
            }
        };

        await fs.writeFile(
            path.join(this.outputDir, 'site-config.json'),
            JSON.stringify(config, null, 2)
        );
        console.log('Configuration sauvegardee: site-config.json');
    }

    // ═══════════════════════════════════════════════════════════════════
    // UTILITAIRES
    // ═══════════════════════════════════════════════════════════════════

    getHeroBadge(theme) {
        const badges = {
            pets: 'Pour vos compagnons',
            tech: 'Nouvelle génération',
            business: 'Solutions pros',
            ecommerce: 'Livraison gratuite',
            creative: 'Portfolio 2024',
            health: 'Prenez soin de vous',
            realestate: 'Estimation gratuite',
            education: 'Certification reconnue',
            food: 'Réservez votre table',
            legal: 'Premier RDV offert',
            fitness: 'Essai gratuit',
            finance: 'Bilan patrimonial offert',
            general: 'Bienvenue'
        };
        return badges[theme] || badges.general;
    }

    getThemeIcon(theme) {
        const icons = {
            pets: '🐾',
            tech: '💻',
            business: '💼',
            ecommerce: '🛒',
            creative: '🎨',
            health: '💚',
            realestate: '🏠',
            education: '🎓',
            food: '🍽️',
            legal: '⚖️',
            fitness: '💪',
            finance: '💰',
            general: '⭐'
        };
        return icons[theme] || icons.general;
    }

    /**
     * Génère une phrase enrichie avec vocabulaire thématique
     */
    generateThematicPhrase(theme, vocabulary) {
        const phrases = {
            pets: 'Conseils d\'experts pour le bien-être de votre compagnon.',
            tech: 'Solutions innovantes pour optimiser votre productivité.',
            business: 'Accompagnement stratégique pour votre croissance.',
            ecommerce: 'Produits sélectionnés avec soin, livrés chez vous.',
            creative: 'Créations uniques qui marquent les esprits.',
            health: 'Votre santé entre de bonnes mains.',
            realestate: 'Votre projet immobilier mérite le meilleur accompagnement.',
            education: 'Des formations qui transforment votre carrière.',
            food: 'Une cuisine qui éveille vos sens.',
            legal: 'Votre droit défendu avec détermination.',
            fitness: 'Votre transformation commence ici.',
            finance: 'Votre patrimoine mérite un conseil expert.',
            general: 'Un accompagnement personnalisé pour tous vos projets.'
        };

        // Ajouter des mots clés du vocabulaire si disponible
        let phrase = phrases[theme] || phrases.general;

        // Enrichir avec une expression thématique
        const expressions = vocabulary?.expressions || [];
        if (expressions.length > 0) {
            const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];
            phrase += ` ${this.capitalizeFirst(randomExpr)}.`;
        }

        return phrase;
    }

    /**
     * Génère un titre de CTA cohérent avec le thème
     */
    getCTATitle(theme) {
        const titles = {
            pets: 'Rejoignez notre communauté d\'amoureux des animaux',
            tech: 'Prêt à transformer votre business ?',
            business: 'Passez au niveau supérieur',
            ecommerce: 'Ne ratez pas nos offres exclusives',
            creative: 'Donnons vie à vos projets',
            health: 'Prenez votre santé en main',
            realestate: 'Votre projet immobilier commence ici',
            education: 'Investissez dans votre avenir',
            food: 'Réservez une expérience inoubliable',
            legal: 'Protégez vos droits dès maintenant',
            fitness: 'Commencez votre transformation',
            finance: 'Construisez votre avenir financier',
            general: 'Contactez-nous dès aujourd\'hui'
        };
        return titles[theme] || titles.general;
    }

    /**
     * Génère une description de feature cohérente avec le thème
     */
    getFeatureDescription(theme, index) {
        const descriptions = {
            pets: [
                'Chaque conseil est validé par des professionnels de la santé animale',
                'Nous aimons les animaux autant que vous et ça se voit',
                'Des guides pratiques pour accompagner votre compagnon au quotidien'
            ],
            tech: [
                'Des solutions pensées pour les entreprises modernes',
                'Une infrastructure robuste et évolutive',
                'Un accompagnement technique disponible 24/7'
            ],
            business: [
                'Des résultats concrets et mesurables',
                'Une approche personnalisée pour chaque client',
                'Un engagement dans la durée à vos côtés'
            ],
            ecommerce: [
                'Des produits sélectionnés avec soin',
                'Livraison rapide et service client réactif',
                'Satisfaction garantie ou remboursé'
            ],
            creative: [
                'Des créations originales et sur-mesure',
                'Une écoute attentive de vos besoins',
                'Des délais respectés et une qualité irréprochable'
            ],
            health: [
                'Des professionnels qualifiés et bienveillants',
                'Une approche globale de votre bien-être',
                'Un suivi personnalisé tout au long de votre parcours'
            ],
            realestate: [
                'Une connaissance fine du marché local',
                'Transparence totale à chaque étape',
                'Accompagnement de la recherche à la signature'
            ],
            education: [
                'Des formateurs experts dans leur domaine',
                'Des méthodes pédagogiques innovantes',
                'Un suivi personnalisé de votre progression'
            ],
            food: [
                'Des produits frais et de saison',
                'Un chef passionné par son métier',
                'Une expérience culinaire unique'
            ],
            legal: [
                'Une expertise reconnue dans notre domaine',
                'Confidentialité et déontologie garanties',
                'Des solutions adaptées à votre situation'
            ],
            fitness: [
                'Des coachs diplômés et passionnés',
                'Un programme adapté à votre niveau',
                'Une communauté motivante et bienveillante'
            ],
            finance: [
                'Des conseils indépendants et objectifs',
                'Une vision long terme de votre patrimoine',
                'Transparence totale sur les frais et les risques'
            ],
            general: [
                'Un engagement qualité sans compromis',
                'Une équipe à votre écoute',
                'Des solutions adaptées à vos besoins'
            ]
        };
        const themeDescriptions = descriptions[theme] || descriptions.general;
        return themeDescriptions[index] || themeDescriptions[0];
    }

    /**
     * Génère un sous-titre de témoignages cohérent
     */
    getTestimonialsSubtitle(theme) {
        const subtitles = {
            pets: 'Découvrez les retours de propriétaires satisfaits',
            tech: 'Ce que disent nos clients de notre solution',
            business: 'Ils ont transformé leur entreprise avec nous',
            ecommerce: 'Avis vérifiés de nos clients',
            creative: 'Nos clients parlent de leur expérience',
            health: 'Témoignages de patients satisfaits',
            realestate: 'Ils ont trouvé leur bien idéal grâce à nous',
            education: 'Ils ont développé leurs compétences avec nous',
            food: 'Les gourmets témoignent',
            legal: 'Des clients que nous avons accompagnés',
            fitness: 'Découvrez leurs transformations',
            finance: 'Ils nous ont fait confiance pour leur patrimoine',
            general: 'Découvrez les retours de nos clients satisfaits'
        };
        return subtitles[theme] || subtitles.general;
    }

    getBlogCategory(theme) {
        const categories = {
            pets: 'Conseils',
            tech: 'Tech',
            business: 'Business',
            ecommerce: 'Shopping',
            creative: 'Inspiration',
            health: 'Santé',
            realestate: 'Immobilier',
            education: 'Formation',
            food: 'Recettes',
            legal: 'Juridique',
            fitness: 'Sport',
            finance: 'Finance',
            general: 'Actualités'
        };
        return categories[theme] || categories.general;
    }

    getBlogTitle(theme, index) {
        const titles = {
            pets: [
                'Comment bien nourrir votre chien en 2024',
                'Les 10 erreurs à éviter avec un chaton',
                'Guide complet des soins pour animaux'
            ],
            tech: [
                'Les tendances tech à suivre en 2024',
                'Comment automatiser vos processus métier',
                'Guide de la transformation digitale'
            ],
            business: [
                'Stratégies de croissance pour PME',
                'Comment optimiser votre productivité',
                'Les clés du management efficace'
            ],
            ecommerce: [
                'Guide d\'achat : nos coups de cœur',
                'Les tendances shopping de la saison',
                'Comment choisir le bon produit'
            ],
            creative: [
                'Tendances design 2024',
                'Comment créer une identité visuelle forte',
                'L\'importance du branding'
            ],
            health: [
                'Conseils pour une vie saine',
                'Prévention : les gestes qui sauvent',
                'Bien-être au quotidien'
            ],
            realestate: [
                'Guide de l\'achat immobilier',
                'Comment bien vendre son bien',
                'Les quartiers où investir'
            ],
            education: [
                'Comment réussir sa reconversion',
                'Les formations les plus demandées',
                'Apprendre efficacement en ligne'
            ],
            food: [
                'Nos recettes de saison',
                'Guide des produits locaux',
                'L\'art de recevoir'
            ],
            legal: [
                'Vos droits en cas de litige',
                'Guide du droit du travail',
                'Comprendre vos contrats'
            ],
            fitness: [
                'Programme d\'entraînement débutant',
                'Nutrition sportive : les bases',
                'Comment rester motivé'
            ],
            finance: [
                'Optimiser sa fiscalité en 2024',
                'Guide de l\'investissement',
                'Préparer sa retraite sereinement'
            ],
            general: [
                'Nos dernières actualités',
                'Guide pratique pour bien démarrer',
                'Conseils d\'experts'
            ]
        };

        const themeTitles = titles[theme] || titles.general;
        return themeTitles[index - 1] || themeTitles[0];
    }

    getInitials(name) {
        if (!name) return 'XX';
        const parts = name.replace('.', '').split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
}

module.exports = SemanticSiteGenerator;
