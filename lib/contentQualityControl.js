/**
 * Système de Contrôle Qualité du Contenu
 * Analyse et note automatiquement la qualité du contenu généré
 */

class ContentQualityControl {
    constructor(config = {}) {
        this.config = {
            minQualityScore: config.minQualityScore || 70,
            minWordCount: config.minWordCount || 300,
            maxWordCount: config.maxWordCount || 5000,
            minReadabilityScore: config.minReadabilityScore || 60,
            minUniqueWords: config.minUniqueWords || 100,
            maxKeywordDensity: config.maxKeywordDensity || 3,
            minKeywordDensity: config.minKeywordDensity || 0.5,
            ...config
        };

        this.reports = [];
    }

    /**
     * Analyse complète de la qualité d'un contenu
     */
    async analyzeContent(content, metadata = {}) {
        const analysis = {
            timestamp: new Date().toISOString(),
            metadata,
            scores: {},
            warnings: [],
            errors: [],
            suggestions: []
        };

        // 1. Analyse de base
        analysis.basic = this.analyzeBasicMetrics(content);
        analysis.scores.basic = this.scoreBasicMetrics(analysis.basic);

        // 2. Analyse de lisibilité
        analysis.readability = this.analyzeReadability(content);
        analysis.scores.readability = this.scoreReadability(analysis.readability);

        // 3. Analyse SEO
        if (metadata.keyword) {
            analysis.seo = this.analyzeSEO(content, metadata.keyword);
            analysis.scores.seo = this.scoreSEO(analysis.seo);
        }

        // 4. Détection de contenu IA (patterns suspects)
        analysis.aiDetection = this.detectAIPatterns(content);
        analysis.scores.humanness = this.scoreHumanness(analysis.aiDetection);

        // 5. Analyse de diversité linguistique
        analysis.linguistic = this.analyzeLinguisticDiversity(content);
        analysis.scores.linguistic = this.scoreLinguistic(analysis.linguistic);

        // 6. Analyse de structure
        analysis.structure = this.analyzeStructure(content);
        analysis.scores.structure = this.scoreStructure(analysis.structure);

        // 7. Score global
        analysis.globalScore = this.calculateGlobalScore(analysis.scores);
        analysis.grade = this.getQualityGrade(analysis.globalScore);
        analysis.passed = analysis.globalScore >= this.config.minQualityScore;

        // 8. Génération des recommandations
        analysis.recommendations = this.generateRecommendations(analysis);

        // Sauvegarder le rapport
        this.reports.push(analysis);

        return analysis;
    }

    /**
     * Analyse des métriques de base
     */
    analyzeBasicMetrics(content) {
        const text = this.cleanText(content);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);

        return {
            totalCharacters: content.length,
            totalWords: words.length,
            totalSentences: sentences.length,
            totalParagraphs: paragraphs.length,
            avgWordsPerSentence: words.length / sentences.length,
            avgSentencesPerParagraph: sentences.length / paragraphs.length,
            avgWordLength: words.reduce((sum, w) => sum + w.length, 0) / words.length
        };
    }

    /**
     * Score des métriques de base
     */
    scoreBasicMetrics(metrics) {
        let score = 100;

        // Pénalité si trop court ou trop long
        if (metrics.totalWords < this.config.minWordCount) {
            score -= Math.min(30, (this.config.minWordCount - metrics.totalWords) / 10);
        } else if (metrics.totalWords > this.config.maxWordCount) {
            score -= Math.min(20, (metrics.totalWords - this.config.maxWordCount) / 100);
        }

        // Bonus si longueur optimale (1500-2500 mots)
        if (metrics.totalWords >= 1500 && metrics.totalWords <= 2500) {
            score += 10;
        }

        // Pénalité si phrases trop longues (>25 mots)
        if (metrics.avgWordsPerSentence > 25) {
            score -= 15;
        }

        // Pénalité si phrases trop courtes (<10 mots)
        if (metrics.avgWordsPerSentence < 10) {
            score -= 10;
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Analyse de lisibilité (Flesch Reading Ease adapté au français)
     */
    analyzeReadability(content) {
        const text = this.cleanText(content);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;

        // Formule de Flesch adaptée au français
        const fleschScore = 207 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

        return {
            fleschScore: Math.max(0, Math.min(100, fleschScore)),
            avgWordsPerSentence,
            avgSyllablesPerWord,
            totalSyllables: syllables,
            interpretation: this.interpretFleschScore(fleschScore)
        };
    }

    /**
     * Score de lisibilité
     */
    scoreReadability(readability) {
        // Un score Flesch entre 60-70 est idéal pour le web
        const target = 65;
        const distance = Math.abs(readability.fleschScore - target);

        if (distance <= 10) return 100;
        if (distance <= 20) return 90 - distance;
        if (distance <= 30) return 70 - (distance - 20);
        return Math.max(40, 70 - distance);
    }

    /**
     * Analyse SEO
     */
    analyzeSEO(content, keyword) {
        const text = this.cleanText(content);
        const lowerText = text.toLowerCase();
        const lowerKeyword = keyword.toLowerCase();

        // Compter les occurrences du mot-clé
        const keywordOccurrences = (lowerText.match(new RegExp(lowerKeyword, 'g')) || []).length;
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const keywordDensity = (keywordOccurrences / words.length) * 100;

        // Vérifier la présence dans les 100 premiers mots
        const first100Words = words.slice(0, 100).join(' ').toLowerCase();
        const keywordInIntro = first100Words.includes(lowerKeyword);

        // Vérifier la présence dans les titres
        const h1Matches = (content.match(/<h1[^>]*>.*?<\/h1>/gi) || []);
        const h2Matches = (content.match(/<h2[^>]*>.*?<\/h2>/gi) || []);
        const keywordInH1 = h1Matches.some(h => h.toLowerCase().includes(lowerKeyword));
        const keywordInH2 = h2Matches.some(h => h.toLowerCase().includes(lowerKeyword));

        // Analyser les variations du mot-clé
        const keywordVariations = this.findKeywordVariations(content, keyword);

        return {
            keyword,
            keywordOccurrences,
            keywordDensity: Number(keywordDensity.toFixed(2)),
            keywordInIntro,
            keywordInH1,
            keywordInH2,
            keywordVariations,
            headingsCount: {
                h1: h1Matches.length,
                h2: h2Matches.length,
                h3: (content.match(/<h3[^>]*>/gi) || []).length
            }
        };
    }

    /**
     * Score SEO
     */
    scoreSEO(seo) {
        let score = 100;

        // Densité de mots-clés
        if (seo.keywordDensity < this.config.minKeywordDensity) {
            score -= 20;
        } else if (seo.keywordDensity > this.config.maxKeywordDensity) {
            score -= 30; // Pénalité plus sévère pour sur-optimisation
        }

        // Présence dans l'intro
        if (!seo.keywordInIntro) score -= 15;

        // Présence dans les titres
        if (!seo.keywordInH1) score -= 10;
        if (!seo.keywordInH2) score -= 5;

        // Structure des headings
        if (seo.headingsCount.h1 !== 1) score -= 10;
        if (seo.headingsCount.h2 < 3) score -= 5;

        // Variations du mot-clé (bon signe)
        if (seo.keywordVariations.length >= 3) score += 10;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Détection de patterns IA
     */
    detectAIPatterns(content) {
        const patterns = {
            repetitiveStarts: this.detectRepetitiveStarts(content),
            overusedPhrases: this.detectOverusedPhrases(content),
            uniformSentences: this.detectUniformSentences(content),
            genericLanguage: this.detectGenericLanguage(content),
            lackOfPersonality: this.detectLackOfPersonality(content)
        };

        const suspicionScore = Object.values(patterns).reduce((sum, p) => sum + p.score, 0) / Object.keys(patterns).length;

        return {
            patterns,
            suspicionScore,
            likelyAI: suspicionScore > 60
        };
    }

    /**
     * Détecte les débuts de phrases répétitifs
     */
    detectRepetitiveStarts(content) {
        const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        const starts = sentences.map(s => s.split(/\s+/)[0].toLowerCase());

        const startFreq = {};
        starts.forEach(start => {
            startFreq[start] = (startFreq[start] || 0) + 1;
        });

        const maxRepetition = Math.max(...Object.values(startFreq));
        const repetitionRate = maxRepetition / sentences.length;

        return {
            score: Math.min(100, repetitionRate * 200),
            maxRepetition,
            repetitionRate: Number((repetitionRate * 100).toFixed(2))
        };
    }

    /**
     * Détecte les phrases surutilisées (jargon IA typique)
     */
    detectOverusedPhrases(content) {
        const aiPhrases = [
            'il est important de',
            'il faut noter que',
            'dans le monde',
            'de nos jours',
            'en effet',
            'par ailleurs',
            'de plus',
            'en outre',
            'solutions innovantes',
            'expertise approfondie',
            'expérience utilisateur',
            'améliorer significativement'
        ];

        const lowerContent = content.toLowerCase();
        let count = 0;

        aiPhrases.forEach(phrase => {
            const occurrences = (lowerContent.match(new RegExp(phrase, 'g')) || []).length;
            if (occurrences > 0) count += occurrences;
        });

        const words = content.split(/\s+/).length;
        const phraseRate = (count / words) * 100;

        return {
            score: Math.min(100, phraseRate * 50),
            count,
            phraseRate: Number(phraseRate.toFixed(2))
        };
    }

    /**
     * Détecte l'uniformité des phrases (mauvais signe)
     */
    detectUniformSentences(content) {
        const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
        const lengths = sentences.map(s => s.split(/\s+/).length);

        const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
        const stdDev = Math.sqrt(variance);

        // Plus la variance est faible, plus c'est suspect (phrases trop uniformes)
        const uniformityScore = Math.max(0, 100 - (stdDev * 5));

        return {
            score: uniformityScore,
            avgLength: Number(avg.toFixed(1)),
            stdDev: Number(stdDev.toFixed(2)),
            variance: Number(variance.toFixed(2))
        };
    }

    /**
     * Détecte le langage générique
     */
    detectGenericLanguage(content) {
        const genericWords = [
            'solution', 'service', 'qualité', 'excellence', 'professionnel',
            'expertise', 'innovation', 'performance', 'optimal', 'efficace'
        ];

        const words = this.cleanText(content).toLowerCase().split(/\s+/);
        const genericCount = words.filter(w => genericWords.includes(w)).length;
        const genericRate = (genericCount / words.length) * 100;

        return {
            score: Math.min(100, genericRate * 20),
            count: genericCount,
            rate: Number(genericRate.toFixed(2))
        };
    }

    /**
     * Détecte le manque de personnalité
     */
    detectLackOfPersonality(content) {
        const personalityMarkers = [
            /\?/g,  // Questions
            /!/g,   // Exclamations
            /\([^)]+\)/g,  // Parenthèses (apartés)
            /«[^»]+»/g,    // Citations
            /vous|votre|vos/gi,  // Adresse directe
            /\b(je|nous|on)\b/gi  // Première personne
        ];

        const text = this.cleanText(content);
        const words = text.split(/\s+/).length;
        let markerCount = 0;

        personalityMarkers.forEach(regex => {
            markerCount += (text.match(regex) || []).length;
        });

        const personalityScore = (markerCount / words) * 1000;

        return {
            score: Math.max(0, 100 - personalityScore),
            markerCount,
            personalityScore: Number(personalityScore.toFixed(2))
        };
    }

    /**
     * Score d'humanité (inverse de la détection IA)
     */
    scoreHumanness(aiDetection) {
        return Math.max(0, 100 - aiDetection.suspicionScore);
    }

    /**
     * Analyse de diversité linguistique
     */
    analyzeLinguisticDiversity(content) {
        const words = this.cleanText(content).toLowerCase().split(/\s+/);
        const uniqueWords = new Set(words);

        const lexicalDiversity = (uniqueWords.size / words.length) * 100;

        // Analyser la longueur des phrases
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceLengths = sentences.map(s => s.split(/\s+/).length);

        const minLength = Math.min(...sentenceLengths);
        const maxLength = Math.max(...sentenceLengths);
        const lengthRange = maxLength - minLength;

        return {
            uniqueWords: uniqueWords.size,
            totalWords: words.length,
            lexicalDiversity: Number(lexicalDiversity.toFixed(2)),
            sentenceLengthRange: lengthRange,
            minSentenceLength: minLength,
            maxSentenceLength: maxLength
        };
    }

    /**
     * Score de diversité linguistique
     */
    scoreLinguistic(linguistic) {
        let score = 100;

        // Diversité lexicale (idéal: 40-60%)
        if (linguistic.lexicalDiversity < 30) {
            score -= 20;
        } else if (linguistic.lexicalDiversity > 70) {
            score -= 10;
        } else if (linguistic.lexicalDiversity >= 40 && linguistic.lexicalDiversity <= 60) {
            score += 10;
        }

        // Variation de longueur de phrases (idéal: >20)
        if (linguistic.sentenceLengthRange < 10) {
            score -= 20;
        } else if (linguistic.sentenceLengthRange >= 20) {
            score += 10;
        }

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Analyse de structure
     */
    analyzeStructure(content) {
        return {
            hasH1: /<h1[^>]*>/i.test(content),
            h1Count: (content.match(/<h1[^>]*>/gi) || []).length,
            h2Count: (content.match(/<h2[^>]*>/gi) || []).length,
            h3Count: (content.match(/<h3[^>]*>/gi) || []).length,
            hasParagraphs: /<p[^>]*>/i.test(content),
            hasLists: /<(ul|ol)[^>]*>/i.test(content),
            hasBold: /<(strong|b)[^>]*>/i.test(content),
            hasLinks: /<a[^>]*>/i.test(content),
            hasImages: /<img[^>]*>/i.test(content)
        };
    }

    /**
     * Score de structure
     */
    scoreStructure(structure) {
        let score = 100;

        if (!structure.hasH1) score -= 20;
        if (structure.h1Count !== 1) score -= 10;
        if (structure.h2Count < 3) score -= 10;
        if (!structure.hasParagraphs) score -= 15;
        if (!structure.hasLists) score -= 5;
        if (!structure.hasBold) score -= 5;

        return Math.max(0, score);
    }

    /**
     * Calcule le score global
     */
    calculateGlobalScore(scores) {
        const weights = {
            basic: 0.15,
            readability: 0.20,
            seo: 0.20,
            humanness: 0.25,
            linguistic: 0.10,
            structure: 0.10
        };

        let globalScore = 0;
        Object.keys(weights).forEach(key => {
            if (scores[key] !== undefined) {
                globalScore += scores[key] * weights[key];
            }
        });

        return Number(globalScore.toFixed(2));
    }

    /**
     * Obtient le grade de qualité
     */
    getQualityGrade(score) {
        if (score >= 90) return { grade: 'A+', label: 'Excellent' };
        if (score >= 80) return { grade: 'A', label: 'Très Bon' };
        if (score >= 70) return { grade: 'B', label: 'Bon' };
        if (score >= 60) return { grade: 'C', label: 'Acceptable' };
        if (score >= 50) return { grade: 'D', label: 'Moyen' };
        return { grade: 'F', label: 'Insuffisant' };
    }

    /**
     * Génère des recommandations d'amélioration
     */
    generateRecommendations(analysis) {
        const recommendations = [];

        // Recommandations de base
        if (analysis.basic.totalWords < this.config.minWordCount) {
            recommendations.push({
                priority: 'high',
                category: 'length',
                message: `Contenu trop court (${analysis.basic.totalWords} mots). Visez au moins ${this.config.minWordCount} mots.`,
                action: 'Développer le contenu avec plus d\'exemples et détails.'
            });
        }

        // Recommandations de lisibilité
        if (analysis.readability.fleschScore < 50) {
            recommendations.push({
                priority: 'high',
                category: 'readability',
                message: 'Texte difficile à lire. Simplifiez les phrases.',
                action: 'Raccourcir les phrases et utiliser un vocabulaire plus simple.'
            });
        }

        // Recommandations SEO
        if (analysis.seo && analysis.seo.keywordDensity < this.config.minKeywordDensity) {
            recommendations.push({
                priority: 'medium',
                category: 'seo',
                message: `Densité de mot-clé trop faible (${analysis.seo.keywordDensity}%).`,
                action: `Intégrer naturellement le mot-clé "${analysis.seo.keyword}" plus souvent.`
            });
        }

        // Recommandations anti-IA
        if (analysis.aiDetection.suspicionScore > 60) {
            recommendations.push({
                priority: 'high',
                category: 'humanness',
                message: 'Le contenu semble généré par IA.',
                action: 'Varier davantage les structures de phrases, ajouter des anecdotes personnelles, poser des questions.'
            });
        }

        // Recommandations de diversité
        if (analysis.linguistic.lexicalDiversity < 35) {
            recommendations.push({
                priority: 'medium',
                category: 'diversity',
                message: 'Vocabulaire peu varié.',
                action: 'Utiliser plus de synonymes et varier les expressions.'
            });
        }

        // Recommandations de structure
        if (!analysis.structure.hasLists) {
            recommendations.push({
                priority: 'low',
                category: 'structure',
                message: 'Pas de listes à puces.',
                action: 'Ajouter des listes pour améliorer la lisibilité.'
            });
        }

        return recommendations.sort((a, b) => {
            const priorities = { high: 3, medium: 2, low: 1 };
            return priorities[b.priority] - priorities[a.priority];
        });
    }

    /**
     * Utilitaires
     */
    cleanText(content) {
        return content
            .replace(/<[^>]+>/g, ' ')  // Retirer HTML
            .replace(/\s+/g, ' ')       // Normaliser espaces
            .trim();
    }

    countSyllables(word) {
        word = word.toLowerCase();
        const vowels = 'aeiouyàâäéèêëïîôùûü';
        let count = 0;
        let previousWasVowel = false;

        for (let char of word) {
            const isVowel = vowels.includes(char);
            if (isVowel && !previousWasVowel) {
                count++;
            }
            previousWasVowel = isVowel;
        }

        return Math.max(1, count);
    }

    interpretFleschScore(score) {
        if (score >= 90) return 'Très facile';
        if (score >= 70) return 'Facile';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Moyennement difficile';
        if (score >= 30) return 'Difficile';
        return 'Très difficile';
    }

    findKeywordVariations(content, keyword) {
        const variations = new Set();
        const words = keyword.toLowerCase().split(/\s+/);

        // Chercher des variations du mot-clé
        const lowerContent = content.toLowerCase();

        // Pluriel/Singulier
        if (keyword.endsWith('s')) {
            if (lowerContent.includes(keyword.slice(0, -1))) {
                variations.add(keyword.slice(0, -1));
            }
        } else {
            if (lowerContent.includes(keyword + 's')) {
                variations.add(keyword + 's');
            }
        }

        return Array.from(variations);
    }

    /**
     * Génère un rapport détaillé
     */
    generateReport(analysis) {
        return `
═══════════════════════════════════════════════════════════════════
              RAPPORT DE QUALITÉ DU CONTENU
═══════════════════════════════════════════════════════════════════

SCORE GLOBAL: ${analysis.globalScore}/100 (${analysis.grade.grade} - ${analysis.grade.label})
STATUT: ${analysis.passed ? '✅ PASSÉ' : '❌ ÉCHOUÉ'}

───────────────────────────────────────────────────────────────────
SCORES DÉTAILLÉS
───────────────────────────────────────────────────────────────────

📊 Métriques de base:        ${analysis.scores.basic}/100
📖 Lisibilité:               ${analysis.scores.readability}/100
🔍 SEO:                      ${analysis.scores.seo || 'N/A'}/100
🤖 Humanité (Anti-IA):       ${analysis.scores.humanness}/100
💬 Diversité linguistique:   ${analysis.scores.linguistic}/100
🏗️  Structure:               ${analysis.scores.structure}/100

───────────────────────────────────────────────────────────────────
MÉTRIQUES CLÉS
───────────────────────────────────────────────────────────────────

Mots: ${analysis.basic.totalWords}
Phrases: ${analysis.basic.totalSentences}
Lisibilité (Flesch): ${analysis.readability.fleschScore.toFixed(1)} (${analysis.readability.interpretation})
${analysis.seo ? `Mot-clé: "${analysis.seo.keyword}" (${analysis.seo.keywordDensity}%)` : ''}
Détection IA: ${analysis.aiDetection.suspicionScore.toFixed(1)}% ${analysis.aiDetection.likelyAI ? '⚠️ SUSPECT' : '✅ OK'}

───────────────────────────────────────────────────────────────────
RECOMMANDATIONS (${analysis.recommendations.length})
───────────────────────────────────────────────────────────────────

${analysis.recommendations.map((r, i) => `
${i + 1}. [${r.priority.toUpperCase()}] ${r.message}
   → ${r.action}
`).join('')}

═══════════════════════════════════════════════════════════════════
`;
    }

    /**
     * Obtient tous les rapports
     */
    getAllReports() {
        return this.reports;
    }

    /**
     * Obtient les statistiques globales
     */
    getGlobalStats() {
        if (this.reports.length === 0) {
            return null;
        }

        const avgScore = this.reports.reduce((sum, r) => sum + r.globalScore, 0) / this.reports.length;
        const passRate = (this.reports.filter(r => r.passed).length / this.reports.length) * 100;

        return {
            totalReports: this.reports.length,
            averageScore: Number(avgScore.toFixed(2)),
            passRate: Number(passRate.toFixed(2)),
            grades: this.reports.reduce((acc, r) => {
                acc[r.grade.grade] = (acc[r.grade.grade] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

module.exports = ContentQualityControl;
