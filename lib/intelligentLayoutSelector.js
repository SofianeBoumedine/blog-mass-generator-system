/**
 * Sélecteur Intelligent de Layouts
 * Adapte le choix du layout selon le thème et le contexte
 */

class IntelligentLayoutSelector {
    constructor() {
        this.initializeLayoutDatabase();
        this.initializeThemeMapping();
    }

    /**
     * Base de données enrichie des layouts avec labels thématiques
     */
    initializeLayoutDatabase() {
        this.layoutDatabase = [
            // LAYOUTS CORPORATE/BUSINESS
            {
                layout: 'layout-professional.html',
                type: 'corporate',
                quality: 'premium',
                themes: ['business', 'corporate', 'finance', 'consulting', 'legal', 'insurance'],
                mood: 'serious',
                colors: 'professional',
                audience: 'b2b',
                features: ['trust-signals', 'testimonials', 'stats', 'certifications']
            },
            {
                layout: 'layout-18-corporate.html',
                type: 'corporate',
                quality: 'standard',
                themes: ['business', 'corporate', 'services'],
                mood: 'serious',
                colors: 'professional',
                audience: 'b2b'
            },

            // LAYOUTS TECH/SAAS
            {
                layout: 'layout-saas-modern-enhanced.html',
                type: 'saas',
                quality: 'premium',
                themes: ['software', 'saas', 'tech', 'startup', 'api', 'cloud', 'ai'],
                mood: 'modern',
                colors: 'tech',
                audience: 'developers',
                features: ['dashboard', 'dark-mode', 'metrics', 'code-blocks']
            },
            {
                layout: 'layout-16-cyberpunk.html',
                type: 'cyberpunk',
                quality: 'standard',
                themes: ['tech', 'gaming', 'crypto', 'hacking', 'security'],
                mood: 'futuristic',
                colors: 'neon',
                audience: 'tech-savvy'
            },

            // LAYOUTS CRÉATIFS/ARTISTIQUES
            {
                layout: 'layout-agency-creative-enhanced.html',
                type: 'creative',
                quality: 'premium',
                themes: ['design', 'agency', 'art', 'photography', 'portfolio', 'creative'],
                mood: 'creative',
                colors: 'vibrant',
                audience: 'creative',
                features: ['portfolio', 'animations', 'custom-cursor']
            },
            {
                layout: 'layout-15-retrowave.html',
                type: 'retrowave',
                quality: 'standard',
                themes: ['music', 'retro', '80s', 'synthwave', 'nostalgia'],
                mood: 'nostalgic',
                colors: 'retrowave',
                audience: 'millennials'
            },

            // LAYOUTS E-COMMERCE/VENTE
            {
                layout: 'layout-ecommerce-premium.html',
                type: 'ecommerce',
                quality: 'premium',
                themes: ['shop', 'store', 'ecommerce', 'retail', 'products', 'fashion'],
                mood: 'commercial',
                colors: 'sales',
                audience: 'shoppers',
                features: ['product-cards', 'cart', 'promotions', 'reviews']
            },

            // LAYOUTS LUDIQUES/FUN (PARFAIT POUR LES CHATONS!)
            {
                layout: 'layout-pets-cute.html',
                type: 'pets',
                quality: 'premium',
                themes: ['pets', 'animals', 'cats', 'dogs', 'chatons', 'chiots', 'animaux', 'mignon', 'cute'],
                mood: 'playful',
                colors: 'cute',
                audience: 'pet-lovers',
                features: ['paw-patterns', 'floating-cats', 'cute-cards', 'gallery', 'fun-facts']
            },
            {
                layout: 'layout-3-cards.html',
                type: 'cards',
                quality: 'standard',
                themes: ['blog', 'pets', 'animals', 'kids', 'toys', 'games', 'fun'],
                mood: 'playful',
                colors: 'cheerful',
                audience: 'general',
                features: ['cards', 'images', 'colorful']
            },
            {
                layout: 'layout-7-gradient.html',
                type: 'gradient',
                quality: 'standard',
                themes: ['modern', 'colorful', 'youth', 'entertainment', 'social'],
                mood: 'energetic',
                colors: 'gradient',
                audience: 'young'
            },
            {
                layout: 'layout-11-neumorphism.html',
                type: 'neumorphism',
                quality: 'high',
                themes: ['modern', 'soft', 'friendly', 'wellness', 'health'],
                mood: 'soft',
                colors: 'pastel',
                audience: 'general'
            },

            // LAYOUTS MINIMALISTES
            {
                layout: 'layout-5-minimal.html',
                type: 'minimal',
                quality: 'standard',
                themes: ['blog', 'writing', 'philosophy', 'meditation', 'simple'],
                mood: 'calm',
                colors: 'minimal',
                audience: 'readers'
            },

            // LAYOUTS MAGAZINE/CONTENU
            {
                layout: 'layout-10-magazine.html',
                type: 'magazine',
                quality: 'high',
                themes: ['news', 'magazine', 'media', 'journalism', 'blog'],
                mood: 'informative',
                colors: 'classic',
                audience: 'readers'
            },

            // LAYOUTS DARK/MYSTÉRIEUX
            {
                layout: 'layout-6-dark.html',
                type: 'dark',
                quality: 'standard',
                themes: ['night', 'mystery', 'gothic', 'horror', 'dark'],
                mood: 'mysterious',
                colors: 'dark',
                audience: 'niche'
            },

            // LAYOUTS VINTAGE/RÉTRO
            {
                layout: 'layout-19-vintage.html',
                type: 'vintage',
                quality: 'standard',
                themes: ['antique', 'vintage', 'classic', 'history', 'retro'],
                mood: 'nostalgic',
                colors: 'vintage',
                audience: 'nostalgic'
            }
        ];
    }

    /**
     * Mapping des mots-clés vers les thèmes
     */
    initializeThemeMapping() {
        this.themeKeywords = {
            // Animaux / Mignon
            'pets': ['chat', 'chaton', 'chien', 'chiot', 'animal', 'animaux', 'pet', 'puppy', 'kitten', 'cat', 'dog'],
            'kids': ['enfant', 'bébé', 'jouet', 'jeu', 'école', 'kids', 'children', 'baby', 'toy'],
            'fun': ['fun', 'drôle', 'amusant', 'rigolo', 'blague', 'humour', 'comedy'],

            // Business / Corporate
            'business': ['business', 'entreprise', 'société', 'corporate', 'conseil', 'consulting'],
            'finance': ['finance', 'banque', 'investissement', 'comptable', 'assurance'],

            // Tech
            'tech': ['tech', 'technologie', 'software', 'logiciel', 'app', 'application', 'api'],
            'ai': ['ai', 'intelligence artificielle', 'machine learning', 'ml', 'deep learning'],

            // Créatif
            'creative': ['design', 'créatif', 'art', 'graphique', 'creative', 'artistic'],
            'photography': ['photo', 'photographie', 'image', 'shooting'],

            // E-commerce
            'ecommerce': ['boutique', 'shop', 'magasin', 'vente', 'produit', 'acheter', 'store'],
            'fashion': ['mode', 'fashion', 'vêtement', 'style', 'tendance']
        };

        // Palettes de couleurs selon le thème
        this.colorPalettes = {
            'playful': {
                primary: '#FF6B6B',
                secondary: '#4ECDC4',
                accent: '#FFE66D',
                text: '#2D3436',
                background: '#FFF5F5'
            },
            'cute': {
                primary: '#FFB6C1',
                secondary: '#87CEEB',
                accent: '#FFE4E1',
                text: '#5D4E60',
                background: '#FFF0F5'
            },
            'professional': {
                primary: '#2E3192',
                secondary: '#1E88E5',
                accent: '#00ACC1',
                text: '#212121',
                background: '#FFFFFF'
            },
            'tech': {
                primary: '#6366F1',
                secondary: '#8B5CF6',
                accent: '#EC4899',
                text: '#1F2937',
                background: '#F9FAFB'
            },
            'nature': {
                primary: '#10B981',
                secondary: '#34D399',
                accent: '#FCD34D',
                text: '#064E3B',
                background: '#F0FDF4'
            }
        };
    }

    /**
     * Analyse les mots-clés pour déterminer le thème principal
     */
    analyzeTheme(keywords, analysis) {
        const themeCounts = {};

        // Analyser chaque mot-clé
        keywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();

            Object.entries(this.themeKeywords).forEach(([theme, themeWords]) => {
                themeWords.forEach(word => {
                    if (lowerKeyword.includes(word)) {
                        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
                    }
                });
            });
        });

        // Trouver le thème dominant
        const dominantTheme = Object.entries(themeCounts)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            theme: dominantTheme ? dominantTheme[0] : 'general',
            confidence: dominantTheme ? dominantTheme[1] / keywords.length : 0,
            allThemes: themeCounts,
            originalAnalysis: analysis
        };
    }

    /**
     * Sélectionne le layout le plus approprié selon le contexte
     */
    async selectBestLayout(keywords, analysis) {
        const themeAnalysis = this.analyzeTheme(keywords, analysis);

        console.log(`\n🎯 Analyse thématique:`);
        console.log(`  Thème détecté: ${themeAnalysis.theme}`);
        console.log(`  Confiance: ${(themeAnalysis.confidence * 100).toFixed(1)}%`);

        // Filtrer les layouts par thème
        let appropriateLayouts = this.layoutDatabase.filter(layout => {
            // Vérifier si le layout correspond au thème
            if (themeAnalysis.theme === 'pets' || themeAnalysis.theme === 'kids') {
                // Pour les animaux/enfants, on veut du ludique
                return layout.mood === 'playful' ||
                       layout.mood === 'cheerful' ||
                       layout.mood === 'soft' ||
                       layout.themes.some(t => ['pets', 'animals', 'kids', 'fun'].includes(t));
            }

            if (themeAnalysis.theme === 'business' || themeAnalysis.theme === 'finance') {
                return layout.mood === 'serious' ||
                       layout.mood === 'professional' ||
                       layout.themes.some(t => ['business', 'corporate', 'finance'].includes(t));
            }

            if (themeAnalysis.theme === 'tech' || themeAnalysis.theme === 'ai') {
                return layout.mood === 'modern' ||
                       layout.mood === 'futuristic' ||
                       layout.themes.some(t => ['tech', 'software', 'ai'].includes(t));
            }

            // Par défaut, chercher une correspondance dans les thèmes
            return layout.themes.some(t => t.includes(themeAnalysis.theme));
        });

        // Si aucun layout spécifique, prendre les plus polyvalents
        if (appropriateLayouts.length === 0) {
            appropriateLayouts = this.layoutDatabase.filter(layout =>
                layout.audience === 'general' || layout.mood === 'modern'
            );
        }

        // Sélectionner selon la qualité avec pondération
        const premiumLayouts = appropriateLayouts.filter(l => l.quality === 'premium');
        const highLayouts = appropriateLayouts.filter(l => l.quality === 'high');
        const standardLayouts = appropriateLayouts.filter(l => l.quality === 'standard');

        let selectedLayout;
        const random = Math.random();

        // Pour les thèmes ludiques, favoriser les layouts standards colorés
        if (themeAnalysis.theme === 'pets' || themeAnalysis.theme === 'kids') {
            if (random < 0.7 && standardLayouts.length > 0) {
                selectedLayout = standardLayouts[Math.floor(Math.random() * standardLayouts.length)];
            } else if (highLayouts.length > 0) {
                selectedLayout = highLayouts[Math.floor(Math.random() * highLayouts.length)];
            } else {
                selectedLayout = appropriateLayouts[0];
            }
        } else {
            // Logique normale pour autres thèmes
            if (random < 0.5 && premiumLayouts.length > 0) {
                selectedLayout = premiumLayouts[Math.floor(Math.random() * premiumLayouts.length)];
            } else if (random < 0.8 && highLayouts.length > 0) {
                selectedLayout = highLayouts[Math.floor(Math.random() * highLayouts.length)];
            } else if (standardLayouts.length > 0) {
                selectedLayout = standardLayouts[Math.floor(Math.random() * standardLayouts.length)];
            } else {
                selectedLayout = appropriateLayouts[0];
            }
        }

        // Sélectionner la palette de couleurs appropriée
        let colorScheme;
        if (themeAnalysis.theme === 'pets' || themeAnalysis.theme === 'kids') {
            colorScheme = this.colorPalettes.playful;
        } else if (themeAnalysis.theme === 'business') {
            colorScheme = this.colorPalettes.professional;
        } else if (themeAnalysis.theme === 'tech') {
            colorScheme = this.colorPalettes.tech;
        } else {
            colorScheme = this.getDefaultColorScheme();
        }

        console.log(`  Layout sélectionné: ${selectedLayout.layout}`);
        console.log(`  Type: ${selectedLayout.type}`);
        console.log(`  Mood: ${selectedLayout.mood}`);

        return {
            layout: selectedLayout,
            colorScheme: colorScheme,
            themeAnalysis: themeAnalysis
        };
    }

    /**
     * Adapte le contenu selon le thème
     */
    adaptContentToTheme(content, themeAnalysis) {
        const adaptations = {
            'pets': {
                heroTitle: content.hero_title || 'Bienvenue dans notre monde de douceur 🐱',
                heroSubtitle: content.hero_subtitle || 'Découvrez tout sur nos adorables compagnons à quatre pattes',
                ctaPrimary: 'Voir nos conseils',
                ctaSecondary: 'Galerie photos',
                tone: 'friendly',
                emojis: ['🐱', '😺', '🐾', '❤️', '🏠', '🎾']
            },
            'kids': {
                heroTitle: content.hero_title || 'Bienvenue dans notre univers coloré! 🌈',
                heroSubtitle: content.hero_subtitle || 'Un monde de découvertes et d\'aventures',
                ctaPrimary: 'Commencer l\'aventure',
                ctaSecondary: 'Voir les activités',
                tone: 'playful',
                emojis: ['🎨', '🎮', '🧸', '🌟', '🎉', '🦄']
            },
            'business': {
                heroTitle: content.hero_title || 'Solutions professionnelles d\'excellence',
                heroSubtitle: content.hero_subtitle || 'Votre partenaire de confiance pour la croissance',
                ctaPrimary: 'Demander un devis',
                ctaSecondary: 'Nos services',
                tone: 'professional',
                emojis: []
            },
            'tech': {
                heroTitle: content.hero_title || 'Innovation technologique de pointe',
                heroSubtitle: content.hero_subtitle || 'Transformez votre vision en réalité',
                ctaPrimary: 'Démarrer gratuitement',
                ctaSecondary: 'Documentation',
                tone: 'modern',
                emojis: ['🚀', '💻', '⚡', '🔧']
            }
        };

        const theme = themeAnalysis.theme;
        const adaptation = adaptations[theme] || adaptations['business'];

        // Fusionner avec le contenu existant
        return {
            ...content,
            hero_title: adaptation.heroTitle,
            hero_subtitle: adaptation.heroSubtitle,
            cta_primary: adaptation.ctaPrimary,
            cta_secondary: adaptation.ctaSecondary,
            tone: adaptation.tone,
            emojis: adaptation.emojis
        };
    }

    getDefaultColorScheme() {
        return {
            primary: '#5046E5',
            secondary: '#7C3AED',
            accent: '#F59E0B',
            text: '#1F2937',
            background: '#FFFFFF'
        };
    }
}

module.exports = IntelligentLayoutSelector;