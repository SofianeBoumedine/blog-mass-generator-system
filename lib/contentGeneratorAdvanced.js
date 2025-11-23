const fs = require('fs').promises;
const path = require('path');

class ContentGeneratorAdvanced {
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
     * Parse le contenu avec structure avancée
     */
    parseStructuredContent(rawContent, pageType) {
        const content = {
            raw: rawContent,
            sections: {},
            metadata: {}
        };

        // Parser par type de page
        switch (pageType) {
            case 'home':
                return this.parseHomePage(rawContent);
            case 'services':
                return this.parseServicesPage(rawContent);
            case 'pricing':
                return this.parsePricingPage(rawContent);
            case 'about':
                return this.parseAboutPage(rawContent);
            case 'contact':
                return this.parseContactPage(rawContent);
            case 'faq':
                return this.parseFAQPage(rawContent);
            case 'portfolio':
                return this.parsePortfolioPage(rawContent);
            case 'team':
                return this.parseTeamPage(rawContent);
            case 'testimonials':
                return this.parseTestimonialsPage(rawContent);
            default:
                return content;
        }
    }

    /**
     * Parse la page d'accueil
     */
    parseHomePage(rawContent) {
        const sections = {};

        // Hero Section
        sections.hero = {
            title: this.extract(rawContent, 'TITRE PRINCIPAL'),
            subtitle: this.extract(rawContent, 'SOUS-TITRE'),
            description: this.extract(rawContent, 'DESCRIPTION HERO'),
            cta_primary: this.extract(rawContent, 'CTA PRINCIPAL'),
            cta_secondary: this.extract(rawContent, 'CTA SECONDAIRE')
        };

        // Social Proof
        sections.trust = {
            indicators: this.extractList(rawContent, 'TRUST INDICATORS')
        };

        // Propositions de valeur
        sections.propositions = this.extractMultiple(rawContent, 'PROPOSITION', 3);

        // Comment ça marche
        sections.howItWorks = this.extractMultiple(rawContent, 'ÉTAPE', 4);

        // Témoignages
        sections.testimonials = this.extractMultiple(rawContent, 'TÉMOIGNAGE', 3);

        // Pourquoi nous choisir
        sections.whyUs = this.extractList(rawContent, 'POURQUOI NOUS CHOISIR');

        // FAQ
        sections.faq = this.extractQA(rawContent, 'FAQ RAPIDE', 3);

        // CTA Final
        sections.finalCTA = {
            title: this.extract(rawContent, 'CTA FINAL.*TITRE'),
            text: this.extract(rawContent, 'CTA FINAL.*TEXTE'),
            button: this.extract(rawContent, 'CTA FINAL.*BOUTON'),
            guarantee: this.extract(rawContent, 'GARANTIE/RÉASSURANCE')
        };

        return { sections, raw: rawContent };
    }

    /**
     * Méthodes d'extraction avancées
     */
    extract(content, pattern) {
        const regex = new RegExp(`${pattern}[:\s]*(.+?)(?=\n\n|===|$)`, 'is');
        const match = content.match(regex);
        return match ? match[1].trim() : '';
    }

    extractList(content, section) {
        const items = [];
        const regex = new RegExp(`${section}[\s\S]*?([•✓✗-]\s*(.+?)(?=\n[•✓✗-]|\n\n|===|$))`, 'gm');
        let match;
        while ((match = regex.exec(content)) !== null) {
            items.push(match[2].trim());
        }
        return items;
    }

    extractMultiple(content, itemType, count) {
        const items = [];
        for (let i = 1; i <= count; i++) {
            const item = {};
            const section = this.extract(content, `${itemType} ${i}`);
            if (section) {
                // Parser les sous-sections
                const lines = section.split('\n');
                lines.forEach(line => {
                    const colonMatch = line.match(/^(.+?):\s*(.+)$/);
                    if (colonMatch) {
                        const key = colonMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
                        item[key] = colonMatch[2].trim();
                    }
                });
                items.push(item);
            }
        }
        return items;
    }

    extractQA(content, section, count) {
        const qa = [];
        for (let i = 1; i <= count; i++) {
            const q = this.extract(content, `QUESTION ${i}.*Q:`);
            const a = this.extract(content, `QUESTION ${i}.*R:`);
            if (q && a) {
                qa.push({ question: q, answer: a });
            }
        }
        return qa;
    }

    /**
     * Parser pour autres types de pages
     */
    parseServicesPage(rawContent) {
        // Extraction avancée des 5-6 services
        const services = this.extractMultiple(rawContent, 'SERVICE', 6);

        return {
            sections: {
                header: {
                    title: this.extract(rawContent, 'TITRE PRINCIPAL'),
                    subtitle: this.extract(rawContent, 'SOUS-TITRE'),
                    introduction: this.extract(rawContent, 'INTRODUCTION')
                },
                services: services,
                process: this.extractMultiple(rawContent, 'PHASE', 5),
                useCases: this.extractMultiple(rawContent, 'CAS', 3),
                faq: this.extractQA(rawContent, 'FAQ SERVICES', 10),
                cta: {
                    title: this.extract(rawContent, 'CTA FINAL.*TITRE'),
                    text: this.extract(rawContent, 'CTA FINAL.*TEXTE')
                }
            },
            raw: rawContent
        };
    }

    // Ajouter les autres parsers...
    parsePricingPage(rawContent) { /* ... */ }
    parseAboutPage(rawContent) { /* ... */ }
    parseContactPage(rawContent) { /* ... */ }
    parseFAQPage(rawContent) { /* ... */ }
    parsePortfolioPage(rawContent) { /* ... */ }
    parseTeamPage(rawContent) { /* ... */ }
    parseTestimonialsPage(rawContent) { /* ... */ }
}

module.exports = ContentGeneratorAdvanced;
