/**
 * Gestionnaire de templates avancé avec support de composants
 */
class TemplateManager {
    constructor() {
        this.templates = new Map();
        this.components = new Map();
        this.cache = new Map();
    }

    /**
     * Enregistre un template
     */
    registerTemplate(name, content) {
        this.templates.set(name, content);
    }

    /**
     * Enregistre un composant réutilisable
     */
    registerComponent(name, template) {
        this.components.set(name, template);
    }

    /**
     * Rend un template avec des données
     */
    render(templateName, data) {
        const cacheKey = `${templateName}-${JSON.stringify(data)}`;

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        let template = this.templates.get(templateName);
        if (!template) {
            throw new Error(`Template not found: ${templateName}`);
        }

        // Remplacer les composants
        template = this.replaceComponents(template, data);

        // Remplacer les variables
        template = this.replaceVariables(template, data);

        // Exécuter les conditions
        template = this.processConditionals(template, data);

        // Exécuter les boucles
        template = this.processLoops(template, data);

        this.cache.set(cacheKey, template);
        return template;
    }

    replaceComponents(template, data) {
        // Remplacer {{component:name}}
        const componentRegex = /\{\{component:(\w+)(?:\s+(.+?))?\}\}/g;
        return template.replace(componentRegex, (match, componentName, props) => {
            const component = this.components.get(componentName);
            if (!component) return match;

            const componentData = props ? this.parseProps(props, data) : data;
            return this.render(component, componentData);
        });
    }

    replaceVariables(template, data) {
        // Remplacer {{variable}}
        return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
            return data[varName] !== undefined ? data[varName] : match;
        });
    }

    processConditionals(template, data) {
        // {{#if condition}}...{{/if}}
        const ifRegex = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
        return template.replace(ifRegex, (match, condition, content) => {
            return data[condition] ? content : '';
        });
    }

    processLoops(template, data) {
        // {{#each items}}...{{/each}}
        const eachRegex = /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
        return template.replace(eachRegex, (match, arrayName, content) => {
            const array = data[arrayName];
            if (!Array.isArray(array)) return '';

            return array.map((item, index) => {
                const itemData = { ...data, item, index };
                return this.replaceVariables(content, itemData);
            }).join('');
        });
    }

    parseProps(propsString, data) {
        const props = {};
        const pairs = propsString.match(/(\w+)="([^"]*)"/g);
        if (pairs) {
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                props[key] = value.replace(/"/g, '');
            });
        }
        return { ...data, ...props };
    }

    clearCache() {
        this.cache.clear();
    }
}

module.exports = TemplateManager;
