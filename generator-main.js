#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

// Import des modules locaux
const ApiClient = require('./lib/apiClient');
const ThemeAnalyzer = require('./lib/themeAnalyzer');
const ContentGenerator = require('./lib/contentGenerator');
const SiteBuilder = require('./lib/siteBuilder');
const TemplateEngine = require('./lib/templateEngine');
const ArticleGenerator = require('./lib/articleGenerator');

class SiteGeneratorMain {
    constructor(options = {}) {
        this.options = {
            domain: options.domain,
            keywordsFile: options.keywordsFile,
            apiKey: options.apiKey || process.env.PERPLEXITY_API_KEY,
            maxArticles: options.maxArticles || 50,
            articlesPerRun: options.articlesPerRun || 10,
            delayBetweenRequests: options.delayBetweenRequests || 3000,
            verbose: options.verbose || false,
            outputDir: options.outputDir,
            ...options
        };

        // Initialiser les modules
        this.apiClient = new ApiClient({
            apiKey: this.options.apiKey
        });

        this.themeAnalyzer = new ThemeAnalyzer(this.apiClient);
        this.contentGenerator = new ContentGenerator(this.apiClient);
        this.siteBuilder = new SiteBuilder();
        this.templateEngine = new TemplateEngine();
        this.articleGenerator = new ArticleGenerator(this.apiClient);

        this.keywords = [];
        this.stats = {
            startTime: null,
            endTime: null,
            totalFiles: 0,
            articlesGenerated: 0,
            pagesGenerated: 0,
            errors: []
        };
    }

    /**
     * Point d'entrée principal
     */
    async generate() {
        try {
            this.stats.startTime = new Date();
            console.log('🚀 Démarrage de la génération de site complet...\n');

            // 1. Validation des paramètres
            await this.validateInput();

            // 2. Initialisation des modules
            await this.initializeModules();

            // 3. Test de l'API
            await this.testApiConnection();

            // 4. Chargement et analyse des mots-clés
            const keywords = await this.loadKeywords();
            console.log(`📋 ${keywords.length} mots-clés chargés\n`);

            // 5. Analyse thématique
            console.log('🔍 Analyse thématique en cours...');
            const analysis = await this.themeAnalyzer.analyzeKeywords(keywords);
            console.log(`  ✅ Thème principal: ${analysis.theme}`);
            console.log(`  ✅ Type d'activité: ${analysis.businessType}`);
            console.log(`  ✅ Ton: ${analysis.tone}\n`);

            // 6. Génération du branding
            console.log('🎨 Génération du branding...');
            const branding = await this.themeAnalyzer.generateBranding(this.options.domain, analysis);
            console.log(`  ✅ Marque: ${branding.brandName}`);
            console.log(`  ✅ Slogan: ${branding.tagline}\n`);

            // 7. Détermination de la structure du site
            const siteStructure = this.themeAnalyzer.determineSiteStructure(analysis);
            console.log(`📐 Structure du site: ${siteStructure.pages.join(', ')}\n`);

            // 8. Génération du contenu des pages
            console.log('📝 Génération du contenu des pages...');
            const content = await this.contentGenerator.generateSiteContent(
                analysis,
                branding,
                keywords,
                siteStructure
            );
            this.stats.pagesGenerated = Object.keys(content.pages).length;
            console.log(`  ✅ ${this.stats.pagesGenerated} pages générées\n`);

            // 9. Construction du site
            console.log('🏗️  Construction du site...');
            const siteResult = await this.siteBuilder.buildSite(
                this.options.domain,
                analysis,
                branding,
                content,
                keywords  // NOUVEAU : on passe les keywords pour la sélection intelligente
            );
            console.log(`  ✅ Site construit dans: ${siteResult.outputDir}`);
            console.log(`  ✅ Framework: ${siteResult.framework}`);
            console.log(`  ✅ Layout: ${siteResult.layout.split('-')[1] || 'inconnu'}`);
            console.log(`  ✅ Couleurs: ${siteResult.colorScheme}\n`);

            // 10. Génération des articles de blog
            console.log('📰 Génération des articles de blog...');
            const articlesResult = await this.articleGenerator.generateArticles(
                keywords,
                siteResult.outputDir,
                branding,
                analysis,
                {
                    maxArticles: this.options.maxArticles,
                    delayBetweenArticles: this.options.delayBetweenRequests
                }
            );
            this.stats.articlesGenerated = articlesResult.generated;
            console.log(`  ✅ ${articlesResult.generated} articles générés`);

            if (articlesResult.failed.length > 0) {
                console.log(`  ⚠️  ${articlesResult.failed.length} échecs`);
            }

            // 11. Finalisation
            this.stats.endTime = new Date();
            await this.generateSummary(siteResult, analysis, branding, articlesResult);

            console.log('\n🎉 Génération terminée avec succès !');
            this.printFinalStats();

            return {
                success: true,
                outputDir: siteResult.outputDir,
                stats: this.stats,
                siteInfo: {
                    domain: this.options.domain,
                    theme: analysis.theme,
                    brand: branding.brandName,
                    framework: siteResult.framework,
                    pages: Object.keys(content.pages),
                    articles: articlesResult.generated
                }
            };

        } catch (error) {
            this.stats.errors.push({
                timestamp: new Date().toISOString(),
                error: error.message,
                stack: error.stack
            });

            console.error('\n❌ Erreur lors de la génération:', error.message);
            if (this.options.verbose) {
                console.error(error.stack);
            }

            return {
                success: false,
                error: error.message,
                stats: this.stats
            };
        }
    }

    /**
     * Valide les paramètres d'entrée
     */
    async validateInput() {
        if (!this.options.domain) {
            throw new Error('Nom de domaine requis (ex: monsite.com)');
        }

        if (!this.options.keywordsFile) {
            throw new Error('Fichier de mots-clés requis');
        }

        if (!this.options.apiKey) {
            throw new Error('Clé API Perplexity requise (PERPLEXITY_API_KEY)');
        }

        // Vérifier que le fichier de mots-clés existe
        try {
            await fs.access(this.options.keywordsFile);
        } catch (error) {
            throw new Error(`Fichier de mots-clés introuvable: ${this.options.keywordsFile}`);
        }

        // Valider le format du domaine
        try {
            new URL(`https://${this.options.domain}`);
        } catch (error) {
            throw new Error(`Format de domaine invalide: ${this.options.domain}`);
        }

        console.log('✅ Paramètres validés\n');
    }

    /**
     * Initialise tous les modules
     */
    async initializeModules() {
        console.log('⚙️  Initialisation des modules...');

        await Promise.all([
            this.themeAnalyzer.initialize(),
            this.contentGenerator.initialize(),
            this.siteBuilder.initialize(),
            this.templateEngine.initialize(),
            this.articleGenerator.initialize()
        ]);

        console.log('✅ Modules initialisés\n');
    }

    /**
     * Teste la connexion à l'API
     */
    async testApiConnection() {
        console.log('🔌 Test de la connexion API...');
        const isConnected = await this.apiClient.testConnection();

        if (!isConnected) {
            throw new Error('Impossible de se connecter à l\'API Perplexity');
        }

        console.log('✅ API connectée\n');
    }

    /**
     * Charge les mots-clés depuis le fichier
     */
    async loadKeywords() {
        const content = await fs.readFile(this.options.keywordsFile, 'utf8');

        this.keywords = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#'))
            .slice(0, 1000); // Limite de sécurité

        if (this.keywords.length === 0) {
            throw new Error('Aucun mot-clé trouvé dans le fichier');
        }

        return this.keywords;
    }

    /**
     * Génère un résumé du site créé
     */
    async generateSummary(siteResult, analysis, branding, articlesResult) {
        const summary = {
            generated_at: new Date().toISOString(),
            domain: this.options.domain,
            site_info: {
                theme: analysis.theme,
                business_type: analysis.businessType,
                tone: analysis.tone,
                brand_name: branding.brandName,
                tagline: branding.tagline
            },
            technical_info: {
                framework: siteResult.framework,
                layout: siteResult.layout,
                color_scheme: siteResult.colorScheme,
                pages_generated: this.stats.pagesGenerated,
                articles_generated: this.stats.articlesGenerated
            },
            files: {
                output_directory: siteResult.outputDir,
                pages: siteResult.pages,
                total_files: this.stats.pagesGenerated + this.stats.articlesGenerated + 2 // +2 pour blog.php et .htaccess
            },
            statistics: {
                keywords_processed: this.keywords.length,
                generation_time: this.getGenerationTime(),
                api_stats: this.apiClient.getStats(),
                errors: this.stats.errors.length
            }
        };

        const summaryPath = path.join(siteResult.outputDir, 'generation-summary.json');
        await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

        console.log(`📊 Résumé sauvegardé: ${summaryPath}`);
    }

    /**
     * Affiche les statistiques finales
     */
    printFinalStats() {
        const duration = this.getGenerationTime();
        const apiStats = this.apiClient.getStats();

        console.log('\n📊 STATISTIQUES FINALES');
        console.log('================================');
        console.log(`🌐 Domaine: ${this.options.domain}`);
        console.log(`⏱️  Durée: ${duration}`);
        console.log(`📄 Pages générées: ${this.stats.pagesGenerated}`);
        console.log(`📰 Articles générés: ${this.stats.articlesGenerated}`);
        console.log(`📊 Requêtes API: ${apiStats.totalRequests}`);
        console.log(`✅ Taux de réussite: ${apiStats.successRate}`);
        console.log(`⚡ Temps moyen API: ${apiStats.averageResponseTimeFormatted}`);
        console.log(`🎯 Tokens utilisés: ${apiStats.totalTokens}`);

        if (this.stats.errors.length > 0) {
            console.log(`❌ Erreurs: ${this.stats.errors.length}`);
        }

        console.log('================================\n');
    }

    /**
     * Calcule le temps de génération
     */
    getGenerationTime() {
        if (!this.stats.startTime || !this.stats.endTime) {
            return 'N/A';
        }

        const duration = this.stats.endTime - this.stats.startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);

        return `${minutes}m ${seconds}s`;
    }

    /**
     * Nettoie les ressources
     */
    cleanup() {
        // Nettoyer les caches si nécessaire
        this.templateEngine?.clearCache();
        console.log('🧹 Nettoyage effectué');
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log(`
🚀 Générateur de Sites Complets

Usage: node generator-main.js <domain> <keywords-file> [options]

Arguments:
  domain          Nom de domaine (ex: monsite.com)
  keywords-file   Chemin vers le fichier de mots-clés

Options:
  --api-key       Clé API Perplexity (ou PERPLEXITY_API_KEY env)
  --max-articles  Nombre max d'articles (défaut: 50)
  --verbose       Mode verbeux
  --output-dir    Dossier de sortie personnalisé

Exemples:
  node generator-main.js monsite.com keywords.txt
  node generator-main.js monsite.com keywords.txt --max-articles 100 --verbose

Variables d'environnement:
  PERPLEXITY_API_KEY    Clé API Perplexity
        `);
        process.exit(1);
    }

    const getArgValue = (argName) => {
        const index = args.indexOf(argName);
        return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
    };

    const options = {
        domain: args[0],
        keywordsFile: args[1],
        verbose: args.includes('--verbose'),
        maxArticles: parseInt(getArgValue('--max-articles')) || 50,
        apiKey: getArgValue('--api-key') || process.env.PERPLEXITY_API_KEY,
        outputDir: getArgValue('--output-dir') || undefined
    };

    const generator = new SiteGeneratorMain(options);

    // Gestion des signaux pour nettoyage
    process.on('SIGINT', () => {
        console.log('\n⚠️  Arrêt demandé...');
        generator.cleanup();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        generator.cleanup();
        process.exit(0);
    });

    try {
        const result = await generator.generate();
        process.exit(result.success ? 0 : 1);
    } catch (error) {
        console.error('Erreur fatale:', error.message);
        generator.cleanup();
        process.exit(1);
    }
}

// Export de la classe pour utilisation programmatique
module.exports = SiteGeneratorMain;

// Exécution CLI si le script est appelé directement
if (require.main === module) {
    main().catch(console.error);
}