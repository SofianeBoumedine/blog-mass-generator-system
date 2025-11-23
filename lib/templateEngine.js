const fs = require('fs').promises;
const path = require('path');

class TemplateEngine {
    constructor() {
        this.templates = new Map();
        this.components = new Map();
        this.layouts = new Map();
        this.cache = new Map();
        this.enableCache = true;
    }

    async initialize() {
        console.log('🎨 Initialisation du moteur de templates...');

        // Charger tous les layouts
        await this.loadLayouts();

        // Charger tous les composants
        await this.loadComponents();

        console.log(`  ✅ ${this.layouts.size} layouts chargés`);
        console.log(`  ✅ ${this.components.size} composants chargés`);
    }

    /**
     * Charge tous les layouts disponibles
     */
    async loadLayouts() {
        const layoutsDir = path.join(__dirname, '..', 'templates', 'layouts');

        try {
            const files = await fs.readdir(layoutsDir);
            const layoutFiles = files.filter(f => f.endsWith('.html'));

            for (const file of layoutFiles) {
                const layoutPath = path.join(layoutsDir, file);
                const content = await fs.readFile(layoutPath, 'utf8');
                const layoutName = file.replace('.html', '');

                this.layouts.set(layoutName, {
                    content,
                    path: layoutPath,
                    name: layoutName,
                    lastModified: (await fs.stat(layoutPath)).mtime
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement des layouts:', error);
        }
    }

    /**
     * Charge tous les composants disponibles
     */
    async loadComponents() {
        const componentsDir = path.join(__dirname, '..', 'templates', 'components');

        try {
            // Créer le dossier s'il n'existe pas
            await fs.mkdir(componentsDir, { recursive: true });

            const subDirs = ['navbars', 'footers', 'cta'];

            for (const subDir of subDirs) {
                const subDirPath = path.join(componentsDir, subDir);
                await fs.mkdir(subDirPath, { recursive: true });

                try {
                    const files = await fs.readdir(subDirPath);
                    const componentFiles = files.filter(f => f.endsWith('.html'));

                    for (const file of componentFiles) {
                        const componentPath = path.join(subDirPath, file);
                        const content = await fs.readFile(componentPath, 'utf8');
                        const componentName = `${subDir}/${file.replace('.html', '')}`;

                        this.components.set(componentName, {
                            content,
                            path: componentPath,
                            type: subDir,
                            name: componentName
                        });
                    }
                } catch (error) {
                    // Dossier vide ou n'existe pas encore
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des composants:', error);
        }
    }

    /**
     * Sélectionne un layout aléatoire
     */
    getRandomLayout() {
        const layoutNames = Array.from(this.layouts.keys());
        const randomIndex = Math.floor(Math.random() * layoutNames.length);
        const selectedName = layoutNames[randomIndex];

        return {
            name: selectedName,
            ...this.layouts.get(selectedName)
        };
    }

    /**
     * Obtient un layout spécifique
     */
    getLayout(layoutName) {
        return this.layouts.get(layoutName);
    }

    /**
     * Rend un template avec les données fournies
     */
    async renderTemplate(templateContent, data, framework, colorScheme) {
        const cacheKey = this.generateCacheKey(templateContent, data, framework, colorScheme);

        if (this.enableCache && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        let rendered = templateContent;

        // 1. Remplacer les variables de framework
        rendered = this.replaceFrameworkVariables(rendered, framework);

        // 2. Remplacer les variables de couleurs
        rendered = this.replaceColorVariables(rendered, colorScheme);

        // 3. Remplacer les variables de données
        rendered = this.replaceDataVariables(rendered, data);

        // 4. Remplacer les composants
        rendered = await this.replaceComponents(rendered, data);

        // 5. Nettoyer les placeholders restants
        rendered = this.cleanupPlaceholders(rendered);

        // 6. Minifier si nécessaire
        rendered = this.minifyIfNeeded(rendered);

        if (this.enableCache) {
            this.cache.set(cacheKey, rendered);
        }

        return rendered;
    }

    /**
     * Remplace les variables du framework CSS
     */
    replaceFrameworkVariables(template, framework) {
        if (!framework) return template;

        let result = template;

        // Remplacer les liens CSS et JS
        result = result.replace(/{framework_css}/g, framework.css ? `<link rel="stylesheet" href="${framework.css}">` : '');
        result = result.replace(/{framework_js}/g, framework.js ? `<script src="${framework.js}"></script>` : '');

        // Remplacer les classes CSS du framework
        if (framework.classes) {
            Object.entries(framework.classes).forEach(([key, value]) => {
                const regex = new RegExp(`{${key}_class}`, 'g');
                result = result.replace(regex, value);
            });
        }

        return result;
    }

    /**
     * Remplace les variables de couleurs
     */
    replaceColorVariables(template, colorScheme) {
        if (!colorScheme) return template;

        let result = template;

        const colorMappings = {
            'color_primary': colorScheme.primary,
            'color_secondary': colorScheme.secondary,
            'color_accent': colorScheme.accent,
            'color_text': colorScheme.text,
            'color_background': colorScheme.background
        };

        Object.entries(colorMappings).forEach(([placeholder, color]) => {
            if (color) {
                const regex = new RegExp(`{${placeholder}}`, 'g');
                result = result.replace(regex, color);
            }
        });

        return result;
    }

    /**
     * Remplace les variables de données
     */
    replaceDataVariables(template, data) {
        let result = template;

        // Fonction récursive pour remplacer les données imbriquées
        const replaceVariables = (obj, prefix = '') => {
            Object.entries(obj).forEach(([key, value]) => {
                const placeholder = prefix ? `${prefix}_${key}` : key;
                const regex = new RegExp(`{${placeholder}}`, 'g');

                if (typeof value === 'string') {
                    result = result.replace(regex, value);
                } else if (typeof value === 'object' && value !== null) {
                    replaceVariables(value, placeholder);
                } else {
                    result = result.replace(regex, String(value || ''));
                }
            });
        };

        replaceVariables(data);

        return result;
    }

    /**
     * Remplace les composants dans le template
     */
    async replaceComponents(template, data) {
        let result = template;

        // Remplacer la navigation
        const navComponent = this.getRandomComponent('navbars') || this.generateDefaultNavigation(data);
        result = result.replace(/{navigation_menu}/g, navComponent);

        // Remplacer le footer
        const footerComponent = this.getRandomComponent('footers') || this.generateDefaultFooter(data);
        result = result.replace(/{footer_content}/g, footerComponent);

        // Remplacer les CTA
        const ctaComponent = this.getRandomComponent('cta') || this.generateDefaultCTA(data);
        result = result.replace(/{cta_component}/g, ctaComponent);

        return result;
    }

    /**
     * Obtient un composant aléatoire d'un type donné
     */
    getRandomComponent(type) {
        const components = Array.from(this.components.values()).filter(c => c.type === type);
        if (components.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * components.length);
        return components[randomIndex].content;
    }

    /**
     * Génère une navigation par défaut
     */
    generateDefaultNavigation(data) {
        const pages = data.pages || {};
        const pageNames = {
            home: 'Accueil',
            services: 'Services',
            pricing: 'Tarifs',
            about: 'À propos',
            contact: 'Contact',
            blog: 'Blog'
        };

        const links = Object.keys(pages).map(page => {
            const href = page === 'home' ? '/' : `/${page}.html`;
            const text = pageNames[page] || page.charAt(0).toUpperCase() + page.slice(1);
            return `<a href="${href}">${text}</a>`;
        });

        // Ajouter le lien blog s'il n'existe pas
        if (!pages.blog) {
            links.push('<a href="/blog.php">Blog</a>');
        }

        return links.join('\n        ');
    }

    /**
     * Génère un footer par défaut
     */
    generateDefaultFooter(data) {
        const brandName = data.brandName || 'Notre Entreprise';
        const currentYear = new Date().getFullYear();

        return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
            <div>
                <h4>${brandName}</h4>
                <p>Votre partenaire de confiance pour tous vos projets.</p>
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
                <p>Email: contact@${brandName.toLowerCase().replace(/\s+/g, '')}.fr</p>
                <p>Tél: 01 23 45 67 89</p>
            </div>
            <div>
                <h4>Suivez-nous</h4>
                <p>LinkedIn | Twitter | Facebook</p>
            </div>
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2); text-align: center;">
            <p>&copy; ${currentYear} ${brandName}. Tous droits réservés.</p>
        </div>`;
    }

    /**
     * Génère un CTA par défaut
     */
    generateDefaultCTA(data) {
        return `
        <div style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 10px; margin: 40px 0;">
            <h3 style="font-size: 2rem; margin-bottom: 20px;">Prêt à commencer ?</h3>
            <p style="margin-bottom: 30px; opacity: 0.9;">Contactez-nous dès aujourd'hui pour discuter de votre projet.</p>
            <a href="#" style="background: white; color: var(--primary); padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Nous contacter</a>
        </div>`;
    }

    /**
     * Nettoie les placeholders restants
     */
    cleanupPlaceholders(template) {
        // Remplacer les placeholders restants par des valeurs par défaut ou les supprimer
        return template
            .replace(/{[^}]+}/g, '') // Supprimer tous les placeholders restants
            .replace(/\s+/g, ' ') // Normaliser les espaces
            .replace(/\n\s*\n/g, '\n'); // Supprimer les lignes vides multiples
    }

    /**
     * Minifie le HTML si nécessaire
     */
    minifyIfNeeded(template) {
        // Minification basique pour réduire la taille
        return template
            .replace(/\n\s*\n/g, '\n') // Supprimer les lignes vides multiples
            .replace(/\s{2,}/g, ' ') // Réduire les espaces multiples
            .trim();
    }

    /**
     * Génère une clé de cache
     */
    generateCacheKey(template, data, framework, colorScheme) {
        const crypto = require('crypto');
        const hash = crypto.createHash('md5');

        hash.update(template);
        hash.update(JSON.stringify(data));
        hash.update(JSON.stringify(framework || {}));
        hash.update(JSON.stringify(colorScheme || {}));

        return hash.digest('hex');
    }

    /**
     * Crée un template personnalisé
     */
    async createCustomTemplate(templateData) {
        const {
            layout,
            framework,
            colorScheme,
            content,
            metadata
        } = templateData;

        const selectedLayout = typeof layout === 'string'
            ? this.getLayout(layout)
            : layout;

        if (!selectedLayout) {
            throw new Error('Layout non trouvé');
        }

        return await this.renderTemplate(
            selectedLayout.content,
            content,
            framework,
            colorScheme
        );
    }

    /**
     * Valide un template
     */
    validateTemplate(template) {
        const errors = [];

        // Vérifier la structure HTML de base
        if (!template.includes('<!DOCTYPE html>')) {
            errors.push('DOCTYPE manquant');
        }

        if (!template.includes('<html')) {
            errors.push('Balise <html> manquante');
        }

        if (!template.includes('<head>')) {
            errors.push('Section <head> manquante');
        }

        if (!template.includes('<body>')) {
            errors.push('Section <body> manquante');
        }

        // Vérifier les balises meta essentielles
        if (!template.includes('<meta charset=')) {
            errors.push('Meta charset manquant');
        }

        if (!template.includes('<meta name="viewport"')) {
            errors.push('Meta viewport manquant');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Obtient les statistiques du moteur
     */
    getStats() {
        return {
            layouts: this.layouts.size,
            components: this.components.size,
            cacheSize: this.cache.size,
            cacheEnabled: this.enableCache
        };
    }

    /**
     * Vide le cache
     */
    clearCache() {
        this.cache.clear();
        console.log('Cache du moteur de templates vidé');
    }

    /**
     * Recharge les templates
     */
    async reload() {
        this.layouts.clear();
        this.components.clear();
        this.clearCache();
        await this.initialize();
        console.log('Moteur de templates rechargé');
    }
}

module.exports = TemplateEngine;