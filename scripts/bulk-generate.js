#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const SiteGeneratorMain = require('../generator-main');

class BulkGenerator {
    constructor(options = {}) {
        this.options = {
            concurrency: options.concurrency || 3,
            delay: options.delay || 5000,
            continueOnError: options.continueOnError !== false,
            outputBaseDir: options.outputBaseDir || process.cwd(),
            verbose: options.verbose || false,
            ...options
        };

        this.stats = {
            startTime: null,
            endTime: null,
            totalSites: 0,
            successful: 0,
            failed: 0,
            sites: []
        };
    }

    /**
     * Génère plusieurs sites à partir d'un fichier de configuration
     */
    async generateFromConfig(configFile) {
        console.log(`🚀 Génération en lot à partir de: ${configFile}\n`);

        try {
            const config = await this.loadConfig(configFile);
            await this.validateConfig(config);

            this.stats.startTime = new Date();
            this.stats.totalSites = config.sites.length;

            console.log(`📊 ${config.sites.length} sites à générer`);
            console.log(`⚙️  Concurrence: ${this.options.concurrency}`);
            console.log(`⏱️  Délai entre lots: ${this.options.delay}ms\n`);

            // Générer les sites par lots
            const results = await this.generateInBatches(config.sites, config.global || {});

            this.stats.endTime = new Date();

            // Afficher le résumé
            await this.displaySummary(results);

            return {
                success: this.stats.failed === 0,
                results,
                stats: this.stats
            };

        } catch (error) {
            console.error('❌ Erreur lors de la génération en lot:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Génère plusieurs sites à partir d'une liste de domaines
     */
    async generateFromDomains(domains, keywordsFile, globalOptions = {}) {
        console.log(`🚀 Génération en lot pour ${domains.length} domaines\n`);

        const sites = domains.map(domain => ({
            domain,
            keywordsFile,
            ...globalOptions
        }));

        this.stats.startTime = new Date();
        this.stats.totalSites = sites.length;

        const results = await this.generateInBatches(sites, globalOptions);

        this.stats.endTime = new Date();
        await this.displaySummary(results);

        return {
            success: this.stats.failed === 0,
            results,
            stats: this.stats
        };
    }

    /**
     * Génère les sites par lots
     */
    async generateInBatches(sites, globalOptions) {
        const results = [];
        const batchSize = this.options.concurrency;

        for (let i = 0; i < sites.length; i += batchSize) {
            const batch = sites.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(sites.length / batchSize);

            console.log(`📦 Lot ${batchNumber}/${totalBatches} (${batch.length} sites):`);

            // Traiter le lot en parallèle
            const batchPromises = batch.map(async (siteConfig, index) => {
                const globalIndex = i + index;
                return await this.generateSite(siteConfig, globalOptions, globalIndex + 1);
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Mettre à jour les statistiques
            batchResults.forEach(result => {
                if (result.success) {
                    this.stats.successful++;
                } else {
                    this.stats.failed++;
                }
                this.stats.sites.push(result);
            });

            // Afficher le progrès
            console.log(`  ✅ Lot ${batchNumber} terminé (${batchResults.filter(r => r.success).length}/${batch.length} réussis)\n`);

            // Délai entre les lots (sauf pour le dernier)
            if (i + batchSize < sites.length) {
                console.log(`⏱️  Attente ${this.options.delay}ms avant le prochain lot...\n`);
                await this.delay(this.options.delay);
            }
        }

        return results;
    }

    /**
     * Génère un site individuel
     */
    async generateSite(siteConfig, globalOptions, index) {
        const startTime = Date.now();
        const domain = siteConfig.domain;

        try {
            console.log(`  [${index}] 🌐 ${domain} - Démarrage...`);

            // Fusionner les options
            const options = {
                ...globalOptions,
                ...siteConfig,
                outputDir: siteConfig.outputDir ||
                    path.join(this.options.outputBaseDir, `site-${domain.replace(/[^a-z0-9]/gi, '-')}`)
            };

            // Créer le générateur
            const generator = new SiteGeneratorMain(options);

            // Générer le site
            const result = await generator.generate();

            const duration = Date.now() - startTime;

            if (result.success) {
                console.log(`  [${index}] ✅ ${domain} - Terminé (${this.formatDuration(duration)})`);
                return {
                    success: true,
                    domain,
                    outputDir: result.outputDir,
                    stats: result.stats,
                    siteInfo: result.siteInfo,
                    duration
                };
            } else {
                console.log(`  [${index}] ❌ ${domain} - Échec: ${result.error}`);
                return {
                    success: false,
                    domain,
                    error: result.error,
                    duration
                };
            }

        } catch (error) {
            const duration = Date.now() - startTime;
            console.log(`  [${index}] ❌ ${domain} - Erreur: ${error.message}`);

            if (!this.options.continueOnError) {
                throw error;
            }

            return {
                success: false,
                domain,
                error: error.message,
                duration
            };
        }
    }

    /**
     * Charge un fichier de configuration
     */
    async loadConfig(configFile) {
        try {
            const content = await fs.readFile(configFile, 'utf8');
            const config = JSON.parse(content);

            // Valider la structure de base
            if (!config.sites || !Array.isArray(config.sites)) {
                throw new Error('Le fichier de configuration doit contenir un tableau "sites"');
            }

            return config;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Fichier de configuration introuvable: ${configFile}`);
            } else if (error instanceof SyntaxError) {
                throw new Error(`Fichier de configuration JSON invalide: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Valide la configuration
     */
    async validateConfig(config) {
        for (let i = 0; i < config.sites.length; i++) {
            const site = config.sites[i];

            if (!site.domain) {
                throw new Error(`Site ${i + 1}: Domaine manquant`);
            }

            if (!site.keywordsFile && !config.global?.keywordsFile) {
                throw new Error(`Site ${i + 1}: Fichier de mots-clés manquant`);
            }

            // Vérifier que le fichier de mots-clés existe
            const keywordsFile = site.keywordsFile || config.global.keywordsFile;
            try {
                await fs.access(keywordsFile);
            } catch {
                throw new Error(`Site ${i + 1}: Fichier de mots-clés introuvable: ${keywordsFile}`);
            }
        }

        console.log('✅ Configuration validée');
    }

    /**
     * Affiche le résumé de la génération
     */
    async displaySummary(results) {
        const duration = this.getGenerationTime();

        console.log('\n' + '='.repeat(60));
        console.log('📊 RÉSUMÉ DE LA GÉNÉRATION EN LOT');
        console.log('='.repeat(60));

        console.log(`🌐 Sites traités: ${this.stats.totalSites}`);
        console.log(`✅ Réussis: ${this.stats.successful}`);
        console.log(`❌ Échecs: ${this.stats.failed}`);
        console.log(`📊 Taux de réussite: ${(this.stats.successful / this.stats.totalSites * 100).toFixed(1)}%`);
        console.log(`⏱️  Durée totale: ${duration}`);

        if (this.stats.successful > 0) {
            const avgDuration = results
                .filter(r => r.success)
                .reduce((sum, r) => sum + r.duration, 0) / this.stats.successful;
            console.log(`⚡ Temps moyen par site: ${this.formatDuration(avgDuration)}`);
        }

        // Afficher les détails des échecs
        if (this.stats.failed > 0) {
            console.log('\n❌ ÉCHECS DÉTAILLÉS:');
            results
                .filter(r => !r.success)
                .forEach((result, index) => {
                    console.log(`  ${index + 1}. ${result.domain}: ${result.error}`);
                });
        }

        // Afficher les sites réussis
        if (this.stats.successful > 0) {
            console.log('\n✅ SITES GÉNÉRÉS AVEC SUCCÈS:');
            results
                .filter(r => r.success)
                .forEach((result, index) => {
                    console.log(`  ${index + 1}. ${result.domain} → ${result.outputDir}`);
                    if (result.siteInfo) {
                        console.log(`     Thème: ${result.siteInfo.theme} | Articles: ${result.siteInfo.articles}`);
                    }
                });
        }

        // Sauvegarder le rapport
        await this.saveReport(results);

        console.log('\n' + '='.repeat(60));
    }

    /**
     * Sauvegarde un rapport détaillé
     */
    async saveReport(results) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportFile = path.join(this.options.outputBaseDir, `bulk-generation-report-${timestamp}.json`);

        const report = {
            generated_at: new Date().toISOString(),
            options: this.options,
            stats: this.stats,
            results: results.map(r => ({
                domain: r.domain,
                success: r.success,
                duration: r.duration,
                outputDir: r.outputDir,
                error: r.error,
                siteInfo: r.siteInfo
            }))
        };

        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
        console.log(`\n📊 Rapport détaillé sauvegardé: ${reportFile}`);
    }

    /**
     * Crée un exemple de fichier de configuration
     */
    async createExampleConfig(outputPath) {
        const example = {
            global: {
                keywordsFile: "keywords.txt",
                apiKey: "${PERPLEXITY_API_KEY}",
                maxArticles: 20,
                delayBetweenRequests: 3000,
                verbose: false
            },
            sites: [
                {
                    domain: "exemple1.com",
                    keywordsFile: "keywords-exemple1.txt",
                    maxArticles: 30
                },
                {
                    domain: "exemple2.com",
                    outputDir: "custom-output/exemple2"
                },
                {
                    domain: "exemple3.fr"
                }
            ]
        };

        await fs.writeFile(outputPath, JSON.stringify(example, null, 2));
        console.log(`✅ Exemple de configuration créé: ${outputPath}`);
    }

    /**
     * Utilitaires
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    getGenerationTime() {
        if (!this.stats.startTime || !this.stats.endTime) {
            return 'N/A';
        }

        const duration = this.stats.endTime - this.stats.startTime;
        return this.formatDuration(duration);
    }
}

// Interface CLI
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
        console.log(`
🚀 Générateur en Lot - Blog Mass Generator

Usage: node bulk-generate.js <command> [options]

Commandes:
  config <file>           Génère à partir d'un fichier de configuration JSON
  domains <domains...>    Génère pour une liste de domaines
  example <file>          Crée un exemple de fichier de configuration

Options:
  --keywords <file>       Fichier de mots-clés (pour mode domains)
  --concurrency <n>       Nombre de sites en parallèle (défaut: 3)
  --delay <ms>            Délai entre les lots (défaut: 5000)
  --output-dir <dir>      Dossier de sortie de base
  --continue-on-error     Continue même en cas d'erreur
  --verbose               Mode verbeux
  --max-articles <n>      Nombre max d'articles par site

Exemples:
  # Génération à partir d'un fichier de config
  node bulk-generate.js config sites.json

  # Génération pour plusieurs domaines
  node bulk-generate.js domains site1.com site2.fr site3.org --keywords keywords.txt

  # Configuration avancée
  node bulk-generate.js config sites.json --concurrency 5 --delay 10000

  # Créer un exemple de configuration
  node bulk-generate.js example config-example.json

Format du fichier de configuration:
{
  "global": {
    "keywordsFile": "keywords.txt",
    "apiKey": "\${PERPLEXITY_API_KEY}",
    "maxArticles": 20
  },
  "sites": [
    {
      "domain": "site1.com",
      "keywordsFile": "keywords-site1.txt"
    },
    {
      "domain": "site2.com",
      "maxArticles": 50
    }
  ]
}
        `);
        return;
    }

    const command = args[0];

    // Options communes
    const options = {
        concurrency: parseInt(args[args.indexOf('--concurrency') + 1]) || 3,
        delay: parseInt(args[args.indexOf('--delay') + 1]) || 5000,
        outputBaseDir: args[args.indexOf('--output-dir') + 1] || process.cwd(),
        continueOnError: args.includes('--continue-on-error'),
        verbose: args.includes('--verbose')
    };

    const generator = new BulkGenerator(options);

    try {
        switch (command) {
            case 'config': {
                const configFile = args[1];
                if (!configFile) {
                    throw new Error('Fichier de configuration requis');
                }
                const result = await generator.generateFromConfig(configFile);
                process.exit(result.success ? 0 : 1);
                break;
            }

            case 'domains': {
                const domains = args.slice(1).filter(arg => !arg.startsWith('--'));
                if (domains.length === 0) {
                    throw new Error('Au moins un domaine requis');
                }

                const keywordsFile = args[args.indexOf('--keywords') + 1];
                if (!keywordsFile) {
                    throw new Error('Fichier de mots-clés requis (--keywords)');
                }

                const globalOptions = {
                    maxArticles: parseInt(args[args.indexOf('--max-articles') + 1]) || 50
                };

                const result = await generator.generateFromDomains(domains, keywordsFile, globalOptions);
                process.exit(result.success ? 0 : 1);
                break;
            }

            case 'example': {
                const outputFile = args[1] || 'bulk-config-example.json';
                await generator.createExampleConfig(outputFile);
                break;
            }

            default:
                console.log(`❌ Commande inconnue: ${command}`);
                console.log('Utilisez --help pour voir les commandes disponibles');
                process.exit(1);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = BulkGenerator;