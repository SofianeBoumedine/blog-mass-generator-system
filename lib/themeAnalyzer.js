const fs = require('fs').promises;
const path = require('path');

class ThemeAnalyzer {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.prompts = null;
        this.structures = null;
    }

    async initialize() {
        // Charger les prompts et structures
        const promptsPath = path.join(__dirname, '..', 'config', 'prompts.json');
        const structuresPath = path.join(__dirname, '..', 'config', 'site-structures.json');

        this.prompts = JSON.parse(await fs.readFile(promptsPath, 'utf8'));
        this.structures = JSON.parse(await fs.readFile(structuresPath, 'utf8'));
    }

    /**
     * Analyse les mots-clés pour déterminer la thématique
     */
    async analyzeKeywords(keywords, limit = 100) {
        const keywordsSubset = keywords.slice(0, limit);
        const keywordsText = keywordsSubset.join('\n');

        const prompt = this.prompts.analysis.themeIdentification
            .replace('{keywords}', keywordsText);

        try {
            const response = await this.apiClient.generateContent(prompt);
            const analysis = JSON.parse(this.extractJSON(response));

            // Valider et enrichir l'analyse
            return this.enrichAnalysis(analysis);
        } catch (error) {
            console.error('Erreur lors de l\'analyse des mots-clés:', error);
            return this.getDefaultAnalysis();
        }
    }

    /**
     * Génère le branding du site
     */
    async generateBranding(domain, analysis) {
        const prompt = this.prompts.analysis.siteNaming
            .replace('{domain}', domain)
            .replace('{theme}', analysis.theme);

        try {
            const response = await this.apiClient.generateContent(prompt);
            return JSON.parse(this.extractJSON(response));
        } catch (error) {
            console.error('Erreur lors de la génération du branding:', error);
            return this.getDefaultBranding(domain);
        }
    }

    /**
     * Détermine la structure du site appropriée
     */
    determineSiteStructure(analysis) {
        // Structure simplifiée: une seule page one-page + blog
        return {
            pages: ['home'],  // Seulement la page d'accueil one-page
            navigation: 'onepage',
            features: ['hero', 'services', 'about', 'pricing', 'contact', 'blog'],
            tone: analysis.tone || 'friendly'
        };
    }

    /**
     * Enrichit l'analyse avec des données supplémentaires
     */
    enrichAnalysis(analysis) {
        // Ajouter des éléments par défaut si manquants
        const enriched = {
            theme: analysis.theme || 'Services digitaux',
            sector: analysis.sector || 'digital',
            businessType: analysis.businessType || 'Service',
            relatedThemes: analysis.relatedThemes || [],
            targetPersona: analysis.targetPersona || 'Entreprises et professionnels',
            tone: analysis.tone || 'professional',
            suggestedStructure: analysis.suggestedStructure || 'service'
        };

        // Ajouter des métadonnées
        enriched.metadata = {
            analyzedAt: new Date().toISOString(),
            confidence: this.calculateConfidence(enriched)
        };

        return enriched;
    }

    /**
     * Calcule un score de confiance pour l'analyse
     */
    calculateConfidence(analysis) {
        let score = 0;

        if (analysis.theme) score += 20;
        if (analysis.sector) score += 20;
        if (analysis.businessType) score += 20;
        if (analysis.relatedThemes.length > 0) score += 20;
        if (analysis.targetPersona) score += 10;
        if (analysis.tone) score += 10;

        return score;
    }

    /**
     * Extrait le JSON d'une réponse texte
     */
    extractJSON(text) {
        // Chercher le JSON dans la réponse
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return jsonMatch[0];
        }

        // Si pas de JSON trouvé, essayer de nettoyer la réponse
        const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return cleaned;
    }

    /**
     * Analyse par défaut si l'API échoue
     */
    getDefaultAnalysis() {
        return {
            theme: 'Services professionnels',
            sector: 'services',
            businessType: 'Service',
            relatedThemes: ['consulting', 'expertise', 'solutions'],
            targetPersona: 'Entreprises et professionnels',
            tone: 'professional',
            suggestedStructure: 'service',
            metadata: {
                analyzedAt: new Date().toISOString(),
                confidence: 50,
                isDefault: true
            }
        };
    }

    /**
     * Branding par défaut si l'API échoue
     */
    getDefaultBranding(domain) {
        const cleanDomain = domain.replace(/\.(com|fr|net|org|io)$/, '');
        const brandName = cleanDomain
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            brandName: brandName,
            tagline: `${brandName} - Votre partenaire de confiance`,
            valueProposition: `Découvrez les solutions innovantes de ${brandName} pour transformer votre activité`
        };
    }

    /**
     * Génère les mots-clés principaux pour chaque page
     */
    selectPageKeywords(allKeywords, pageType, limit = 5) {
        // Logique pour sélectionner les mots-clés pertinents par page
        const pageKeywordMap = {
            'home': 0,
            'services': Math.floor(allKeywords.length * 0.2),
            'pricing': Math.floor(allKeywords.length * 0.4),
            'about': Math.floor(allKeywords.length * 0.6),
            'contact': Math.floor(allKeywords.length * 0.8)
        };

        const startIdx = pageKeywordMap[pageType] || 0;
        return allKeywords.slice(startIdx, startIdx + limit);
    }
}

module.exports = ThemeAnalyzer;