/**
 * Générateur intelligent de suggestions de contenu
 */
class ContentSuggester {
    constructor() {
        this.suggestionTypes = [
            'related_topics',
            'content_gaps',
            'trending_questions',
            'comparison_articles',
            'how_to_guides',
            'listicles'
        ];
    }

    /**
     * Génère des suggestions de contenu basées sur les keywords
     */
    generateSuggestions(keywords, existingArticles = []) {
        const suggestions = {
            relatedTopics: this.suggestRelatedTopics(keywords),
            contentGaps: this.identifyContentGaps(keywords, existingArticles),
            trendingQuestions: this.generateTrendingQuestions(keywords),
            comparisons: this.suggestComparisons(keywords),
            howToGuides: this.suggestHowToGuides(keywords),
            listicles: this.suggestListicles(keywords)
        };

        return suggestions;
    }

    suggestRelatedTopics(keywords) {
        const topics = new Set();

        keywords.forEach(keyword => {
            const words = keyword.split(' ');

            // Combiner les mots différemment
            if (words.length > 1) {
                words.forEach((word, i) => {
                    if (i < words.length - 1) {
                        topics.add(`${words[i]} ${words[i + 1]}`);
                    }
                });
            }

            // Ajouter des préfixes courants
            topics.add(`guide ${keyword}`);
            topics.add(`meilleur ${keyword}`);
            topics.add(`${keyword} 2024`);
        });

        return Array.from(topics).slice(0, 20);
    }

    identifyContentGaps(keywords, existingArticles) {
        const gaps = [];
        const existing = new Set(existingArticles.map(a => a.keyword.toLowerCase()));

        keywords.forEach(keyword => {
            if (!existing.has(keyword.toLowerCase())) {
                gaps.push({
                    keyword,
                    priority: this.calculatePriority(keyword, keywords),
                    reason: 'Mot-clé non couvert'
                });
            }
        });

        return gaps.slice(0, 15);
    }

    generateTrendingQuestions(keywords) {
        const questions = [];
        const questionWords = [
            'comment', 'pourquoi', 'quand', 'où', 'qui',
            'quel', 'quelle', 'combien', 'quoi'
        ];

        keywords.slice(0, 10).forEach(keyword => {
            questionWords.slice(0, 3).forEach(q => {
                questions.push(`${q} ${keyword}`);
            });
        });

        return questions.slice(0, 20);
    }

    suggestComparisons(keywords) {
        const comparisons = [];

        for (let i = 0; i < keywords.length && i < 5; i++) {
            for (let j = i + 1; j < keywords.length && j < 5; j++) {
                comparisons.push({
                    title: `${keywords[i]} vs ${keywords[j]}`,
                    keywords: [keywords[i], keywords[j]],
                    type: 'comparison'
                });
            }
        }

        return comparisons.slice(0, 10);
    }

    suggestHowToGuides(keywords) {
        return keywords.slice(0, 15).map(keyword => ({
            title: `Comment utiliser ${keyword}`,
            keyword,
            type: 'how-to'
        }));
    }

    suggestListicles(keywords) {
        const numbers = [5, 7, 10, 15, 20];
        const listicles = [];

        keywords.slice(0, 10).forEach(keyword => {
            const num = numbers[Math.floor(Math.random() * numbers.length)];
            listicles.push({
                title: `${num} astuces pour maîtriser ${keyword}`,
                keyword,
                count: num,
                type: 'listicle'
            });
        });

        return listicles;
    }

    calculatePriority(keyword, allKeywords) {
        const words = keyword.split(' ');
        let score = 0;

        // Plus de mots = généralement plus spécifique = plus intéressant
        score += words.length * 2;

        // Si contient des mots des autres keywords = bon pour maillage
        allKeywords.forEach(other => {
            if (other !== keyword) {
                const otherWords = other.split(' ');
                const common = words.filter(w => otherWords.includes(w));
                score += common.length;
            }
        });

        return score > 10 ? 'high' : score > 5 ? 'medium' : 'low';
    }

    /**
     * Génère un calendrier éditorial
     */
    generateEditorialCalendar(suggestions, weeksCount = 12) {
        const calendar = [];
        const allSuggestions = [
            ...suggestions.howToGuides,
            ...suggestions.listicles,
            ...suggestions.comparisons,
            ...suggestions.relatedTopics.map(t => ({ title: t, keyword: t, type: 'article' }))
        ];

        // Distribuer sur les semaines
        const itemsPerWeek = Math.ceil(allSuggestions.length / weeksCount);

        for (let week = 1; week <= weeksCount; week++) {
            const startIndex = (week - 1) * itemsPerWeek;
            const weekItems = allSuggestions.slice(startIndex, startIndex + itemsPerWeek);

            calendar.push({
                week,
                startDate: this.getWeekStart(week),
                items: weekItems,
                totalArticles: weekItems.length
            });
        }

        return calendar;
    }

    getWeekStart(weekNumber) {
        const today = new Date();
        const futureDate = new Date(today.getTime() + (weekNumber * 7 * 24 * 60 * 60 * 1000));
        return futureDate.toISOString().split('T')[0];
    }
}

module.exports = ContentSuggester;
