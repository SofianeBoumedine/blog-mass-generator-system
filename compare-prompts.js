const fs = require('fs').promises;
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('         COMPARAISON PROMPTS ORIGINAUX VS AMÉLIORÉS');
console.log('═══════════════════════════════════════════════════════════════════\n');

async function comparePrompts() {
    // Charger les deux versions
    const originalPath = path.join(__dirname, 'config', 'prompts.json');
    const improvedPath = path.join(__dirname, 'config', 'prompts-improved.json');

    const original = JSON.parse(await fs.readFile(originalPath, 'utf8'));
    const improved = JSON.parse(await fs.readFile(improvedPath, 'utf8'));

    console.log('📊 ANALYSE COMPARATIVE\n');
    console.log('─────────────────────────────────────────────────────────────────\n');

    // Comparer chaque catégorie
    const categories = ['analysis', 'content', 'seo', 'blog'];

    for (const category of categories) {
        console.log(`\n🔍 CATÉGORIE: ${category.toUpperCase()}\n`);

        const origCat = original[category] || {};
        const impCat = improved[category] || {};

        const keys = new Set([...Object.keys(origCat), ...Object.keys(impCat)]);

        for (const key of keys) {
            const origPrompt = origCat[key] || '';
            const impPrompt = impCat[key] || '';

            console.log(`  📝 ${key}:`);
            console.log(`     Original: ${origPrompt.length} caractères`);
            console.log(`     Amélioré: ${impPrompt.length} caractères`);
            console.log(`     Gain: +${impPrompt.length - origPrompt.length} caractères (${((impPrompt.length / origPrompt.length - 1) * 100).toFixed(0)}%)\n`);

            // Analyser les améliorations
            const improvements = [];

            if (impPrompt.includes('INSTRUCTIONS')) improvements.push('Instructions structurées');
            if (impPrompt.includes('ANTI-')) improvements.push('Anti-détection IA');
            if (impPrompt.includes('EXEMPLE')) improvements.push('Exemples concrets');
            if (impPrompt.includes('FORMAT EXACT')) improvements.push('Format strict');
            if (impPrompt.includes('═══')) improvements.push('Délimiteurs de parsing');
            if (impPrompt.includes('✓') || impPrompt.includes('✗')) improvements.push('Do/Don\'t lists');
            if (impPrompt.includes('CRUCIAL') || impPrompt.includes('IMPORTANT')) improvements.push('Points d\'attention');

            if (improvements.length > 0) {
                console.log(`     Améliorations détectées:`);
                improvements.forEach(imp => console.log(`       ✅ ${imp}`));
                console.log();
            }
        }
    }

    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('                    STATISTIQUES GLOBALES');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // Calculer les stats globales
    const origTotal = JSON.stringify(original).length;
    const impTotal = JSON.stringify(improved).length;

    console.log(`📊 TAILLE TOTALE:\n`);
    console.log(`   Original:  ${origTotal.toLocaleString()} caractères`);
    console.log(`   Amélioré:  ${impTotal.toLocaleString()} caractères`);
    console.log(`   Gain:      +${(impTotal - origTotal).toLocaleString()} caractères (${((impTotal / origTotal - 1) * 100).toFixed(0)}%)\n`);

    // Compter les prompts
    const countPrompts = (obj) => {
        let count = 0;
        for (const category in obj) {
            count += Object.keys(obj[category]).length;
        }
        return count;
    };

    const origCount = countPrompts(original);
    const impCount = countPrompts(improved);

    console.log(`📝 NOMBRE DE PROMPTS:\n`);
    console.log(`   Original:  ${origCount} prompts`);
    console.log(`   Amélioré:  ${impCount} prompts`);
    console.log(`   Statut:    ${origCount === impCount ? '✅ Couverture identique' : '⚠️  Différence de couverture'}\n`);

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                    POINTS CLÉS D\'AMÉLIORATION');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log('✅ AMÉLIORATIONS MAJEURES:\n');
    console.log('  1. ANTI-DÉTECTION IA');
    console.log('     • Instructions détaillées pour varier les phrases');
    console.log('     • Consignes pour un ton naturel et humain');
    console.log('     • Demande d\'exemples concrets et détails spécifiques\n');

    console.log('  2. STRUCTURE DE SORTIE');
    console.log('     • Format strict avec délimiteurs (═══)');
    console.log('     • Facilite le parsing automatique');
    console.log('     • Réduit les erreurs de génération\n');

    console.log('  3. QUALITÉ DU CONTENU');
    console.log('     • Exemples de ce qu\'il faut faire/éviter');
    console.log('     • Instructions pour éviter le jargon marketing');
    console.log('     • Demande de spécificité et chiffres concrets\n');

    console.log('  4. SEO AVANCÉ');
    console.log('     • Intégration naturelle des mots-clés');
    console.log('     • Évite le keyword stuffing');
    console.log('     • Optimisation pour le CTR\n');

    console.log('  5. CONTEXTUALISATION');
    console.log('     • Beaucoup plus de variables de contexte');
    console.log('     • Instructions adaptées au type de business');
    console.log('     • Ton personnalisé selon le secteur\n');

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                    RECOMMANDATION DE MIGRATION');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log('🚀 STRATÉGIE DE MIGRATION PROPOSÉE:\n');
    console.log('OPTION 1: Migration Progressive (RECOMMANDÉ)');
    console.log('  • Tester les nouveaux prompts sur 5-10 sites');
    console.log('  • Comparer la qualité du contenu généré');
    console.log('  • Ajuster si nécessaire');
    console.log('  • Migrer complètement si satisfait\n');

    console.log('OPTION 2: Migration Immédiate');
    console.log('  • Sauvegarder l\'ancien fichier');
    console.log('  • Remplacer prompts.json par prompts-improved.json');
    console.log('  • Tester sur plusieurs générations');
    console.log('  • Rollback si problème\n');

    console.log('OPTION 3: Mode Hybride');
    console.log('  • Utiliser les nouveaux prompts pour certains types de contenu');
    console.log('  • Garder les anciens pour d\'autres');
    console.log('  • Migrer progressivement catégorie par catégorie\n');

    console.log('───────────────────────────────────────────────────────────────────\n');

    console.log('💡 COMMANDES DISPONIBLES:\n');
    console.log('  Sauvegarder l\'ancien:');
    console.log('  $ cp config/prompts.json config/prompts-backup.json\n');

    console.log('  Activer les nouveaux prompts:');
    console.log('  $ cp config/prompts-improved.json config/prompts.json\n');

    console.log('  Restaurer l\'ancien:');
    console.log('  $ cp config/prompts-backup.json config/prompts.json\n');

    console.log('═══════════════════════════════════════════════════════════════════\n');
}

comparePrompts().catch(console.error);
