#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class CleanupManager {
    constructor() {
        this.outputDir = process.cwd();
        this.defaultPatterns = [
            'site-*',
            '*-generated',
            'generated-*',
            'temp-*'
        ];
    }

    /**
     * Nettoie les sites générés
     */
    async cleanupSites(options = {}) {
        console.log('🧹 Nettoyage des sites générés...\n');

        const patterns = options.patterns || this.defaultPatterns;
        const force = options.force || false;
        const dryRun = options.dryRun || false;

        let totalDeleted = 0;
        let totalSize = 0;

        try {
            const entries = await fs.readdir(this.outputDir, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const dirName = entry.name;
                    const shouldDelete = patterns.some(pattern => {
                        const regex = new RegExp(pattern.replace('*', '.*'));
                        return regex.test(dirName);
                    });

                    if (shouldDelete) {
                        const dirPath = path.join(this.outputDir, dirName);

                        try {
                            const stats = await this.getDirStats(dirPath);
                            totalSize += stats.size;

                            if (dryRun) {
                                console.log(`🔍 Trouverait: ${dirName} (${this.formatSize(stats.size)}, ${stats.files} fichiers)`);
                            } else {
                                if (!force) {
                                    console.log(`Suppression de: ${dirName} (${this.formatSize(stats.size)}, ${stats.files} fichiers)`);
                                }

                                await this.deleteDirectory(dirPath);
                                totalDeleted++;
                                console.log(`✅ ${dirName} supprimé`);
                            }
                        } catch (error) {
                            console.log(`❌ Erreur lors de la suppression de ${dirName}: ${error.message}`);
                        }
                    }
                }
            }

            if (dryRun) {
                console.log(`\n🔍 SIMULATION - ${totalDeleted} dossiers seraient supprimés (${this.formatSize(totalSize)} libérés)`);
            } else {
                console.log(`\n✅ Nettoyage terminé - ${totalDeleted} dossiers supprimés (${this.formatSize(totalSize)} libérés)`);
            }

        } catch (error) {
            console.error('❌ Erreur lors du nettoyage:', error.message);
        }
    }

    /**
     * Obtient les statistiques d'un dossier
     */
    async getDirStats(dirPath) {
        let totalSize = 0;
        let fileCount = 0;

        const processDir = async (currentPath) => {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);

                if (entry.isDirectory()) {
                    await processDir(fullPath);
                } else {
                    const stats = await fs.stat(fullPath);
                    totalSize += stats.size;
                    fileCount++;
                }
            }
        };

        await processDir(dirPath);
        return { size: totalSize, files: fileCount };
    }

    /**
     * Supprime récursivement un dossier
     */
    async deleteDirectory(dirPath) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                await this.deleteDirectory(fullPath);
            } else {
                await fs.unlink(fullPath);
            }
        }

        await fs.rmdir(dirPath);
    }

    /**
     * Formate la taille en unités lisibles
     */
    formatSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    /**
     * Archive les sites avant suppression
     */
    async archiveSites(options = {}) {
        console.log('📦 Archivage des sites générés...\n');

        const archiveDir = options.archiveDir || path.join(this.outputDir, 'archives');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        try {
            await fs.mkdir(archiveDir, { recursive: true });

            const entries = await fs.readdir(this.outputDir, { withFileTypes: true });
            let archivedCount = 0;

            for (const entry of entries) {
                if (entry.isDirectory() && this.shouldArchive(entry.name)) {
                    const sourcePath = path.join(this.outputDir, entry.name);
                    const archiveName = `${entry.name}-${timestamp}`;
                    const destPath = path.join(archiveDir, archiveName);

                    await this.copyDirectory(sourcePath, destPath);
                    console.log(`📦 ${entry.name} archivé vers ${archiveName}`);
                    archivedCount++;
                }
            }

            console.log(`\n✅ ${archivedCount} sites archivés dans ${archiveDir}`);

        } catch (error) {
            console.error('❌ Erreur lors de l\'archivage:', error.message);
        }
    }

    /**
     * Vérifie si un dossier doit être archivé
     */
    shouldArchive(dirName) {
        return this.defaultPatterns.some(pattern => {
            const regex = new RegExp(pattern.replace('*', '.*'));
            return regex.test(dirName);
        });
    }

    /**
     * Copie récursivement un dossier
     */
    async copyDirectory(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    /**
     * Nettoie les fichiers temporaires du système
     */
    async cleanupTempFiles() {
        console.log('🗂️  Nettoyage des fichiers temporaires...\n');

        const tempPatterns = [
            '*.tmp',
            '*.temp',
            '.cache-*',
            'node_modules/.cache',
            '*.log'
        ];

        let deletedCount = 0;

        for (const pattern of tempPatterns) {
            try {
                const matches = await this.findFiles(pattern);

                for (const filePath of matches) {
                    await fs.unlink(filePath);
                    console.log(`🗑️  ${path.basename(filePath)} supprimé`);
                    deletedCount++;
                }
            } catch (error) {
                // Ignorer les erreurs de fichiers introuvables
            }
        }

        console.log(`\n✅ ${deletedCount} fichiers temporaires supprimés`);
    }

    /**
     * Trouve les fichiers correspondant à un pattern
     */
    async findFiles(pattern, dir = this.outputDir) {
        const results = [];
        const regex = new RegExp(pattern.replace('*', '.*'));

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isFile() && regex.test(entry.name)) {
                    results.push(fullPath);
                } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
                    const subResults = await this.findFiles(pattern, fullPath);
                    results.push(...subResults);
                }
            }
        } catch (error) {
            // Ignorer les erreurs d'accès
        }

        return results;
    }
}

// Interface CLI
async function main() {
    const args = process.argv.slice(2);
    const cleanup = new CleanupManager();

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🧹 Script de Nettoyage - Blog Mass Generator

Usage: node cleanup.js [command] [options]

Commandes:
  sites       Nettoie les sites générés (défaut)
  temp        Nettoie les fichiers temporaires
  archive     Archive puis nettoie les sites
  all         Nettoie tout (sites + temp)

Options:
  --dry-run   Affiche ce qui serait supprimé sans supprimer
  --force     Supprime sans confirmation
  --patterns  Patterns personnalisés (séparés par des virgules)

Exemples:
  node cleanup.js                          # Nettoie les sites
  node cleanup.js --dry-run                # Simulation
  node cleanup.js temp                     # Nettoie uniquement les fichiers temporaires
  node cleanup.js archive                  # Archive puis nettoie
  node cleanup.js --patterns "test-*,old-*" # Patterns personnalisés
        `);
        return;
    }

    const command = args[0] || 'sites';
    const options = {
        dryRun: args.includes('--dry-run'),
        force: args.includes('--force'),
        patterns: args.includes('--patterns') ?
            args[args.indexOf('--patterns') + 1]?.split(',') : undefined
    };

    try {
        switch (command) {
            case 'sites':
                await cleanup.cleanupSites(options);
                break;

            case 'temp':
                await cleanup.cleanupTempFiles();
                break;

            case 'archive':
                await cleanup.archiveSites();
                await cleanup.cleanupSites(options);
                break;

            case 'all':
                await cleanup.cleanupSites(options);
                await cleanup.cleanupTempFiles();
                break;

            default:
                console.log(`❌ Commande inconnue: ${command}`);
                console.log('Utilisez --help pour voir les commandes disponibles');
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = CleanupManager;