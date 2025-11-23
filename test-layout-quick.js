const IntelligentLayoutSelectorV2 = require('./lib/intelligentLayoutSelectorV2');

// Désactiver les logs verbeux
const originalLog = console.log;
console.log = function(...args) {
    const str = args.join(' ');
    // Filtrer les logs du sélecteur
    if (str.includes('🎯') || str.includes('📊') || str.includes('🔍') ||
        str.includes('✨') || str.includes('Analyse') || str.includes('Top 5')) {
        return;
    }
    originalLog.apply(console, args);
};

async function quickTest() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  TEST RAPIDE ANTI-FOOTPRINT (3 générations/secteur)');
    console.log('═══════════════════════════════════════════════════\n');

    const tests = [
        { name: 'Restaurant 🍽️', keywords: ['restaurant', 'gastronomie', 'cuisine'] },
        { name: 'Fitness 💪', keywords: ['fitness', 'gym', 'sport'] },
        { name: 'Gaming 🎮', keywords: ['gaming', 'esports', 'game'] },
        { name: 'Photography 📸', keywords: ['photography', 'photographer', 'portfolio'] },
        { name: 'Medical ⚕️', keywords: ['medical', 'health', 'clinic'] }
    ];

    const allResults = new Map();

    for (const test of tests) {
        console.log(`\n${test.name}:`);
        const results = new Map();

        for (let i = 1; i <= 3; i++) {
            const selector = new IntelligentLayoutSelectorV2();
            const result = await selector.selectBestLayout(test.keywords, {});
            // result.layout est l'objet selectedLayout, qui contient result.layout.layout (le nom du fichier)
            const layoutName = result.layout.layout;
            results.set(layoutName, (results.get(layoutName) || 0) + 1);
            allResults.set(layoutName, (allResults.get(layoutName) || 0) + 1);
            console.log(`  ${i}. ${layoutName}`);
        }
    }

    console.log('\n\n═══════════════════════════════════════════════════');
    console.log('  RÉSULTATS');
    console.log('═══════════════════════════════════════════════════\n');

    console.log(`📊 Total layouts différents utilisés: ${allResults.size}`);
    console.log('\nLayouts sélectionnés:');
    Array.from(allResults.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([layout, count]) => {
            console.log(`  - ${layout}: ${count} fois`);
        });

    console.log('\n💡 Analyse:');
    if (allResults.size >= 8) {
        console.log('  🎉 EXCELLENT - Grande diversité!');
        console.log('  ✅ Système anti-footprint efficace.');
    } else if (allResults.size >= 5) {
        console.log('  👍 BON - Diversité correcte.');
    } else {
        console.log('  ⚠️  Diversité limitée.');
    }

    console.log('\n═══════════════════════════════════════════════════\n');
}

quickTest().catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
});
