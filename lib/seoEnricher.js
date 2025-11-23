/**
 * Module d'enrichissement SEO avancé
 */
class SEOEnricher {
    constructor() {
        this.stopWords = new Set([
            'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du',
            'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car',
            'ce', 'cette', 'ces', 'cet', 'mon', 'ma', 'mes'
        ]);
    }

    /**
     * Enrichit un contenu avec des mots-clés LSI
     */
    enrichWithLSI(content, mainKeyword) {
        const lsiKeywords = this.generateLSIKeywords(mainKeyword);
        return {
            content,
            lsiKeywords,
            density: this.calculateKeywordDensity(content, mainKeyword)
        };
    }

    /**
     * Génère des mots-clés LSI (Latent Semantic Indexing)
     */
    generateLSIKeywords(mainKeyword) {
        const words = mainKeyword.toLowerCase().split(/\s+/);
        const lsi = new Set();

        // Ajouter des variations
        words.forEach(word => {
            lsi.add(word);
            lsi.add(word + 's'); // Pluriel
            lsi.add(word + 'tion'); // Nominalisation
            lsi.add(word + 'ment'); // Adverbe
        });

        return Array.from(lsi);
    }

    /**
     * Calcule la densité de mots-clés
     */
    calculateKeywordDensity(content, keyword) {
        const text = content.toLowerCase();
        const words = text.match(/\b\w+\b/g) || [];
        const keywordCount = (text.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;

        return {
            keyword,
            count: keywordCount,
            totalWords: words.length,
            density: ((keywordCount / words.length) * 100).toFixed(2) + '%',
            optimal: keywordCount / words.length >= 0.005 && keywordCount / words.length <= 0.025
        };
    }

    /**
     * Génère des suggestions de H2/H3 optimisés SEO
     */
    generateHeadingSuggestions(mainKeyword) {
        return [
            `Qu'est-ce que ${mainKeyword} ?`,
            `Comment fonctionne ${mainKeyword} ?`,
            `Les avantages de ${mainKeyword}`,
            `Guide complet sur ${mainKeyword}`,
            `${mainKeyword} : Les meilleures pratiques`,
            `Tout savoir sur ${mainKeyword}`
        ];
    }

    /**
     * Analyse la structure SEO du contenu
     */
    analyzeSEOStructure(content) {
        const analysis = {
            h1Count: (content.match(/<h1/g) || []).length,
            h2Count: (content.match(/<h2/g) || []).length,
            h3Count: (content.match(/<h3/g) || []).length,
            paragraphs: (content.match(/<p>/g) || []).length,
            images: (content.match(/<img/g) || []).length,
            links: (content.match(/<a/g) || []).length,
            wordCount: this.countWords(content),
            readabilityScore: this.calculateReadability(content)
        };

        analysis.recommendations = this.generateRecommendations(analysis);
        return analysis;
    }

    /**
     * Compte les mots
     */
    countWords(content) {
        const text = content.replace(/<[^>]*>/g, '');
        const words = text.match(/\b\w+\b/g) || [];
        return words.length;
    }

    /**
     * Calcule le score de lisibilité (simplifié)
     */
    calculateReadability(content) {
        const text = content.replace(/<[^>]*>/g, '');
        const sentences = text.split(/[.!?]+/).length;
        const words = this.countWords(content);
        const avgWordsPerSentence = words / sentences;

        // Score simple: plus c'est proche de 15-20 mots/phrase, mieux c'est
        if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
            return 'Excellent';
        } else if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
            return 'Bon';
        } else {
            return 'À améliorer';
        }
    }

    /**
     * Génère des recommandations SEO
     */
    generateRecommendations(analysis) {
        const reco = [];

        if (analysis.h1Count === 0) {
            reco.push('⚠️ Ajouter un titre H1');
        } else if (analysis.h1Count > 1) {
            reco.push('⚠️ Un seul H1 par page');
        }

        if (analysis.h2Count < 3) {
            reco.push('💡 Ajouter plus de H2 (min 3-5)');
        }

        if (analysis.wordCount < 500) {
            reco.push('💡 Augmenter le contenu (min 500 mots)');
        }

        if (analysis.images === 0) {
            reco.push('📷 Ajouter des images');
        }

        if (analysis.links < 3) {
            reco.push('🔗 Ajouter des liens internes/externes');
        }

        if (analysis.readabilityScore === 'À améliorer') {
            reco.push('📖 Améliorer la lisibilité (phrases plus courtes)');
        }

        return reco;
    }

    /**
     * Génère un meta title optimisé
     */
    optimizeMetaTitle(title, keyword, brandName) {
        let optimized = title;

        // S'assurer que le keyword est présent
        if (!title.toLowerCase().includes(keyword.toLowerCase())) {
            optimized = `${keyword} - ${title}`;
        }

        // Ajouter le brand si pas présent
        if (!optimized.includes(brandName)) {
            optimized += ` | ${brandName}`;
        }

        // Limiter à 60 caractères
        if (optimized.length > 60) {
            optimized = optimized.substring(0, 57) + '...';
        }

        return optimized;
    }

    /**
     * Génère une meta description optimisée
     */
    optimizeMetaDescription(text, keyword) {
        let desc = text.replace(/<[^>]*>/g, '').trim();

        // S'assurer que le keyword apparaît dans les 100 premiers caractères
        if (!desc.substring(0, 100).toLowerCase().includes(keyword.toLowerCase())) {
            desc = `${keyword}. ` + desc;
        }

        // Limiter à 155-160 caractères
        if (desc.length > 155) {
            desc = desc.substring(0, 152) + '...';
        }

        return desc;
    }

    /**
     * Génère des alt texts pour images
     */
    generateImageAltTexts(keyword, imageCount) {
        const alts = [];
        const variations = [
            keyword,
            `Guide ${keyword}`,
            `${keyword} en action`,
            `Illustration ${keyword}`,
            `Exemple de ${keyword}`,
            `Schéma ${keyword}`,
            `Infographie ${keyword}`
        ];

        for (let i = 0; i < imageCount && i < variations.length; i++) {
            alts.push(variations[i]);
        }

        return alts;
    }
}

module.exports = SEOEnricher;
