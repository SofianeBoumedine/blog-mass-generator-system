#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * MASS GENERATE - Génération massive de sites
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Usage:
 *   node scripts/mass-generate.js [options]
 *
 * Exemples:
 *   node scripts/mass-generate.js                           # Tous les .txt
 *   node scripts/mass-generate.js --dir ./my-keywords       # Dossier spécifique
 *   node scripts/mass-generate.js --parallel 10             # 10 en parallèle
 *   node scripts/mass-generate.js --pattern "site-*.txt"    # Pattern spécifique
 *
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

// Import du générateur
const SemanticSiteGenerator = require('../lib/semanticSiteGenerator');

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    keywordsDir: './keywords',
    outputDir: './output',
    parallel: 5,           // Nombre de générations en parallèle
    pattern: '*.txt',      // Pattern de fichiers
    verbose: false,
    deployAfter: false
};

// ════════════════════════════════════════════════════════════════════════════
// PARSING DES ARGUMENTS
// ════════════════════════════════════════════════════════════════════════════

function parseArgs() {
    const args = process.argv.slice(2);
    const config = { ...CONFIG };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--dir':
            case '-d':
                config.keywordsDir = args[++i];
                break;
            case '--output':
            case '-o':
                config.outputDir = args[++i];
                break;
            case '--parallel':
            case '-p':
                config.parallel = parseInt(args[++i]) || 5;
                break;
            case '--pattern':
                config.pattern = args[++i];
                break;
            case '--verbose':
            case '-v':
                config.verbose = true;
                break;
            case '--deploy':
                config.deployAfter = true;
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
        }
    }

    return config;
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════

async function main() {
    const config = parseArgs();
    const startTime = Date.now();

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║            BLOG MASS GENERATOR - Génération Massive              ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log('');

    // Trouver tous les fichiers .txt
    const files = await findKeywordFiles(config.keywordsDir, config.pattern);

    if (files.length === 0) {
        console.log(`❌ Aucun fichier trouvé dans ${config.keywordsDir} avec le pattern ${config.pattern}`);
        process.exit(1);
    }

    console.log(`📁 Dossier source: ${config.keywordsDir}`);
    console.log(`📁 Dossier sortie: ${config.outputDir}`);
    console.log(`📄 Fichiers trouvés: ${files.length}`);
    console.log(`⚡ Parallélisation: ${config.parallel}`);
    console.log('');
    console.log('────────────────────────────────────────────────────────────────────');
    console.log('');

    // Résultats
    const results = {
        success: [],
        failed: [],
        skipped: []
    };

    // Créer le dossier de sortie
    await fs.mkdir(config.outputDir, { recursive: true });

    // Générer par lots
    const batches = chunkArray(files, config.parallel);
    let processed = 0;

    for (const batch of batches) {
        const promises = batch.map(async (file) => {
            const siteName = path.basename(file, '.txt');
            const outputPath = path.join(config.outputDir, siteName);

            try {
                console.log(`🚀 [${++processed}/${files.length}] Génération: ${siteName}`);

                // Lire les keywords
                const keywords = await readKeywords(file);

                if (keywords.length === 0) {
                    results.skipped.push({ file, reason: 'Aucun keyword' });
                    console.log(`   ⚠️  Ignoré (aucun keyword)`);
                    return;
                }

                // Générer le site
                const generator = new SemanticSiteGenerator();
                const result = await generator.generateSite(keywords, outputPath);

                results.success.push({
                    file,
                    siteName,
                    outputPath,
                    theme: result.theme,
                    branding: result.branding
                });

                console.log(`   ✅ ${siteName} (${result.theme})`);

            } catch (error) {
                results.failed.push({
                    file,
                    siteName,
                    error: error.message
                });
                console.log(`   ❌ Erreur: ${error.message}`);
            }
        });

        await Promise.all(promises);
    }

    // Rapport final
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('                         RAPPORT FINAL                               ');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`⏱️  Durée totale: ${duration}s`);
    console.log(`✅ Succès: ${results.success.length}`);
    console.log(`❌ Échecs: ${results.failed.length}`);
    console.log(`⚠️  Ignorés: ${results.skipped.length}`);
    console.log('');

    if (results.success.length > 0) {
        console.log('Sites générés:');
        results.success.forEach(r => {
            console.log(`  • ${r.siteName} (${r.theme}) - ${r.branding.brandName}`);
        });
        console.log('');
    }

    if (results.failed.length > 0) {
        console.log('Échecs:');
        results.failed.forEach(r => {
            console.log(`  • ${r.siteName}: ${r.error}`);
        });
        console.log('');
    }

    // Sauvegarder le rapport
    const reportPath = path.join(config.outputDir, 'mass-generation-report.json');
    await fs.writeFile(reportPath, JSON.stringify({
        generatedAt: new Date().toISOString(),
        duration: `${duration}s`,
        config,
        results
    }, null, 2));

    console.log(`📊 Rapport sauvegardé: ${reportPath}`);
    console.log('');

    // Déployer si demandé
    if (config.deployAfter && results.success.length > 0) {
        console.log('🚀 Déploiement en cours...');
        // Le déploiement serait géré ici
    }

    process.exit(results.failed.length > 0 ? 1 : 0);
}

// ════════════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Trouve tous les fichiers de keywords
 */
async function findKeywordFiles(dir, pattern) {
    const files = [];

    async function scan(currentDir) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                if (entry.isDirectory()) {
                    await scan(fullPath);
                } else if (entry.isFile() && matchPattern(entry.name, pattern)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Ignorer les dossiers inaccessibles
        }
    }

    await scan(dir);
    return files.sort();
}

/**
 * Vérifie si un nom de fichier correspond au pattern
 */
function matchPattern(filename, pattern) {
    if (pattern === '*.txt') {
        return filename.endsWith('.txt');
    }

    // Convertir le pattern glob en regex
    const regexPattern = pattern
        .replace(/\./g, '\\.')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');

    return new RegExp(`^${regexPattern}$`, 'i').test(filename);
}

/**
 * Lit les keywords depuis un fichier
 */
async function readKeywords(filePath) {
    const content = await fs.readFile(filePath, 'utf8');

    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('//'));
}

/**
 * Découpe un tableau en chunks
 */
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Affiche l'aide
 */
function showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                 MASS GENERATE - Aide                             ║
╚══════════════════════════════════════════════════════════════════╝

USAGE:
    node scripts/mass-generate.js [options]

OPTIONS:
    --dir, -d <path>       Dossier contenant les fichiers .txt
                           (défaut: ./keywords)

    --output, -o <path>    Dossier de sortie pour les sites
                           (défaut: ./output)

    --parallel, -p <n>     Nombre de générations en parallèle
                           (défaut: 5)

    --pattern <glob>       Pattern de fichiers à traiter
                           (défaut: *.txt)

    --verbose, -v          Mode verbeux

    --deploy               Déployer après génération

    --help, -h             Affiche cette aide

EXEMPLES:
    # Générer tous les sites depuis ./keywords
    node scripts/mass-generate.js

    # Utiliser un dossier spécifique
    node scripts/mass-generate.js --dir ./mes-keywords

    # Générer 10 sites en parallèle
    node scripts/mass-generate.js --parallel 10

    # Filtrer par pattern
    node scripts/mass-generate.js --pattern "site-*.txt"

STRUCTURE ATTENDUE:
    keywords/
    ├── site1.txt
    ├── site2.txt
    ├── animaux/
    │   ├── chiens.txt
    │   └── chats.txt
    └── tech/
        └── saas.txt

SORTIE:
    output/
    ├── site1/
    │   ├── index.html
    │   └── blog/
    ├── site2/
    └── ...
    `);
}

// ════════════════════════════════════════════════════════════════════════════
// EXÉCUTION
// ════════════════════════════════════════════════════════════════════════════

main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
});
