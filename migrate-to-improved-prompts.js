const fs = require('fs').promises;
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('         MIGRATION VERS LES PROMPTS AMÉLIORÉS');
console.log('═══════════════════════════════════════════════════════════════════\n');

async function migratePrompts() {
    const originalPath = path.join(__dirname, 'config', 'prompts.json');
    const improvedPath = path.join(__dirname, 'config', 'prompts-improved.json');
    const backupPath = path.join(__dirname, 'config', 'prompts-backup.json');

    console.log('🔍 Vérification des fichiers...\n');

    // Vérifier que les fichiers existent
    try {
        await fs.access(originalPath);
        console.log('  ✅ prompts.json trouvé');
    } catch {
        console.log('  ❌ prompts.json non trouvé');
        process.exit(1);
    }

    try {
        await fs.access(improvedPath);
        console.log('  ✅ prompts-improved.json trouvé\n');
    } catch {
        console.log('  ❌ prompts-improved.json non trouvé');
        console.log('     Exécutez d\'abord le script de création des prompts améliorés.\n');
        process.exit(1);
    }

    console.log('─────────────────────────────────────────────────────────────────\n');
    console.log('📋 ÉTAPES DE MIGRATION:\n');
    console.log('  1. Sauvegarde de l\'ancien fichier prompts.json');
    console.log('  2. Remplacement par prompts-improved.json');
    console.log('  3. Vérification de l\'intégrité\n');

    console.log('⚠️  ATTENTION: Cette opération va remplacer les prompts actuels.\n');
    console.log('   Un backup sera créé dans: config/prompts-backup.json\n');

    // Pause pour laisser le temps de lire
    console.log('─────────────────────────────────────────────────────────────────\n');

    console.log('🚀 Démarrage de la migration...\n');

    try {
        // Étape 1: Backup
        console.log('  [1/3] Création du backup...');
        const originalContent = await fs.readFile(originalPath, 'utf8');
        await fs.writeFile(backupPath, originalContent, 'utf8');
        console.log('  ✅ Backup créé: config/prompts-backup.json\n');

        // Étape 2: Migration
        console.log('  [2/3] Migration vers les nouveaux prompts...');
        const improvedContent = await fs.readFile(improvedPath, 'utf8');
        await fs.writeFile(originalPath, improvedContent, 'utf8');
        console.log('  ✅ Prompts mis à jour: config/prompts.json\n');

        // Étape 3: Vérification
        console.log('  [3/3] Vérification de l\'intégrité...');
        const verifyContent = await fs.readFile(originalPath, 'utf8');

        try {
            JSON.parse(verifyContent);
            console.log('  ✅ JSON valide\n');
        } catch (error) {
            console.log('  ❌ Erreur JSON détectée! Restauration du backup...');
            await fs.writeFile(originalPath, originalContent, 'utf8');
            console.log('  ✅ Backup restauré\n');
            throw error;
        }

        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('                 🎉 MIGRATION RÉUSSIE! 🎉');
        console.log('═══════════════════════════════════════════════════════════════════\n');

        // Afficher les statistiques
        const original = JSON.parse(originalContent);
        const improved = JSON.parse(improvedContent);

        const origSize = JSON.stringify(original).length;
        const impSize = JSON.stringify(improved).length;

        console.log('📊 STATISTIQUES:\n');
        console.log(`   Taille avant:  ${origSize.toLocaleString()} caractères`);
        console.log(`   Taille après:  ${impSize.toLocaleString()} caractères`);
        console.log(`   Amélioration:  +${((impSize / origSize - 1) * 100).toFixed(0)}%\n`);

        console.log('✅ AMÉLIORATIONS ACTIVÉES:\n');
        console.log('   • Anti-détection IA (ton naturel et humain)');
        console.log('   • Structure de sortie stricte (facilite le parsing)');
        console.log('   • Instructions détaillées (qualité du contenu)');
        console.log('   • Exemples concrets (do/don\'t lists)');
        console.log('   • SEO avancé (intégration naturelle des mots-clés)\n');

        console.log('─────────────────────────────────────────────────────────────────\n');
        console.log('🔄 ROLLBACK (si nécessaire):\n');
        console.log('   Pour revenir aux anciens prompts:');
        console.log('   $ cp config/prompts-backup.json config/prompts.json\n');

        console.log('🧪 PROCHAINES ÉTAPES:\n');
        console.log('   1. Tester la génération sur un site test');
        console.log('   2. Vérifier la qualité du contenu généré');
        console.log('   3. Comparer avec les anciens prompts');
        console.log('   4. Ajuster si nécessaire\n');

        console.log('═══════════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.log('\n❌ ERREUR LORS DE LA MIGRATION:\n');
        console.log(`   ${error.message}\n`);
        console.log('   La migration a été annulée.\n');
        console.log('═══════════════════════════════════════════════════════════════════\n');
        process.exit(1);
    }
}

migratePrompts().catch(console.error);
