#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class MassGenerationSetup {
    constructor() {
        this.keywordsDir = './keywords';
        this.outputDir = './output';
    }

    /**
     * 🏗️ Configuration automatique pour génération massive
     */
    async setupMassGeneration() {
        console.log('🚀 CONFIGURATION GÉNÉRATION MASSIVE\n');

        try {
            // 1. Créer les dossiers nécessaires
            await this.createDirectories();

            // 2. Vérifier les fichiers de mots-clés existants
            const existingFiles = await this.checkExistingKeywords();

            // 3. Afficher les instructions
            await this.displayInstructions(existingFiles);

            // 4. Créer des exemples si nécessaire
            if (existingFiles.length === 0) {
                await this.createExampleKeywords();
            }

            console.log('✅ Configuration terminée !');

        } catch (error) {
            console.error('❌ Erreur:', error.message);
        }
    }

    /**
     * 📁 Créer les dossiers nécessaires
     */
    async createDirectories() {
        const dirs = [this.keywordsDir, this.outputDir];

        for (const dir of dirs) {
            try {
                await fs.access(dir);
                console.log(`✅ Dossier existe: ${dir}`);
            } catch {
                await fs.mkdir(dir, { recursive: true });
                console.log(`📁 Dossier créé: ${dir}`);
            }
        }
    }

    /**
     * 🔍 Vérifier les fichiers de mots-clés existants
     */
    async checkExistingKeywords() {
        try {
            const files = await fs.readdir(this.keywordsDir);
            const txtFiles = files.filter(f => f.endsWith('.txt'));

            if (txtFiles.length > 0) {
                console.log(`📄 ${txtFiles.length} fichiers de mots-clés trouvés:`);
                for (const file of txtFiles) {
                    const content = await fs.readFile(path.join(this.keywordsDir, file), 'utf8');
                    const keywords = content.trim().split('\n').filter(k => k.trim());
                    console.log(`  ✅ ${file} (${keywords.length} mots-clés)`);
                }
            } else {
                console.log('📄 Aucun fichier de mots-clés trouvé');
            }

            return txtFiles;
        } catch {
            return [];
        }
    }

    /**
     * 📋 Afficher les instructions
     */
    async displayInstructions(existingFiles) {
        console.log('\n' + '='.repeat(70));
        console.log('📋 INSTRUCTIONS POUR GÉNÉRATION MASSIVE');
        console.log('='.repeat(70));

        console.log(`
🎯 POUR GÉNÉRER 10-100 SITES EN PARALLÈLE:

1️⃣ PRÉPARER VOS FICHIERS DE MOTS-CLÉS:
   📁 Placez vos fichiers .txt dans: ${this.keywordsDir}/
   📄 Un fichier = Un site web généré

   Exemples:
   - chatons.txt → génère un site sur les chatons
   - cuisine-italienne.txt → génère un site cuisine italienne
   - tech-2024.txt → génère un site tech

2️⃣ FORMAT DES FICHIERS:
   Chaque fichier .txt doit contenir des mots-clés, un par ligne:

   chatons.txt:
   chatons mignons
   chat domestique
   soins félins
   jouets pour chat

3️⃣ LANCER LA GÉNÉRATION:

   # Mode standard (10 sites parallèles)
   node scripts/mass-generator.js

   # Mode turbo (25 sites parallèles)
   node scripts/mass-generator.js --turbo

   # Mode extrême (50 sites parallèles)
   node scripts/mass-generator.js --extreme

   # Personnalisé pour 100 fichiers
   node scripts/mass-generator.js --concurrency 20 --delay 1000

4️⃣ RÉSULTATS:
   📁 Vos sites seront dans: ${this.outputDir}/
   📊 Rapport détaillé généré automatiquement
        `);

        if (existingFiles.length > 0) {
            console.log(`🚀 PRÊT À GÉNÉRER ${existingFiles.length} SITES !`);
            console.log(`\n💡 Commande suggérée pour vos ${existingFiles.length} fichiers:`);

            const suggestedConcurrency = Math.min(Math.max(Math.floor(existingFiles.length / 5), 5), 25);
            console.log(`   node scripts/mass-generator.js --concurrency ${suggestedConcurrency}`);
        }

        console.log('\n' + '='.repeat(70));
    }

    /**
     * 📝 Créer des exemples de fichiers de mots-clés
     */
    async createExampleKeywords() {
        console.log('\n📝 Création d\'exemples de fichiers de mots-clés...');

        const examples = [
            {
                filename: 'chatons.txt',
                keywords: [
                    'chatons mignons',
                    'chat domestique',
                    'soins félins',
                    'jouets pour chat',
                    'alimentation chaton',
                    'comportement chat',
                    'santé féline',
                    'adoption chat'
                ]
            },
            {
                filename: 'cuisine-francaise.txt',
                keywords: [
                    'cuisine française traditionnelle',
                    'recettes françaises',
                    'gastronomie France',
                    'plats typiques français',
                    'cuisine régionale France',
                    'desserts français',
                    'vins français',
                    'chef cuisinier français'
                ]
            },
            {
                filename: 'technologie-2024.txt',
                keywords: [
                    'intelligence artificielle',
                    'nouvelles technologies 2024',
                    'innovation tech',
                    'gadgets technologiques',
                    'développement web',
                    'cybersécurité',
                    'cloud computing',
                    'blockchain actualités'
                ]
            }
        ];

        for (const example of examples) {
            const filePath = path.join(this.keywordsDir, example.filename);
            const content = example.keywords.join('\n');
            await fs.writeFile(filePath, content);
            console.log(`  ✅ Créé: ${example.filename} (${example.keywords.length} mots-clés)`);
        }

        console.log('\n💡 Modifiez ces exemples ou ajoutez vos propres fichiers !');
    }

    /**
     * 🎯 Créer une configuration optimisée pour un nombre spécifique de sites
     */
    async createOptimizedConfig(numberOfSites) {
        const configs = {
            small: { sites: '1-10', concurrency: 5, delay: 3000 },
            medium: { sites: '10-25', concurrency: 10, delay: 2000 },
            large: { sites: '25-50', concurrency: 20, delay: 1500 },
            huge: { sites: '50-100', concurrency: 30, delay: 1000 },
            extreme: { sites: '100+', concurrency: 50, delay: 500 }
        };

        let config;
        if (numberOfSites <= 10) config = configs.small;
        else if (numberOfSites <= 25) config = configs.medium;
        else if (numberOfSites <= 50) config = configs.large;
        else if (numberOfSites <= 100) config = configs.huge;
        else config = configs.extreme;

        console.log(`\n🎯 CONFIGURATION OPTIMISÉE POUR ${numberOfSites} SITES:`);
        console.log(`   Sites: ${config.sites}`);
        console.log(`   Concurrence: ${config.concurrency}`);
        console.log(`   Délai: ${config.delay}ms`);
        console.log(`\n📋 Commande recommandée:`);
        console.log(`   node scripts/mass-generator.js --concurrency ${config.concurrency} --delay ${config.delay}`);
    }
}

// Interface CLI
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🚀 Configuration Génération Massive

Usage: node setup-mass-generation.js [command]

Commandes:
  setup                   Configuration automatique
  config <nombre>         Configuration optimisée pour N sites

Exemples:
  node setup-mass-generation.js setup
  node setup-mass-generation.js config 50
        `);
        return;
    }

    const setup = new MassGenerationSetup();

    const command = args[0] || 'setup';

    try {
        switch (command) {
            case 'setup':
                await setup.setupMassGeneration();
                break;

            case 'config':
                const numberOfSites = parseInt(args[1]);
                if (!numberOfSites || numberOfSites < 1) {
                    throw new Error('Nombre de sites requis (ex: node setup-mass-generation.js config 50)');
                }
                await setup.createOptimizedConfig(numberOfSites);
                break;

            default:
                await setup.setupMassGeneration();
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = MassGenerationSetup;