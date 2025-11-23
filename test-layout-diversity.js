const IntelligentLayoutSelectorV2 = require('./lib/intelligentLayoutSelectorV2');

async function testLayoutDiversity() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  TEST DE DIVERSITÉ DES LAYOUTS (ANTI-FOOTPRINT)');
    console.log('═══════════════════════════════════════════════════\n');

    // Test 1: Restaurant (devrait sélectionner layout-53 parfois)
    console.log('🍽️  TEST 1: Secteur RESTAURANT (10 générations)\n');
    const restaurantKeywords = ['restaurant', 'gastronomie', 'cuisine', 'chef', 'food'];
    const restaurantResults = new Map();

    for (let i = 1; i <= 10; i++) {
        const selector = new IntelligentLayoutSelectorV2();
        const result = await selector.selectBestLayout(restaurantKeywords, {});
        const layoutName = result.layout.replace('templates/layouts/', '');
        restaurantResults.set(layoutName, (restaurantResults.get(layoutName) || 0) + 1);
        console.log(`   Site ${i}: ${layoutName}`);
    }

    console.log('\n   Résumé:');
    restaurantResults.forEach((count, layout) => {
        console.log(`   - ${layout}: ${count} fois`);
    });

    // Test 2: Fitness (devrait sélectionner layout-57 parfois)
    console.log('\n\n💪  TEST 2: Secteur FITNESS (10 générations)\n');
    const fitnessKeywords = ['fitness', 'gym', 'sport', 'musculation', 'training', 'health'];
    const fitnessResults = new Map();

    for (let i = 1; i <= 10; i++) {
        const selector = new IntelligentLayoutSelectorV2();
        const result = await selector.selectBestLayout(fitnessKeywords, {});
        const layoutName = result.layout.replace('templates/layouts/', '');
        fitnessResults.set(layoutName, (fitnessResults.get(layoutName) || 0) + 1);
        console.log(`   Site ${i}: ${layoutName}`);
    }

    console.log('\n   Résumé:');
    fitnessResults.forEach((count, layout) => {
        console.log(`   - ${layout}: ${count} fois`);
    });

    // Test 3: Gaming (devrait sélectionner layout-66)
    console.log('\n\n🎮  TEST 3: Secteur GAMING (10 générations)\n');
    const gamingKeywords = ['gaming', 'esports', 'videogame', 'jeux', 'game', 'gamer'];
    const gamingResults = new Map();

    for (let i = 1; i <= 10; i++) {
        const selector = new IntelligentLayoutSelectorV2();
        const result = await selector.selectBestLayout(gamingKeywords, {});
        const layoutName = result.layout.replace('templates/layouts/', '');
        gamingResults.set(layoutName, (gamingResults.get(layoutName) || 0) + 1);
        console.log(`   Site ${i}: ${layoutName}`);
    }

    console.log('\n   Résumé:');
    gamingResults.forEach((count, layout) => {
        console.log(`   - ${layout}: ${count} fois`);
    });

    // Test 4: Photography (devrait sélectionner layout-63)
    console.log('\n\n📸  TEST 4: Secteur PHOTOGRAPHY (10 générations)\n');
    const photoKeywords = ['photography', 'photographer', 'portfolio', 'photo', 'creative'];
    const photoResults = new Map();

    for (let i = 1; i <= 10; i++) {
        const selector = new IntelligentLayoutSelectorV2();
        const result = await selector.selectBestLayout(photoKeywords, {});
        const layoutName = result.layout.replace('templates/layouts/', '');
        photoResults.set(layoutName, (photoResults.get(layoutName) || 0) + 1);
        console.log(`   Site ${i}: ${layoutName}`);
    }

    console.log('\n   Résumé:');
    photoResults.forEach((count, layout) => {
        console.log(`   - ${layout}: ${count} fois`);
    });

    // Test 5: Medical (devrait sélectionner layout-56)
    console.log('\n\n⚕️  TEST 5: Secteur MEDICAL (10 générations)\n');
    const medicalKeywords = ['medical', 'health', 'clinic', 'doctor', 'healthcare', 'hospital'];
    const medicalResults = new Map();

    for (let i = 1; i <= 10; i++) {
        const selector = new IntelligentLayoutSelectorV2();
        const result = await selector.selectBestLayout(medicalKeywords, {});
        const layoutName = result.layout.replace('templates/layouts/', '');
        medicalResults.set(layoutName, (medicalResults.get(layoutName) || 0) + 1);
        console.log(`   Site ${i}: ${layoutName}`);
    }

    console.log('\n   Résumé:');
    medicalResults.forEach((count, layout) => {
        console.log(`   - ${layout}: ${count} fois`);
    });

    // Analyse globale
    console.log('\n\n═══════════════════════════════════════════════════');
    console.log('  ANALYSE ANTI-FOOTPRINT');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('✅ Restaurant: ' + restaurantResults.size + ' layouts différents utilisés');
    console.log('✅ Fitness: ' + fitnessResults.size + ' layouts différents utilisés');
    console.log('✅ Gaming: ' + gamingResults.size + ' layouts différents utilisés');
    console.log('✅ Photography: ' + photoResults.size + ' layouts différents utilisés');
    console.log('✅ Medical: ' + medicalResults.size + ' layouts différents utilisés');

    const totalLayouts = new Set([
        ...restaurantResults.keys(),
        ...fitnessResults.keys(),
        ...gamingResults.keys(),
        ...photoResults.keys(),
        ...medicalResults.keys()
    ]);

    console.log('\n📊 Total layouts uniques utilisés: ' + totalLayouts.size);
    console.log('\n💡 Conclusion:');
    if (totalLayouts.size >= 10) {
        console.log('   🎉 EXCELLENT - Grande diversité de layouts!');
        console.log('   ✅ Le système anti-footprint fonctionne parfaitement.');
    } else if (totalLayouts.size >= 5) {
        console.log('   👍 BON - Diversité correcte de layouts.');
    } else {
        console.log('   ⚠️  ATTENTION - Diversité limitée.');
    }

    console.log('\n═══════════════════════════════════════════════════\n');
}

// Exécuter le test
testLayoutDiversity().catch(err => {
    console.error('Erreur lors du test:', err);
    process.exit(1);
});
