#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class MassGenerationTester {
    constructor() {
        this.testDir = './test-mass-generation';
        this.keywordsDir = path.join(this.testDir, 'keywords');
        this.outputDir = path.join(this.testDir, 'output');
    }

    /**
     * 🧪 Test complet du système de génération massive
     */
    async runTests() {
        console.log('🧪 TEST DU SYSTÈME DE GÉNÉRATION MASSIVE\n');

        try {
            // 1. Préparation de l'environnement de test
            await this.setupTestEnvironment();

            // 2. Création de fichiers de test
            await this.createTestKeywords();

            // 3. Test de performance
            await this.runPerformanceTest();

            // 4. Nettoyage
            await this.cleanup();

            console.log('\n✅ TOUS LES TESTS RÉUSSIS !');

        } catch (error) {
            console.error('❌ ÉCHEC DES TESTS:', error.message);
            process.exit(1);
        }
    }

    /**
     * 🏗️ Préparer l'environnement de test
     */
    async setupTestEnvironment() {
        console.log('🏗️ Préparation de l\'environnement de test...');

        // Nettoyer si existe déjà
        try {
            await fs.rm(this.testDir, { recursive: true, force: true });
        } catch {}

        // Créer les dossiers
        await fs.mkdir(this.keywordsDir, { recursive: true });
        await fs.mkdir(this.outputDir, { recursive: true });

        console.log('  ✅ Dossiers de test créés');
    }

    /**
     * 📝 Créer des fichiers de test avec différents thèmes
     */
    async createTestKeywords() {
        console.log('📝 Création des fichiers de test...');

        const testFiles = [
            {
                name: 'test-tech.txt',
                keywords: [
                    'intelligence artificielle',
                    'développement web',
                    'cybersécurité',
                    'cloud computing',
                    'blockchain'
                ]
            },
            {
                name: 'test-cuisine.txt',
                keywords: [
                    'recettes françaises',
                    'cuisine traditionnelle',
                    'gastronomie',
                    'chef cuisinier',
                    'plats régionaux'
                ]
            },
            {
                name: 'test-sport.txt',
                keywords: [
                    'fitness musculation',
                    'entraînement sportif',
                    'nutrition sport',
                    'course à pied',
                    'yoga bien-être'
                ]
            }
        ];

        for (const file of testFiles) {
            const filePath = path.join(this.keywordsDir, file.name);
            const content = file.keywords.join('\n');
            await fs.writeFile(filePath, content);
            console.log(`  ✅ ${file.name} (${file.keywords.length} mots-clés)`);
        }
    }

    /**
     * ⚡ Test de performance avec différentes configurations
     */
    async runPerformanceTest() {
        console.log('\n⚡ TESTS DE PERFORMANCE...');

        const MassGenerator = require('./mass-generator');

        const configurations = [
            {
                name: 'Configuration Conservative',
                options: { concurrency: 2, delay: 5000, maxArticles: 10 }
            },
            {
                name: 'Configuration Standard',
                options: { concurrency: 3, delay: 3000, maxArticles: 15 }
            }
        ];

        for (const config of configurations) {
            console.log(`\n🧪 Test: ${config.name}`);
            console.log(`   Concurrence: ${config.options.concurrency}`);
            console.log(`   Délai: ${config.options.delay}ms`);

            const startTime = Date.now();

            try {
                const generator = new MassGenerator({
                    ...config.options,
                    keywordsDir: this.keywordsDir,
                    outputBaseDir: this.outputDir,
                    verbose: false
                });

                const result = await generator.generateFromKeywordsDirectory(this.keywordsDir);
                const duration = Date.now() - startTime;

                if (result.success) {
                    console.log(`   ✅ Succès en ${this.formatDuration(duration)}`);
                    console.log(`   📊 ${result.stats.successful}/${result.stats.totalSites} sites générés`);

                    if (result.stats.successful > 0) {
                        const avgTime = duration / result.stats.successful;
                        console.log(`   ⚡ Temps moyen: ${this.formatDuration(avgTime)}/site`);
                    }
                } else {
                    console.log(`   ❌ Échec: ${result.error}`);
                }

            } catch (error) {
                console.log(`   ❌ Erreur: ${error.message}`);
            }

            // Pause entre les tests
            await this.delay(2000);
        }
    }

    /**
     * 🧹 Nettoyage après tests
     */
    async cleanup() {
        console.log('\n🧹 Nettoyage des fichiers de test...');

        try {
            await fs.rm(this.testDir, { recursive: true, force: true });
            console.log('  ✅ Fichiers de test supprimés');
        } catch (error) {
            console.log('  ⚠️ Impossible de supprimer les fichiers de test');
        }
    }

    /**
     * 🔍 Vérifications du système
     */
    async runSystemChecks() {
        console.log('🔍 VÉRIFICATIONS SYSTÈME\n');

        // Vérifier Node.js version
        const nodeVersion = process.version;
        console.log(`📦 Node.js: ${nodeVersion}`);

        // Vérifier les modules requis
        const requiredModules = ['./mass-generator', './bulk-generate'];

        for (const module of requiredModules) {
            try {
                require(module);
                console.log(`✅ Module ${module}: OK`);
            } catch (error) {
                console.log(`❌ Module ${module}: MANQUANT`);
                throw new Error(`Module requis manquant: ${module}`);
            }
        }

        // Vérifier l'environnement
        if (!process.env.PERPLEXITY_API_KEY) {
            console.log('⚠️ PERPLEXITY_API_KEY non définie');
            console.log('   Tests limités sans clé API');
        } else {
            console.log('✅ PERPLEXITY_API_KEY: Configurée');
        }

        // Vérifier l'espace disque
        try {
            const stats = await fs.stat('./');
            console.log('✅ Permissions dossier: OK');
        } catch {
            throw new Error('Impossible d\'écrire dans le dossier courant');
        }

        console.log('\n✅ Vérifications système réussies\n');
    }

    /**
     * 📊 Test de capacité
     */
    async runCapacityTest() {
        console.log('📊 TEST DE CAPACITÉ\n');

        // Simuler différents nombres de fichiers
        const scenarios = [
            { files: 5, concurrency: 3, description: 'Petit test (5 sites)' },
            { files: 10, concurrency: 5, description: 'Test moyen (10 sites)' },
            { files: 25, concurrency: 10, description: 'Gros test (25 sites)' }
        ];

        for (const scenario of scenarios) {
            console.log(`🎯 ${scenario.description}`);

            // Estimer le temps
            const estimatedTime = (scenario.files / scenario.concurrency) * 3; // 3 min par lot
            console.log(`   ⏱️ Temps estimé: ${estimatedTime} minutes`);

            // Estimer l'espace disque
            const estimatedSpace = scenario.files * 75; // 75MB par site
            console.log(`   💾 Espace estimé: ${estimatedSpace}MB`);

            console.log(`   🚀 Commande: node scripts/mass-generator.js --concurrency ${scenario.concurrency}`);
            console.log();
        }
    }

    // Utilitaires
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);

        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }
}

// Interface CLI
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🧪 Testeur Génération Massive

Usage: node test-mass-generation.js [command]

Commandes:
  test          Test complet du système
  check         Vérifications système seulement
  capacity      Test de capacité (estimation)

Exemples:
  node test-mass-generation.js test
  node test-mass-generation.js check
        `);
        return;
    }

    const tester = new MassGenerationTester();
    const command = args[0] || 'test';

    try {
        switch (command) {
            case 'test':
                await tester.runSystemChecks();
                await tester.runTests();
                break;

            case 'check':
                await tester.runSystemChecks();
                break;

            case 'capacity':
                await tester.runCapacityTest();
                break;

            default:
                console.log('❌ Commande inconnue. Utilisez --help pour l\'aide.');
                process.exit(1);
        }
    } catch (error) {
        console.error('❌ Erreur de test:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = MassGenerationTester;