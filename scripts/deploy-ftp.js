#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * DEPLOY FTP - Script de déploiement FTP
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Usage:
 *   node scripts/deploy-ftp.js [options]
 *
 * Variables d'environnement requises:
 *   FTP_HOST     - Adresse du serveur FTP
 *   FTP_USER     - Nom d'utilisateur
 *   FTP_PASSWORD - Mot de passe
 *   FTP_DIR      - Dossier distant (optionnel, défaut: /public_html)
 *
 * ════════════════════════════════════════════════════════════════════════════
 */

const ftp = require('basic-ftp');
const fs = require('fs').promises;
const path = require('path');

// ════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    localDir: './output',
    remoteDir: process.env.FTP_DIR || '/public_html',
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT) || 21,
    secure: process.env.FTP_SECURE === 'true'
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════

async function main() {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║              DEPLOY FTP - Déploiement des sites              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');

    // Parser les arguments
    const args = process.argv.slice(2);
    let localDir = CONFIG.localDir;
    let specificSite = null;

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--dir':
            case '-d':
                localDir = args[++i];
                break;
            case '--site':
            case '-s':
                specificSite = args[++i];
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
        }
    }

    // Vérifier les credentials
    if (!CONFIG.host || !CONFIG.user || !CONFIG.password) {
        console.error('❌ Erreur: Variables d\'environnement FTP manquantes');
        console.error('   Requis: FTP_HOST, FTP_USER, FTP_PASSWORD');
        console.error('');
        console.error('   Exemple:');
        console.error('   export FTP_HOST="ftp.example.com"');
        console.error('   export FTP_USER="username"');
        console.error('   export FTP_PASSWORD="password"');
        process.exit(1);
    }

    console.log(`📡 Serveur: ${CONFIG.host}:${CONFIG.port}`);
    console.log(`📁 Dossier local: ${localDir}`);
    console.log(`📁 Dossier distant: ${CONFIG.remoteDir}`);
    console.log('');

    // Trouver les sites à déployer
    let sitesToDeploy = [];

    if (specificSite) {
        const sitePath = path.join(localDir, specificSite);
        try {
            await fs.access(sitePath);
            sitesToDeploy.push({ name: specificSite, path: sitePath });
        } catch {
            console.error(`❌ Site non trouvé: ${specificSite}`);
            process.exit(1);
        }
    } else {
        const entries = await fs.readdir(localDir, { withFileTypes: true });
        sitesToDeploy = entries
            .filter(e => e.isDirectory())
            .map(e => ({
                name: e.name,
                path: path.join(localDir, e.name)
            }));
    }

    if (sitesToDeploy.length === 0) {
        console.log('⚠️  Aucun site à déployer');
        process.exit(0);
    }

    console.log(`📦 Sites à déployer: ${sitesToDeploy.length}`);
    sitesToDeploy.forEach(s => console.log(`   • ${s.name}`));
    console.log('');

    // Connexion FTP
    const client = new ftp.Client();
    client.ftp.verbose = false;

    try {
        console.log('🔌 Connexion au serveur FTP...');

        await client.access({
            host: CONFIG.host,
            port: CONFIG.port,
            user: CONFIG.user,
            password: CONFIG.password,
            secure: CONFIG.secure
        });

        console.log('✅ Connecté');
        console.log('');

        // Déployer chaque site
        let success = 0;
        let failed = 0;

        for (const site of sitesToDeploy) {
            const remotePath = `${CONFIG.remoteDir}/${site.name}`;

            try {
                console.log(`📤 Déploiement: ${site.name}`);

                // Créer le dossier distant si nécessaire
                await client.ensureDir(remotePath);

                // Uploader le contenu
                await client.uploadFromDir(site.path, remotePath);

                console.log(`   ✅ Déployé: ${remotePath}`);
                success++;

            } catch (error) {
                console.log(`   ❌ Erreur: ${error.message}`);
                failed++;
            }
        }

        console.log('');
        console.log('════════════════════════════════════════════════════════════════════');
        console.log('                         DÉPLOIEMENT TERMINÉ                         ');
        console.log('════════════════════════════════════════════════════════════════════');
        console.log('');
        console.log(`✅ Succès: ${success}`);
        console.log(`❌ Échecs: ${failed}`);
        console.log('');

        process.exit(failed > 0 ? 1 : 0);

    } catch (error) {
        console.error(`❌ Erreur de connexion: ${error.message}`);
        process.exit(1);
    } finally {
        client.close();
    }
}

/**
 * Affiche l'aide
 */
function showHelp() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    DEPLOY FTP - Aide                         ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
    node scripts/deploy-ftp.js [options]

OPTIONS:
    --dir, -d <path>     Dossier local contenant les sites
                         (défaut: ./output)

    --site, -s <name>    Déployer un site spécifique

    --help, -h           Affiche cette aide

VARIABLES D'ENVIRONNEMENT:
    FTP_HOST             Adresse du serveur FTP (requis)
    FTP_USER             Nom d'utilisateur (requis)
    FTP_PASSWORD         Mot de passe (requis)
    FTP_DIR              Dossier distant (défaut: /public_html)
    FTP_PORT             Port (défaut: 21)
    FTP_SECURE           Utiliser FTPS (true/false)

EXEMPLES:
    # Définir les credentials
    export FTP_HOST="ftp.example.com"
    export FTP_USER="username"
    export FTP_PASSWORD="password"

    # Déployer tous les sites
    node scripts/deploy-ftp.js

    # Déployer un site spécifique
    node scripts/deploy-ftp.js --site monsite

    # Déployer depuis un dossier différent
    node scripts/deploy-ftp.js --dir ./sites
    `);
}

// ════════════════════════════════════════════════════════════════════════════
// EXÉCUTION
// ════════════════════════════════════════════════════════════════════════════

main().catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
});
