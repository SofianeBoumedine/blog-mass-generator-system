/**
 * Module d'Optimisation SEO Avancé
 * Améliore automatiquement le référencement des sites générés
 */

const fs = require('fs').promises;
const path = require('path');

class SEOOptimizer {
    constructor() {
        this.config = {
            minTitleLength: 30,
            maxTitleLength: 60,
            minDescriptionLength: 120,
            maxDescriptionLength: 160,
            minKeywordDensity: 0.5,
            maxKeywordDensity: 3,
            minContentLength: 300,
            optimalContentLength: 1500
        };

        this.structuredDataTypes = {
            article: this.generateArticleSchema,
            organization: this.generateOrganizationSchema,
            website: this.generateWebsiteSchema,
            breadcrumb: this.generateBreadcrumbSchema,
            faq: this.generateFAQSchema,
            product: this.generateProductSchema,
            localBusiness: this.generateLocalBusinessSchema
        };
    }

    /**
     * Optimise le SEO d'une page complète
     */
    async optimizePage(pageData) {
        const optimizations = {
            meta: await this.optimizeMetaTags(pageData),
            content: await this.optimizeContent(pageData.content, pageData.keyword),
            structure: await this.optimizeStructure(pageData.content),
            schema: await this.generateAllSchemas(pageData),
            performance: await this.optimizePerformance(pageData),
            social: await this.optimizeSocialMedia(pageData),
            technical: await this.optimizeTechnicalSEO(pageData)
        };

        return {
            ...pageData,
            seo: optimizations,
            score: this.calculateSEOScore(optimizations)
        };
    }

    /**
     * Optimise les meta tags
     */
    async optimizeMetaTags(pageData) {
        const { title, description, keywords } = pageData;

        // Optimisation du titre
        let optimizedTitle = this.optimizeTitle(title, pageData.keyword);

        // Optimisation de la description
        let optimizedDescription = this.optimizeDescription(description, pageData.keyword);

        // Génération des mots-clés optimisés
        let optimizedKeywords = this.optimizeKeywords(keywords, pageData.keyword);

        return {
            title: optimizedTitle,
            description: optimizedDescription,
            keywords: optimizedKeywords,
            robots: 'index, follow',
            canonical: pageData.url || '',
            author: pageData.author || '',
            viewport: 'width=device-width, initial-scale=1.0',
            charset: 'UTF-8',
            language: pageData.language || 'fr',
            revisitAfter: '7 days',
            rating: 'general',
            distribution: 'global'
        };
    }

    /**
     * Optimise le titre
     */
    optimizeTitle(title, keyword) {
        // Nettoyer le titre
        let optimized = title.trim();

        // S'assurer que le mot-clé principal est présent
        if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
            optimized = `${keyword} - ${optimized}`;
        }

        // Ajuster la longueur
        if (optimized.length < this.config.minTitleLength) {
            optimized += ` | Guide Complet ${new Date().getFullYear()}`;
        } else if (optimized.length > this.config.maxTitleLength) {
            optimized = optimized.substring(0, this.config.maxTitleLength - 3) + '...';
        }

        // Capitaliser la première lettre
        return optimized.charAt(0).toUpperCase() + optimized.slice(1);
    }

    /**
     * Optimise la description
     */
    optimizeDescription(description, keyword) {
        let optimized = description.trim();

        // S'assurer que le mot-clé est présent
        if (!optimized.toLowerCase().includes(keyword.toLowerCase())) {
            optimized = `${keyword}: ${optimized}`;
        }

        // Ajuster la longueur
        if (optimized.length < this.config.minDescriptionLength) {
            optimized += ` Découvrez tout ce qu'il faut savoir sur ${keyword}.`;
        } else if (optimized.length > this.config.maxDescriptionLength) {
            optimized = optimized.substring(0, this.config.maxDescriptionLength - 3) + '...';
        }

        // Ajouter un CTA si possible
        if (optimized.length <= this.config.maxDescriptionLength - 20) {
            optimized += ' En savoir plus.';
        }

        return optimized;
    }

    /**
     * Optimise les mots-clés
     */
    optimizeKeywords(keywords, mainKeyword) {
        let keywordList = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());

        // Ajouter le mot-clé principal s'il n'est pas présent
        if (!keywordList.includes(mainKeyword)) {
            keywordList.unshift(mainKeyword);
        }

        // Ajouter des variantes
        const variants = this.generateKeywordVariants(mainKeyword);
        keywordList = [...new Set([...keywordList, ...variants])];

        // Limiter à 10 mots-clés
        return keywordList.slice(0, 10).join(', ');
    }

    /**
     * Génère des variantes de mots-clés
     */
    generateKeywordVariants(keyword) {
        const variants = [];
        const words = keyword.split(' ');

        // Singulier/Pluriel
        if (keyword.endsWith('s')) {
            variants.push(keyword.slice(0, -1));
        } else {
            variants.push(keyword + 's');
        }

        // Avec/Sans accents
        variants.push(this.removeAccents(keyword));

        // Ordre des mots inversé (pour 2 mots)
        if (words.length === 2) {
            variants.push(`${words[1]} ${words[0]}`);
        }

        // Synonymes courants
        const synonymMap = {
            'meilleur': 'top',
            'guide': 'tutoriel',
            'conseil': 'astuce',
            'acheter': 'commander',
            'prix': 'tarif'
        };

        words.forEach(word => {
            if (synonymMap[word]) {
                variants.push(keyword.replace(word, synonymMap[word]));
            }
        });

        return [...new Set(variants)];
    }

    /**
     * Optimise le contenu
     */
    async optimizeContent(content, keyword) {
        const analysis = {
            length: content.length,
            wordCount: content.split(/\s+/).length,
            keywordDensity: this.calculateKeywordDensity(content, keyword),
            headings: this.analyzeHeadings(content),
            images: this.analyzeImages(content),
            links: this.analyzeLinks(content),
            readability: this.calculateReadability(content)
        };

        const recommendations = [];

        // Vérifier la longueur du contenu
        if (analysis.wordCount < this.config.minContentLength) {
            recommendations.push('Augmenter la longueur du contenu (min. 300 mots)');
        }

        // Vérifier la densité de mots-clés
        if (analysis.keywordDensity < this.config.minKeywordDensity) {
            recommendations.push(`Augmenter l'utilisation du mot-clé "${keyword}"`);
        } else if (analysis.keywordDensity > this.config.maxKeywordDensity) {
            recommendations.push('Réduire la sur-optimisation du mot-clé');
        }

        // Vérifier les headings
        if (!analysis.headings.h1) {
            recommendations.push('Ajouter un titre H1');
        }
        if (analysis.headings.h2Count < 2) {
            recommendations.push('Ajouter plus de sous-titres H2');
        }

        // Vérifier les images
        if (analysis.images.withoutAlt > 0) {
            recommendations.push(`Ajouter des attributs alt à ${analysis.images.withoutAlt} image(s)`);
        }

        return {
            analysis,
            recommendations,
            optimized: this.injectKeywordVariations(content, keyword)
        };
    }

    /**
     * Calcule la densité de mots-clés
     */
    calculateKeywordDensity(content, keyword) {
        const words = content.toLowerCase().split(/\s+/);
        const keywordCount = content.toLowerCase().split(keyword.toLowerCase()).length - 1;
        return ((keywordCount / words.length) * 100).toFixed(2);
    }

    /**
     * Analyse les headings
     */
    analyzeHeadings(content) {
        return {
            h1: (content.match(/<h1[^>]*>/gi) || []).length,
            h2Count: (content.match(/<h2[^>]*>/gi) || []).length,
            h3Count: (content.match(/<h3[^>]*>/gi) || []).length,
            total: (content.match(/<h[1-6][^>]*>/gi) || []).length
        };
    }

    /**
     * Analyse les images
     */
    analyzeImages(content) {
        const images = content.match(/<img[^>]*>/gi) || [];
        const withoutAlt = images.filter(img => !img.includes('alt=')).length;

        return {
            total: images.length,
            withoutAlt,
            optimized: images.length - withoutAlt
        };
    }

    /**
     * Analyse les liens
     */
    analyzeLinks(content) {
        const links = content.match(/<a[^>]*>/gi) || [];
        const external = links.filter(link => link.includes('http')).length;
        const internal = links.length - external;
        const nofollow = links.filter(link => link.includes('nofollow')).length;

        return {
            total: links.length,
            internal,
            external,
            nofollow
        };
    }

    /**
     * Calcule la lisibilité (Flesch Reading Ease adapté au français)
     */
    calculateReadability(content) {
        const cleanText = content.replace(/<[^>]*>/g, '');
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim()).length;
        const words = cleanText.split(/\s+/).filter(w => w).length;
        const syllables = this.countSyllables(cleanText);

        const avgWordsPerSentence = words / sentences;
        const avgSyllablesPerWord = syllables / words;

        // Score de Flesch adapté
        const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

        return {
            score: Math.max(0, Math.min(100, score)),
            level: this.getReadabilityLevel(score),
            avgWordsPerSentence,
            avgSyllablesPerWord
        };
    }

    /**
     * Compte les syllabes (approximation)
     */
    countSyllables(text) {
        const words = text.toLowerCase().split(/\s+/);
        let totalSyllables = 0;

        words.forEach(word => {
            // Approximation simple pour le français
            const vowels = word.match(/[aeiouy]/gi);
            totalSyllables += vowels ? vowels.length : 1;
        });

        return totalSyllables;
    }

    /**
     * Détermine le niveau de lisibilité
     */
    getReadabilityLevel(score) {
        if (score >= 90) return 'Très facile';
        if (score >= 80) return 'Facile';
        if (score >= 70) return 'Assez facile';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Assez difficile';
        if (score >= 30) return 'Difficile';
        return 'Très difficile';
    }

    /**
     * Génère tous les schemas structurés
     */
    async generateAllSchemas(pageData) {
        const schemas = [];

        // Schema Article
        if (pageData.type === 'article' || pageData.type === 'blog') {
            schemas.push(this.generateArticleSchema(pageData));
        }

        // Schema Organization
        schemas.push(this.generateOrganizationSchema(pageData));

        // Schema Website
        schemas.push(this.generateWebsiteSchema(pageData));

        // Schema Breadcrumb
        if (pageData.breadcrumbs) {
            schemas.push(this.generateBreadcrumbSchema(pageData));
        }

        // Schema FAQ si présent
        if (pageData.faq) {
            schemas.push(this.generateFAQSchema(pageData));
        }

        return schemas;
    }

    /**
     * Génère le schema Article
     */
    generateArticleSchema(data) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': data.title,
            'description': data.description,
            'keywords': data.keywords,
            'author': {
                '@type': 'Person',
                'name': data.author || 'Auteur'
            },
            'datePublished': data.publishDate || new Date().toISOString(),
            'dateModified': data.modifiedDate || new Date().toISOString(),
            'publisher': {
                '@type': 'Organization',
                'name': data.brandName,
                'logo': {
                    '@type': 'ImageObject',
                    'url': data.logoUrl || '/logo.png'
                }
            },
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': data.url
            },
            'image': data.featuredImage || '/default-image.jpg',
            'articleSection': data.category || 'General',
            'wordCount': data.wordCount || 1000,
            'inLanguage': 'fr-FR'
        };
    }

    /**
     * Génère le schema Organization
     */
    generateOrganizationSchema(data) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': data.brandName,
            'url': data.siteUrl,
            'logo': data.logoUrl || '/logo.png',
            'description': data.brandDescription,
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': data.phone || '+33-1-23-45-67-89',
                'contactType': 'customer service',
                'areaServed': 'FR',
                'availableLanguage': ['French']
            },
            'sameAs': [
                data.facebook || '',
                data.twitter || '',
                data.linkedin || '',
                data.instagram || ''
            ].filter(url => url)
        };
    }

    /**
     * Génère le schema Website
     */
    generateWebsiteSchema(data) {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': data.siteName || data.brandName,
            'url': data.siteUrl,
            'description': data.siteDescription,
            'publisher': {
                '@type': 'Organization',
                'name': data.brandName
            },
            'potentialAction': {
                '@type': 'SearchAction',
                'target': {
                    '@type': 'EntryPoint',
                    'urlTemplate': `${data.siteUrl}/search?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
            },
            'inLanguage': 'fr-FR'
        };
    }

    /**
     * Génère le schema Breadcrumb
     */
    generateBreadcrumbSchema(data) {
        const items = data.breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
                '@id': crumb.url,
                'name': crumb.name
            }
        }));

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': items
        };
    }

    /**
     * Génère le schema FAQ
     */
    generateFAQSchema(data) {
        const questions = data.faq.map(item => ({
            '@type': 'Question',
            'name': item.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.answer
            }
        }));

        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': questions
        };
    }

    /**
     * Optimise les performances
     */
    async optimizePerformance(pageData) {
        return {
            lazyLoading: true,
            minification: true,
            compression: 'gzip',
            caching: {
                strategy: 'aggressive',
                maxAge: 31536000, // 1 an
                sMaxAge: 86400 // 1 jour pour CDN
            },
            criticalCSS: true,
            preload: [
                { rel: 'preload', as: 'style', href: '/css/critical.css' },
                { rel: 'preload', as: 'font', href: '/fonts/main.woff2', crossorigin: 'anonymous' }
            ],
            prefetch: [
                { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
            ]
        };
    }

    /**
     * Optimise pour les réseaux sociaux
     */
    async optimizeSocialMedia(pageData) {
        return {
            openGraph: {
                'og:type': pageData.type || 'website',
                'og:title': pageData.title,
                'og:description': pageData.description,
                'og:image': pageData.featuredImage || '/og-image.jpg',
                'og:url': pageData.url,
                'og:site_name': pageData.siteName,
                'og:locale': 'fr_FR'
            },
            twitter: {
                'twitter:card': 'summary_large_image',
                'twitter:title': pageData.title,
                'twitter:description': pageData.description,
                'twitter:image': pageData.twitterImage || pageData.featuredImage,
                'twitter:site': pageData.twitterHandle,
                'twitter:creator': pageData.authorTwitter
            },
            facebook: {
                'fb:app_id': pageData.fbAppId || '',
                'fb:pages': pageData.fbPageId || ''
            }
        };
    }

    /**
     * Optimisations techniques SEO
     */
    async optimizeTechnicalSEO(pageData) {
        return {
            sitemap: {
                priority: pageData.priority || 0.8,
                changefreq: pageData.changefreq || 'weekly',
                lastmod: new Date().toISOString()
            },
            robots: {
                index: true,
                follow: true,
                'max-snippet': -1,
                'max-image-preview': 'large',
                'max-video-preview': -1
            },
            canonicalUrl: pageData.canonical || pageData.url,
            alternateLanguages: pageData.languages || [],
            mobileOptimization: {
                viewport: 'width=device-width, initial-scale=1.0',
                mobileFirst: true,
                touchIcons: true
            },
            security: {
                https: true,
                hsts: true,
                csp: true
            }
        };
    }

    /**
     * Calcule le score SEO global
     */
    calculateSEOScore(optimizations) {
        let score = 0;
        let maxScore = 0;

        // Meta tags (25 points)
        maxScore += 25;
        if (optimizations.meta.title.length >= 30 && optimizations.meta.title.length <= 60) score += 10;
        if (optimizations.meta.description.length >= 120 && optimizations.meta.description.length <= 160) score += 10;
        if (optimizations.meta.keywords) score += 5;

        // Contenu (30 points)
        maxScore += 30;
        const contentAnalysis = optimizations.content.analysis;
        if (contentAnalysis.wordCount >= 300) score += 10;
        if (contentAnalysis.keywordDensity >= 0.5 && contentAnalysis.keywordDensity <= 3) score += 10;
        if (contentAnalysis.headings.h1 === 1) score += 5;
        if (contentAnalysis.headings.h2Count >= 2) score += 5;

        // Structure (15 points)
        maxScore += 15;
        if (contentAnalysis.images.withoutAlt === 0) score += 5;
        if (contentAnalysis.links.internal >= 2) score += 5;
        if (contentAnalysis.readability.score >= 60) score += 5;

        // Schema (10 points)
        maxScore += 10;
        if (optimizations.schema.length >= 2) score += 10;

        // Performance (10 points)
        maxScore += 10;
        if (optimizations.performance.lazyLoading) score += 5;
        if (optimizations.performance.criticalCSS) score += 5;

        // Social (5 points)
        maxScore += 5;
        if (optimizations.social.openGraph) score += 2.5;
        if (optimizations.social.twitter) score += 2.5;

        // Technical (5 points)
        maxScore += 5;
        if (optimizations.technical.canonicalUrl) score += 2.5;
        if (optimizations.technical.security.https) score += 2.5;

        const percentage = (score / maxScore) * 100;

        return {
            score: Math.round(percentage),
            grade: this.getGrade(percentage),
            details: {
                obtained: score,
                maximum: maxScore
            }
        };
    }

    /**
     * Détermine la note SEO
     */
    getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }

    /**
     * Supprime les accents
     */
    removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Injecte des variations de mots-clés dans le contenu
     */
    injectKeywordVariations(content, keyword) {
        // Cette fonction pourrait être plus sophistiquée
        // Pour l'instant, on retourne le contenu tel quel
        return content;
    }

    /**
     * Génère un rapport SEO complet
     */
    async generateSEOReport(pageData) {
        const optimized = await this.optimizePage(pageData);

        return {
            url: pageData.url,
            timestamp: new Date().toISOString(),
            score: optimized.score,
            optimizations: optimized.seo,
            recommendations: this.generateRecommendations(optimized),
            competitorAnalysis: await this.analyzeCompetitors(pageData.keyword),
            estimatedTraffic: this.estimateTraffic(optimized.score.score)
        };
    }

    /**
     * Génère des recommandations personnalisées
     */
    generateRecommendations(optimized) {
        const recommendations = [];

        if (optimized.score.score < 80) {
            recommendations.push({
                priority: 'haute',
                action: 'Améliorer les méta-descriptions',
                impact: '+15% de CTR'
            });
        }

        if (optimized.seo.content.analysis.wordCount < 1500) {
            recommendations.push({
                priority: 'moyenne',
                action: 'Augmenter la longueur du contenu',
                impact: '+20% de temps sur page'
            });
        }

        return recommendations;
    }

    /**
     * Analyse de la concurrence (placeholder)
     */
    async analyzeCompetitors(keyword) {
        // Cette fonction pourrait faire une vraie analyse
        return {
            topCompetitors: [
                { domain: 'example.com', score: 85 },
                { domain: 'competitor.fr', score: 78 }
            ],
            averageScore: 81,
            opportunities: ['Meilleur contenu', 'Plus de backlinks']
        };
    }

    /**
     * Estime le trafic potentiel
     */
    estimateTraffic(seoScore) {
        const baseTraffic = 1000;
        const multiplier = seoScore / 50;
        return Math.round(baseTraffic * multiplier);
    }
}

module.exports = SEOOptimizer;