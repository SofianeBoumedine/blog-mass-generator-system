/**
 * Analyse de la distribution des scores et labels
 */

const IntelligentLayoutSelectorV2 = require('../lib/intelligentLayoutSelectorV2');

class DistributionAnalyzer {
    constructor() {
        this.selector = new IntelligentLayoutSelectorV2();
    }

    analyzeDistribution() {
        console.log('📊 ANALYSE DE LA DISTRIBUTION DES SCORES ET LABELS\n');
        console.log('='.repeat(70));

        const layouts = this.selector.layoutDatabase;

        // 1. Distribution des scores de spécialisation
        this.analyzeSpecializationScores(layouts);

        // 2. Distribution des secteurs
        this.analyzeSectorDistribution(layouts);

        // 3. Distribution des types de mood
        this.analyzeMoodDistribution(layouts);

        // 4. Layouts universels vs spécialisés
        this.analyzeUniversalVsSpecialized(layouts);

        // 5. Qualité des labels par layout
        this.analyzeLabelQuality(layouts);
    }

    analyzeSpecializationScores(layouts) {
        console.log('\n📈 DISTRIBUTION DES SCORES DE SPÉCIALISATION');
        console.log('-'.repeat(50));

        const scoreRanges = {
            'Très spécialisé (80-100)': [],
            'Spécialisé (60-79)': [],
            'Modéré (40-59)': [],
            'Généraliste (0-39)': []
        };

        layouts.forEach(layout => {
            const score = layout.specialization_score || 0;
            if (score >= 80) {
                scoreRanges['Très spécialisé (80-100)'].push(layout.layout);
            } else if (score >= 60) {
                scoreRanges['Spécialisé (60-79)'].push(layout.layout);
            } else if (score >= 40) {
                scoreRanges['Modéré (40-59)'].push(layout.layout);
            } else {
                scoreRanges['Généraliste (0-39)'].push(layout.layout);
            }
        });

        Object.entries(scoreRanges).forEach(([range, layoutsList]) => {
            console.log(`\n${range}: ${layoutsList.length} layouts`);
            layoutsList.forEach(layout => {
                const layoutData = layouts.find(l => l.layout === layout);
                console.log(`  • ${layout} (${layoutData.specialization_score || 0}/100)`);
            });
        });
    }

    analyzeSectorDistribution(layouts) {
        console.log('\n🏢 DISTRIBUTION PAR SECTEURS');
        console.log('-'.repeat(50));

        const sectorCounts = {};

        layouts.forEach(layout => {
            if (layout.sectors_detailed) {
                layout.sectors_detailed.forEach(sector => {
                    sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
                });
            }
        });

        const sortedSectors = Object.entries(sectorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15);

        console.log('\nTop 15 secteurs les plus couverts:');
        sortedSectors.forEach(([sector, count]) => {
            console.log(`  ${sector}: ${count} layouts`);
        });
    }

    analyzeMoodDistribution(layouts) {
        console.log('\n🎭 DISTRIBUTION PAR MOOD/AMBIANCE');
        console.log('-'.repeat(50));

        const moodCounts = {};

        layouts.forEach(layout => {
            const mood = layout.mood || 'unknown';
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });

        const sortedMoods = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1]);

        console.log('\nDistribution des ambiances:');
        sortedMoods.forEach(([mood, count]) => {
            console.log(`  ${mood}: ${count} layouts`);
        });
    }

    analyzeUniversalVsSpecialized(layouts) {
        console.log('\n🌐 UNIVERSELS VS SPÉCIALISÉS');
        console.log('-'.repeat(50));

        const universal = layouts.filter(l => l.universal === true);
        const specialized = layouts.filter(l => l.universal !== true);

        console.log(`\nLayouts universels: ${universal.length}`);
        universal.forEach(layout => {
            console.log(`  • ${layout.layout} (spé: ${layout.specialization_score || 0}/100)`);
        });

        console.log(`\nLayouts spécialisés: ${specialized.length}`);
        specialized.slice(0, 10).forEach(layout => {
            console.log(`  • ${layout.layout} (spé: ${layout.specialization_score || 0}/100)`);
        });
        if (specialized.length > 10) {
            console.log(`  ... et ${specialized.length - 10} autres`);
        }
    }

    analyzeLabelQuality(layouts) {
        console.log('\n🏷️  QUALITÉ DES LABELS');
        console.log('-'.repeat(50));

        const labelCategories = [
            'sectors_detailed',
            'demographics_age',
            'demographics_profession',
            'psychology_emotions',
            'psychology_personality',
            'interactions_engagement',
            'conversion_goals',
            'formats_structure',
            'technical_performance',
            'complexity_content'
        ];

        let totalLabels = 0;
        let completeLayouts = 0;

        layouts.forEach(layout => {
            let categoryCount = 0;

            labelCategories.forEach(category => {
                if (layout[category] && Array.isArray(layout[category]) && layout[category].length > 0) {
                    categoryCount++;
                    totalLabels += layout[category].length;
                }
            });

            if (categoryCount >= 9) { // Au moins 9/10 catégories
                completeLayouts++;
            }
        });

        console.log(`\nLayouts avec labels complets (≥9/10 catégories): ${completeLayouts}/${layouts.length}`);
        console.log(`Nombre total de labels appliqués: ${totalLabels}`);
        console.log(`Moyenne de labels par layout: ${(totalLabels / layouts.length).toFixed(1)}`);

        // Layouts avec le plus de labels
        console.log('\nTop 5 layouts avec le plus de labels:');
        const layoutsWithCounts = layouts.map(layout => {
            let count = 0;
            labelCategories.forEach(category => {
                if (layout[category] && Array.isArray(layout[category])) {
                    count += layout[category].length;
                }
            });
            return { layout: layout.layout, count };
        }).sort((a, b) => b.count - a.count).slice(0, 5);

        layoutsWithCounts.forEach(({ layout, count }) => {
            console.log(`  • ${layout}: ${count} labels`);
        });
    }
}

// Script principal
async function main() {
    const analyzer = new DistributionAnalyzer();
    analyzer.analyzeDistribution();
}

// Lancer le script si appelé directement
if (require.main === module) {
    main().catch(console.error);
}

module.exports = DistributionAnalyzer;