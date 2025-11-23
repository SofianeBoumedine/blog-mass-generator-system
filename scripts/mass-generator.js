#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const BulkGenerator = require('./bulk-generate.js');

class MassGenerator extends BulkGenerator {
    constructor(options = {}) {
        super({
            // Optimisations pour génération massive
            concurrency: options.concurrency || 10, // Augmenté à 10 par défaut
            delay: options.delay || 2000, // Réduit à 2s
            continueOnError: true,
            verbose: false,
            ...options
        });

        this.keywordsDir = options.keywordsDir || './keywords';
        this.domainGenerator = options.domainGenerator || this.defaultDomainGenerator.bind(this);
    }

    /**
     * 🚀 Génération massive automatique à partir d'un dossier de fichiers keywords
     */
    async generateFromKeywordsDirectory(keywordsDir) {
        console.log(`🚀 GÉNÉRATION MASSIVE AUTOMATIQUE`);
        console.log(`📁 Recherche de fichiers dans: ${keywordsDir}\n`);

        try {
            // 1. Découvrir tous les fichiers de mots-clés
            const keywordFiles = await this.discoverKeywordFiles(keywordsDir);

            if (keywordFiles.length === 0) {
                throw new Error(`Aucun fichier .txt trouvé dans ${keywordsDir}`);
            }

            console.log(`📄 ${keywordFiles.length} fichiers de mots-clés trouvés:`);
            keywordFiles.forEach((file, i) => console.log(`  ${i+1}. ${path.basename(file)}`));

            // 2. Générer automatiquement les configurations de sites
            const sites = await this.generateSiteConfigs(keywordFiles);

            console.log(`\n🌐 ${sites.length} sites à générer:`);
            sites.forEach((site, i) => console.log(`  ${i+1}. ${site.domain}`));

            // 3. Configuration optimisée pour la masse
            console.log(`\n⚙️ CONFIGURATION OPTIMISÉE:`);
            console.log(`  🚀 Concurrence: ${this.options.concurrency} sites en parallèle`);
            console.log(`  ⏱️ Délai entre lots: ${this.options.delay}ms`);
            console.log(`  🛡️ Continue sur erreur: ${this.options.continueOnError}`);

            // 4. Lancer la génération massive
            const startTime = Date.now();
            this.stats.startTime = new Date();
            this.stats.totalSites = sites.length;

            const results = await this.generateInBatches(sites, {});

            this.stats.endTime = new Date();
            const totalDuration = Date.now() - startTime;

            // 5. Afficher les résultats
            await this.displayMassResults(results, totalDuration);

            return {
                success: this.stats.failed === 0,
                results,
                stats: this.stats,
                duration: totalDuration
            };

        } catch (error) {
            console.error('❌ Erreur génération massive:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * 📁 Découvre tous les fichiers de mots-clés dans un dossier
     */
    async discoverKeywordFiles(directory) {
        try {
            const files = await fs.readdir(directory);
            const keywordFiles = [];

            for (const file of files) {
                const filePath = path.join(directory, file);
                const stats = await fs.stat(filePath);

                if (stats.isFile() && file.endsWith('.txt')) {
                    // Vérifier que le fichier contient des mots-clés valides
                    const content = await fs.readFile(filePath, 'utf8');
                    const keywords = content.trim().split('\n').filter(k => k.trim());

                    if (keywords.length > 0) {
                        keywordFiles.push(filePath);
                    }
                }
            }

            return keywordFiles.sort();
        } catch (error) {
            throw new Error(`Impossible de lire le dossier ${directory}: ${error.message}`);
        }
    }

    /**
     * 🏗️ Génère automatiquement les configurations de sites
     */
    async generateSiteConfigs(keywordFiles) {
        const sites = [];

        for (const keywordFile of keywordFiles) {
            // Lire le premier mot-clé pour générer le domaine
            const content = await fs.readFile(keywordFile, 'utf8');
            const firstKeyword = content.trim().split('\n')[0].trim();

            // Générer un domaine basé sur les mots-clés
            const domain = this.domainGenerator(firstKeyword, path.basename(keywordFile, '.txt'));

            sites.push({
                domain,
                keywordsFile: keywordFile,
                outputDir: path.join(this.options.outputBaseDir, domain),
                maxArticles: 30, // Optimisé pour la vitesse
                delayBetweenRequests: 1500 // Réduit pour aller plus vite
            });
        }

        return sites;
    }

    /**
     * 🎯 Générateur de domaine par défaut
     */
    defaultDomainGenerator(keyword, filename) {
        // Nettoyer le mot-clé principal
        const cleanKeyword = keyword
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 20);

        // Utiliser le nom du fichier comme base
        const cleanFilename = filename
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .substring(0, 15);

        // Générer le domaine
        const domain = `${cleanFilename}-${cleanKeyword}.com`
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');

        return domain;
    }

    /**
     * 📊 Affichage des résultats optimisé pour la masse
     */
    async displayMassResults(results, totalDuration) {
        console.log('\n' + '='.repeat(80));
        console.log('🚀 RÉSULTATS DE LA GÉNÉRATION MASSIVE');
        console.log('='.repeat(80));

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        console.log(`📊 STATISTIQUES GLOBALES:`);
        console.log(`  🌐 Sites traités: ${results.length}`);
        console.log(`  ✅ Réussis: ${successful.length}`);
        console.log(`  ❌ Échecs: ${failed.length}`);
        console.log(`  📈 Taux de réussite: ${(successful.length / results.length * 100).toFixed(1)}%`);
        console.log(`  ⏱️ Durée totale: ${this.formatDuration(totalDuration)}`);

        if (successful.length > 0) {
            const avgDuration = successful.reduce((sum, r) => sum + r.duration, 0) / successful.length;
            console.log(`  ⚡ Temps moyen par site: ${this.formatDuration(avgDuration)}`);
            console.log(`  🚄 Vitesse: ${(successful.length / (totalDuration / 1000 / 60)).toFixed(1)} sites/min`);
        }

        // Performance par lot
        console.log(`\n⚙️ PERFORMANCE:`);
        console.log(`  🔧 Concurrence utilisée: ${this.options.concurrency}`);
        console.log(`  🔄 Nombre de lots: ${Math.ceil(results.length / this.options.concurrency)}`);

        if (failed.length > 0) {
            console.log(`\n❌ ÉCHECS (${failed.length}):`);
            failed.forEach((result, i) => {
                console.log(`  ${i+1}. ${result.domain}: ${result.error}`);
            });
        }

        // Top sites générés le plus rapidement
        if (successful.length > 0) {
            const fastestSites = successful
                .sort((a, b) => a.duration - b.duration)
                .slice(0, 5);

            console.log(`\n⚡ TOP 5 SITES LES PLUS RAPIDES:`);
            fastestSites.forEach((site, i) => {
                console.log(`  ${i+1}. ${site.domain} (${this.formatDuration(site.duration)})`);
            });
        }

        // Sauvegarder le rapport
        await this.saveMassReport(results, totalDuration);

        console.log('\n' + '='.repeat(80));
    }

    /**
     * 💾 Sauvegarde rapport optimisé pour génération massive
     */
    async saveMassReport(results, totalDuration) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = path.join(this.options.outputBaseDir, `mass-generation-report-${timestamp}.json`);

        const report = {
            generated_at: new Date().toISOString(),
            generation_type: 'MASS_GENERATION',
            total_duration_ms: totalDuration,
            options: this.options,
            stats: {
                ...this.stats,
                sites_per_minute: results.filter(r => r.success).length / (totalDuration / 1000 / 60),
                average_duration_per_site: results.filter(r => r.success).reduce((sum, r) => sum + r.duration, 0) / results.filter(r => r.success).length
            },
            performance: {
                concurrency: this.options.concurrency,
                batches: Math.ceil(results.length / this.options.concurrency),
                delay_between_batches: this.options.delay
            },
            results: results.map(r => ({
                domain: r.domain,
                success: r.success,
                duration: r.duration,
                outputDir: r.outputDir,
                error: r.error,
                theme: r.siteInfo?.theme,
                articles: r.siteInfo?.articles
            }))
        };

        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        console.log(`\n📊 Rapport de génération massive: ${reportFile}`);
    }
}

// Interface CLI avancée
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
        console.log(`
🚀 GÉNÉRATEUR MASSIF - Blog Mass Generator v2.0

Usage: node mass-generator.js [options]

Options de performance:
  --keywords-dir <dir>     Dossier contenant les fichiers .txt (défaut: ./keywords)
  --output-dir <dir>       Dossier de sortie (défaut: ./output)
  --concurrency <n>        Sites en parallèle (défaut: 10, max recommandé: 50)
  --delay <ms>             Délai entre lots (défaut: 2000, min: 1000)
  --max-articles <n>       Articles par site (défaut: 30)
  --turbo                  Mode turbo (concurrency=25, delay=1000)
  --extreme                Mode extrême (concurrency=50, delay=500) ⚠️

Exemples:
  # Génération standard (10 sites parallèles)
  node mass-generator.js

  # Génération rapide (25 sites parallèles)
  node mass-generator.js --turbo

  # Génération extrême (50 sites parallèles) ⚠️
  node mass-generator.js --extreme

  # Configuration personnalisée
  node mass-generator.js --concurrency 20 --delay 1500 --keywords-dir ./mes-keywords

  # Pour 100 fichiers keywords différents:
  node mass-generator.js --concurrency 25 --delay 1000 --keywords-dir ./100-keywords

Structure attendue:
  ./keywords/
    ├── chatons.txt
    ├── cuisine.txt
    ├── tech.txt
    └── ... (tous tes fichiers .txt)

⚠️  ATTENTION PERFORMANCE:
- Concurrency 10-25: Recommandé pour usage normal
- Concurrency 25-50: Pour machines puissantes
- Concurrency 50+: Peut surcharger l'API
        `);
        return;
    }

    // Gestion des modes prédéfinis
    let concurrency = 10;
    let delay = 2000;

    if (args.includes('--turbo')) {
        concurrency = 25;
        delay = 1000;
        console.log('🚄 MODE TURBO ACTIVÉ (25 sites parallèles)');
    } else if (args.includes('--extreme')) {
        concurrency = 50;
        delay = 500;
        console.log('⚡ MODE EXTRÊME ACTIVÉ (50 sites parallèles) - ATTENTION!');
    }

    // Options personnalisées
    if (args.includes('--concurrency')) {
        const index = args.indexOf('--concurrency');
        if (index !== -1 && index + 1 < args.length) {
            concurrency = parseInt(args[index + 1]) || concurrency;
        }
    }
    if (args.includes('--delay')) {
        const index = args.indexOf('--delay');
        if (index !== -1 && index + 1 < args.length) {
            delay = parseInt(args[index + 1]) || delay;
        }
    }

    const getArgValue = (flag, defaultValue) => {
        const index = args.indexOf(flag);
        return index !== -1 && index + 1 < args.length ? args[index + 1] : defaultValue;
    };

    const options = {
        keywordsDir: getArgValue('--keywords-dir', './keywords'),
        outputBaseDir: getArgValue('--output-dir', './output'),
        concurrency,
        delay,
        maxArticles: parseInt(getArgValue('--max-articles', '30')) || 30
    };

    const generator = new MassGenerator(options);

    try {
        console.log('🚀 DÉMARRAGE DE LA GÉNÉRATION MASSIVE\n');

        const result = await generator.generateFromKeywordsDirectory(options.keywordsDir);

        if (result.success) {
            console.log('\n🎉 GÉNÉRATION MASSIVE TERMINÉE AVEC SUCCÈS !');
            process.exit(0);
        } else {
            console.log('\n❌ GÉNÉRATION MASSIVE ÉCHOUÉE');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Erreur fatale:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = MassGenerator;