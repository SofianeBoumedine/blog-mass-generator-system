/**
 * Script de test du système de labels ultra-détaillés
 * Démonstration de la précision du nouveau système de labeling
 */

const IntelligentLayoutSelectorV2 = require('../lib/intelligentLayoutSelectorV2');

class AdvancedLabelsTest {
    constructor() {
        this.selector = new IntelligentLayoutSelectorV2();
    }

    async runAllTests() {
        console.log('🧪 TEST DU SYSTÈME DE LABELS ULTRA-DÉTAILLÉS\n');
        console.log('='.repeat(60));

        // Test 1: Affichage des labels enrichis
        console.log('\n📊 TEST 1: LABELS ENRICHIS PAR LAYOUT');
        console.log('-'.repeat(40));
        this.testEnrichedLabels();

        // Test 2: Test de spécialisation des layouts
        console.log('\n🎯 TEST 2: SCORES DE SPÉCIALISATION');
        console.log('-'.repeat(40));
        this.testSpecializationScores();

        // Test 3: Test avec différents types de keywords
        console.log('\n🔍 TEST 3: PRÉCISION SELON LES KEYWORDS');
        console.log('-'.repeat(40));
        await this.testKeywordPrecision();

        // Test 4: Test des micro-labels
        console.log('\n🔬 TEST 4: MICRO-LABELS DÉTAILLÉS');
        console.log('-'.repeat(40));
        this.testMicroLabels();

        console.log('\n✅ TOUS LES TESTS TERMINÉS !');
    }

    /**
     * Test des labels enrichis
     */
    testEnrichedLabels() {
        const layouts = ['layout-pets-cute.html', 'layout-professional.html', 'layout-saas-modern-enhanced.html'];

        layouts.forEach(layoutName => {
            this.selector.displayAdvancedLabels(layoutName);
        });
    }

    /**
     * Test des scores de spécialisation
     */
    testSpecializationScores() {
        const layouts = this.selector.layoutDatabase
            .filter(l => l.specialization_score)
            .sort((a, b) => b.specialization_score - a.specialization_score)
            .slice(0, 10);

        console.log('Top 10 layouts les plus spécialisés:');
        layouts.forEach((layout, index) => {
            console.log(`  ${index + 1}. ${layout.layout}: ${layout.specialization_score}/100`);
            if (layout.sectors_detailed) {
                console.log(`     Secteurs: ${layout.sectors_detailed.slice(0, 3).join(', ')}`);
            }
        });

        console.log('\nLayouts universels (bas score de spécialisation):');
        const universalLayouts = this.selector.layoutDatabase
            .filter(l => l.universal)
            .slice(0, 5);

        universalLayouts.forEach(layout => {
            console.log(`  • ${layout.layout}: ${layout.specialization_score || 'N/A'}/100 (universel)`);
        });
    }

    /**
     * Test de précision avec différents keywords
     */
    async testKeywordPrecision() {
        const testCases = [
            {
                name: 'Site Chatons/Animaux',
                keywords: ['chatons', 'chat', 'mignon', 'adoption', 'veterinaire'],
                expectedTheme: 'pets'
            },
            {
                name: 'Site Consulting Business',
                keywords: ['consulting', 'entreprise', 'strategie', 'business', 'conseil'],
                expectedTheme: 'business'
            },
            {
                name: 'Site SaaS Tech',
                keywords: ['software', 'saas', 'api', 'cloud', 'intelligence artificielle'],
                expectedTheme: 'tech'
            },
            {
                name: 'Site E-commerce Mode',
                keywords: ['fashion', 'mode', 'vetements', 'boutique', 'style'],
                expectedTheme: 'ecommerce'
            },
            {
                name: 'Site Agence Créative',
                keywords: ['design', 'creative', 'portfolio', 'art', 'graphique'],
                expectedTheme: 'creative'
            }
        ];

        for (const testCase of testCases) {
            console.log(`\n🧪 Test: ${testCase.name}`);
            console.log(`Keywords: [${testCase.keywords.join(', ')}]`);

            const analysis = { theme: testCase.expectedTheme };
            const result = await this.selector.selectBestLayout(testCase.keywords, analysis);

            console.log(`✅ Layout sélectionné: ${result.layout.layout}`);
            console.log(`   Thème détecté: ${result.themeAnalysis.theme}`);
            console.log(`   Confiance: ${(result.themeAnalysis.confidence * 100).toFixed(1)}%`);

            // Vérifier si le layout sélectionné a les bons labels
            const selectedLayout = this.selector.layoutDatabase.find(l => l.layout === result.layout.layout);
            if (selectedLayout?.sectors_detailed?.includes(testCase.expectedTheme)) {
                console.log(`   ✅ Layout approprié au thème`);
            } else {
                console.log(`   ⚠️  Layout générique ou fallback`);
            }
        }
    }

    /**
     * Test des micro-labels
     */
    testMicroLabels() {
        console.log('Exemples de micro-labels par type de layout:');

        const exampleLayouts = [
            'layout-pets-cute.html',
            'layout-professional.html',
            'layout-saas-modern-enhanced.html'
        ];

        exampleLayouts.forEach(layoutName => {
            const layout = this.selector.layoutDatabase.find(l => l.layout === layoutName);
            if (layout?.micro_labels) {
                console.log(`\n📄 ${layoutName}:`);
                Object.entries(layout.micro_labels).forEach(([key, values]) => {
                    console.log(`  ${key}: ${Array.isArray(values) ? values.join(', ') : values}`);
                });
            }
        });
    }

    /**
     * Test comparatif: avant vs après les labels enrichis
     */
    async testComparison() {
        console.log('\n⚖️  COMPARAISON: Sélection simple vs Labels enrichis');
        console.log('-'.repeat(50));

        const keywords = ['chatons', 'mignon', 'veterinaire'];
        const analysis = { theme: 'pets' };

        // Sélection classique
        const classicResult = await this.selector.selectBestLayout(keywords, analysis);
        console.log('Méthode classique:');
        console.log(`  Layout: ${classicResult.layout.layout}`);
        console.log(`  Thème: ${classicResult.themeAnalysis.theme}`);

        // Avec labels enrichis (simulation)
        console.log('\nAvec labels enrichis:');
        const enrichedLayouts = this.selector.layoutDatabase
            .filter(l => l.sectors_detailed?.includes('pets'))
            .sort((a, b) => (b.specialization_score || 0) - (a.specialization_score || 0));

        if (enrichedLayouts.length > 0) {
            console.log(`  Layout: ${enrichedLayouts[0].layout}`);
            console.log(`  Spécialisation: ${enrichedLayouts[0].specialization_score}/100`);
            console.log(`  Labels pets: ${enrichedLayouts[0].sectors_detailed.filter(s => ['pets', 'veterinaire', 'animalerie', 'adoption'].includes(s)).join(', ')}`);
        }
    }

    /**
     * Génère un rapport détaillé du système de labels
     */
    generateLabelsReport() {
        console.log('\n📋 RAPPORT DÉTAILLÉ DU SYSTÈME DE LABELS');
        console.log('='.repeat(50));

        const stats = {
            totalLayouts: this.selector.layoutDatabase.length,
            specializedLayouts: this.selector.layoutDatabase.filter(l => l.specialization_score > 50).length,
            universalLayouts: this.selector.layoutDatabase.filter(l => l.universal).length,
            highlySpecialized: this.selector.layoutDatabase.filter(l => l.specialization_score > 80).length
        };

        console.log(`\nStatistiques générales:`);
        console.log(`  📄 Total layouts: ${stats.totalLayouts}`);
        console.log(`  🎯 Spécialisés (>50): ${stats.specializedLayouts}`);
        console.log(`  🌐 Universels: ${stats.universalLayouts}`);
        console.log(`  ⭐ Hautement spécialisés (>80): ${stats.highlySpecialized}`);

        // Couverture par secteur
        console.log(`\nCouverture par secteur:`);
        const sectors = {};
        this.selector.layoutDatabase.forEach(layout => {
            if (layout.sectors_detailed) {
                layout.sectors_detailed.forEach(sector => {
                    sectors[sector] = (sectors[sector] || 0) + 1;
                });
            }
        });

        Object.entries(sectors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([sector, count]) => {
                console.log(`  ${sector}: ${count} layouts`);
            });

        return stats;
    }
}

// Script principal
async function main() {
    const tester = new AdvancedLabelsTest();

    const command = process.argv[2];

    switch (command) {
        case 'all':
            await tester.runAllTests();
            break;
        case 'labels':
            tester.testEnrichedLabels();
            break;
        case 'scores':
            tester.testSpecializationScores();
            break;
        case 'precision':
            await tester.testKeywordPrecision();
            break;
        case 'micro':
            tester.testMicroLabels();
            break;
        case 'compare':
            await tester.testComparison();
            break;
        case 'report':
            tester.generateLabelsReport();
            break;
        default:
            console.log('🧪 Script de test du système de labels ultra-détaillés\n');
            console.log('Usage:');
            console.log('  node test-advanced-labels.js all        - Tous les tests');
            console.log('  node test-advanced-labels.js labels     - Test des labels enrichis');
            console.log('  node test-advanced-labels.js scores     - Test des scores de spécialisation');
            console.log('  node test-advanced-labels.js precision  - Test de précision selon keywords');
            console.log('  node test-advanced-labels.js micro      - Test des micro-labels');
            console.log('  node test-advanced-labels.js compare    - Comparaison avant/après');
            console.log('  node test-advanced-labels.js report     - Rapport détaillé');
            break;
    }
}

// Lancer le script si appelé directement
if (require.main === module) {
    main().catch(console.error);
}

module.exports = AdvancedLabelsTest;