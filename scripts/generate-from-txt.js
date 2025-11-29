#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * GENERATE FROM TXT - Script de génération de site depuis fichier keywords
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Usage:
 *   node scripts/generate-from-txt.js <keywords-file.txt> [output-dir]
 *
 * Exemples:
 *   node scripts/generate-from-txt.js keywords/chiens.txt
 *   node scripts/generate-from-txt.js keywords/tech.txt ./output/techsite
 *
 * Le fichier .txt doit contenir un mot-clé par ligne.
 * Le site sera généré dans output/<nom-fichier>/ par défaut.
 *
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs').promises;
const path = require('path');

// Import du générateur sémantique
const SemanticSiteGenerator = require('../lib/semanticSiteGenerator');

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    defaultOutputDir: './output',
    minKeywords: 1,
    maxKeywords: 100
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║         BLOG MASS GENERATOR - Site Generation               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    // Récupérer les arguments
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }

    const keywordsFile = args[0];
    let outputDir = args[1];

    // Vérifier que le fichier existe
    try {
        await fs.access(keywordsFile);
    } catch {
        console.error(`❌ Erreur: Le fichier "${keywordsFile}" n'existe pas.`);
        process.exit(1);
    }

    // Déterminer le dossier de sortie
    if (!outputDir) {
        const fileName = path.basename(keywordsFile, '.txt');
        outputDir = path.join(CONFIG.defaultOutputDir, fileName);
    }

    console.log(`📄 Fichier keywords: ${keywordsFile}`);
    console.log(`📁 Dossier de sortie: ${outputDir}`);
    console.log('');

    try {
        // 1. Lire les keywords
        console.log('📖 Lecture des keywords...');
        const keywords = await readKeywords(keywordsFile);

        if (keywords.length === 0) {
            console.error('❌ Erreur: Le fichier ne contient aucun keyword valide.');
            process.exit(1);
        }

        console.log(`   ✓ ${keywords.length} keywords trouvés`);
        console.log(`   Premiers keywords: ${keywords.slice(0, 5).join(', ')}...`);
        console.log('');

        // 2. Générer le site
        console.log('🚀 Génération du site...');
        const generator = new SemanticSiteGenerator();
        const result = await generator.generateSite(keywords, outputDir);

        console.log('');
        console.log('╔══════════════════════════════════════════════════════════════╗');
        console.log('║                    ✅ GÉNÉRATION RÉUSSIE                     ║');
        console.log('╚══════════════════════════════════════════════════════════════╝');
        console.log('');
        console.log(`   📁 Dossier: ${result.outputDir}`);
        console.log(`   🎨 Thème détecté: ${result.theme}`);
        console.log(`   🏷️  Marque: ${result.branding.brandName}`);
        console.log(`   📝 Tagline: ${result.branding.tagline}`);
        console.log('');

        // Créer un fichier de rapport
        await createReport(result, keywordsFile, keywords);

        process.exit(0);

    } catch (error) {
        console.error('');
        console.error('╔══════════════════════════════════════════════════════════════╗');
        console.error('║                    ❌ ERREUR DE GÉNÉRATION                   ║');
        console.error('╚══════════════════════════════════════════════════════════════╝');
        console.error('');
        console.error(`Message: ${error.message}`);
        console.error('');
        if (process.env.DEBUG) {
            console.error('Stack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Lit les keywords depuis un fichier .txt
 */
async function readKeywords(filePath) {
    const content = await fs.readFile(filePath, 'utf8');

    // Parser les keywords (un par ligne)
    const keywords = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
            // Ignorer les lignes vides et les commentaires
            return line.length > 0 && !line.startsWith('#') && !line.startsWith('//');
        })
        .slice(0, CONFIG.maxKeywords);  // Limiter le nombre

    return keywords;
}

/**
 * Crée un rapport de génération
 */
async function createReport(result, sourceFile, keywords) {
    const report = {
        generatedAt: new Date().toISOString(),
        sourceFile,
        outputDir: result.outputDir,
        theme: result.theme,
        branding: result.branding,
        keywordsCount: keywords.length,
        keywords: keywords.slice(0, 20),  // Premiers 20 keywords
        files: await listGeneratedFiles(result.outputDir)
    };

    const reportPath = path.join(result.outputDir, 'generation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📊 Rapport: ${reportPath}`);
}

/**
 * Liste les fichiers générés
 */
async function listGeneratedFiles(dir) {
    const files = [];

    async function scan(currentDir, prefix = '') {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                await scan(path.join(currentDir, entry.name), relativePath);
            } else {
                files.push(relativePath);
            }
        }
    }

    await scan(dir);
    return files;
}

/**
 * Affiche l'aide
 */
function showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║              GENERATE FROM TXT - Aide                        ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
    node scripts/generate-from-txt.js <keywords-file.txt> [output-dir]

ARGUMENTS:
    keywords-file.txt    Fichier contenant les keywords (un par ligne)
    output-dir           Dossier de sortie (optionnel)

OPTIONS:
    --help, -h           Affiche cette aide

EXEMPLES:
    # Générer un site depuis un fichier de keywords
    node scripts/generate-from-txt.js keywords/animaux.txt

    # Spécifier le dossier de sortie
    node scripts/generate-from-txt.js keywords/tech.txt ./sites/techsite

FORMAT DU FICHIER KEYWORDS:
    # Commentaire (ignoré)
    mot-clé 1
    mot-clé 2
    mot clé avec plusieurs mots
    ...

NOTES:
    - Le thème est détecté automatiquement à partir des keywords
    - Le contenu est généré de manière sémantiquement cohérente
    - Le lien Blog est toujours présent dans la navigation
    - Les fichiers sont générés: index.html, blog/, .htaccess, etc.
    `);
}

// ════════════════════════════════════════════════════════════════════════════
// EXÉCUTION
// ════════════════════════════════════════════════════════════════════════════

main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
});
