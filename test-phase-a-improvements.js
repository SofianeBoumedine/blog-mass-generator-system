const fs = require('fs').promises;
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('            TESTS DES AMÉLIORATIONS PHASE A');
console.log('═══════════════════════════════════════════════════════════════════\n');

const layouts = [
    { num: 51, name: 'faq-center' }, { num: 52, name: 'app-showcase' },
    { num: 53, name: 'restaurant' }, { num: 54, name: 'real-estate' },
    { num: 55, name: 'education' }, { num: 56, name: 'medical' },
    { num: 57, name: 'fitness' }, { num: 58, name: 'events' },
    { num: 59, name: 'travel' }, { num: 60, name: 'nonprofit' },
    { num: 61, name: 'automotive' }, { num: 62, name: 'legal' },
    { num: 63, name: 'photography' }, { num: 64, name: 'beauty' },
    { num: 65, name: 'podcast' }, { num: 66, name: 'gaming' },
    { num: 67, name: 'wedding' }, { num: 68, name: 'coworking' },
    { num: 69, name: 'crypto' }, { num: 70, name: 'pets' }
];

const layoutsDir = path.join(__dirname, 'templates', 'layouts');

async function testImprovements() {
    const stats = {
        totalLayouts: 20,
        withSmoothScroll: 0,
        withAdvancedHover: 0,
        withFocusStyles: 0,
        withInputEnhancement: 0,
        allPassed: 0,
        sizeBefore: 0,
        sizeAfter: 0
    };

    console.log('🔍 Analyse des améliorations appliquées...\n');

    for (const layout of layouts) {
        const fileName = `layout-${layout.num}-${layout.name}.html`;
        const filePath = path.join(layoutsDir, fileName);

        try {
            const html = await fs.readFile(filePath, 'utf8');
            const fileStats = await fs.stat(filePath);
            stats.sizeAfter += fileStats.size;

            console.log(`📄 Layout ${layout.num} - ${layout.name}`);

            let passed = 0;
            let total = 4;

            // Test 1: Smooth Scroll
            if (html.includes('scroll-behavior: smooth')) {
                console.log('  ✅ Smooth scroll: OUI');
                stats.withSmoothScroll++;
                passed++;
            } else {
                console.log('  ❌ Smooth scroll: NON');
            }

            // Test 2: Advanced Hover Effects
            if (html.includes('Advanced Link Hover Effects') ||
                html.includes('Premium Card Hover Effects')) {
                console.log('  ✅ Hover effects avancés: OUI');
                stats.withAdvancedHover++;
                passed++;
            } else {
                console.log('  ❌ Hover effects avancés: NON');
            }

            // Test 3: Focus Styles
            if (html.includes('Focus Styles for Accessibility')) {
                console.log('  ✅ Focus accessibility: OUI');
                stats.withFocusStyles++;
                passed++;
            } else {
                console.log('  ❌ Focus accessibility: NON');
            }

            // Test 4: Input Enhancement
            if (html.includes('Input Fields Enhancement')) {
                console.log('  ✅ Input enhancement: OUI');
                stats.withInputEnhancement++;
                passed++;
            } else {
                console.log('  ❌ Input enhancement: NON');
            }

            // CSS valide
            const openBraces = (html.match(/\{/g) || []).length;
            const closeBraces = (html.match(/\}/g) || []).length;
            if (openBraces === closeBraces) {
                console.log('  ✅ CSS valide (accolades équilibrées)');
            } else {
                console.log(`  ⚠️  CSS potentiellement invalide (${openBraces} { vs ${closeBraces} })`);
            }

            // Taille fichier
            console.log(`  📊 Taille: ${(fileStats.size / 1024).toFixed(2)} KB`);

            if (passed === total) {
                console.log('  🎉 TOUTES LES AMÉLIORATIONS PRÉSENTES\n');
                stats.allPassed++;
            } else {
                console.log(`  ⚠️  ${passed}/${total} améliorations présentes\n`);
            }

        } catch (error) {
            console.log(`  ❌ Erreur: ${error.message}\n`);
        }
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                    STATISTIQUES GLOBALES');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log('📊 COUVERTURE DES AMÉLIORATIONS:\n');
    console.log(`  Smooth scroll:           ${stats.withSmoothScroll}/20 (${(stats.withSmoothScroll/20*100).toFixed(0)}%)`);
    console.log(`  Hover effects avancés:   ${stats.withAdvancedHover}/20 (${(stats.withAdvancedHover/20*100).toFixed(0)}%)`);
    console.log(`  Focus accessibility:     ${stats.withFocusStyles}/20 (${(stats.withFocusStyles/20*100).toFixed(0)}%)`);
    console.log(`  Input enhancement:       ${stats.withInputEnhancement}/20 (${(stats.withInputEnhancement/20*100).toFixed(0)}%)\n`);

    console.log('✅ RÉSULTAT:\n');
    console.log(`  Layouts 100% améliorés:  ${stats.allPassed}/20 (${(stats.allPassed/20*100).toFixed(0)}%)\n`);

    console.log('📈 IMPACT:\n');
    console.log(`  Taille totale après:     ${(stats.sizeAfter / 1024).toFixed(2)} KB`);
    console.log(`  Code ajouté par layout:  ~102 lignes CSS\n`);

    if (stats.allPassed === 20) {
        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('                 🎉 TOUS LES TESTS RÉUSSIS! 🎉');
        console.log('═══════════════════════════════════════════════════════════════════\n');
        console.log('✅ 100% des layouts ont reçu toutes les améliorations Phase A');
        console.log('✅ Navigation fluide activée sur tous les layouts');
        console.log('✅ Interactions premium uniformisées');
        console.log('✅ Accessibilité améliorée partout');
        console.log('✅ Formulaires avec micro-interactions\n');
        console.log('🚀 LE SYSTÈME EST MAINTENANT EN MODE PREMIUM!\n');
    } else {
        console.log('⚠️  Certains layouts nécessitent une vérification manuelle\n');
    }

    return stats;
}

testImprovements().catch(console.error);
