const fs = require('fs').promises;
const path = require('path');
const IntelligentLayoutSelector = require('./intelligentLayoutSelectorV2');
const DynamicContentAdapter = require('./dynamicContentAdapter');

class SiteBuilder {
    constructor() {
        this.frameworks = null;
        this.layouts = [];
        this.outputDir = null;
        this.layoutSelector = new IntelligentLayoutSelector();
        this.contentAdapter = new DynamicContentAdapter();
    }

    async initialize() {
        // Charger les configurations
        const frameworksPath = path.join(__dirname, '..', 'config', 'frameworks.json');
        this.frameworks = JSON.parse(await fs.readFile(frameworksPath, 'utf8'));

        // Charger la liste des layouts disponibles
        const layoutsDir = path.join(__dirname, '..', 'templates', 'layouts');
        const layoutFiles = await fs.readdir(layoutsDir);
        this.layouts = layoutFiles.filter(f => f.endsWith('.html'));
    }

    /**
     * Crée la structure complète du site
     */
    async buildSite(domain, analysis, branding, content, keywords = []) {
        console.log(`🏗️  Construction du site pour ${domain}...`);

        // Créer le dossier de sortie
        this.outputDir = path.join(__dirname, '..', 'output', domain);
        await this.createDirectoryStructure();

        // Utiliser le sélecteur intelligent si des keywords sont fournis
        let layoutResult, framework, layout, colorScheme;

        if (keywords && keywords.length > 0) {
            // NOUVEAU : Sélection intelligente basée sur le thème
            console.log('🤖 Sélection intelligente du layout...');
            const intelligentSelection = await this.layoutSelector.selectBestLayout(keywords, analysis);

            // Charger le layout sélectionné
            const layoutPath = path.join(__dirname, '..', 'templates', 'layouts', intelligentSelection.layout.layout);
            const rawLayout = await fs.readFile(layoutPath, 'utf8');

            // 🎯 NOUVEAU : Dynamiser le layout selon le thème détecté
            const detectedTheme = intelligentSelection.themeAnalysis.theme;
            layout = this.contentAdapter.dynamizeLayout(rawLayout, detectedTheme);

            // Générer les variables thématiques pour remplacer le contenu fixe
            const themeVariables = this.contentAdapter.generateThemeVariables(detectedTheme, branding);

            // Utiliser les couleurs appropriées au thème
            colorScheme = intelligentSelection.colorScheme;

            // Adapter le contenu au thème (enrichi avec variables dynamiques)
            content = {
                ...this.layoutSelector.adaptContentToTheme(content, intelligentSelection.themeAnalysis),
                ...themeVariables
            };

            // Framework adapté
            framework = this.selectAppropriateFramework(intelligentSelection.layout);

            layoutResult = {
                layout: intelligentSelection.layout.layout,
                layoutContent: layout,
                themeAdapted: true
            };
        } else {
            // Fallback : ancienne méthode aléatoire avec dynamisation
            layoutResult = await this.selectRandomLayoutAndFramework();
            framework = layoutResult.framework;

            // 🎯 Dynamiser même en mode fallback pour éviter le contenu fixe
            const rawLayout = layoutResult.layoutContent;
            layout = this.contentAdapter.dynamizeLayout(rawLayout, 'general');

            // Générer des variables génériques
            const themeVariables = this.contentAdapter.generateThemeVariables('general', branding);
            content = { ...content, ...themeVariables };

            colorScheme = this.selectRandomColorScheme();
        }

        console.log(`📦 Framework: ${framework.name}`);
        console.log(`🎨 Layout: ${layoutResult.layout || 'Simple'}`);
        console.log(`🎨 Couleurs: ${colorScheme.name}`);

        // Construire chaque page
        const pages = await this.buildPages(
            analysis,
            branding,
            content,
            framework,
            layout,
            colorScheme
        );

        // Créer le fichier blog.php
        await this.createBlogListing(branding, framework, colorScheme);

        // Créer le .htaccess
        await this.createHtaccess();

        console.log(`✅ Site construit dans: ${this.outputDir}`);

        return {
            outputDir: this.outputDir,
            framework: framework.name,
            layout: layoutResult.layout,
            colorScheme: colorScheme.name,
            pages: Object.keys(pages)
        };
    }

    /**
     * Crée la structure de dossiers
     */
    async createDirectoryStructure() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'blog'), { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'assets'), { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'assets', 'css'), { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'assets', 'js'), { recursive: true });
        await fs.mkdir(path.join(this.outputDir, 'assets', 'images'), { recursive: true });
    }

    /**
     * Sélectionne un framework aléatoire
     */
    selectRandomFramework() {
        const frameworks = this.frameworks.frameworks;
        return frameworks[Math.floor(Math.random() * frameworks.length)];
    }

    /**
     * Sélectionne un framework approprié selon le layout
     */
    selectAppropriateFramework(layoutInfo) {
        const frameworks = this.frameworks.frameworks;

        // Pour les layouts ludiques/enfants, éviter les frameworks trop sérieux
        if (layoutInfo.mood === 'playful' || layoutInfo.mood === 'cheerful') {
            // Préférer Tailwind ou aucun framework pour plus de flexibilité
            const tailwind = frameworks.find(f => f.id === 'tailwind');
            if (tailwind && Math.random() < 0.6) return tailwind;

            // Ou pas de framework du tout
            return {
                id: 'none',
                name: 'Aucun (Styles personnalisés)',
                css: '',
                js: '',
                classes: {}
            };
        }

        // Pour les layouts corporate, Bootstrap est approprié
        if (layoutInfo.mood === 'serious' || layoutInfo.mood === 'professional') {
            const bootstrap = frameworks.find(f => f.id === 'bootstrap');
            if (bootstrap && Math.random() < 0.7) return bootstrap;
        }

        // Pour les layouts modernes/tech, Tailwind est idéal
        if (layoutInfo.mood === 'modern' || layoutInfo.mood === 'futuristic') {
            const tailwind = frameworks.find(f => f.id === 'tailwind');
            if (tailwind && Math.random() < 0.8) return tailwind;
        }

        // Par défaut, pas de framework pour les layouts premium
        if (layoutInfo.quality === 'premium') {
            return {
                id: 'none',
                name: 'Aucun (Styles intégrés)',
                css: '',
                js: '',
                classes: {}
            };
        }

        // Sinon, sélection aléatoire
        return this.selectRandomFramework();
    }

    /**
     * Sélectionne un layout aléatoire avec framework correspondant
     */
    async selectRandomLayoutAndFramework() {
        // Tous les layouts disponibles avec leurs caractéristiques
        const allLayouts = [
            // Layouts professionnels améliorés
            { layout: 'layout-professional.html', type: 'corporate', quality: 'premium' },
            { layout: 'layout-saas-modern-enhanced.html', type: 'saas', quality: 'premium' },
            { layout: 'layout-agency-creative-enhanced.html', type: 'creative', quality: 'premium' },
            { layout: 'layout-ecommerce-premium.html', type: 'ecommerce', quality: 'premium' },

            // Layouts modernes
            { layout: 'layout-saas-modern.html', type: 'saas', quality: 'high' },
            { layout: 'layout-agency-creative.html', type: 'creative', quality: 'high' },

            // Layouts thématiques
            { layout: 'layout-1-hero.html', type: 'hero', quality: 'standard' },
            { layout: 'layout-2-split.html', type: 'split', quality: 'standard' },
            { layout: 'layout-3-cards.html', type: 'cards', quality: 'standard' },
            { layout: 'layout-4-sidebar.html', type: 'sidebar', quality: 'standard' },
            { layout: 'layout-5-minimal.html', type: 'minimal', quality: 'standard' },
            { layout: 'layout-6-dark.html', type: 'dark', quality: 'standard' },
            { layout: 'layout-7-gradient.html', type: 'gradient', quality: 'standard' },
            { layout: 'layout-8-glass.html', type: 'glass', quality: 'high' },
            { layout: 'layout-9-brutalist.html', type: 'brutalist', quality: 'standard' },
            { layout: 'layout-10-magazine.html', type: 'magazine', quality: 'high' },
            { layout: 'layout-11-neumorphism.html', type: 'neumorphism', quality: 'high' },
            { layout: 'layout-12-parallax.html', type: 'parallax', quality: 'high' },
            { layout: 'layout-13-fullscreen.html', type: 'fullscreen', quality: 'standard' },
            { layout: 'layout-14-asymmetric.html', type: 'asymmetric', quality: 'standard' },
            { layout: 'layout-15-retrowave.html', type: 'retrowave', quality: 'standard' },
            { layout: 'layout-16-cyberpunk.html', type: 'cyberpunk', quality: 'standard' },
            { layout: 'layout-17-creative.html', type: 'creative', quality: 'standard' },
            { layout: 'layout-18-corporate.html', type: 'corporate', quality: 'standard' },
            { layout: 'layout-19-vintage.html', type: 'vintage', quality: 'standard' },
            { layout: 'layout-20-modern.html', type: 'modern', quality: 'high' }
        ];

        // Prioriser les layouts premium (80% de chance)
        const premiumLayouts = allLayouts.filter(l => l.quality === 'premium');
        const highQualityLayouts = allLayouts.filter(l => l.quality === 'high');
        const standardLayouts = allLayouts.filter(l => l.quality === 'standard');

        let selectedLayout;
        const random = Math.random();

        if (random < 0.5 && premiumLayouts.length > 0) {
            // 50% de chance pour un layout premium
            selectedLayout = premiumLayouts[Math.floor(Math.random() * premiumLayouts.length)];
        } else if (random < 0.8 && highQualityLayouts.length > 0) {
            // 30% de chance pour un layout haute qualité
            selectedLayout = highQualityLayouts[Math.floor(Math.random() * highQualityLayouts.length)];
        } else {
            // 20% de chance pour un layout standard
            selectedLayout = standardLayouts[Math.floor(Math.random() * standardLayouts.length)];
        }

        // Sélectionner un framework adapté
        const frameworks = this.frameworks.frameworks;
        let framework;

        // Pour les layouts premium, on utilise soit aucun framework, soit Bootstrap/Tailwind
        if (selectedLayout.quality === 'premium') {
            const frameworkChoice = Math.random();
            if (frameworkChoice < 0.6) {
                // 60% sans framework (utilisation des styles intégrés)
                framework = {
                    id: 'none',
                    name: 'Aucun (Styles intégrés)',
                    css: '',
                    js: '',
                    classes: {}
                };
            } else if (frameworkChoice < 0.8) {
                framework = frameworks.find(f => f.id === 'tailwind') || frameworks[0];
            } else {
                framework = frameworks.find(f => f.id === 'bootstrap') || frameworks[0];
            }
        } else {
            // Pour les autres layouts, sélection aléatoire
            framework = frameworks[Math.floor(Math.random() * frameworks.length)];
        }

        const layoutPath = path.join(__dirname, '..', 'templates', 'layouts', selectedLayout.layout);
        const layoutContent = await fs.readFile(layoutPath, 'utf8');

        return {
            layoutContent,
            framework: framework,
            layout: selectedLayout.layout,
            layoutType: selectedLayout.type,
            layoutQuality: selectedLayout.quality
        };
    }

    /**
     * Sélectionne un layout aléatoire (backward compatibility)
     */
    async selectRandomLayout() {
        const result = await this.selectRandomLayoutAndFramework();
        return result.layoutContent;
    }

    /**
     * Sélectionne une palette de couleurs aléatoire
     */
    selectRandomColorScheme() {
        const schemes = this.frameworks.colorSchemes;
        return schemes[Math.floor(Math.random() * schemes.length)];
    }

    /**
     * Construit toutes les pages du site
     */
    async buildPages(analysis, branding, content, framework, layoutTemplate, colorScheme) {
        const pages = {};
        const navigation = this.generateNavigation(content.pages);

        for (const [pageType, pageContent] of Object.entries(content.pages)) {
            const pageHtml = await this.buildPage(
                pageType,
                pageContent,
                branding,
                framework,
                layoutTemplate,
                colorScheme,
                navigation
            );

            const filename = pageType === 'home' ? 'index.html' : `${pageType}.html`;
            const filepath = path.join(this.outputDir, filename);

            await fs.writeFile(filepath, pageHtml);
            pages[pageType] = filename;

            console.log(`  📄 Page créée: ${filename}`);
        }

        return pages;
    }

    /**
     * Construit une page individuelle
     */
    buildPage(pageType, content, branding, framework, layoutTemplate, colorScheme, navigation) {
        let html = layoutTemplate;

        // Remplacer les variables de framework
        html = html.replace(/{framework_css}/g, framework.css ? `<link rel="stylesheet" href="${framework.css}">` : '');
        html = html.replace(/{framework_js}/g, framework.js ? `<script src="${framework.js}"></script>` : '');

        // Remplacer les classes CSS du framework
        Object.entries(framework.classes).forEach(([key, value]) => {
            const regex = new RegExp(`{${key}_class}`, 'g');
            html = html.replace(regex, value);
        });

        // Remplacer les couleurs
        html = html.replace(/{color_primary}/g, colorScheme.primary);
        html = html.replace(/{color_secondary}/g, colorScheme.secondary);
        html = html.replace(/{color_accent}/g, colorScheme.accent);
        html = html.replace(/{color_text}/g, colorScheme.text);
        html = html.replace(/{color_background}/g, colorScheme.background);

        // Remplacer les métadonnées
        html = html.replace(/{meta_title}/g, content.meta?.title || `${branding.brandName} - ${this.getPageTitle(pageType)}`);
        html = html.replace(/{meta_description}/g, content.meta?.description || branding.valueProposition);
        html = html.replace(/{meta_keywords}/g, content.meta?.keywords || '');

        // Remplacer le branding
        html = html.replace(/{brand_name}/g, branding.brandName);
        html = html.replace(/{tagline}/g, branding.tagline);

        // Variables de contenu principales (hero, sections, CTA)
        html = html.replace(/{hero_title}/g, content.hero_title || content.hero?.title || `Bienvenue chez ${branding.brandName}`);
        html = html.replace(/{hero_subtitle}/g, content.hero_subtitle || content.hero?.subtitle || branding.valueProposition);
        html = html.replace(/{cta_title}/g, content.cta_title || content.cta?.title || 'Prêt à commencer ?');
        html = html.replace(/{cta_text}/g, content.cta_text || content.cta?.text || 'Contactez-nous dès aujourd\'hui');
        html = html.replace(/{cta_button}/g, content.cta_button || content.cta?.button || 'Nous contacter');
        html = html.replace(/{cta_primary}/g, content.cta_primary || 'Commencer maintenant');
        html = html.replace(/{cta_secondary}/g, content.cta_secondary || 'En savoir plus');

        // Variables de features et benefits
        html = html.replace(/{features_title}/g, content.features_title || content.features?.title || 'Nos Caractéristiques');
        html = html.replace(/{features_subtitle}/g, content.features_subtitle || content.features?.subtitle || 'Ce qui nous rend uniques');
        html = html.replace(/{features_content}/g, content.features_content || content.features?.content || '');
        html = html.replace(/{benefits_title}/g, content.benefits_title || content.benefits?.title || 'Vos Avantages');
        html = html.replace(/{benefits_content}/g, content.benefits_content || content.benefits?.content || '');

        // Variables de section génériques
        html = html.replace(/{section1_content}/g, content.section1_content || content.sections?.section1 || 'Contenu de la première section');
        html = html.replace(/{section2_content}/g, content.section2_content || content.sections?.section2 || 'Contenu de la deuxième section');
        html = html.replace(/{section3_content}/g, content.section3_content || content.sections?.section3 || 'Contenu de la troisième section');

        // Variables about
        html = html.replace(/{about_title}/g, content.about_title || content.about?.title || 'À Propos de Nous');
        html = html.replace(/{about_content}/g, content.about_content || content.about?.content || `${branding.brandName} est une entreprise innovante dédiée à votre succès.`);

        // Remplacer la navigation
        html = html.replace(/{navigation_menu}/g, navigation);
        html = html.replace(/{sidebar_navigation}/g, this.generateSidebarNavigation(content.pages));

        // 🆕 NOUVELLES VARIABLES DE NAVIGATION
        html = this.replaceNavigationVariables(html, content);

        // 🆕 NOUVELLES VARIABLES DE FOOTER
        html = this.replaceFooterVariables(html, branding, content);

        // 🆕 NOUVELLES VARIABLES DE FONCTIONNALITÉS
        html = this.replaceFeatureVariables(html, content);

        // 🆕 NOUVELLES VARIABLES DE TÉMOIGNAGES
        html = this.replaceTestimonialVariables(html, content);

        // 🆕 NOUVELLES VARIABLES DE STATISTIQUES
        html = this.replaceStatsVariables(html, content);

        // 🆕 NOUVELLES VARIABLES D'ACCESSIBILITÉ
        html = this.replaceAccessibilityVariables(html, content);

        // 🆕 NOUVELLES VARIABLES DE CONTACT
        html = this.replaceContactVariables(html, branding, content);

        // 🆕 NOUVELLES VARIABLES LÉGALES
        html = this.replaceLegalVariables(html, branding);

        // 🆕 NOUVELLES VARIABLES SPÉCIALISÉES
        html = this.replaceBrandingVariables(html, branding);

        // 🆕 NOUVELLES VARIABLES DE CONTENU SPÉCIALISÉ
        html = this.replaceSpecializedContentVariables(html, branding, content);

        // Remplacer le contenu principal
        html = this.replaceContent(html, content, pageType);

        // Remplacer le footer
        html = html.replace(/{footer_content}/g, this.generateFooter(branding));

        // 🆕 REMPLACEMENT GÉNÉRIQUE : Remplacer toutes les variables restantes du content
        // Cela capture les variables dynamiques ajoutées par DynamicContentAdapter
        Object.keys(content).forEach(key => {
            const value = content[key];
            // Ne remplacer que les valeurs primitives (string, number, boolean)
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                const regex = new RegExp(`{${key}}`, 'g');
                html = html.replace(regex, String(value));
            }
        });

        // Détecter et signaler les variables non remplies (pour debug)
        // Note: Certaines variables peuvent être créées par DynamicContentAdapter mais pas utilisées par tous les layouts
        const remainingVars = html.match(/{[a-zA-Z_][a-zA-Z0-9_]*}/g);
        if (remainingVars && remainingVars.length > 0) {
            const uniqueVars = [...new Set(remainingVars)];
            // Ne logger que si plus de 5 variables non remplies (pour éviter le bruit des variables optionnelles)
            if (uniqueVars.length > 5 && this.options?.verbose) {
                console.warn(`⚠️  Variables non remplies détectées (${uniqueVars.length}):`, uniqueVars.slice(0, 10));
            }
        }

        // Nettoyer les placeholders restants (seulement les variables, pas les blocs CSS)
        html = html.replace(/{[a-zA-Z_][a-zA-Z0-9_]*}/g, '');

        return html;
    }

    /**
     * Remplace le contenu spécifique de la page
     */
    replaceContent(html, content, pageType) {
        // Remplacer les sections principales avec support étendu pour les nouveaux layouts
        const sections = [
            // Hero et sections principales
            'hero_title', 'hero_subtitle', 'hero_image_or_content', 'hero_description',

            // Features et bénéfices
            'features_title', 'features_content', 'features_subtitle',
            'benefits_title', 'benefits_content', 'benefits_subtitle',

            // Services et solutions
            'services_title', 'services_content', 'services_subtitle',
            'solutions_title', 'solutions_content',

            // Sections génériques
            'section1_title', 'section1_content', 'section1_subtitle',
            'section2_title', 'section2_content', 'section2_subtitle',
            'section3_title', 'section3_content', 'section3_subtitle',
            'section4_title', 'section4_content', 'section4_subtitle',

            // CTA et boutons
            'cta_title', 'cta_text', 'cta_button', 'cta_primary', 'cta_secondary',
            'cta_subtitle', 'cta_description',

            // Contenus spécialisés
            'cards_content', 'masonry_content', 'zigzag_content',
            'grid_content', 'timeline_content', 'portfolio_content',

            // Témoignages et statistiques
            'testimonials_title', 'testimonials_content', 'testimonials_subtitle',
            'stats_content', 'stats_title', 'metrics_content',

            // Équipe et à propos
            'team_title', 'team_content', 'team_subtitle',
            'about_title', 'about_content', 'about_subtitle',

            // Pricing et FAQ
            'pricing_title', 'pricing_content', 'pricing_subtitle',
            'faq_title', 'faq_content', 'faq_subtitle',

            // Newsletter et contact
            'newsletter_title', 'newsletter_subtitle', 'newsletter_description',
            'contact_title', 'contact_content', 'contact_form',

            // Autres éléments
            'additional_title', 'additional_content',
            'page_title', 'page_subtitle', 'sidebar_footer',
            'partners_content', 'clients_logos', 'awards_content',

            // SEO et métadonnées
            'meta_keywords', 'schema_markup', 'social_links',

            // E-commerce spécifiques
            'product_title', 'product_description', 'product_price',
            'product_features', 'product_gallery', 'product_reviews'
        ];

        sections.forEach(section => {
            const regex = new RegExp(`{${section}}`, 'g');
            const value = content[section] ||
                         content.sections?.[section] ||
                         this.getDefaultContent(section, pageType);
            html = html.replace(regex, value);
        });

        // Remplacer les variables conditionnelles (pour les éléments optionnels)
        html = html.replace(/{if_(\w+)}([\s\S]*?){\/if_\1}/g, (match, varName, content) => {
            if (this.hasContent(varName, content)) {
                return content;
            }
            return '';
        });

        // Remplacer les boucles (pour les listes d'éléments)
        html = html.replace(/{foreach_(\w+)}([\s\S]*?){\/foreach_\1}/g, (match, varName, template) => {
            const items = content[varName] || [];
            if (Array.isArray(items)) {
                return items.map(item => this.replaceItemVariables(template, item)).join('');
            }
            return '';
        });

        return html;
    }

    /**
     * Vérifie si un contenu existe
     */
    hasContent(varName, content) {
        return content && content[varName] && content[varName].length > 0;
    }

    /**
     * Remplace les variables dans un élément de boucle
     */
    replaceItemVariables(template, item) {
        let result = template;
        if (typeof item === 'object') {
            Object.keys(item).forEach(key => {
                const regex = new RegExp(`{item_${key}}`, 'g');
                result = result.replace(regex, item[key] || '');
            });
        }
        return result;
    }

    /**
     * Génère la navigation
     */
    generateNavigation(pages) {
        // Pour une structure one-page, générer des ancres vers les sections
        const onepageSections = [
            { id: 'hero', text: 'Accueil' },
            { id: 'services', text: 'Services' },
            { id: 'about', text: 'À Propos' },
            { id: 'pricing', text: 'Tarifs' },
            { id: 'testimonials', text: 'Témoignages' },
            { id: 'contact', text: 'Contact' }
        ];

        const links = onepageSections.map(section => {
            return `<a href="#${section.id}">${section.text}</a>`;
        });

        // Ajouter le lien vers le blog (page séparée)
        links.push('<a href="/blog.php">Blog</a>');

        return links.join('\n');
    }

    /**
     * Génère la navigation sidebar
     */
    generateSidebarNavigation(pages) {
        const pageNames = {
            home: '🏠 Accueil',
            services: '💼 Services',
            pricing: '💰 Tarifs',
            about: 'ℹ️ À propos',
            contact: '📧 Contact',
            blog: '📝 Blog'
        };

        if (!pages || typeof pages !== 'object') {
            return '';
        }

        const links = Object.keys(pages).map(page => {
            const href = page === 'home' ? '/' : `/${page}.html`;
            const text = pageNames[page] || page.charAt(0).toUpperCase() + page.slice(1);
            return `<li><a href="${href}">${text}</a></li>`;
        });

        return links.join('\n');
    }

    /**
     * Génère le footer
     */
    generateFooter(branding) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
                <div>
                    <h4>${branding.brandName}</h4>
                    <p>${branding.tagline}</p>
                </div>
                <div>
                    <h4>Navigation</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/services.html">Services</a></li>
                        <li><a href="/about.html">À propos</a></li>
                        <li><a href="/contact.html">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Contact</h4>
                    <p>Email: contact@${branding.brandName.toLowerCase().replace(/\s+/g, '')}.fr</p>
                    <p>Tél: 01 23 45 67 89</p>
                </div>
                <div>
                    <h4>Suivez-nous</h4>
                    <p>LinkedIn | Twitter | Facebook</p>
                </div>
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
                <p>&copy; 2024 ${branding.brandName}. Tous droits réservés.</p>
            </div>
        `;
    }

    /**
     * Crée le listing blog PHP
     */
    async createBlogListing(branding, framework, colorScheme) {
        const blogTemplatePath = path.join(__dirname, '..', 'index.php');
        let blogContent = await fs.readFile(blogTemplatePath, 'utf8');

        // Personnaliser le blog.php avec le branding et le style
        blogContent = blogContent.replace(/LemmiLink/g, branding.brandName);

        // Ajouter les styles du framework
        const styleTag = `<link rel="stylesheet" href="${framework.css}">`;
        blogContent = blogContent.replace('</head>', `${styleTag}\n</head>`);

        await fs.writeFile(path.join(this.outputDir, 'blog.php'), blogContent);
        console.log('  📝 Blog listing créé: blog.php');
    }

    /**
     * Crée le fichier .htaccess
     */
    async createHtaccess() {
        const htaccess = `
# Configuration Apache
DirectoryIndex index.html index.php

RewriteEngine On

# Blog
RewriteRule ^blog/?$ blog.php [L]

# Supprimer l'extension .html
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}\\.html -f
RewriteRule ^([^/]+)/?$ $1.html [L]

# Cache navigateur
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>
`;

        await fs.writeFile(path.join(this.outputDir, '.htaccess'), htaccess);
        console.log('  ⚙️  .htaccess créé');
    }

    /**
     * Retourne un contenu par défaut pour les sections manquantes
     */
    getDefaultContent(section, pageType) {
        const defaults = {
            // Hero
            hero_title: 'Bienvenue sur notre site',
            hero_subtitle: 'Découvrez nos services et solutions innovantes',
            hero_description: 'Une approche moderne pour répondre à vos besoins',
            hero_image_or_content: '',

            // Features
            features_title: 'Nos Caractéristiques',
            features_subtitle: 'Ce qui nous rend uniques',
            features_content: `
                <div class="features-grid">
                    <div class="feature-item">
                        <h3>Innovation</h3>
                        <p>Solutions de pointe adaptées à vos besoins</p>
                    </div>
                    <div class="feature-item">
                        <h3>Fiabilité</h3>
                        <p>Un service stable et performant 24/7</p>
                    </div>
                    <div class="feature-item">
                        <h3>Support</h3>
                        <p>Une équipe dédiée à votre réussite</p>
                    </div>
                </div>
            `,

            // Benefits
            benefits_title: 'Vos Avantages',
            benefits_subtitle: 'Pourquoi nous choisir',
            benefits_content: `
                <ul class="benefits-list">
                    <li>✅ Gain de temps considérable</li>
                    <li>✅ Réduction des coûts opérationnels</li>
                    <li>✅ Amélioration de la productivité</li>
                    <li>✅ Résultats mesurables</li>
                </ul>
            `,

            // Services
            services_title: 'Nos Services',
            services_subtitle: 'Des solutions complètes pour votre entreprise',
            services_content: '<p>Découvrez notre gamme complète de services professionnels.</p>',

            // CTA
            cta_title: 'Prêt à commencer ?',
            cta_subtitle: 'Rejoignez des milliers de clients satisfaits',
            cta_text: 'Contactez-nous dès aujourd\'hui pour une consultation gratuite',
            cta_button: 'Nous contacter',
            cta_primary: 'Commencer maintenant',
            cta_secondary: 'En savoir plus',
            cta_description: 'Sans engagement • Réponse sous 24h',

            // Stats
            stats_content: `
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">500+</span>
                        <span class="stat-label">Clients satisfaits</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">98%</span>
                        <span class="stat-label">Taux de satisfaction</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">24/7</span>
                        <span class="stat-label">Support disponible</span>
                    </div>
                </div>
            `,
            stats_title: 'Nos Résultats Parlent',

            // Testimonials
            testimonials_title: 'Ce que disent nos clients',
            testimonials_subtitle: 'Des retours authentiques de nos utilisateurs',
            testimonials_content: `
                <div class="testimonials-grid">
                    <div class="testimonial">
                        <p>"Un service exceptionnel qui a transformé notre activité."</p>
                        <cite>- Marie D., Directrice Marketing</cite>
                    </div>
                    <div class="testimonial">
                        <p>"L'équipe est réactive et professionnelle. Je recommande !"</p>
                        <cite>- Jean P., CEO</cite>
                    </div>
                </div>
            `,

            // Team
            team_title: 'Notre Équipe',
            team_subtitle: 'Des experts passionnés à votre service',
            team_content: '<p>Une équipe dédiée de professionnels expérimentés.</p>',

            // About
            about_title: 'À Propos de Nous',
            about_subtitle: 'Notre histoire et nos valeurs',
            about_content: '<p>Nous sommes une entreprise innovante dédiée à votre succès.</p>',

            // Pricing
            pricing_title: 'Nos Tarifs',
            pricing_subtitle: 'Des plans adaptés à vos besoins',
            pricing_content: '<p>Découvrez nos offres transparentes et sans frais cachés.</p>',

            // FAQ
            faq_title: 'Questions Fréquentes',
            faq_subtitle: 'Tout ce que vous devez savoir',
            faq_content: '<p>Trouvez rapidement des réponses à vos questions.</p>',

            // Newsletter
            newsletter_title: 'Restez Informé',
            newsletter_subtitle: 'Inscrivez-vous à notre newsletter',
            newsletter_description: 'Recevez nos dernières actualités et conseils exclusifs.',

            // Contact
            contact_title: 'Contactez-Nous',
            contact_content: `
                <div class="contact-info">
                    <p>📧 contact@example.com</p>
                    <p>📱 01 23 45 67 89</p>
                    <p>📍 Paris, France</p>
                </div>
            `,

            // Autres
            page_title: this.getPageTitle(pageType),
            page_subtitle: 'Découvrez notre contenu',
            additional_title: 'En Savoir Plus',
            additional_content: '',
            sidebar_footer: '© 2024 - Tous droits réservés',

            // E-commerce
            product_title: 'Nos Produits',
            product_description: 'Découvrez notre sélection',
            product_price: 'À partir de 29€',
            product_features: 'Caractéristiques premium incluses'
        };

        return defaults[section] || '';
    }

    /**
     * Retourne le titre de page par défaut
     */
    getPageTitle(pageType) {
        const titles = {
            home: 'Accueil',
            services: 'Nos Services',
            pricing: 'Nos Tarifs',
            about: 'À Propos',
            contact: 'Contact',
            lexique: 'Lexique'
        };

        return titles[pageType] || pageType.charAt(0).toUpperCase() + pageType.slice(1);
    }

    /**
     * 🆕 Remplace les variables de navigation
     */
    replaceNavigationVariables(html, content) {
        // Variables de navigation principales
        const navItems = this.generateNavItems(content.pages);

        html = html.replace(/{nav_item_1}/g, navItems[0] || 'Accueil');
        html = html.replace(/{nav_item_2}/g, navItems[1] || 'Services');
        html = html.replace(/{nav_item_3}/g, navItems[2] || 'À propos');
        html = html.replace(/{nav_item_4}/g, navItems[3] || 'Blog');
        html = html.replace(/{nav_item_5}/g, navItems[4] || 'Ressources');

        html = html.replace(/{nav_url_1}/g, '/');
        html = html.replace(/{nav_url_2}/g, '/services.html');
        html = html.replace(/{nav_url_3}/g, '/about.html');
        html = html.replace(/{nav_url_4}/g, '/blog.php');
        html = html.replace(/{nav_url_5}/g, '/ressources.html');

        html = html.replace(/{nav_cta_text}/g, 'Contact');

        // Variables d'accessibilité navigation
        html = html.replace(/{nav_toggle_open_label}/g, 'Ouvrir le menu de navigation');
        html = html.replace(/{nav_toggle_close_label}/g, 'Fermer le menu de navigation');

        return html;
    }

    /**
     * 🆕 Remplace les variables de footer
     */
    replaceFooterVariables(html, branding, content) {
        // Sections du footer
        html = html.replace(/{footer_section_1_title}/g, 'Services');
        html = html.replace(/{footer_section_2_title}/g, 'Ressources');
        html = html.replace(/{footer_section_3_title}/g, 'Contact');

        // Liens du footer (section 1 - Services)
        html = html.replace(/{footer_link_1_text}/g, content.services?.title || 'Nos Services');
        html = html.replace(/{footer_link_1_url}/g, '/services.html');
        html = html.replace(/{footer_link_2_text}/g, 'Solutions');
        html = html.replace(/{footer_link_2_url}/g, '/solutions.html');
        html = html.replace(/{footer_link_3_text}/g, 'Tarifs');
        html = html.replace(/{footer_link_3_url}/g, '/pricing.html');
        html = html.replace(/{footer_link_4_text}/g, 'Support');
        html = html.replace(/{footer_link_4_url}/g, '/support.html');

        // Liens du footer (section 2 - Ressources)
        html = html.replace(/{footer_link_5_text}/g, 'Blog');
        html = html.replace(/{footer_link_5_url}/g, '/blog.php');
        html = html.replace(/{footer_link_6_text}/g, 'Guides');
        html = html.replace(/{footer_link_6_url}/g, '/guides.html');
        html = html.replace(/{footer_link_7_text}/g, 'FAQ');
        html = html.replace(/{footer_link_7_url}/g, '/faq.html');
        html = html.replace(/{footer_link_8_text}/g, 'Documentation');
        html = html.replace(/{footer_link_8_url}/g, '/docs.html');

        // Liens du footer (section 3 - Contact et légal)
        html = html.replace(/{footer_link_9_text}/g, 'Contact');
        html = html.replace(/{footer_link_9_url}/g, '/contact.html');
        html = html.replace(/{footer_link_10_text}/g, 'Support');
        html = html.replace(/{footer_link_10_url}/g, '/support.html');
        html = html.replace(/{footer_link_11_text}/g, 'Mentions légales');
        html = html.replace(/{footer_link_11_url}/g, '/legal.html');
        html = html.replace(/{footer_link_12_text}/g, 'CGV');
        html = html.replace(/{footer_link_12_url}/g, '/cgv.html');

        // Texte du footer
        html = html.replace(/{footer_text}/g, branding.valueProposition || `${branding.brandName} vous accompagne dans votre réussite.`);

        // Newsletter
        html = html.replace(/{newsletter_text}/g, 'Restez informé de nos actualités');
        html = html.replace(/{newsletter_placeholder}/g, 'Votre adresse email');
        html = html.replace(/{newsletter_button}/g, 'S\'inscrire');

        return html;
    }

    /**
     * 🆕 Remplace les variables de fonctionnalités
     */
    replaceFeatureVariables(html, content) {
        // Titres des fonctionnalités
        html = html.replace(/{feature_1_title}/g, content.features?.feature1?.title || 'Excellence');
        html = html.replace(/{feature_2_title}/g, content.features?.feature2?.title || 'Innovation');
        html = html.replace(/{feature_3_title}/g, content.features?.feature3?.title || 'Fiabilité');
        html = html.replace(/{feature_4_title}/g, content.features?.feature4?.title || 'Performance');
        html = html.replace(/{feature_5_title}/g, content.features?.feature5?.title || 'Sécurité');
        html = html.replace(/{feature_6_title}/g, content.features?.feature6?.title || 'Support');

        return html;
    }

    /**
     * 🆕 Remplace les variables de témoignages
     */
    replaceTestimonialVariables(html, content) {
        html = html.replace(/{testimonials_badge}/g, 'Témoignages');
        html = html.replace(/{testimonials_title}/g, 'Ce que disent nos clients');
        html = html.replace(/{testimonials_subtitle}/g, 'Découvrez les retours de nos clients satisfaits');

        // Témoignage 1
        html = html.replace(/{testimonial_1_text}/g, '"Service exceptionnel et équipe à l\'écoute. Résultats au-delà de nos attentes !"');
        html = html.replace(/{testimonial_1_author}/g, 'Marie Dubois');
        html = html.replace(/{testimonial_1_position}/g, 'Directrice Marketing');

        // Témoignage 2
        html = html.replace(/{testimonial_2_text}/g, '"Professionnalisme remarquable et expertise technique de haut niveau."');
        html = html.replace(/{testimonial_2_author}/g, 'Pierre Martin');
        html = html.replace(/{testimonial_2_position}/g, 'CEO, TechCorp');

        // Témoignage 3
        html = html.replace(/{testimonial_3_text}/g, '"Un partenaire de confiance qui comprend nos enjeux et nos objectifs."');
        html = html.replace(/{testimonial_3_author}/g, 'Sophie Laurent');
        html = html.replace(/{testimonial_3_position}/g, 'Fondatrice, StartupX');

        return html;
    }

    /**
     * 🆕 Remplace les variables de statistiques
     */
    replaceStatsVariables(html, content) {
        html = html.replace(/{stat_1_number}/g, '100+');
        html = html.replace(/{stat_1_label}/g, 'Clients Satisfaits');

        html = html.replace(/{stat_2_number}/g, '98%');
        html = html.replace(/{stat_2_label}/g, 'Taux de Réussite');

        html = html.replace(/{stat_3_number}/g, '5+');
        html = html.replace(/{stat_3_label}/g, 'Années d\'Expérience');

        html = html.replace(/{stat_4_number}/g, '24/7');
        html = html.replace(/{stat_label_support}/g, 'Support Disponible');

        return html;
    }

    /**
     * 🆕 Remplace les variables d'accessibilité
     */
    replaceAccessibilityVariables(html, content) {
        html = html.replace(/{skip_link_text}/g, 'Aller au contenu principal');
        html = html.replace(/{meta_keywords}/g, content.meta?.keywords || '');

        return html;
    }

    /**
     * 🆕 Remplace les variables de contact
     */
    replaceContactVariables(html, branding, content) {
        html = html.replace(/{contact_email}/g, `contact@${branding.brandName.toLowerCase().replace(/\s+/g, '')}.fr`);
        html = html.replace(/{contact_phone}/g, '+33 1 23 45 67 89');
        html = html.replace(/{contact_address}/g, 'Paris, France');

        // Icônes de contact
        html = html.replace(/{contact_email_icon}/g, '📧');
        html = html.replace(/{contact_phone_icon}/g, '📞');
        html = html.replace(/{contact_address_icon}/g, '📍');

        return html;
    }

    /**
     * 🆕 Remplace les variables légales
     */
    replaceLegalVariables(html, branding) {
        html = html.replace(/{copyright_year}/g, new Date().getFullYear());
        html = html.replace(/{copyright_text}/g, `© ${new Date().getFullYear()} ${branding.brandName}. Tous droits réservés.`);

        html = html.replace(/{privacy_text}/g, 'Politique de confidentialité');
        html = html.replace(/{privacy_url}/g, '/privacy.html');

        html = html.replace(/{terms_text}/g, 'Conditions d\'utilisation');
        html = html.replace(/{terms_url}/g, '/terms.html');

        html = html.replace(/{cookies_text}/g, 'Gestion des cookies');
        html = html.replace(/{cookies_url}/g, '/cookies.html');

        return html;
    }

    /**
     * 🆕 Génère les éléments de navigation
     */
    generateNavItems(pages) {
        const pageNames = Object.keys(pages || {});
        const defaultItems = ['Accueil', 'Services', 'À propos', 'Blog', 'Contact'];

        return pageNames.length > 0 ?
            pageNames.map(name => this.getPageTitle(name)).slice(0, 5) :
            defaultItems;
    }

    /**
     * 🆕 Remplace les variables de branding avancées
     */
    replaceBrandingVariables(html, branding) {
        // Initiales de la marque pour les logos
        const brandInitial = branding.brandName.charAt(0).toUpperCase();
        html = html.replace(/{brand_initial}/g, brandInitial);

        // Variables de confiance et indicateurs
        html = html.replace(/{trust_indicator_1}/g, '✓ Certifié');
        html = html.replace(/{trust_indicator_2}/g, '⭐ 5/5 étoiles');
        html = html.replace(/{trust_indicator_3}/g, '🔒 Sécurisé');

        // Badges de section génériques
        html = html.replace(/{section_badge_text}/g, 'Nos Services');
        html = html.replace(/{hero_badge_text}/g, 'Nouveau');

        return html;
    }

    /**
     * 🆕 Remplace les variables de contenu spécialisé
     */
    replaceSpecializedContentVariables(html, branding, content) {
        // Variables de qualité et excellence
        html = html.replace(/{quality_content}/g, 'Nous nous engageons à fournir la plus haute qualité de service.');
        html = html.replace(/{excellence_content}/g, 'L\'excellence est au cœur de tout ce que nous faisons.');

        // Variables d'accessibilité et navigation mobile
        html = html.replace(/{nav_toggle_open_label}/g, 'Ouvrir le menu');
        html = html.replace(/{nav_toggle_close_label}/g, 'Fermer le menu');
        html = html.replace(/{skip_link_text}/g, 'Aller au contenu principal');

        // Correction des variables stat manquantes
        html = html.replace(/{stat_label_support}/g, 'Support Disponible');

        // Variables CTA manquantes
        html = html.replace(/{benefits_cta_text}/g, 'Découvrir nos avantages');
        html = html.replace(/{cta_benefits_text}/g, 'Voir les bénéfices');
        html = html.replace(/{phone_cta_text}/g, 'Appelez-nous');
        html = html.replace(/{phone_number}/g, '01 23 45 67 89');

        // Variables de tarification
        html = html.replace(/{price}/g, 'À partir de 29€');

        // Variables d'entreprises de confiance
        html = html.replace(/{trust_company_1}/g, 'Google');
        html = html.replace(/{trust_company_2}/g, 'Microsoft');
        html = html.replace(/{trust_company_3}/g, 'Amazon');
        html = html.replace(/{trust_company_4}/g, 'Apple');
        html = html.replace(/{trust_text}/g, 'Ils nous font confiance');

        // Variables de contenu spécialisé
        html = html.replace(/{feature_link_text}/g, 'En savoir plus');
        html = html.replace(/{masonry_content}/g, '');

        // Variables de footer personnalisé
        html = html.replace(/{footer_cute_prefix}/g, 'Fait avec ❤️ à');

        // Variables d'animation (pour les layouts avancés)
        html = html.replace(/{randomRotation}/g, '0');
        html = html.replace(/{scrollPercent}/g, '0');
        html = html.replace(/{x}/g, '0');
        html = html.replace(/{y}/g, '0');
        html = html.replace(/{yPos}/g, '0');
        html = html.replace(/{firstChar}/g, branding.brandName.charAt(0).toUpperCase());

        return html;
    }
}

module.exports = SiteBuilder;