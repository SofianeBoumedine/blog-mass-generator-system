/**
 * Sélecteur Intelligent de Layouts V2
 * Version améliorée avec labels complets et contenus neutres + Système de labeling avancé
 */

const AdvancedLabelingSystem = require('./advancedLabelingSystem');

class IntelligentLayoutSelectorV2 {
    constructor() {
        this.advancedLabeling = new AdvancedLabelingSystem();
        this.initializeLayoutDatabase();
        this.initializeThemeMapping();
        this.initializeNeutralContent();
        this.enrichLayoutsWithAdvancedLabels();
    }

    /**
     * Base de données COMPLÈTE des layouts avec labels exhaustifs
     */
    initializeLayoutDatabase() {
        this.layoutDatabase = [
            // ============ LAYOUTS POLYVALENTS (utilisables pour tout) ============
            {
                layout: 'layout-1-hero.html',
                type: 'hero',
                quality: 'standard',
                themes: ['general', 'blog', 'portfolio', 'services', 'agency', 'startup', 'corporate', 'personal'],
                mood: 'balanced',
                colors: 'adaptable',
                audience: 'general',
                features: ['hero-section', 'responsive', 'clean'],
                universal: true  // Flag pour layouts universels
            },
            {
                layout: 'layout-2-split.html',
                type: 'split',
                quality: 'standard',
                themes: ['general', 'portfolio', 'agency', 'creative', 'tech', 'blog', 'services'],
                mood: 'modern',
                colors: 'adaptable',
                audience: 'general',
                features: ['split-screen', 'visual-focus'],
                universal: true
            },
            {
                layout: 'layout-3-cards.html',
                type: 'cards',
                quality: 'standard',
                themes: ['general', 'blog', 'services', 'portfolio', 'products', 'team', 'features'],
                mood: 'friendly',
                colors: 'adaptable',
                audience: 'general',
                features: ['card-grid', 'flexible', 'content-focused'],
                universal: true
            },
            {
                layout: 'layout-4-sidebar.html',
                type: 'sidebar',
                quality: 'standard',
                themes: ['blog', 'documentation', 'knowledge', 'news', 'education', 'resources', 'dashboard'],
                mood: 'structured',
                colors: 'adaptable',
                audience: 'readers',
                features: ['sidebar-navigation', 'content-heavy'],
                universal: true
            },
            {
                layout: 'layout-5-minimal.html',
                type: 'minimal',
                quality: 'standard',
                themes: ['general', 'blog', 'portfolio', 'personal', 'writing', 'philosophy', 'art'],
                mood: 'calm',
                colors: 'minimal',
                audience: 'general',
                features: ['clean', 'focused', 'distraction-free'],
                universal: true
            },
            {
                layout: 'layout-20-modern.html',
                type: 'modern',
                quality: 'high',
                themes: ['general', 'startup', 'tech', 'agency', 'services', 'portfolio', 'corporate'],
                mood: 'contemporary',
                colors: 'adaptable',
                audience: 'general',
                features: ['modern-design', 'animations', 'responsive'],
                universal: true
            },

            // ============ LAYOUTS BUSINESS/CORPORATE ============
            {
                layout: 'layout-professional.html',
                type: 'corporate',
                quality: 'premium',
                themes: ['business', 'corporate', 'finance', 'consulting', 'legal', 'insurance', 'b2b', 'enterprise', 'professional'],
                mood: 'serious',
                colors: 'professional',
                audience: 'b2b',
                features: ['trust-signals', 'testimonials', 'stats', 'certifications'],
                universal: false
            },
            {
                layout: 'layout-18-corporate.html',
                type: 'corporate',
                quality: 'standard',
                themes: ['business', 'corporate', 'services', 'consulting', 'professional', 'agency'],
                mood: 'serious',
                colors: 'professional',
                audience: 'b2b',
                features: ['formal', 'structured'],
                universal: false
            },

            // ============ LAYOUTS TECH/SAAS ============
            {
                layout: 'layout-saas-modern-enhanced.html',
                type: 'saas',
                quality: 'premium',
                themes: ['software', 'saas', 'tech', 'startup', 'api', 'cloud', 'ai', 'app', 'platform', 'developer'],
                mood: 'modern',
                colors: 'tech',
                audience: 'developers',
                features: ['dashboard', 'dark-mode', 'metrics', 'code-blocks'],
                universal: false
            },
            {
                layout: 'layout-saas-modern.html',
                type: 'saas',
                quality: 'high',
                themes: ['software', 'saas', 'tech', 'startup', 'app', 'digital', 'platform'],
                mood: 'modern',
                colors: 'tech',
                audience: 'tech-users',
                features: ['pricing', 'features-list', 'cta-focused'],
                universal: false
            },
            {
                layout: 'layout-16-cyberpunk.html',
                type: 'cyberpunk',
                quality: 'standard',
                themes: ['tech', 'gaming', 'crypto', 'blockchain', 'security', 'futuristic', 'sci-fi'],
                mood: 'futuristic',
                colors: 'neon',
                audience: 'tech-savvy',
                features: ['neon-effects', 'dark-theme', 'animations'],
                universal: false
            },

            // ============ LAYOUTS CRÉATIFS/ARTISTIQUES ============
            {
                layout: 'layout-agency-creative-enhanced.html',
                type: 'creative',
                quality: 'premium',
                themes: ['design', 'agency', 'art', 'photography', 'portfolio', 'creative', 'studio', 'artistic'],
                mood: 'creative',
                colors: 'vibrant',
                audience: 'creative',
                features: ['portfolio', 'animations', 'custom-cursor', 'gallery'],
                universal: false
            },
            {
                layout: 'layout-agency-creative.html',
                type: 'creative',
                quality: 'high',
                themes: ['agency', 'creative', 'design', 'marketing', 'advertising', 'studio'],
                mood: 'creative',
                colors: 'vibrant',
                audience: 'creative',
                features: ['portfolio', 'team', 'projects'],
                universal: false
            },
            {
                layout: 'layout-17-creative.html',
                type: 'creative',
                quality: 'standard',
                themes: ['creative', 'art', 'design', 'portfolio', 'artistic', 'gallery'],
                mood: 'artistic',
                colors: 'creative',
                audience: 'creative',
                features: ['visual-focused', 'gallery'],
                universal: false
            },
            {
                layout: 'layout-14-asymmetric.html',
                type: 'asymmetric',
                quality: 'standard',
                themes: ['art', 'creative', 'design', 'experimental', 'portfolio', 'modern'],
                mood: 'experimental',
                colors: 'bold',
                audience: 'creative',
                features: ['asymmetric-layout', 'unique'],
                universal: false
            },

            // ============ LAYOUTS E-COMMERCE ============
            {
                layout: 'layout-ecommerce-premium.html',
                type: 'ecommerce',
                quality: 'premium',
                themes: ['shop', 'store', 'ecommerce', 'retail', 'products', 'fashion', 'boutique', 'marketplace'],
                mood: 'commercial',
                colors: 'sales',
                audience: 'shoppers',
                features: ['product-cards', 'cart', 'promotions', 'reviews'],
                universal: false
            },

            // ============ LAYOUTS LUDIQUES/SPÉCIALISÉS ============
            {
                layout: 'layout-pets-cute.html',
                type: 'pets',
                quality: 'premium',
                themes: ['pets', 'animals', 'cats', 'dogs', 'chatons', 'chiots', 'animaux', 'veterinary', 'pet-care'],
                mood: 'playful',
                colors: 'cute',
                audience: 'pet-lovers',
                features: ['paw-patterns', 'cute-design', 'gallery', 'fun-facts'],
                universal: false
            },
            {
                layout: 'layout-15-retrowave.html',
                type: 'retrowave',
                quality: 'standard',
                themes: ['music', 'retro', '80s', 'synthwave', 'nostalgia', 'vintage', 'entertainment'],
                mood: 'nostalgic',
                colors: 'retrowave',
                audience: 'millennials',
                features: ['retro-style', 'neon', 'animations'],
                universal: false
            },

            // ============ LAYOUTS VISUELS/EFFETS ============
            {
                layout: 'layout-7-gradient.html',
                type: 'gradient',
                quality: 'standard',
                themes: ['general', 'modern', 'colorful', 'youth', 'entertainment', 'social', 'creative', 'fun'],
                mood: 'energetic',
                colors: 'gradient',
                audience: 'young',
                features: ['gradients', 'colorful', 'modern'],
                universal: true  // Peut s'adapter à différents thèmes
            },
            {
                layout: 'layout-8-glass.html',
                type: 'glass',
                quality: 'high',
                themes: ['modern', 'tech', 'premium', 'luxury', 'design', 'innovative', 'futuristic'],
                mood: 'sophisticated',
                colors: 'glass',
                audience: 'general',
                features: ['glassmorphism', 'modern-effects', 'blur'],
                universal: true
            },
            {
                layout: 'layout-9-brutalist.html',
                type: 'brutalist',
                quality: 'standard',
                themes: ['experimental', 'art', 'bold', 'controversial', 'unique', 'statement'],
                mood: 'bold',
                colors: 'stark',
                audience: 'niche',
                features: ['brutalist-design', 'bold-typography'],
                universal: false
            },
            {
                layout: 'layout-11-neumorphism.html',
                type: 'neumorphism',
                quality: 'high',
                themes: ['modern', 'soft', 'wellness', 'health', 'calm', 'meditation', 'spa', 'beauty'],
                mood: 'soft',
                colors: 'pastel',
                audience: 'general',
                features: ['soft-shadows', 'modern-ui', 'clean'],
                universal: true
            },
            {
                layout: 'layout-12-parallax.html',
                type: 'parallax',
                quality: 'high',
                themes: ['storytelling', 'narrative', 'immersive', 'portfolio', 'agency', 'product-launch'],
                mood: 'immersive',
                colors: 'dynamic',
                audience: 'general',
                features: ['parallax-scrolling', 'storytelling', 'engaging'],
                universal: true
            },
            {
                layout: 'layout-13-fullscreen.html',
                type: 'fullscreen',
                quality: 'standard',
                themes: ['photography', 'portfolio', 'presentation', 'landing', 'product', 'app'],
                mood: 'impactful',
                colors: 'bold',
                audience: 'general',
                features: ['fullscreen-sections', 'immersive'],
                universal: true
            },

            // ============ LAYOUTS CONTENU/MÉDIA ============
            {
                layout: 'layout-10-magazine.html',
                type: 'magazine',
                quality: 'high',
                themes: ['news', 'magazine', 'media', 'journalism', 'blog', 'editorial', 'publication'],
                mood: 'informative',
                colors: 'classic',
                audience: 'readers',
                features: ['multi-column', 'content-rich', 'editorial'],
                universal: false
            },

            // ============ LAYOUTS THÉMATIQUES ============
            {
                layout: 'layout-6-dark.html',
                type: 'dark',
                quality: 'standard',
                themes: ['general', 'tech', 'gaming', 'night', 'premium', 'luxury', 'mysterious'],
                mood: 'sophisticated',
                colors: 'dark',
                audience: 'general',
                features: ['dark-theme', 'elegant', 'contrast'],
                universal: true  // Dark mode est populaire pour tous les thèmes
            },
            {
                layout: 'layout-19-vintage.html',
                type: 'vintage',
                quality: 'standard',
                themes: ['antique', 'vintage', 'classic', 'history', 'retro', 'traditional', 'heritage'],
                mood: 'nostalgic',
                colors: 'vintage',
                audience: 'nostalgic',
                features: ['vintage-style', 'classic-typography'],
                universal: false
            },

            // ============ LAYOUTS 21-50 (BUSINESS, STYLES, SPÉCIALISÉS) ============
            {
                layout: 'layout-21-startup.html',
                type: 'startup',
                quality: 'high',
                themes: ["startup","tech","saas","innovation","entrepreneurship","venture","founders"],
                mood: 'energetic',
                colors: 'modern',
                audience: 'entrepreneurs',
                features: ["pitch","team","investors","growth-metrics"],
                universal: false
            },
            {
                layout: 'layout-22-elegant.html',
                type: 'elegant',
                quality: 'high',
                themes: ["luxury","premium","fashion","jewelry","spa","high-end","sophisticated"],
                mood: 'elegant',
                colors: 'refined',
                audience: 'upscale',
                features: ["refined-typography","luxury-design","premium-feel"],
                universal: false
            },
            {
                layout: 'layout-23-dynamic.html',
                type: 'dynamic',
                quality: 'high',
                themes: ["sports","fitness","energy","action","youth","movement","active"],
                mood: 'dynamic',
                colors: 'vibrant',
                audience: 'active',
                features: ["animations","bold-design","energy"],
                universal: false
            },
            {
                layout: 'layout-24-classic.html',
                type: 'classic',
                quality: 'standard',
                themes: ["traditional","established","professional","law","insurance","finance","formal"],
                mood: 'conservative',
                colors: 'classic',
                audience: 'professional',
                features: ["traditional-layout","formal","trust"],
                universal: false
            },
            {
                layout: 'layout-25-bold.html',
                type: 'bold',
                quality: 'standard',
                themes: ["marketing","advertising","events","promotions","campaigns","announcements"],
                mood: 'bold',
                colors: 'strong',
                audience: 'mass-market',
                features: ["bold-typography","high-contrast","attention-grabbing"],
                universal: false
            },
            {
                layout: 'layout-26-soft.html',
                type: 'soft',
                quality: 'high',
                themes: ["wellness","spa","beauty","meditation","health","calm","relaxation","therapy"],
                mood: 'peaceful',
                colors: 'soft-pastel',
                audience: 'wellness-seekers',
                features: ["soft-colors","gentle-design","calming"],
                universal: false
            },
            {
                layout: 'layout-27-grid.html',
                type: 'grid',
                quality: 'standard',
                themes: ["portfolio","gallery","products","catalog","showcase","visual","collection"],
                mood: 'organized',
                colors: 'adaptable',
                audience: 'visual-focused',
                features: ["grid-layout","organized","content-showcase"],
                universal: true
            },
            {
                layout: 'layout-28-waves.html',
                type: 'waves',
                quality: 'high',
                themes: ["ocean","beach","resort","water","marine","coastal","vacation","relaxation"],
                mood: 'relaxed',
                colors: 'oceanic',
                audience: 'vacation-seekers',
                features: ["wave-patterns","fluid-design","beach-theme"],
                universal: false
            },
            {
                layout: 'layout-29-geometric.html',
                type: 'geometric',
                quality: 'high',
                themes: ["architecture","design","tech","modern","engineering","innovation","structure"],
                mood: 'precise',
                colors: 'geometric',
                audience: 'design-conscious',
                features: ["geometric-patterns","modern-design","structured"],
                universal: false
            },
            {
                layout: 'layout-30-card-based.html',
                type: 'card-based',
                quality: 'high',
                themes: ["general","blog","news","products","services","features","content"],
                mood: 'organized',
                colors: 'adaptable',
                audience: 'general',
                features: ["card-grid","flexible","modern"],
                universal: true
            },
            {
                layout: 'layout-31-business-pro.html',
                type: 'business-pro',
                quality: 'premium',
                themes: ["business","corporate","b2b","consulting","finance","enterprise","professional-services"],
                mood: 'professional',
                colors: 'corporate',
                audience: 'b2b',
                features: ["trust-signals","professional-layout","enterprise"],
                universal: false
            },
            {
                layout: 'layout-32-tech-modern.html',
                type: 'tech-modern',
                quality: 'premium',
                themes: ["technology","software","ai","innovation","digital","futuristic","tech-startup"],
                mood: 'innovative',
                colors: 'tech-gradient',
                audience: 'tech-enthusiasts',
                features: ["modern-tech-design","animations","futuristic"],
                universal: false
            },
            {
                layout: 'layout-33-minimal-zen.html',
                type: 'minimal-zen',
                quality: 'premium',
                themes: ["zen","minimalism","philosophy","meditation","simplicity","mindfulness","calm"],
                mood: 'zen',
                colors: 'minimal-zen',
                audience: 'minimalists',
                features: ["ultra-minimal","whitespace","calm"],
                universal: false
            },
            {
                layout: 'layout-34-colorful-pop.html',
                type: 'colorful-pop',
                quality: 'high',
                themes: ["fun","youth","entertainment","kids","games","social","creative","playful"],
                mood: 'playful',
                colors: 'vibrant-pop',
                audience: 'young',
                features: ["colorful","fun-design","pop-art"],
                universal: false
            },
            {
                layout: 'layout-35-monochrome.html',
                type: 'monochrome',
                quality: 'high',
                themes: ["photography","art","portfolio","minimal","black-white","artistic","gallery"],
                mood: 'artistic',
                colors: 'monochrome',
                audience: 'art-lovers',
                features: ["black-white","minimal","photography-focused"],
                universal: false
            },
            {
                layout: 'layout-36-photo-focus.html',
                type: 'photo-focus',
                quality: 'premium',
                themes: ["photography","portfolio","visual","gallery","artist","images","showcase"],
                mood: 'visual',
                colors: 'image-focused',
                audience: 'visual-consumers',
                features: ["large-images","gallery","photo-centric"],
                universal: false
            },
            {
                layout: 'layout-37-text-centered.html',
                type: 'text-centered',
                quality: 'standard',
                themes: ["blog","writing","publishing","editorial","literature","journalism","content"],
                mood: 'focused',
                colors: 'minimal',
                audience: 'readers',
                features: ["typography-focused","reading-optimized","clean"],
                universal: true
            },
            {
                layout: 'layout-38-split-reverse.html',
                type: 'split-reverse',
                quality: 'high',
                themes: ["modern","services","portfolio","agency","creative","showcase"],
                mood: 'modern',
                colors: 'adaptable',
                audience: 'general',
                features: ["split-screen","visual-focus","asymmetric"],
                universal: true
            },
            {
                layout: 'layout-39-centered-all.html',
                type: 'centered',
                quality: 'standard',
                themes: ["landing","product","service","simple","focused","conversion","minimal"],
                mood: 'focused',
                colors: 'adaptable',
                audience: 'general',
                features: ["centered-content","focused","cta-driven"],
                universal: true
            },
            {
                layout: 'layout-40-asymmetric-pro.html',
                type: 'asymmetric-pro',
                quality: 'premium',
                themes: ["design","creative","modern","portfolio","agency","experimental","artistic"],
                mood: 'creative',
                colors: 'bold',
                audience: 'design-conscious',
                features: ["asymmetric-grid","modern","unique"],
                universal: false
            },
            {
                layout: 'layout-41-landing-form.html',
                type: 'landing-form',
                quality: 'high',
                themes: ["lead-generation","marketing","conversion","signup","registration","contact"],
                mood: 'conversion-focused',
                colors: 'conversion',
                audience: 'marketers',
                features: ["form-focused","lead-gen","cta-prominent"],
                universal: false
            },
            {
                layout: 'layout-42-portfolio-gallery.html',
                type: 'portfolio-gallery',
                quality: 'premium',
                themes: ["portfolio","gallery","art","photography","design","showcase","creative-work"],
                mood: 'showcase',
                colors: 'visual',
                audience: 'portfolio-viewers',
                features: ["large-gallery","masonry","lightbox"],
                universal: false
            },
            {
                layout: 'layout-43-blog-magazine.html',
                type: 'blog-magazine',
                quality: 'high',
                themes: ["blog","magazine","publishing","news","editorial","journalism","media"],
                mood: 'editorial',
                colors: 'editorial',
                audience: 'readers',
                features: ["featured-posts","categories","sidebar"],
                universal: false
            },
            {
                layout: 'layout-44-pricing-focus.html',
                type: 'pricing-focus',
                quality: 'high',
                themes: ["saas","subscription","pricing","plans","membership","service-tiers"],
                mood: 'sales-driven',
                colors: 'pricing',
                audience: 'buyers',
                features: ["pricing-tables","comparison","cta-focused"],
                universal: false
            },
            {
                layout: 'layout-45-timeline.html',
                type: 'timeline',
                quality: 'high',
                themes: ["history","milestones","journey","story","progress","evolution","roadmap"],
                mood: 'narrative',
                colors: 'timeline',
                audience: 'story-seekers',
                features: ["timeline-design","chronological","storytelling"],
                universal: false
            },
            {
                layout: 'layout-46-footer-heavy.html',
                type: 'footer-heavy',
                quality: 'standard',
                themes: ["information-rich","resources","sitemap","directory","portal"],
                mood: 'comprehensive',
                colors: 'adaptable',
                audience: 'information-seekers',
                features: ["mega-footer","links","sitemap"],
                universal: true
            },
            {
                layout: 'layout-47-testimonials-showcase.html',
                type: 'testimonials',
                quality: 'high',
                themes: ["reviews","social-proof","testimonials","trust","credibility","ratings"],
                mood: 'trust-building',
                colors: 'trust',
                audience: 'decision-makers',
                features: ["testimonials","reviews","social-proof"],
                universal: false
            },
            {
                layout: 'layout-48-team-about.html',
                type: 'team-about',
                quality: 'high',
                themes: ["team","about","company","people","culture","employees","staff"],
                mood: 'personal',
                colors: 'friendly',
                audience: 'job-seekers',
                features: ["team-grid","bios","photos"],
                universal: false
            },
            {
                layout: 'layout-49-video-bg.html',
                type: 'video-bg',
                quality: 'premium',
                themes: ["impact","video","media","modern","premium","immersive","engaging"],
                mood: 'impactful',
                colors: 'video-overlay',
                audience: 'visual-consumers',
                features: ["video-background","immersive","modern"],
                universal: false
            },
            {
                layout: 'layout-50-masonry.html',
                type: 'masonry',
                quality: 'high',
                themes: ["blog","portfolio","gallery","pinterest-style","visual-grid","content-showcase"],
                mood: 'dynamic',
                colors: 'adaptable',
                audience: 'visual-browsers',
                features: ["masonry-grid","dynamic","visual-flow"],
                universal: true
            },

            // ============ LAYOUTS SECTORIELS 51-70 ============
            {
                layout: 'layout-51-faq-center.html',
                type: 'faq',
                quality: 'high',
                themes: ['faq', 'support', 'help', 'documentation', 'customer-service'],
                mood: 'helpful',
                colors: 'adaptable',
                audience: 'support-seekers',
                features: ['search-box', 'categories', 'accordion'],
                universal: false
            },
            {
                layout: 'layout-52-app-showcase.html',
                type: 'app',
                quality: 'high',
                themes: ['app', 'mobile', 'software', 'saas', 'tech', 'startup'],
                mood: 'modern',
                colors: 'tech',
                audience: 'tech-savvy',
                features: ['phone-mockup', 'app-download'],
                universal: false
            },
            {
                layout: 'layout-53-restaurant.html',
                type: 'restaurant',
                quality: 'high',
                themes: ['restaurant', 'food', 'cuisine', 'gastronomie', 'dining'],
                mood: 'welcoming',
                colors: 'warm',
                audience: 'foodies',
                features: ['menu-showcase', 'reservation'],
                universal: false
            },
            {
                layout: 'layout-54-real-estate.html',
                type: 'realestate',
                quality: 'high',
                themes: ['real-estate', 'immobilier', 'property', 'housing', 'homes'],
                mood: 'professional',
                colors: 'professional',
                audience: 'home-buyers',
                features: ['property-search', 'filters', 'gallery'],
                universal: false
            },
            {
                layout: 'layout-55-education.html',
                type: 'education',
                quality: 'high',
                themes: ['education', 'e-learning', 'courses', 'training', 'school'],
                mood: 'friendly',
                colors: 'friendly',
                audience: 'students',
                features: ['course-cards', 'enrollment'],
                universal: false
            },
            {
                layout: 'layout-56-medical.html',
                type: 'medical',
                quality: 'high',
                themes: ['medical', 'health', 'healthcare', 'clinic', 'doctor', 'hospital'],
                mood: 'trustworthy',
                colors: 'health',
                audience: 'patients',
                features: ['appointment-booking', 'emergency-button'],
                universal: false
            },
            {
                layout: 'layout-57-fitness.html',
                type: 'fitness',
                quality: 'high',
                themes: ['fitness', 'gym', 'sport', 'training', 'health', 'wellness'],
                mood: 'energetic',
                colors: 'vibrant',
                audience: 'athletes',
                features: ['class-schedule', 'membership'],
                universal: false
            },
            {
                layout: 'layout-58-events.html',
                type: 'events',
                quality: 'high',
                themes: ['events', 'conference', 'festival', 'concert', 'gathering'],
                mood: 'exciting',
                colors: 'vibrant',
                audience: 'event-goers',
                features: ['timeline', 'schedule', 'tickets'],
                universal: false
            },
            {
                layout: 'layout-59-travel.html',
                type: 'travel',
                quality: 'high',
                themes: ['travel', 'tourism', 'voyage', 'destination', 'vacation'],
                mood: 'adventurous',
                colors: 'bright',
                audience: 'travelers',
                features: ['destination-search', 'booking'],
                universal: false
            },
            {
                layout: 'layout-60-nonprofit.html',
                type: 'nonprofit',
                quality: 'high',
                themes: ['nonprofit', 'charity', 'ong', 'association', 'cause'],
                mood: 'caring',
                colors: 'warm',
                audience: 'donors',
                features: ['donation-form', 'impact-stats'],
                universal: false
            },
            {
                layout: 'layout-61-automotive.html',
                type: 'automotive',
                quality: 'high',
                themes: ['car', 'auto', 'automotive', 'vehicle', 'dealer'],
                mood: 'bold',
                colors: 'dark',
                audience: 'car-buyers',
                features: ['specs-display', 'model-showcase'],
                universal: false
            },
            {
                layout: 'layout-62-legal.html',
                type: 'legal',
                quality: 'high',
                themes: ['legal', 'law', 'lawyer', 'attorney', 'juridique'],
                mood: 'professional',
                colors: 'professional',
                audience: 'clients',
                features: ['consultation-form', 'expertise-cards'],
                universal: false
            },
            {
                layout: 'layout-63-photography.html',
                type: 'photography',
                quality: 'high',
                themes: ['photography', 'photographer', 'portfolio', 'photo', 'creative'],
                mood: 'artistic',
                colors: 'minimal',
                audience: 'art-lovers',
                features: ['gallery', 'portfolio', 'minimal-design'],
                universal: false
            },
            {
                layout: 'layout-64-beauty.html',
                type: 'beauty',
                quality: 'high',
                themes: ['beauty', 'spa', 'wellness', 'salon', 'cosmetics'],
                mood: 'elegant',
                colors: 'soft',
                audience: 'beauty-seekers',
                features: ['services-showcase', 'pricing'],
                universal: false
            },
            {
                layout: 'layout-65-podcast.html',
                type: 'podcast',
                quality: 'high',
                themes: ['podcast', 'audio', 'media', 'broadcasting', 'radio'],
                mood: 'modern',
                colors: 'modern',
                audience: 'listeners',
                features: ['audio-player', 'episodes', 'subscribe'],
                universal: false
            },
            {
                layout: 'layout-66-gaming.html',
                type: 'gaming',
                quality: 'high',
                themes: ['gaming', 'esports', 'game', 'videogame', 'gamer'],
                mood: 'energetic',
                colors: 'dark',
                audience: 'gamers',
                features: ['dark-theme', 'neon-effects'],
                universal: false
            },
            {
                layout: 'layout-67-wedding.html',
                type: 'wedding',
                quality: 'high',
                themes: ['wedding', 'mariage', 'event', 'celebration', 'matrimony'],
                mood: 'romantic',
                colors: 'elegant',
                audience: 'couples',
                features: ['timeline', 'rsvp', 'elegant-design'],
                universal: false
            },
            {
                layout: 'layout-68-coworking.html',
                type: 'coworking',
                quality: 'high',
                themes: ['coworking', 'workspace', 'office', 'freelance', 'startup'],
                mood: 'professional',
                colors: 'modern',
                audience: 'freelancers',
                features: ['pricing', 'space-showcase', 'amenities'],
                universal: false
            },
            {
                layout: 'layout-69-crypto.html',
                type: 'crypto',
                quality: 'high',
                themes: ['crypto', 'blockchain', 'web3', 'cryptocurrency', 'tech'],
                mood: 'futuristic',
                colors: 'dark',
                audience: 'investors',
                features: ['dark-theme', 'gradient-text', 'tokenomics'],
                universal: false
            },
            {
                layout: 'layout-70-pets.html',
                type: 'pets',
                quality: 'high',
                themes: ['pets', 'animals', 'pet-care', 'grooming', 'veterinary'],
                mood: 'playful',
                colors: 'cute',
                audience: 'pet-owners',
                features: ['playful-design', 'services', 'pricing'],
                universal: false
            }
        ];

        // Ajouter les layouts simples avec framework
        this.addSimpleLayouts();
    }

    /**
     * Ajoute les layouts simples (bootstrap, tailwind, bulma)
     */
    addSimpleLayouts() {
        const simpleLayouts = [
            {
                layout: 'layout-simple-bootstrap.html',
                type: 'bootstrap',
                quality: 'standard',
                themes: ['general', 'business', 'corporate', 'startup', 'services'],
                mood: 'professional',
                colors: 'bootstrap',
                audience: 'general',
                features: ['bootstrap-components', 'responsive'],
                universal: true
            },
            {
                layout: 'layout-simple-tailwind.html',
                type: 'tailwind',
                quality: 'standard',
                themes: ['general', 'modern', 'tech', 'startup', 'saas'],
                mood: 'modern',
                colors: 'tailwind',
                audience: 'general',
                features: ['utility-classes', 'customizable'],
                universal: true
            },
            {
                layout: 'layout-simple-bulma.html',
                type: 'bulma',
                quality: 'standard',
                themes: ['general', 'modern', 'clean', 'minimal'],
                mood: 'clean',
                colors: 'bulma',
                audience: 'general',
                features: ['bulma-components', 'modern'],
                universal: true
            }
        ];

        this.layoutDatabase.push(...simpleLayouts);
    }

    /**
     * Mapping amélioré des mots-clés vers les thèmes
     */
    initializeThemeMapping() {
        this.themeKeywords = {
            // Animaux / Pets
            'pets': ['chat', 'chaton', 'chien', 'chiot', 'animal', 'animaux', 'pet', 'puppy', 'kitten', 'cat', 'dog', 'veterinaire', 'vétérinaire'],

            // Enfants / Kids
            'kids': ['enfant', 'bébé', 'jouet', 'jeu', 'école', 'kids', 'children', 'baby', 'toy', 'maternelle', 'crèche'],

            // Business / Corporate
            'business': ['business', 'entreprise', 'société', 'corporate', 'conseil', 'consulting', 'management', 'stratégie'],
            'finance': ['finance', 'banque', 'investissement', 'comptable', 'assurance', 'trading', 'bourse'],
            'legal': ['avocat', 'juridique', 'droit', 'legal', 'justice', 'tribunal'],

            // Tech
            'tech': ['tech', 'technologie', 'software', 'logiciel', 'app', 'application', 'api', 'développement', 'programmation'],
            'ai': ['ai', 'intelligence artificielle', 'machine learning', 'ml', 'deep learning', 'ia', 'algorithme'],
            'crypto': ['crypto', 'blockchain', 'bitcoin', 'ethereum', 'nft', 'defi'],

            // Créatif
            'creative': ['design', 'créatif', 'art', 'graphique', 'creative', 'artistic', 'création'],
            'photography': ['photo', 'photographie', 'image', 'shooting', 'photographe'],

            // E-commerce
            'ecommerce': ['boutique', 'shop', 'magasin', 'vente', 'produit', 'acheter', 'store', 'commerce', 'achat'],
            'fashion': ['mode', 'fashion', 'vêtement', 'style', 'tendance', 'collection'],

            // Santé / Wellness
            'health': ['santé', 'médecin', 'médical', 'clinique', 'hôpital', 'soin', 'thérapie'],
            'wellness': ['bien-être', 'spa', 'yoga', 'meditation', 'relaxation', 'détente'],

            // Food
            'food': ['restaurant', 'cuisine', 'nourriture', 'recette', 'gastronomie', 'chef', 'alimentation'],

            // Education
            'education': ['formation', 'cours', 'école', 'université', 'apprentissage', 'enseignement', 'étude'],

            // Sport
            'sport': ['sport', 'fitness', 'gym', 'musculation', 'athlète', 'entrainement', 'compétition'],

            // Immobilier
            'realestate': ['immobilier', 'maison', 'appartement', 'location', 'vente', 'propriété', 'agent immobilier']
        };

        // Palettes de couleurs adaptées et neutres
        this.colorPalettes = {
            'adaptable': {  // Palette neutre qui s'adapte à tout
                name: 'Adaptable',
                primary: '#4A5568',
                secondary: '#718096',
                accent: '#ED8936',
                text: '#2D3748',
                background: '#FFFFFF'
            },
            'playful': {
                name: 'Playful',
                primary: '#FF6B6B',
                secondary: '#4ECDC4',
                accent: '#FFE66D',
                text: '#2D3436',
                background: '#FFF5F5'
            },
            'cute': {
                name: 'Cute',
                primary: '#FFB6C1',
                secondary: '#87CEEB',
                accent: '#FFE4E1',
                text: '#5D4E60',
                background: '#FFF0F5'
            },
            'professional': {
                name: 'Professional',
                primary: '#2E3192',
                secondary: '#1E88E5',
                accent: '#00ACC1',
                text: '#212121',
                background: '#FFFFFF'
            },
            'tech': {
                name: 'Tech',
                primary: '#6366F1',
                secondary: '#8B5CF6',
                accent: '#EC4899',
                text: '#1F2937',
                background: '#F9FAFB'
            },
            'health': {
                name: 'Health',
                primary: '#10B981',
                secondary: '#34D399',
                accent: '#FCD34D',
                text: '#064E3B',
                background: '#F0FDF4'
            }
        };
    }

    /**
     * Contenus neutres et adaptables
     */
    initializeNeutralContent() {
        this.neutralContent = {
            hero_title: 'Bienvenue',
            hero_subtitle: 'Découvrez notre univers',
            features_title: 'Nos Points Forts',
            features_subtitle: 'Ce qui nous distingue',
            services_title: 'Nos Services',
            services_subtitle: 'Des solutions adaptées à vos besoins',
            about_title: 'À Propos',
            about_subtitle: 'Notre histoire',
            cta_title: 'Prêt à commencer ?',
            cta_text: 'Contactez-nous pour en savoir plus',
            cta_primary: 'Découvrir',
            cta_secondary: 'En savoir plus',
            cta_button: 'Nous contacter',

            // Contenus génériques sans références spécifiques
            section1_content: 'Nous proposons des solutions innovantes et adaptées à vos besoins spécifiques.',
            section2_content: 'Une équipe dédiée vous accompagne dans tous vos projets.',
            section3_content: 'Des résultats concrets et mesurables pour votre satisfaction.',

            features_content: 'Découvrez l\'ensemble de nos caractéristiques et avantages.',
            services_content: 'Une gamme complète de services pour répondre à vos attentes.',
            benefits_content: 'Les bénéfices de notre approche pour votre réussite.'
        };
    }

    /**
     * Analyse améliorée des mots-clés
     */
    analyzeTheme(keywords, analysis) {
        const themeCounts = {};
        let totalMatches = 0;

        // Analyser chaque mot-clé
        keywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();

            Object.entries(this.themeKeywords).forEach(([theme, themeWords]) => {
                themeWords.forEach(word => {
                    if (lowerKeyword.includes(word)) {
                        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
                        totalMatches++;
                    }
                });
            });
        });

        // Si aucun thème spécifique détecté, utiliser l'analyse fournie
        if (totalMatches === 0 && analysis) {
            // Essayer de mapper l'analyse existante
            if (analysis.businessType === 'B2B') {
                themeCounts['business'] = 1;
            }
            if (analysis.sector === 'tech' || analysis.sector === 'digital') {
                themeCounts['tech'] = 1;
            }
        }

        // Trouver le thème dominant
        const dominantTheme = Object.entries(themeCounts)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            theme: dominantTheme ? dominantTheme[0] : 'general',
            confidence: dominantTheme ? dominantTheme[1] / Math.max(keywords.length, 1) : 0,
            allThemes: themeCounts,
            isGeneric: !dominantTheme || dominantTheme[1] < 2,  // Flag pour thème générique
            originalAnalysis: analysis
        };
    }

    /**
     * Sélection améliorée avec fallback intelligent
     */
    async selectBestLayout(keywords = [], analysis = {}) {
        const themeAnalysis = this.analyzeTheme(keywords, analysis);

        console.log(`\n🎯 Analyse thématique ultra-détaillée:`);
        console.log(`  Thème détecté: ${themeAnalysis.theme}`);
        console.log(`  Confiance: ${(themeAnalysis.confidence * 100).toFixed(1)}%`);
        console.log(`  Générique: ${themeAnalysis.isGeneric ? 'Oui' : 'Non'}`);

        // 🚀 NOUVELLE LOGIQUE : Scorer tous les layouts avec les labels détaillés
        const scoredLayouts = this.scoreLayoutsWithDetailedLabels(keywords, themeAnalysis);

        console.log(`\n📊 Top 5 layouts selon les labels détaillés:`);
        scoredLayouts.slice(0, 5).forEach((layout, index) => {
            console.log(`  ${index + 1}. ${layout.layout} (score: ${layout.detailedScore.toFixed(1)}, spé: ${layout.specialization_score || 'N/A'})`);
        });

        // 🎯 SÉLECTION DU MEILLEUR LAYOUT
        // Sélectionner simplement le layout avec le meilleur score
        const selectedLayout = scoredLayouts[0];

        console.log(`\n✅ Layout final sélectionné: ${selectedLayout.layout}`);
        console.log(`   Score détaillé: ${selectedLayout.detailedScore.toFixed(1)}/100`);
        console.log(`   Spécialisation: ${selectedLayout.specialization_score || 'N/A'}/100`);

        if (selectedLayout.scoringDetails) {
            console.log(`   Détails scoring:`);
            Object.entries(selectedLayout.scoringDetails).forEach(([key, value]) => {
                if (value !== 0) {
                    console.log(`     ${key}: ${value.toFixed(1)}`);
                }
            });
        }

        // Sélectionner la palette de couleurs
        let colorScheme = this.selectColorScheme(themeAnalysis, selectedLayout);

        console.log(`  Layout sélectionné: ${selectedLayout.layout}`);
        console.log(`  Type: ${selectedLayout.type}`);
        console.log(`  Mood: ${selectedLayout.mood}`);
        console.log(`  Universal: ${selectedLayout.universal ? 'Oui' : 'Non'}`);

        return {
            layout: selectedLayout,
            colorScheme: colorScheme,
            themeAnalysis: themeAnalysis
        };
    }

    /**
     * Sélection intelligente de la palette de couleurs
     */
    selectColorScheme(themeAnalysis, layout) {
        // 1. Si le layout a une couleur spécifique qui correspond à une palette
        if (layout.colors && this.colorPalettes[layout.colors]) {
            return this.colorPalettes[layout.colors];
        }

        // 2. Si le layout est adaptable ou universel, choisir selon le thème
        if (layout.colors === 'adaptable' || layout.universal) {
            // Utiliser une palette adaptée au thème
            if (themeAnalysis.theme === 'pets' || themeAnalysis.theme === 'kids') {
                return this.colorPalettes.cute;
            } else if (themeAnalysis.theme === 'business' || themeAnalysis.theme === 'finance') {
                return this.colorPalettes.professional;
            } else if (themeAnalysis.theme === 'tech' || themeAnalysis.theme === 'ai') {
                return this.colorPalettes.tech;
            } else if (themeAnalysis.theme === 'health' || themeAnalysis.theme === 'wellness') {
                return this.colorPalettes.health;
            }
        }

        // 3. Palette par défaut adaptable
        return this.colorPalettes.adaptable;
    }

    /**
     * Adaptation du contenu avec fallback neutre
     */
    adaptContentToTheme(content, themeAnalysis) {
        // Commencer avec le contenu neutre
        let adaptedContent = { ...this.neutralContent, ...content };

        // Adaptations spécifiques si thème fort
        if (themeAnalysis.confidence > 0.5) {
            const themeAdaptations = {
                'pets': {
                    hero_title: 'Bienvenue dans notre monde animalier',
                    hero_subtitle: 'Tout pour le bien-être de vos compagnons',
                    cta_primary: 'Nos conseils',
                    cta_secondary: 'Notre galerie'
                },
                'kids': {
                    hero_title: 'Un univers dédié aux enfants',
                    hero_subtitle: 'Découvertes et apprentissages',
                    cta_primary: 'Explorer',
                    cta_secondary: 'Activités'
                },
                'business': {
                    hero_title: 'Solutions professionnelles',
                    hero_subtitle: 'Votre partenaire de confiance',
                    cta_primary: 'Demander un devis',
                    cta_secondary: 'Nos services'
                },
                'tech': {
                    hero_title: 'Innovation technologique',
                    hero_subtitle: 'Solutions digitales avancées',
                    cta_primary: 'Démarrer',
                    cta_secondary: 'Documentation'
                },
                'health': {
                    hero_title: 'Votre santé, notre priorité',
                    hero_subtitle: 'Soins et accompagnement personnalisés',
                    cta_primary: 'Prendre rendez-vous',
                    cta_secondary: 'Nos services'
                }
            };

            const adaptation = themeAdaptations[themeAnalysis.theme];
            if (adaptation) {
                adaptedContent = { ...adaptedContent, ...adaptation };
            }
        }

        // S'assurer qu'aucun contenu n'est vide
        Object.keys(adaptedContent).forEach(key => {
            if (!adaptedContent[key] || adaptedContent[key] === '') {
                adaptedContent[key] = this.neutralContent[key] || 'Contenu à venir';
            }
        });

        return adaptedContent;
    }

    /**
     * Obtenir un layout aléatoire universel (fallback ultime)
     */
    getRandomUniversalLayout() {
        const universalLayouts = this.layoutDatabase.filter(l => l.universal === true);
        return universalLayouts[Math.floor(Math.random() * universalLayouts.length)];
    }

    /**
     * 🎯 NOUVEAU : Enrichit tous les layouts avec des labels ultra-détaillés
     */
    enrichLayoutsWithAdvancedLabels() {
        this.layoutDatabase = this.layoutDatabase.map(layout => {
            const enriched = { ...layout };

            // 🎯 LABELS DÉTAILLÉS POUR TOUS LES 30 LAYOUTS
            this.applySpecificLabels(enriched, layout);

            // 🎯 Layouts universels : labels spécifiques même si universels
            if (layout.universal && !enriched.sectors_detailed) {
                // Labels par défaut seulement si aucun label spécifique n'a été appliqué
                enriched.sectors_detailed = ['general', 'adaptable'];
                enriched.demographics_age = ['all-ages'];
                enriched.psychology_emotions = ['neutral', 'adaptable'];
                enriched.psychology_personality = ['flexible', 'universal'];
                enriched.interactions_engagement = ['standard'];
                enriched.conversion_goals = ['flexible', 'multi-purpose'];
                enriched.formats_structure = ['adaptable', 'responsive'];
                enriched.technical_performance = ['standard', 'reliable'];
                enriched.complexity_content = ['moderate', 'scalable'];
            }

            // Ajouter des micro-labels pour personalisation ultra-fine
            enriched.micro_labels = {
                color_preferences: this.generateColorPreferences(layout),
                font_style: this.generateFontPreferences(layout),
                spacing: this.generateSpacingPreferences(layout),
                interaction_level: this.generateInteractionLevel(layout),
                content_density: this.generateContentDensity(layout)
            };

            // Calculer un score de spécialisation
            enriched.specialization_score = this.calculateSpecializationScore(enriched);

            return enriched;
        });
    }

    /**
     * Génère des préférences de couleurs selon le layout
     */
    generateColorPreferences(layout) {
        const colorMap = {
            'pets': ['pastel', 'warm', 'playful', 'soft'],
            'professional': ['corporate', 'blue-family', 'neutral', 'trust'],
            'saas': ['modern', 'tech-blue', 'gradients', 'accent-heavy'],
            'creative': ['vibrant', 'artistic', 'bold', 'experimental'],
            'ecommerce': ['product-focused', 'clean', 'brand-colors'],
            'general': ['adaptable', 'standard', 'safe']
        };
        return colorMap[layout.type] || colorMap['general'];
    }

    /**
     * Génère des préférences typographiques
     */
    generateFontPreferences(layout) {
        const fontMap = {
            'pets': ['rounded', 'friendly', 'playful'],
            'professional': ['serif', 'clean', 'readable'],
            'saas': ['sans-serif', 'modern', 'tech'],
            'creative': ['display', 'artistic', 'unique'],
            'ecommerce': ['product-focused', 'clear', 'sales'],
            'general': ['readable', 'standard', 'safe']
        };
        return fontMap[layout.type] || fontMap['general'];
    }

    /**
     * Génère des préférences d'espacement
     */
    generateSpacingPreferences(layout) {
        const spacingMap = {
            'pets': ['cozy', 'friendly', 'moderate'],
            'professional': ['structured', 'formal', 'generous'],
            'saas': ['clean', 'modern', 'focused'],
            'creative': ['artistic', 'dynamic', 'expressive'],
            'ecommerce': ['product-optimized', 'clean', 'purchase-focused'],
            'general': ['balanced', 'standard', 'readable']
        };
        return spacingMap[layout.type] || spacingMap['general'];
    }

    /**
     * Détermine le niveau d'interaction
     */
    generateInteractionLevel(layout) {
        if (layout.features?.includes('interactive')) return 'high';
        if (layout.features?.includes('animations')) return 'medium';
        return 'standard';
    }

    /**
     * Détermine la densité de contenu
     */
    generateContentDensity(layout) {
        if (layout.features?.includes('minimal')) return 'low';
        if (layout.features?.includes('comprehensive')) return 'high';
        return 'medium';
    }

    /**
     * Calcule un score de spécialisation (0-100)
     */
    calculateSpecializationScore(layout) {
        let score = 0;

        // Plus de secteurs spécifiques = plus spécialisé
        const specificSectors = layout.sectors_detailed?.length || 0;
        score += Math.min(specificSectors * 15, 60);

        // Labels psychologiques spécifiques
        const psychoLabels = (layout.psychology_emotions?.length || 0) + (layout.psychology_personality?.length || 0);
        score += Math.min(psychoLabels * 5, 25);

        // Complexité technique
        if (layout.technical_performance?.includes('enterprise')) score += 10;
        if (layout.complexity_content?.includes('comprehensive')) score += 5;

        // Universal flag diminue la spécialisation
        if (layout.universal) score = Math.max(score - 30, 10);

        return Math.min(score, 100);
    }

    /**
     * 🎯 LABELS SPÉCIFIQUES POUR TOUS LES 30 LAYOUTS
     */
    applySpecificLabels(enriched, layout) {
        switch (layout.layout) {
            // ============ LAYOUTS SPÉCIALISÉS PREMIUM ============
            case 'layout-pets-cute.html':
                enriched.sectors_detailed = ['pets', 'veterinaire', 'animalerie', 'adoption', 'wildlife'];
                enriched.demographics_age = ['families', 'kids', 'all-ages'];
                enriched.demographics_profession = ['pet-owners', 'animal-lovers'];
                enriched.psychology_emotions = ['fun', 'playful', 'trust', 'calm', 'affection'];
                enriched.psychology_personality = ['quirky', 'friendly', 'warm', 'caring'];
                enriched.interactions_engagement = ['interactive', 'visual-heavy', 'community-driven'];
                enriched.conversion_goals = ['community', 'information', 'trust-building', 'adoption'];
                enriched.formats_structure = ['card-based', 'image-focused', 'gallery-style'];
                enriched.technical_performance = ['optimized', 'mobile-friendly', 'image-heavy'];
                enriched.complexity_content = ['moderate', 'accessible', 'family-friendly'];
                break;

            case 'layout-professional.html':
                enriched.sectors_detailed = ['consulting', 'finance', 'legal', 'corporate', 'insurance'];
                enriched.demographics_age = ['adults', 'professionals', 'executives'];
                enriched.demographics_profession = ['executives', 'managers', 'entrepreneurs', 'consultants'];
                enriched.psychology_emotions = ['trust', 'serious', 'confidence', 'authority'];
                enriched.psychology_personality = ['conservative', 'elegant', 'professional', 'reliable'];
                enriched.interactions_engagement = ['minimal', 'focused', 'results-oriented'];
                enriched.conversion_goals = ['lead-generation', 'b2b-sales', 'branding', 'credibility'];
                enriched.formats_structure = ['structured', 'formal', 'testimonials-heavy'];
                enriched.technical_performance = ['enterprise-grade', 'secure', 'compliance-ready'];
                enriched.complexity_content = ['comprehensive', 'detailed', 'professional'];
                break;

            case 'layout-saas-modern-enhanced.html':
                enriched.sectors_detailed = ['saas', 'ai-ml', 'cybersecurity', 'fintech', 'cloud'];
                enriched.demographics_age = ['young-adults', 'adults', 'tech-savvy'];
                enriched.demographics_profession = ['developers', 'tech-professionals', 'startups', 'product-managers'];
                enriched.psychology_emotions = ['excitement', 'innovation', 'efficiency', 'cutting-edge'];
                enriched.psychology_personality = ['modern', 'bold', 'minimalist', 'forward-thinking'];
                enriched.interactions_engagement = ['highly-interactive', 'demo-focused', 'trial-oriented'];
                enriched.conversion_goals = ['trial-signup', 'saas-conversion', 'freemium-acquisition'];
                enriched.formats_structure = ['dashboard-preview', 'feature-focused', 'metrics-driven'];
                enriched.technical_performance = ['high-performance', 'scalable', 'api-friendly'];
                enriched.complexity_content = ['technical', 'feature-rich', 'developer-oriented'];
                break;

            case 'layout-ecommerce-premium.html':
                enriched.sectors_detailed = ['fashion', 'beauty', 'electronics', 'luxury', 'retail'];
                enriched.demographics_age = ['young-adults', 'adults', 'shoppers'];
                enriched.demographics_social_class = ['middle-class', 'premium', 'luxury', 'affluent'];
                enriched.psychology_emotions = ['desire', 'aspiration', 'satisfaction', 'exclusivity'];
                enriched.psychology_personality = ['modern', 'elegant', 'sophisticated', 'trendy'];
                enriched.interactions_engagement = ['product-focused', 'purchase-optimized', 'browsing-friendly'];
                enriched.conversion_goals = ['sales', 'product-showcase', 'cart-conversion'];
                enriched.formats_structure = ['product-grid', 'checkout-optimized', 'catalog-style'];
                enriched.technical_performance = ['fast-loading', 'secure-payment', 'mobile-commerce'];
                enriched.complexity_content = ['product-heavy', 'catalog-based', 'inventory-driven'];
                break;

            case 'layout-agency-creative-enhanced.html':
                enriched.sectors_detailed = ['creative', 'design', 'photography', 'marketing', 'advertising'];
                enriched.demographics_age = ['young-adults', 'adults', 'creatives'];
                enriched.demographics_profession = ['designers', 'artists', 'photographers', 'marketers'];
                enriched.psychology_emotions = ['inspiration', 'creativity', 'artistic', 'impressive'];
                enriched.psychology_personality = ['artistic', 'bold', 'unique', 'expressive'];
                enriched.interactions_engagement = ['portfolio-heavy', 'visual-storytelling', 'case-studies'];
                enriched.conversion_goals = ['portfolio-showcase', 'client-acquisition', 'brand-awareness'];
                enriched.formats_structure = ['portfolio-grid', 'case-study-driven', 'visual-narrative'];
                enriched.technical_performance = ['visual-optimized', 'portfolio-ready', 'media-heavy'];
                enriched.complexity_content = ['visual-rich', 'project-based', 'creative-focused'];
                break;

            case 'layout-agency-creative.html':
                enriched.sectors_detailed = ['creative', 'design', 'agency', 'marketing', 'portfolio'];
                enriched.demographics_age = ['young-adults', 'adults', 'creatives'];
                enriched.demographics_profession = ['designers', 'agencies', 'marketers', 'creative-professionals'];
                enriched.psychology_emotions = ['inspiration', 'creativity', 'professional', 'modern'];
                enriched.psychology_personality = ['creative', 'professional', 'modern', 'balanced'];
                enriched.interactions_engagement = ['portfolio-focused', 'visual-presentation', 'client-oriented'];
                enriched.conversion_goals = ['client-acquisition', 'portfolio-showcase', 'service-presentation'];
                enriched.formats_structure = ['agency-layout', 'portfolio-sections', 'service-focused'];
                enriched.technical_performance = ['portfolio-optimized', 'visual-performance', 'professional-grade'];
                enriched.complexity_content = ['balanced', 'professional', 'service-oriented'];
                break;

            case 'layout-saas-modern.html':
                enriched.sectors_detailed = ['saas', 'software', 'tech', 'startup', 'digital'];
                enriched.demographics_age = ['young-adults', 'adults', 'tech-users'];
                enriched.demographics_profession = ['developers', 'product-managers', 'tech-users', 'startups'];
                enriched.psychology_emotions = ['modern', 'efficiency', 'innovation', 'trust'];
                enriched.psychology_personality = ['modern', 'professional', 'tech-forward', 'reliable'];
                enriched.interactions_engagement = ['saas-focused', 'feature-presentation', 'trial-oriented'];
                enriched.conversion_goals = ['trial-conversion', 'saas-signup', 'feature-demonstration'];
                enriched.formats_structure = ['saas-layout', 'feature-sections', 'conversion-optimized'];
                enriched.technical_performance = ['saas-optimized', 'conversion-focused', 'professional'];
                enriched.complexity_content = ['saas-oriented', 'feature-rich', 'conversion-focused'];
                break;

            // ============ LAYOUTS TECHNIQUES SPÉCIALISÉS ============
            case 'layout-16-cyberpunk.html':
                enriched.sectors_detailed = ['cybersecurity', 'gaming', 'crypto', 'tech', 'blockchain'];
                enriched.demographics_age = ['young-adults', 'tech-enthusiasts', 'gamers'];
                enriched.demographics_profession = ['developers', 'security-experts', 'gamers', 'crypto-traders'];
                enriched.psychology_emotions = ['excitement', 'futuristic', 'edgy', 'rebellious'];
                enriched.psychology_personality = ['bold', 'futuristic', 'alternative', 'tech-forward'];
                enriched.interactions_engagement = ['highly-interactive', 'immersive', 'animated'];
                enriched.conversion_goals = ['engagement', 'community-building', 'tech-credibility'];
                enriched.formats_structure = ['futuristic-ui', 'neon-accents', 'tech-aesthetic'];
                enriched.technical_performance = ['animation-heavy', 'modern-browsers', 'gpu-accelerated'];
                enriched.complexity_content = ['tech-heavy', 'jargon-friendly', 'expert-level'];
                break;

            case 'layout-15-retrowave.html':
                enriched.sectors_detailed = ['music', 'entertainment', 'nostalgia', 'gaming', 'media'];
                enriched.demographics_age = ['millennials', 'gen-x', 'nostalgia-seekers'];
                enriched.demographics_profession = ['musicians', 'artists', 'content-creators', 'entertainers'];
                enriched.psychology_emotions = ['nostalgia', 'fun', 'retro-cool', 'atmospheric'];
                enriched.psychology_personality = ['nostalgic', 'artistic', 'alternative', 'vintage-modern'];
                enriched.interactions_engagement = ['audio-visual', 'atmospheric', 'immersive'];
                enriched.conversion_goals = ['brand-experience', 'content-consumption', 'nostalgia-marketing'];
                enriched.formats_structure = ['retro-aesthetic', 'synth-wave', 'gradient-heavy'];
                enriched.technical_performance = ['style-heavy', 'animation-rich', 'theme-focused'];
                enriched.complexity_content = ['style-over-substance', 'mood-driven', 'aesthetic-first'];
                break;

            // ============ LAYOUTS BUSINESS VARIÉS ============
            case 'layout-18-corporate.html':
                enriched.sectors_detailed = ['corporate', 'enterprise', 'multinational', 'b2b', 'industrial'];
                enriched.demographics_age = ['adults', 'professionals', 'enterprise-level'];
                enriched.demographics_profession = ['c-level', 'enterprise-buyers', 'corporate-decision-makers'];
                enriched.psychology_emotions = ['trust', 'stability', 'authority', 'established'];
                enriched.psychology_personality = ['conservative', 'reliable', 'established', 'formal'];
                enriched.interactions_engagement = ['information-heavy', 'credibility-focused', 'formal'];
                enriched.conversion_goals = ['enterprise-sales', 'partnership', 'b2b-leads'];
                enriched.formats_structure = ['corporate-standard', 'information-dense', 'formal-sections'];
                enriched.technical_performance = ['enterprise-compatible', 'accessibility-compliant', 'secure'];
                enriched.complexity_content = ['comprehensive', 'formal', 'compliance-ready'];
                break;

            case 'layout-10-magazine.html':
                enriched.sectors_detailed = ['media', 'journalism', 'publishing', 'news', 'content'];
                enriched.demographics_age = ['adults', 'readers', 'information-seekers'];
                enriched.demographics_profession = ['journalists', 'readers', 'content-consumers', 'professionals'];
                enriched.psychology_emotions = ['informative', 'credible', 'engaging', 'authoritative'];
                enriched.psychology_personality = ['informative', 'credible', 'readable', 'organized'];
                enriched.interactions_engagement = ['content-heavy', 'reading-optimized', 'article-focused'];
                enriched.conversion_goals = ['content-consumption', 'subscription', 'readership'];
                enriched.formats_structure = ['article-grid', 'content-organized', 'reading-optimized'];
                enriched.technical_performance = ['reading-optimized', 'content-fast', 'seo-friendly'];
                enriched.complexity_content = ['content-rich', 'article-based', 'editorial'];
                break;

            // ============ LAYOUTS CRÉATIFS ============
            case 'layout-17-creative.html':
                enriched.sectors_detailed = ['creative', 'art', 'design', 'freelance', 'portfolio'];
                enriched.demographics_age = ['young-adults', 'adults', 'creatives'];
                enriched.demographics_profession = ['freelancers', 'artists', 'designers', 'creative-professionals'];
                enriched.psychology_emotions = ['creative', 'inspiring', 'unique', 'artistic'];
                enriched.psychology_personality = ['creative', 'unique', 'expressive', 'non-conformist'];
                enriched.interactions_engagement = ['visual-heavy', 'portfolio-focused', 'creative-showcase'];
                enriched.conversion_goals = ['creative-showcase', 'client-acquisition', 'artistic-recognition'];
                enriched.formats_structure = ['creative-layout', 'asymmetric', 'artistic-flow'];
                enriched.technical_performance = ['visual-focused', 'creative-optimized', 'artistic-priority'];
                enriched.complexity_content = ['creative-driven', 'visual-storytelling', 'artistic'];
                break;

            case 'layout-14-asymmetric.html':
                enriched.sectors_detailed = ['creative', 'modern', 'startup', 'design', 'innovative'];
                enriched.demographics_age = ['young-adults', 'early-adopters', 'design-conscious'];
                enriched.demographics_profession = ['creatives', 'startups', 'designers', 'innovators'];
                enriched.psychology_emotions = ['modern', 'unique', 'innovative', 'distinctive'];
                enriched.psychology_personality = ['modern', 'bold', 'innovative', 'design-forward'];
                enriched.interactions_engagement = ['design-focused', 'layout-experimental', 'modern-ui'];
                enriched.conversion_goals = ['design-credibility', 'modern-appeal', 'differentiation'];
                enriched.formats_structure = ['asymmetric-grid', 'modern-layout', 'design-experimental'];
                enriched.technical_performance = ['modern-css', 'layout-advanced', 'design-priority'];
                enriched.complexity_content = ['design-driven', 'layout-experimental', 'modern-approach'];
                break;

            // ============ LAYOUTS TECHNIQUES AVANCÉS ============
            case 'layout-12-parallax.html':
                enriched.sectors_detailed = ['tech', 'modern', 'interactive', 'digital', 'innovative'];
                enriched.demographics_age = ['young-adults', 'tech-savvy', 'modern-users'];
                enriched.demographics_profession = ['tech-professionals', 'digital-natives', 'early-adopters'];
                enriched.psychology_emotions = ['impressed', 'modern', 'sophisticated', 'engaged'];
                enriched.psychology_personality = ['modern', 'tech-forward', 'innovative', 'dynamic'];
                enriched.interactions_engagement = ['highly-interactive', 'scroll-driven', 'immersive'];
                enriched.conversion_goals = ['engagement', 'tech-credibility', 'modern-appeal'];
                enriched.formats_structure = ['parallax-scroll', 'layered-content', 'scroll-narrative'];
                enriched.technical_performance = ['performance-critical', 'modern-browsers', 'animation-heavy'];
                enriched.complexity_content = ['scroll-storytelling', 'interactive-narrative', 'dynamic'];
                break;

            case 'layout-13-fullscreen.html':
                enriched.sectors_detailed = ['portfolio', 'photography', 'visual', 'media', 'artistic'];
                enriched.demographics_age = ['all-ages', 'visual-oriented', 'media-consumers'];
                enriched.demographics_profession = ['photographers', 'visual-artists', 'media-professionals'];
                enriched.psychology_emotions = ['immersive', 'impressive', 'focused', 'dramatic'];
                enriched.psychology_personality = ['bold', 'visual-first', 'immersive', 'dramatic'];
                enriched.interactions_engagement = ['fullscreen-experience', 'visual-immersion', 'focused'];
                enriched.conversion_goals = ['visual-impact', 'portfolio-showcase', 'immersive-experience'];
                enriched.formats_structure = ['fullscreen-design', 'visual-priority', 'immersive-layout'];
                enriched.technical_performance = ['fullscreen-optimized', 'visual-performance', 'responsive-critical'];
                enriched.complexity_content = ['visual-primary', 'minimal-text', 'impact-driven'];
                break;

            // ============ LAYOUTS POLYVALENTS AMÉLIORÉS ============
            case 'layout-1-hero.html':
                enriched.sectors_detailed = ['general', 'business', 'startup', 'services', 'blog'];
                enriched.demographics_age = ['all-ages', 'general-audience'];
                enriched.demographics_profession = ['general', 'business-owners', 'professionals'];
                enriched.psychology_emotions = ['welcoming', 'professional', 'trustworthy', 'clean'];
                enriched.psychology_personality = ['reliable', 'professional', 'clean', 'standard'];
                enriched.interactions_engagement = ['standard', 'hero-focused', 'call-to-action'];
                enriched.conversion_goals = ['general-conversion', 'lead-generation', 'information'];
                enriched.formats_structure = ['hero-prominent', 'standard-sections', 'cta-focused'];
                enriched.technical_performance = ['standard', 'reliable', 'fast-loading'];
                enriched.complexity_content = ['standard', 'balanced', 'accessible'];
                break;

            case 'layout-3-cards.html':
                enriched.sectors_detailed = ['services', 'portfolio', 'blog', 'features', 'products'];
                enriched.demographics_age = ['all-ages', 'general-audience'];
                enriched.demographics_profession = ['general', 'service-seekers', 'information-seekers'];
                enriched.psychology_emotions = ['organized', 'clear', 'accessible', 'structured'];
                enriched.psychology_personality = ['organized', 'clear', 'user-friendly', 'practical'];
                enriched.interactions_engagement = ['card-based', 'browsing-friendly', 'scannable'];
                enriched.conversion_goals = ['service-discovery', 'content-exploration', 'feature-highlighting'];
                enriched.formats_structure = ['card-grid', 'content-organized', 'scannable-layout'];
                enriched.technical_performance = ['standard', 'mobile-friendly', 'content-optimized'];
                enriched.complexity_content = ['organized', 'structured', 'accessible'];
                break;

            case 'layout-5-minimal.html':
                enriched.sectors_detailed = ['blog', 'writing', 'personal', 'minimal', 'content'];
                enriched.demographics_age = ['adults', 'readers', 'minimalism-lovers'];
                enriched.demographics_profession = ['writers', 'bloggers', 'content-creators', 'minimalists'];
                enriched.psychology_emotions = ['calm', 'focused', 'clean', 'peaceful'];
                enriched.psychology_personality = ['minimalist', 'clean', 'focused', 'understated'];
                enriched.interactions_engagement = ['content-focused', 'reading-optimized', 'distraction-free'];
                enriched.conversion_goals = ['content-consumption', 'reading-experience', 'focus'];
                enriched.formats_structure = ['minimal-design', 'content-first', 'whitespace-heavy'];
                enriched.technical_performance = ['lightweight', 'fast-loading', 'content-optimized'];
                enriched.complexity_content = ['content-focused', 'minimal-distractions', 'reading-optimized'];
                break;

            // ============ LAYOUTS FONCTIONNELS ============
            case 'layout-4-sidebar.html':
                enriched.sectors_detailed = ['blog', 'documentation', 'content', 'information', 'tutorial'];
                enriched.demographics_age = ['adults', 'professionals', 'learners'];
                enriched.demographics_profession = ['content-consumers', 'learners', 'professionals', 'researchers'];
                enriched.psychology_emotions = ['organized', 'informative', 'structured', 'helpful'];
                enriched.psychology_personality = ['organized', 'systematic', 'helpful', 'structured'];
                enriched.interactions_engagement = ['navigation-heavy', 'content-browsing', 'information-seeking'];
                enriched.conversion_goals = ['information-delivery', 'content-navigation', 'knowledge-sharing'];
                enriched.formats_structure = ['sidebar-navigation', 'content-organized', 'hierarchical'];
                enriched.technical_performance = ['content-optimized', 'navigation-friendly', 'information-architecture'];
                enriched.complexity_content = ['information-rich', 'structured', 'navigable'];
                break;

            case 'layout-6-dark.html':
                enriched.sectors_detailed = ['tech', 'gaming', 'modern', 'entertainment', 'edgy'];
                enriched.demographics_age = ['young-adults', 'tech-enthusiasts', 'gamers'];
                enriched.demographics_profession = ['developers', 'gamers', 'tech-workers', 'night-workers'];
                enriched.psychology_emotions = ['sleek', 'modern', 'sophisticated', 'mysterious'];
                enriched.psychology_personality = ['modern', 'sophisticated', 'tech-forward', 'edgy'];
                enriched.interactions_engagement = ['dark-theme', 'modern-ui', 'tech-aesthetic'];
                enriched.conversion_goals = ['modern-appeal', 'tech-credibility', 'dark-theme-preference'];
                enriched.formats_structure = ['dark-design', 'modern-layout', 'tech-aesthetic'];
                enriched.technical_performance = ['dark-optimized', 'modern-browsers', 'theme-aware'];
                enriched.complexity_content = ['dark-theme', 'modern-content', 'tech-oriented'];
                break;

            // ============ LAYOUTS STYLE & DESIGN ============
            case 'layout-8-glass.html':
                enriched.sectors_detailed = ['modern', 'tech', 'design', 'innovative', 'premium'];
                enriched.demographics_age = ['young-adults', 'design-conscious', 'early-adopters'];
                enriched.demographics_profession = ['designers', 'tech-professionals', 'premium-seekers'];
                enriched.psychology_emotions = ['modern', 'sleek', 'premium', 'sophisticated'];
                enriched.psychology_personality = ['modern', 'design-forward', 'premium', 'sophisticated'];
                enriched.interactions_engagement = ['design-focused', 'visual-effects', 'modern-ui'];
                enriched.conversion_goals = ['design-credibility', 'premium-appeal', 'modern-branding'];
                enriched.formats_structure = ['glass-morphism', 'modern-effects', 'layered-design'];
                enriched.technical_performance = ['css-advanced', 'modern-browsers', 'effects-heavy'];
                enriched.complexity_content = ['design-priority', 'modern-aesthetic', 'visual-focused'];
                break;

            case 'layout-9-brutalist.html':
                enriched.sectors_detailed = ['alternative', 'art', 'experimental', 'edgy', 'counter-culture'];
                enriched.demographics_age = ['young-adults', 'artists', 'alternative-seekers'];
                enriched.demographics_profession = ['artists', 'designers', 'alternative-professionals', 'experimenters'];
                enriched.psychology_emotions = ['bold', 'rebellious', 'uncompromising', 'raw'];
                enriched.psychology_personality = ['bold', 'uncompromising', 'alternative', 'raw'];
                enriched.interactions_engagement = ['confrontational', 'bold-ui', 'statement-making'];
                enriched.conversion_goals = ['statement-making', 'artistic-credibility', 'alternative-appeal'];
                enriched.formats_structure = ['brutalist-design', 'unconventional', 'bold-typography'];
                enriched.technical_performance = ['style-priority', 'unconventional', 'bold-choices'];
                enriched.complexity_content = ['bold-content', 'unconventional', 'statement-driven'];
                break;

            case 'layout-11-neumorphism.html':
                enriched.sectors_detailed = ['modern', 'app-design', 'tech', 'ui-focused', 'premium'];
                enriched.demographics_age = ['young-adults', 'design-enthusiasts', 'app-users'];
                enriched.demographics_profession = ['ui-designers', 'app-developers', 'design-conscious'];
                enriched.psychology_emotions = ['soft', 'modern', 'tactile', 'premium'];
                enriched.psychology_personality = ['soft', 'modern', 'design-forward', 'tactile'];
                enriched.interactions_engagement = ['ui-focused', 'tactile-feeling', 'app-like'];
                enriched.conversion_goals = ['ui-credibility', 'app-like-experience', 'design-showcase'];
                enriched.formats_structure = ['neumorphic-design', 'soft-ui', 'tactile-elements'];
                enriched.technical_performance = ['css-modern', 'design-heavy', 'ui-optimized'];
                enriched.complexity_content = ['ui-focused', 'design-priority', 'app-oriented'];
                break;

            case 'layout-19-vintage.html':
                enriched.sectors_detailed = ['vintage', 'antique', 'traditional', 'heritage', 'classic'];
                enriched.demographics_age = ['adults', 'heritage-lovers', 'vintage-enthusiasts'];
                enriched.demographics_profession = ['antique-dealers', 'heritage-businesses', 'traditional-crafts'];
                enriched.psychology_emotions = ['nostalgic', 'traditional', 'timeless', 'heritage'];
                enriched.psychology_personality = ['traditional', 'timeless', 'heritage-focused', 'classic'];
                enriched.interactions_engagement = ['heritage-storytelling', 'traditional-values', 'timeless-appeal'];
                enriched.conversion_goals = ['heritage-branding', 'tradition-appeal', 'timeless-credibility'];
                enriched.formats_structure = ['vintage-design', 'traditional-layout', 'heritage-aesthetic'];
                enriched.technical_performance = ['classic-compatible', 'heritage-optimized', 'timeless-design'];
                enriched.complexity_content = ['heritage-content', 'traditional-storytelling', 'timeless'];
                break;

            // ============ LAYOUTS SECTORIELS 51-60 ============
            case 'layout-53-restaurant.html':
                enriched.sectors_detailed = ['restaurant', 'food', 'gastronomie', 'cuisine', 'dining', 'chef'];
                enriched.demographics_age = ['adults', 'foodies', 'diners'];
                enriched.demographics_profession = ['restaurateurs', 'chefs', 'food-lovers'];
                enriched.psychology_emotions = ['elegant', 'appetite', 'refined', 'welcoming'];
                enriched.psychology_personality = ['elegant', 'sophisticated', 'welcoming', 'refined'];
                enriched.interactions_engagement = ['menu-focused', 'reservation-optimized', 'visual-food'];
                enriched.conversion_goals = ['reservations', 'brand-experience', 'menu-showcase'];
                enriched.formats_structure = ['menu-layout', 'reservation-form', 'elegant-design'];
                enriched.technical_performance = ['image-optimized', 'booking-ready', 'mobile-friendly'];
                enriched.complexity_content = ['menu-driven', 'visual-heavy', 'elegant'];
                break;

            case 'layout-57-fitness.html':
                enriched.sectors_detailed = ['fitness', 'gym', 'sport', 'musculation', 'training', 'health'];
                enriched.demographics_age = ['young-adults', 'athletes', 'fitness-enthusiasts'];
                enriched.demographics_profession = ['trainers', 'athletes', 'fitness-coaches'];
                enriched.psychology_emotions = ['energetic', 'motivated', 'powerful', 'determined'];
                enriched.psychology_personality = ['bold', 'energetic', 'powerful', 'motivating'];
                enriched.interactions_engagement = ['program-showcase', 'motivation-driven', 'visual-results'];
                enriched.conversion_goals = ['membership', 'program-signup', 'motivation'];
                enriched.formats_structure = ['dark-theme', 'bold-typography', 'energy-focused'];
                enriched.technical_performance = ['animation-heavy', 'visual-performance', 'mobile-optimized'];
                enriched.complexity_content = ['program-focused', 'motivational', 'visual-results'];
                break;

            case 'layout-61-automotive.html':
                enriched.sectors_detailed = ['automotive', 'car', 'auto', 'vehicle', 'dealer', 'automobile'];
                enriched.demographics_age = ['adults', 'car-buyers', 'enthusiasts'];
                enriched.demographics_profession = ['dealers', 'car-enthusiasts', 'buyers'];
                enriched.psychology_emotions = ['performance', 'prestige', 'power', 'sleek'];
                enriched.psychology_personality = ['bold', 'technical', 'premium', 'performance'];
                enriched.interactions_engagement = ['specs-focused', 'visual-showcase', 'tech-heavy'];
                enriched.conversion_goals = ['test-drive', 'inquiry', 'showroom-visit'];
                enriched.formats_structure = ['dark-theme', 'specs-display', 'model-showcase'];
                enriched.technical_performance = ['visual-heavy', 'animation-rich', 'modern'];
                enriched.complexity_content = ['technical-specs', 'model-focused', 'premium'];
                break;

            case 'layout-62-legal.html':
                enriched.sectors_detailed = ['legal', 'law', 'lawyer', 'attorney', 'juridique', 'avocat'];
                enriched.demographics_age = ['adults', 'professionals', 'legal-seekers'];
                enriched.demographics_profession = ['lawyers', 'attorneys', 'legal-professionals'];
                enriched.psychology_emotions = ['trust', 'authority', 'professional', 'credible'];
                enriched.psychology_personality = ['professional', 'trustworthy', 'authoritative', 'serious'];
                enriched.interactions_engagement = ['consultation-focused', 'expertise-showcase', 'trust-building'];
                enriched.conversion_goals = ['consultation', 'lead-generation', 'credibility'];
                enriched.formats_structure = ['serif-typography', 'professional-layout', 'formal'];
                enriched.technical_performance = ['professional-grade', 'secure', 'accessible'];
                enriched.complexity_content = ['legal-content', 'expertise-heavy', 'formal'];
                break;

            case 'layout-64-beauty.html':
                enriched.sectors_detailed = ['beauty', 'spa', 'wellness', 'beauté', 'esthétique', 'salon'];
                enriched.demographics_age = ['adults', 'women', 'beauty-conscious'];
                enriched.demographics_profession = ['beauticians', 'spa-owners', 'estheticians'];
                enriched.psychology_emotions = ['relaxing', 'pampering', 'beautiful', 'serene'];
                enriched.psychology_personality = ['soft', 'welcoming', 'elegant', 'soothing'];
                enriched.interactions_engagement = ['booking-focused', 'service-showcase', 'relaxing-ui'];
                enriched.conversion_goals = ['appointments', 'service-booking', 'package-sales'];
                enriched.formats_structure = ['rounded-design', 'soft-colors', 'elegant-layout'];
                enriched.technical_performance = ['booking-optimized', 'mobile-friendly', 'visual'];
                enriched.complexity_content = ['service-focused', 'pricing-clear', 'welcoming'];
                break;

            case 'layout-70-pets.html':
                enriched.sectors_detailed = ['pets', 'animals', 'veterinary', 'pet-care', 'grooming', 'animaux'];
                enriched.demographics_age = ['families', 'pet-owners', 'all-ages'];
                enriched.demographics_profession = ['pet-owners', 'veterinarians', 'groomers'];
                enriched.psychology_emotions = ['playful', 'caring', 'fun', 'loving', 'trust'];
                enriched.psychology_personality = ['playful', 'friendly', 'caring', 'warm'];
                enriched.interactions_engagement = ['service-showcase', 'playful-ui', 'visual-heavy'];
                enriched.conversion_goals = ['appointments', 'service-inquiry', 'trust-building'];
                enriched.formats_structure = ['playful-design', 'rounded-elements', 'emoji-heavy'];
                enriched.technical_performance = ['family-friendly', 'visual-optimized', 'mobile'];
                enriched.complexity_content = ['service-driven', 'friendly-tone', 'accessible'];
                break;

            case 'layout-51-faq-center.html':
                enriched.sectors_detailed = ['faq', 'support', 'help-center', 'documentation', 'customer-service', 'knowledge-base'];
                enriched.demographics_age = ['all-ages', 'support-seekers', 'customers'];
                enriched.demographics_profession = ['support-staff', 'service-providers', 'customer-support'];
                enriched.psychology_emotions = ['helpful', 'organized', 'accessible', 'clear', 'reassuring'];
                enriched.psychology_personality = ['organized', 'helpful', 'clear', 'systematic'];
                enriched.interactions_engagement = ['search-focused', 'category-browsing', 'accordion-ui'];
                enriched.conversion_goals = ['problem-solving', 'self-service', 'support-deflection'];
                enriched.formats_structure = ['category-based', 'search-prominent', 'accordion-heavy'];
                enriched.technical_performance = ['search-optimized', 'fast-loading', 'accessible'];
                enriched.complexity_content = ['documentation-heavy', 'organized', 'searchable'];
                break;

            case 'layout-52-app-showcase.html':
                enriched.sectors_detailed = ['app', 'mobile-app', 'software', 'saas', 'application', 'tech', 'startup'];
                enriched.demographics_age = ['millennials', 'gen-z', 'tech-savvy', 'adults'];
                enriched.demographics_profession = ['developers', 'entrepreneurs', 'tech-users', 'startups'];
                enriched.psychology_emotions = ['innovative', 'modern', 'tech-forward', 'sleek'];
                enriched.psychology_personality = ['innovative', 'modern', 'tech-focused', 'forward-thinking'];
                enriched.interactions_engagement = ['app-preview', 'mockup-showcase', 'download-focused'];
                enriched.conversion_goals = ['app-downloads', 'user-acquisition', 'tech-credibility'];
                enriched.formats_structure = ['phone-mockup', 'app-showcase', 'modern-layout'];
                enriched.technical_performance = ['modern-standards', 'mobile-optimized', 'fast'];
                enriched.complexity_content = ['feature-focused', 'visual-showcase', 'tech-oriented'];
                break;

            case 'layout-54-real-estate.html':
                enriched.sectors_detailed = ['real-estate', 'immobilier', 'property', 'housing', 'realty', 'homes'];
                enriched.demographics_age = ['adults', 'home-buyers', 'investors', 'families'];
                enriched.demographics_profession = ['real-estate-agents', 'property-managers', 'brokers', 'investors'];
                enriched.psychology_emotions = ['aspirational', 'trustworthy', 'professional', 'luxurious'];
                enriched.psychology_personality = ['professional', 'trustworthy', 'aspirational', 'established'];
                enriched.interactions_engagement = ['search-filters', 'property-browsing', 'visual-gallery'];
                enriched.conversion_goals = ['lead-generation', 'property-inquiries', 'viewings'];
                enriched.formats_structure = ['search-prominent', 'property-cards', 'filter-heavy'];
                enriched.technical_performance = ['image-optimized', 'search-fast', 'mobile-friendly'];
                enriched.complexity_content = ['property-listings', 'search-focused', 'visual-heavy'];
                break;

            case 'layout-55-education.html':
                enriched.sectors_detailed = ['education', 'e-learning', 'online-courses', 'training', 'formation', 'academy'];
                enriched.demographics_age = ['students', 'adults', 'lifelong-learners', 'professionals'];
                enriched.demographics_profession = ['educators', 'trainers', 'students', 'professionals'];
                enriched.psychology_emotions = ['inspiring', 'accessible', 'friendly', 'motivating', 'growth'];
                enriched.psychology_personality = ['friendly', 'approachable', 'educational', 'supportive'];
                enriched.interactions_engagement = ['course-browsing', 'learning-focused', 'friendly-ui'];
                enriched.conversion_goals = ['enrollment', 'course-signup', 'educational-engagement'];
                enriched.formats_structure = ['course-cards', 'friendly-design', 'emoji-accents'];
                enriched.technical_performance = ['accessible', 'mobile-optimized', 'student-friendly'];
                enriched.complexity_content = ['course-focused', 'educational', 'accessible'];
                break;

            case 'layout-56-medical.html':
                enriched.sectors_detailed = ['medical', 'health', 'healthcare', 'clinic', 'doctor', 'hospital', 'medicine'];
                enriched.demographics_age = ['all-ages', 'patients', 'families', 'healthcare-seekers'];
                enriched.demographics_profession = ['doctors', 'healthcare-providers', 'medical-staff', 'clinics'];
                enriched.psychology_emotions = ['trustworthy', 'professional', 'caring', 'reassuring', 'safe'];
                enriched.psychology_personality = ['professional', 'trustworthy', 'caring', 'reliable'];
                enriched.interactions_engagement = ['appointment-booking', 'emergency-access', 'service-info'];
                enriched.conversion_goals = ['appointments', 'emergency-contact', 'trust-building'];
                enriched.formats_structure = ['emergency-button', 'professional-layout', 'service-focused'];
                enriched.technical_performance = ['reliable', 'accessible', 'mobile-critical'];
                enriched.complexity_content = ['medical-info', 'service-driven', 'professional-tone'];
                break;

            case 'layout-58-events.html':
                enriched.sectors_detailed = ['events', 'conference', 'festival', 'concert', 'eventiel', 'gatherings'];
                enriched.demographics_age = ['adults', 'young-adults', 'event-goers', 'professionals'];
                enriched.demographics_profession = ['event-organizers', 'attendees', 'entertainers', 'speakers'];
                enriched.psychology_emotions = ['exciting', 'vibrant', 'energetic', 'anticipation', 'fun'];
                enriched.psychology_personality = ['bold', 'vibrant', 'energetic', 'social'];
                enriched.interactions_engagement = ['ticket-purchase', 'schedule-viewing', 'registration'];
                enriched.conversion_goals = ['ticket-sales', 'registrations', 'event-awareness'];
                enriched.formats_structure = ['timeline-schedule', 'event-focused', 'date-prominent'];
                enriched.technical_performance = ['ticket-optimized', 'mobile-friendly', 'fast-loading'];
                enriched.complexity_content = ['schedule-heavy', 'event-details', 'timeline-based'];
                break;

            case 'layout-59-travel.html':
                enriched.sectors_detailed = ['travel', 'tourism', 'voyage', 'destination', 'vacation', 'adventure', 'trips'];
                enriched.demographics_age = ['adults', 'millennials', 'travelers', 'adventurers', 'families'];
                enriched.demographics_profession = ['travel-agencies', 'tour-operators', 'travelers', 'adventurers'];
                enriched.psychology_emotions = ['adventurous', 'wanderlust', 'exciting', 'inspiring', 'dreamy'];
                enriched.psychology_personality = ['adventurous', 'friendly', 'inspiring', 'wanderlust'];
                enriched.interactions_engagement = ['destination-browsing', 'search-travel', 'visual-inspiration'];
                enriched.conversion_goals = ['bookings', 'trip-planning', 'destination-interest'];
                enriched.formats_structure = ['search-prominent', 'destination-cards', 'visual-heavy'];
                enriched.technical_performance = ['image-optimized', 'search-fast', 'mobile-friendly'];
                enriched.complexity_content = ['destination-focused', 'visual-storytelling', 'inspiring'];
                break;

            case 'layout-60-nonprofit.html':
                enriched.sectors_detailed = ['nonprofit', 'charity', 'ong', 'association', 'cause', 'social-impact'];
                enriched.demographics_age = ['adults', 'donors', 'volunteers', 'supporters'];
                enriched.demographics_profession = ['nonprofit-workers', 'volunteers', 'donors', 'activists'];
                enriched.psychology_emotions = ['caring', 'inspiring', 'trustworthy', 'hopeful', 'compassionate'];
                enriched.psychology_personality = ['caring', 'trustworthy', 'mission-driven', 'compassionate'];
                enriched.interactions_engagement = ['donation-focused', 'impact-showcase', 'volunteer-signup'];
                enriched.conversion_goals = ['donations', 'volunteer-signup', 'awareness'];
                enriched.formats_structure = ['donation-prominent', 'impact-stats', 'mission-focused'];
                enriched.technical_performance = ['donation-optimized', 'accessible', 'trust-focused'];
                enriched.complexity_content = ['mission-driven', 'impact-storytelling', 'emotional'];
                break;

            case 'layout-63-photography.html':
                enriched.sectors_detailed = ['photography', 'photographer', 'portfolio', 'photo', 'visual-artist', 'creative'];
                enriched.demographics_age = ['adults', 'creatives', 'clients', 'art-lovers'];
                enriched.demographics_profession = ['photographers', 'artists', 'creatives', 'visual-professionals'];
                enriched.psychology_emotions = ['artistic', 'minimalist', 'elegant', 'refined', 'creative'];
                enriched.psychology_personality = ['artistic', 'minimalist', 'refined', 'creative'];
                enriched.interactions_engagement = ['gallery-viewing', 'portfolio-browsing', 'visual-focus'];
                enriched.conversion_goals = ['client-inquiries', 'portfolio-showcase', 'artistic-credibility'];
                enriched.formats_structure = ['ultra-minimal', 'gallery-focused', 'transparent-nav'];
                enriched.technical_performance = ['image-critical', 'portfolio-optimized', 'minimal-code'];
                enriched.complexity_content = ['visual-primary', 'minimal-text', 'gallery-centric'];
                break;

            case 'layout-65-podcast.html':
                enriched.sectors_detailed = ['podcast', 'audio', 'media', 'broadcasting', 'radio', 'content-creator'];
                enriched.demographics_age = ['millennials', 'gen-z', 'adults', 'content-consumers'];
                enriched.demographics_profession = ['podcasters', 'content-creators', 'broadcasters', 'media'];
                enriched.psychology_emotions = ['engaging', 'modern', 'authentic', 'conversational'];
                enriched.psychology_personality = ['modern', 'engaging', 'authentic', 'creative'];
                enriched.interactions_engagement = ['audio-player', 'episode-browsing', 'subscribe-focused'];
                enriched.conversion_goals = ['subscribers', 'episode-plays', 'platform-follows'];
                enriched.formats_structure = ['player-prominent', 'episode-cards', 'subscribe-buttons'];
                enriched.technical_performance = ['audio-optimized', 'player-integration', 'mobile-friendly'];
                enriched.complexity_content = ['episode-focused', 'audio-centric', 'media-driven'];
                break;

            case 'layout-66-gaming.html':
                enriched.sectors_detailed = ['gaming', 'esports', 'game', 'videogame', 'gamer', 'entertainment'];
                enriched.demographics_age = ['gen-z', 'millennials', 'gamers', 'young-adults'];
                enriched.demographics_profession = ['gamers', 'esports', 'game-developers', 'streamers'];
                enriched.psychology_emotions = ['exciting', 'energetic', 'competitive', 'immersive', 'bold'];
                enriched.psychology_personality = ['bold', 'competitive', 'energetic', 'tech-savvy'];
                enriched.interactions_engagement = ['game-showcase', 'visual-heavy', 'interactive'];
                enriched.conversion_goals = ['game-downloads', 'user-engagement', 'community-building'];
                enriched.formats_structure = ['dark-theme', 'neon-effects', 'futuristic-design'];
                enriched.technical_performance = ['animation-heavy', 'dark-optimized', 'gaming-focused'];
                enriched.complexity_content = ['game-focused', 'visual-intense', 'entertainment'];
                break;

            case 'layout-67-wedding.html':
                enriched.sectors_detailed = ['wedding', 'mariage', 'event', 'celebration', 'matrimony', 'nuptials'];
                enriched.demographics_age = ['adults', 'couples', 'families', 'wedding-planners'];
                enriched.demographics_profession = ['wedding-planners', 'couples', 'event-organizers', 'venues'];
                enriched.psychology_emotions = ['romantic', 'elegant', 'joyful', 'celebratory', 'sentimental'];
                enriched.psychology_personality = ['elegant', 'romantic', 'refined', 'celebratory'];
                enriched.interactions_engagement = ['timeline-viewing', 'rsvp', 'info-gathering'];
                enriched.conversion_goals = ['rsvp', 'info-sharing', 'celebration-engagement'];
                enriched.formats_structure = ['timeline-prominent', 'elegant-serif', 'date-focused'];
                enriched.technical_performance = ['elegant-optimized', 'mobile-friendly', 'info-accessible'];
                enriched.complexity_content = ['event-details', 'timeline-based', 'sentimental'];
                break;

            case 'layout-68-coworking.html':
                enriched.sectors_detailed = ['coworking', 'workspace', 'office', 'shared-space', 'freelance', 'entrepreneurs'];
                enriched.demographics_age = ['millennials', 'gen-z', 'adults', 'professionals', 'freelancers'];
                enriched.demographics_profession = ['freelancers', 'entrepreneurs', 'startups', 'remote-workers'];
                enriched.psychology_emotions = ['professional', 'modern', 'collaborative', 'productive'];
                enriched.psychology_personality = ['professional', 'modern', 'collaborative', 'entrepreneurial'];
                enriched.interactions_engagement = ['pricing-comparison', 'space-browsing', 'booking'];
                enriched.conversion_goals = ['space-booking', 'membership-signup', 'inquiries'];
                enriched.formats_structure = ['pricing-prominent', 'space-cards', 'amenity-showcase'];
                enriched.technical_performance = ['booking-optimized', 'mobile-friendly', 'modern'];
                enriched.complexity_content = ['pricing-focused', 'space-details', 'professional'];
                break;

            case 'layout-20-modern.html':
                enriched.sectors_detailed = ['modern', 'contemporary', 'clean', 'business', 'standard'];
                enriched.demographics_age = ['adults', 'professionals', 'modern-seekers'];
                enriched.demographics_profession = ['modern-professionals', 'contemporary-businesses', 'clean-seekers'];
                enriched.psychology_emotions = ['clean', 'modern', 'professional', 'contemporary'];
                enriched.psychology_personality = ['clean', 'modern', 'professional', 'updated'];
                enriched.interactions_engagement = ['clean-ui', 'modern-standards', 'professional-focused'];
                enriched.conversion_goals = ['modern-credibility', 'professional-appeal', 'clean-branding'];
                enriched.formats_structure = ['modern-design', 'clean-layout', 'contemporary-structure'];
                enriched.technical_performance = ['modern-standards', 'clean-code', 'professional-optimized'];
                enriched.complexity_content = ['clean-content', 'modern-approach', 'professional'];
                break;

            // ============ LAYOUTS SIMPLES FRAMEWORK-BASED ============
            case 'layout-simple-bootstrap.html':
                enriched.sectors_detailed = ['general', 'rapid-development', 'standard', 'accessible'];
                enriched.demographics_age = ['all-ages', 'general-users'];
                enriched.demographics_profession = ['developers', 'quick-deployers', 'standard-seekers'];
                enriched.psychology_emotions = ['reliable', 'standard', 'accessible', 'familiar'];
                enriched.psychology_personality = ['reliable', 'standard', 'no-nonsense', 'practical'];
                enriched.interactions_engagement = ['standard-ui', 'framework-based', 'reliable'];
                enriched.conversion_goals = ['quick-deployment', 'standard-appeal', 'accessibility'];
                enriched.formats_structure = ['bootstrap-standard', 'framework-based', 'grid-system'];
                enriched.technical_performance = ['framework-optimized', 'standard-performance', 'reliable'];
                enriched.complexity_content = ['framework-standard', 'accessible', 'straightforward'];
                break;

            case 'layout-simple-bulma.html':
                enriched.sectors_detailed = ['general', 'modern-css', 'clean', 'developer-friendly'];
                enriched.demographics_age = ['all-ages', 'developers'];
                enriched.demographics_profession = ['developers', 'modern-css-users', 'clean-seekers'];
                enriched.psychology_emotions = ['clean', 'modern', 'developer-friendly', 'efficient'];
                enriched.psychology_personality = ['clean', 'modern', 'developer-oriented', 'efficient'];
                enriched.interactions_engagement = ['css-modern', 'developer-focused', 'clean-ui'];
                enriched.conversion_goals = ['developer-appeal', 'modern-css', 'clean-implementation'];
                enriched.formats_structure = ['bulma-framework', 'css-modern', 'flexbox-based'];
                enriched.technical_performance = ['css-optimized', 'modern-standards', 'developer-friendly'];
                enriched.complexity_content = ['developer-oriented', 'css-focused', 'modern-approach'];
                break;

            case 'layout-simple-tailwind.html':
                enriched.sectors_detailed = ['general', 'utility-css', 'modern', 'customizable'];
                enriched.demographics_age = ['young-adults', 'developers', 'modern-users'];
                enriched.demographics_profession = ['developers', 'utility-css-users', 'customization-seekers'];
                enriched.psychology_emotions = ['efficient', 'customizable', 'modern', 'developer-centric'];
                enriched.psychology_personality = ['efficient', 'customizable', 'modern', 'utility-focused'];
                enriched.interactions_engagement = ['utility-based', 'highly-customizable', 'developer-centric'];
                enriched.conversion_goals = ['developer-productivity', 'customization', 'modern-development'];
                enriched.formats_structure = ['utility-based', 'atomic-css', 'highly-customizable'];
                enriched.technical_performance = ['utility-optimized', 'build-process', 'customization-focused'];
                enriched.complexity_content = ['utility-driven', 'developer-focused', 'customizable'];
                break;

            // ============ LAYOUTS TECHNIQUES & VISUELS ============
            case 'layout-2-split.html':
                enriched.sectors_detailed = ['portfolio', 'comparison', 'dual-content', 'visual-storytelling'];
                enriched.demographics_age = ['all-ages', 'visual-users'];
                enriched.demographics_profession = ['content-creators', 'storytellers', 'comparison-makers'];
                enriched.psychology_emotions = ['balanced', 'comparative', 'visual', 'structured'];
                enriched.psychology_personality = ['balanced', 'comparative', 'visual-oriented', 'organized'];
                enriched.interactions_engagement = ['split-screen', 'comparative-viewing', 'dual-focus'];
                enriched.conversion_goals = ['comparison-highlighting', 'dual-messaging', 'visual-impact'];
                enriched.formats_structure = ['split-layout', 'dual-sections', 'comparative-design'];
                enriched.technical_performance = ['responsive-split', 'dual-content', 'comparative-optimized'];
                enriched.complexity_content = ['dual-content', 'comparative', 'balanced-messaging'];
                break;

            case 'layout-7-gradient.html':
                enriched.sectors_detailed = ['modern', 'colorful', 'youth', 'creative', 'vibrant'];
                enriched.demographics_age = ['young-adults', 'color-lovers', 'modern-users'];
                enriched.demographics_profession = ['creatives', 'young-professionals', 'color-conscious'];
                enriched.psychology_emotions = ['vibrant', 'energetic', 'colorful', 'youthful'];
                enriched.psychology_personality = ['vibrant', 'energetic', 'colorful', 'modern'];
                enriched.interactions_engagement = ['color-focused', 'vibrant-ui', 'energetic'];
                enriched.conversion_goals = ['color-appeal', 'youthful-branding', 'energy-conveyance'];
                enriched.formats_structure = ['gradient-heavy', 'colorful-design', 'vibrant-layout'];
                enriched.technical_performance = ['color-optimized', 'gradient-heavy', 'vibrant-display'];
                enriched.complexity_content = ['color-driven', 'vibrant-messaging', 'energetic'];
                break;

            // ============ LAYOUTS DE BASE ============
            default:
                // Labels génériques pour layouts non spécifiés
                enriched.sectors_detailed = ['general', 'multi-purpose'];
                enriched.demographics_age = ['all-ages'];
                enriched.demographics_profession = ['general'];
                enriched.psychology_emotions = ['neutral', 'standard'];
                enriched.psychology_personality = ['standard', 'reliable'];
                enriched.interactions_engagement = ['standard'];
                enriched.conversion_goals = ['general-purpose'];
                enriched.formats_structure = ['standard'];
                enriched.technical_performance = ['standard'];
                enriched.complexity_content = ['standard'];
                break;
        }
    }

    /**
     * 🎯 SCORING AVEC LABELS DÉTAILLÉS
     */
    scoreLayoutsWithDetailedLabels(keywords, themeAnalysis) {
        return this.layoutDatabase.map(layout => {
            let score = 0;
            const scoringDetails = {};

            // 1. Score de correspondance sectorielle (40 points max)
            if (layout.sectors_detailed) {
                const sectorMatch = this.calculateSectorMatch(keywords, layout.sectors_detailed, themeAnalysis.theme);
                score += sectorMatch * 40;
                scoringDetails.sectorScore = sectorMatch * 40;
            }

            // 2. Score psychologique/émotionnel (25 points max)
            if (layout.psychology_emotions) {
                const emotionMatch = this.calculateEmotionMatch(keywords, layout.psychology_emotions, themeAnalysis.theme);
                score += emotionMatch * 25;
                scoringDetails.emotionScore = emotionMatch * 25;
            }

            // 3. Score de spécialisation (20 points max)
            const specializationBonus = (layout.specialization_score || 0) / 100 * 20;
            score += specializationBonus;
            scoringDetails.specializationScore = specializationBonus;

            // 4. Score démographique (10 points max)
            if (layout.demographics_age) {
                const demoMatch = this.calculateDemographicMatch(keywords, layout.demographics_age);
                score += demoMatch * 10;
                scoringDetails.demoScore = demoMatch * 10;
            }

            // 5. Bonus pour correspondance technique (5 points max)
            if (layout.technical_performance) {
                const techBonus = this.calculateTechnicalBonus(keywords, layout.technical_performance);
                score += techBonus * 5;
                scoringDetails.techBonus = techBonus * 5;
            }

            // 6. Malus pour layouts universels si thème spécifique détecté
            if (layout.universal && !themeAnalysis.isGeneric && themeAnalysis.confidence > 0.5) {
                score -= 15;
                scoringDetails.universalPenalty = -15;
            }

            return {
                ...layout,
                detailedScore: Math.max(score, 0),
                scoringDetails: scoringDetails
            };
        }).sort((a, b) => b.detailedScore - a.detailedScore);
    }

    /**
     * Calcule la correspondance sectorielle
     */
    calculateSectorMatch(keywords, layoutSectors, detectedTheme) {
        let matchScore = 0;

        // Correspondance directe avec le thème détecté
        if (layoutSectors.includes(detectedTheme)) {
            matchScore += 0.8; // 80% pour correspondance directe
        }

        // Correspondance avec les mots-clés
        keywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            layoutSectors.forEach(sector => {
                if (lowerKeyword.includes(sector) || sector.includes(lowerKeyword)) {
                    matchScore += 0.2;
                }
            });
        });

        // Correspondances sectorielles spéciales
        const sectorMappings = {
            'pets': ['veterinaire', 'animalerie', 'adoption', 'wildlife', 'animals'],
            'business': ['consulting', 'finance', 'corporate', 'legal', 'insurance'],
            'tech': ['saas', 'ai-ml', 'cybersecurity', 'fintech', 'cloud', 'software'],
            'creative': ['design', 'photography', 'marketing', 'art', 'portfolio'],
            'ecommerce': ['fashion', 'beauty', 'electronics', 'luxury', 'retail']
        };

        if (sectorMappings[detectedTheme]) {
            sectorMappings[detectedTheme].forEach(mappedSector => {
                if (layoutSectors.includes(mappedSector)) {
                    matchScore += 0.3;
                }
            });
        }

        return Math.min(matchScore, 1.0);
    }

    /**
     * Calcule la correspondance émotionnelle
     */
    calculateEmotionMatch(keywords, layoutEmotions, detectedTheme) {
        let emotionScore = 0;

        // Mapping émotionnel par thème
        const emotionMappings = {
            'pets': ['fun', 'playful', 'trust', 'calm', 'affection', 'caring'],
            'business': ['trust', 'serious', 'confidence', 'authority', 'professional'],
            'tech': ['excitement', 'innovation', 'efficiency', 'modern', 'cutting-edge'],
            'creative': ['inspiration', 'creativity', 'artistic', 'unique', 'expressive'],
            'ecommerce': ['desire', 'aspiration', 'satisfaction', 'exclusivity']
        };

        if (emotionMappings[detectedTheme]) {
            emotionMappings[detectedTheme].forEach(expectedEmotion => {
                if (layoutEmotions.includes(expectedEmotion)) {
                    emotionScore += 0.2;
                }
            });
        }

        // Bonus pour émotions généralement positives
        const positiveEmotions = ['trust', 'excitement', 'satisfaction', 'confidence'];
        layoutEmotions.forEach(emotion => {
            if (positiveEmotions.includes(emotion)) {
                emotionScore += 0.1;
            }
        });

        return Math.min(emotionScore, 1.0);
    }

    /**
     * Calcule la correspondance démographique
     */
    calculateDemographicMatch(keywords, layoutDemographics) {
        let demoScore = 0;

        // Détection d'indices démographiques dans les keywords
        const keywordString = keywords.join(' ').toLowerCase();

        if (keywordString.includes('enfant') || keywordString.includes('bébé') || keywordString.includes('kid')) {
            if (layoutDemographics.includes('kids') || layoutDemographics.includes('families')) {
                demoScore += 0.5;
            }
        }

        if (keywordString.includes('business') || keywordString.includes('entreprise') || keywordString.includes('professional')) {
            if (layoutDemographics.includes('professionals') || layoutDemographics.includes('adults')) {
                demoScore += 0.4;
            }
        }

        if (keywordString.includes('tech') || keywordString.includes('développeur') || keywordString.includes('startup')) {
            if (layoutDemographics.includes('young-adults') || layoutDemographics.includes('tech-savvy')) {
                demoScore += 0.4;
            }
        }

        // Bonus pour 'all-ages' si aucun autre critère
        if (demoScore === 0 && layoutDemographics.includes('all-ages')) {
            demoScore = 0.3;
        }

        return Math.min(demoScore, 1.0);
    }

    /**
     * Calcule le bonus technique
     */
    calculateTechnicalBonus(keywords, layoutTechnical) {
        let techScore = 0;

        const keywordString = keywords.join(' ').toLowerCase();

        // Bonus pour performance selon le contexte
        if (keywordString.includes('ecommerce') || keywordString.includes('boutique')) {
            if (layoutTechnical.includes('fast-loading') || layoutTechnical.includes('secure-payment')) {
                techScore += 0.3;
            }
        }

        if (keywordString.includes('enterprise') || keywordString.includes('corporate')) {
            if (layoutTechnical.includes('enterprise-grade') || layoutTechnical.includes('secure')) {
                techScore += 0.3;
            }
        }

        if (keywordString.includes('mobile') || keywordString.includes('smartphone')) {
            if (layoutTechnical.includes('mobile-friendly') || layoutTechnical.includes('responsive')) {
                techScore += 0.2;
            }
        }

        return Math.min(techScore, 1.0);
    }

    /**
     * 🎯 SYSTÈME DE LABELING ULTRA-DÉTAILLÉ
     * Affiche tous les labels disponibles pour debug/analyse
     */
    displayAdvancedLabels(layoutName = null) {
        const layouts = layoutName ?
            this.layoutDatabase.filter(l => l.layout === layoutName) :
            this.layoutDatabase;

        layouts.forEach(layout => {
            console.log(`\n📄 ${layout.layout}:`);
            console.log(`  🎯 Spécialisation: ${layout.specialization_score || 'N/A'}/100`);

            if (layout.sectors_detailed) {
                console.log(`  🏢 Secteurs: ${layout.sectors_detailed.join(', ')}`);
            }

            if (layout.psychology_emotions) {
                console.log(`  😊 Émotions: ${layout.psychology_emotions.join(', ')}`);
            }

            if (layout.demographics_age) {
                console.log(`  👥 Âge: ${layout.demographics_age.join(', ')}`);
            }

            if (layout.micro_labels) {
                console.log(`  🔬 Micro-labels:`);
                Object.entries(layout.micro_labels).forEach(([key, values]) => {
                    if (Array.isArray(values)) {
                        console.log(`    ${key}: ${values.join(', ')}`);
                    }
                });
            }
        });
    }
}

module.exports = IntelligentLayoutSelectorV2;