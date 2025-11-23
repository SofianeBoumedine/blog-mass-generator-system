/**
 * Adaptateur de Contenu Dynamique
 * Remplace tout contenu fixe par du contenu généré selon le thème
 */

class DynamicContentAdapter {
    constructor() {
        this.initializeThemeVocabulary();
        this.initializeNavigationPatterns();
        this.initializePlaceholderPatterns();
    }

    /**
     * Vocabulaire thématique pour navigation et contenus
     */
    initializeThemeVocabulary() {
        this.themeVocabulary = {
            'pets': {
                navigation: ['Accueil', 'Conseils', 'Adoption', 'Galerie', 'Contact'],
                sections: {
                    services: 'Nos Conseils',
                    about: 'Notre Passion',
                    team: 'Nos Experts',
                    blog: 'Actualités',
                    contact: 'Nous Écrire',
                    features: 'Ce que nous offrons',
                    testimonials: 'Témoignages',
                    pricing: 'Informations'
                },
                cta: ['Découvrir', 'En savoir plus', 'Voir plus', 'Explorer'],
                descriptors: ['adorable', 'mignon', 'doux', 'affectueux', 'ludique']
            },
            'business': {
                navigation: ['Accueil', 'Services', 'Solutions', 'À propos', 'Contact'],
                sections: {
                    services: 'Nos Services',
                    about: 'À propos',
                    team: 'Notre Équipe',
                    blog: 'Actualités',
                    contact: 'Contact',
                    features: 'Nos Atouts',
                    testimonials: 'Témoignages Clients',
                    pricing: 'Tarifs'
                },
                cta: ['Commencer', 'Demander un devis', 'Nous contacter', 'En savoir plus'],
                descriptors: ['professionnel', 'expert', 'efficace', 'fiable', 'innovant']
            },
            'tech': {
                navigation: ['Accueil', 'Produits', 'API', 'Documentation', 'Support'],
                sections: {
                    services: 'Nos Solutions',
                    about: 'À propos',
                    team: 'Équipe Tech',
                    blog: 'Blog Tech',
                    contact: 'Support',
                    features: 'Fonctionnalités',
                    testimonials: 'Retours Utilisateurs',
                    pricing: 'Plans'
                },
                cta: ['Commencer gratuitement', 'Essayer', 'Documentation', 'Télécharger'],
                descriptors: ['innovant', 'performant', 'scalable', 'moderne', 'intelligent']
            },
            'creative': {
                navigation: ['Accueil', 'Portfolio', 'Services', 'Inspiration', 'Contact'],
                sections: {
                    services: 'Nos Créations',
                    about: 'Notre Vision',
                    team: 'Artistes',
                    blog: 'Inspiration',
                    contact: 'Collaboration',
                    features: 'Notre Approche',
                    testimonials: 'Projets Réalisés',
                    pricing: 'Prestations'
                },
                cta: ['Voir portfolio', 'Créer ensemble', 'Découvrir', 'Inspiration'],
                descriptors: ['créatif', 'unique', 'artistique', 'inspirant', 'original']
            },
            'ecommerce': {
                navigation: ['Accueil', 'Boutique', 'Nouveautés', 'Promotions', 'Contact'],
                sections: {
                    services: 'Nos Produits',
                    about: 'Notre Histoire',
                    team: 'Notre Équipe',
                    blog: 'Actualités',
                    contact: 'Service Client',
                    features: 'Avantages',
                    testimonials: 'Avis Clients',
                    pricing: 'Catalogue'
                },
                cta: ['Acheter', 'Ajouter au panier', 'Voir produits', 'Promotions'],
                descriptors: ['qualité', 'tendance', 'authentique', 'accessible', 'populaire']
            },
            'general': {
                navigation: ['Accueil', 'Découvrir', 'À propos', 'Actualités', 'Contact'],
                sections: {
                    services: 'Ce que nous proposons',
                    about: 'À propos',
                    team: 'Équipe',
                    blog: 'Actualités',
                    contact: 'Contact',
                    features: 'Nos atouts',
                    testimonials: 'Témoignages',
                    pricing: 'Informations'
                },
                cta: ['En savoir plus', 'Découvrir', 'Explorer', 'Voir plus'],
                descriptors: ['qualité', 'fiable', 'professionnel', 'accessible', 'complet']
            }
        };
    }

    /**
     * Patterns de contenu fixe à remplacer
     */
    initializePlaceholderPatterns() {
        this.hardcodedPatterns = [
            // Navigation fixe
            { pattern: />\s*(Nos\s+)?Services?\s*</gi, replacement: '>{nav_services}<' },
            { pattern: />\s*À\s+propos?\s*</gi, replacement: '>{nav_about}<' },
            { pattern: />\s*(Notre\s+)?Équipe?\s*</gi, replacement: '>{nav_team}<' },
            { pattern: />\s*Contact\s*</gi, replacement: '>{nav_contact}<' },
            { pattern: />\s*Blog\s*</gi, replacement: '>{nav_blog}<' },
            { pattern: />\s*Accueil\s*</gi, replacement: '>{nav_home}<' },
            { pattern: />\s*Carrières?\s*</gi, replacement: '>{nav_careers}<' },

            // Sections fixes
            { pattern: /Découvrez nos guides[^<]*/gi, replacement: '{hero_subtitle}' },
            { pattern: /Nos (services|solutions|atouts)[^<]*/gi, replacement: '{section_services_title}' },
            { pattern: /Notre (équipe|vision|mission)[^<]*/gi, replacement: '{section_about_title}' },

            // CTA fixes
            { pattern: />Commencer<\//, replacement: '>{cta_primary}</' },
            { pattern: />En savoir plus<\//, replacement: '>{cta_secondary}</' },
            { pattern: />Nous contacter<\//, replacement: '>{cta_contact}</' },

            // Textes descriptifs fixes
            { pattern: /experts?/gi, replacement: '{descriptor_expert}' },
            { pattern: /professionnel(le)?s?/gi, replacement: '{descriptor_professional}' },
            { pattern: /innovant(e)?s?/gi, replacement: '{descriptor_innovative}' },

            // Formulaires
            { pattern: /placeholder="Votre email"/gi, replacement: 'placeholder="{form_email_placeholder}"' },
            { pattern: /placeholder="Nom"/gi, replacement: 'placeholder="{form_name_placeholder}"' },
            { pattern: /placeholder="Message"/gi, replacement: 'placeholder="{form_message_placeholder}"' }
        ];
    }

    /**
     * Patterns de navigation spécifiques
     */
    initializeNavigationPatterns() {
        this.navigationPatterns = {
            // Navigation principale
            'main-nav': /<nav[^>]*class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/nav>/gi,
            'nav-list': /<ul[^>]*class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/ul>/gi,
            'nav-item': /<li[^>]*>[\s\S]*?<\/li>/gi,

            // Footer navigation
            'footer-nav': /<footer[^>]*>[\s\S]*?<\/footer>/gi,
            'footer-links': /<ul[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/ul>/gi
        };
    }

    /**
     * Dynamise un layout selon le thème détecté
     */
    dynamizeLayout(layoutContent, detectedTheme = 'general') {
        const vocabulary = this.themeVocabulary[detectedTheme] || this.themeVocabulary['general'];

        let dynamizedContent = layoutContent;

        // 1. Remplacer les patterns de contenu fixe
        this.hardcodedPatterns.forEach(({ pattern, replacement }) => {
            dynamizedContent = dynamizedContent.replace(pattern, replacement);
        });

        // 2. Dynamiser la navigation
        dynamizedContent = this.dynamizeNavigation(dynamizedContent, vocabulary);

        // 3. Ajouter les variables de contenu thématique
        dynamizedContent = this.injectThemeVariables(dynamizedContent, vocabulary);

        return dynamizedContent;
    }

    /**
     * Dynamise la navigation selon le thème
     */
    dynamizeNavigation(content, vocabulary) {
        // Remplacer les éléments de navigation par des variables
        const navItems = vocabulary.navigation;

        // Pattern pour identifier et remplacer les listes de navigation
        content = content.replace(
            /<li[^>]*>\s*<a[^>]*href="\/([^"]*)"[^>]*>([^<]*)<\/a>\s*<\/li>/g,
            (match, href, text) => {
                // Mapper les URLs vers les variables appropriées
                const urlMap = {
                    'services': '{nav_services}',
                    'about': '{nav_about}',
                    'team': '{nav_team}',
                    'contact': '{nav_contact}',
                    'blog': '{nav_blog}',
                    'pricing': '{nav_pricing}',
                    'portfolio': '{nav_portfolio}'
                };

                const variable = urlMap[href] || `{nav_${href}}`;
                return match.replace(text, variable);
            }
        );

        return content;
    }

    /**
     * Injecte les variables thématiques dans le layout
     */
    injectThemeVariables(content, vocabulary) {
        // Ajouter un commentaire avec toutes les variables disponibles
        const variablesComment = `
<!-- Variables thématiques disponibles :
     Navigation: ${Object.keys(vocabulary.sections).map(k => `{nav_${k}}`).join(', ')}
     Sections: ${Object.keys(vocabulary.sections).map(k => `{section_${k}_title}`).join(', ')}
     CTA: {cta_primary}, {cta_secondary}, {cta_contact}
     Descripteurs: ${vocabulary.descriptors.map(d => `{descriptor_${d.replace(/\s+/g, '_')}}`).join(', ')}
-->`;

        // Injecter le commentaire au début du body
        content = content.replace(/<body[^>]*>/, `$&${variablesComment}`);

        return content;
    }

    /**
     * Génère les valeurs des variables selon le thème
     */
    generateThemeVariables(detectedTheme, branding) {
        const vocabulary = this.themeVocabulary[detectedTheme] || this.themeVocabulary['general'];

        const variables = {};

        // Variables de navigation
        Object.entries(vocabulary.sections).forEach(([key, value]) => {
            variables[`nav_${key}`] = value;
            variables[`section_${key}_title`] = value;
        });

        // Variables CTA
        variables.cta_primary = vocabulary.cta[0];
        variables.cta_secondary = vocabulary.cta[1] || vocabulary.cta[0];
        variables.cta_contact = vocabulary.cta[vocabulary.cta.length - 1];

        // Variables descripteurs
        vocabulary.descriptors.forEach((desc, index) => {
            variables[`descriptor_${desc.replace(/\s+/g, '_')}`] = desc;
            if (index === 0) variables.descriptor_expert = desc;
            if (index === 1) variables.descriptor_professional = desc;
            if (index === 2) variables.descriptor_innovative = desc;
        });

        // Variables de formulaire
        variables.form_email_placeholder = detectedTheme === 'pets' ? 'Votre email' :
                                         detectedTheme === 'business' ? 'Email professionnel' :
                                         'Votre adresse email';

        variables.form_name_placeholder = detectedTheme === 'pets' ? 'Votre prénom' :
                                        detectedTheme === 'business' ? 'Nom et prénom' :
                                        'Votre nom';

        variables.form_message_placeholder = detectedTheme === 'pets' ? 'Votre message ou question' :
                                           detectedTheme === 'business' ? 'Décrivez votre projet' :
                                           'Votre message';

        return variables;
    }

    /**
     * Nettoie un layout de tout contenu fixe inapproprié
     */
    cleanLayoutFromHardcodedContent(layoutContent) {
        // Liste des textes fixes à supprimer ou remplacer
        const cleanupPatterns = [
            // Remplacer par des placeholders génériques
            { pattern: /Découvrez nos guides, conseils d'experts[^<]*/gi, replacement: '{hero_description}' },
            { pattern: /optimiser votre stratégie digitale/gi, replacement: '{value_proposition}' },
            { pattern: /Votre partenaire de confiance/gi, replacement: '{tagline}' },
            { pattern: /Solutions professionnelles d'excellence/gi, replacement: '{hero_title}' },

            // Supprimer les références spécifiques
            { pattern: /entreprise|business|corporate/gi, replacement: '{business_term}' },
            { pattern: /digitale?|numérique/gi, replacement: '{domain_term}' },
            { pattern: /stratégie|consulting/gi, replacement: '{service_term}' }
        ];

        let cleanedContent = layoutContent;

        cleanupPatterns.forEach(({ pattern, replacement }) => {
            cleanedContent = cleanedContent.replace(pattern, replacement);
        });

        return cleanedContent;
    }
}

module.exports = DynamicContentAdapter;