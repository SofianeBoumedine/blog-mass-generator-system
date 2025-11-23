/**
 * Script pour vérifier individuellement TOUS les layouts
 */

const IntelligentLayoutSelectorV2 = require('../lib/intelligentLayoutSelectorV2');

class LayoutChecker {
    constructor() {
        this.selector = new IntelligentLayoutSelectorV2();
    }

    async checkAllLayouts() {
        console.log('🔍 VÉRIFICATION COMPLÈTE DE TOUS LES LAYOUTS\n');
        console.log('='.repeat(60));

        // Liste complète de tous les layouts
        const allLayouts = [
            'layout-1-hero.html',
            'layout-2-split.html',
            'layout-3-cards.html',
            'layout-4-sidebar.html',
            'layout-5-minimal.html',
            'layout-6-dark.html',
            'layout-7-gradient.html',
            'layout-8-glass.html',
            'layout-9-brutalist.html',
            'layout-10-magazine.html',
            'layout-11-neumorphism.html',
            'layout-12-parallax.html',
            'layout-13-fullscreen.html',
            'layout-14-asymmetric.html',
            'layout-15-retrowave.html',
            'layout-16-cyberpunk.html',
            'layout-17-creative.html',
            'layout-18-corporate.html',
            'layout-19-vintage.html',
            'layout-20-modern.html',
            'layout-agency-creative.html',
            'layout-agency-creative-enhanced.html',
            'layout-ecommerce-premium.html',
            'layout-pets-cute.html',
            'layout-professional.html',
            'layout-saas-modern.html',
            'layout-saas-modern-enhanced.html',
            'layout-simple-bootstrap.html',
            'layout-simple-bulma.html',
            'layout-simple-tailwind.html'
        ];

        console.log(`📊 Total de layouts à vérifier: ${allLayouts.length}\n`);

        const results = {
            withDetailedLabels: [],
            withoutDetailedLabels: [],
            missingFromDatabase: []
        };

        // Vérifier chaque layout
        allLayouts.forEach((layoutName, index) => {
            console.log(`\n${index + 1}/${allLayouts.length}. Vérification: ${layoutName}`);

            const layoutData = this.selector.layoutDatabase.find(l => l.layout === layoutName);

            if (!layoutData) {
                console.log('   ❌ ABSENT de la base de données !');
                results.missingFromDatabase.push(layoutName);
                return;
            }

            // Vérifier les labels détaillés
            const hasDetailedLabels = this.checkDetailedLabels(layoutData);

            if (hasDetailedLabels.complete) {
                console.log(`   ✅ Labels complets (${hasDetailedLabels.count} catégories)`);
                console.log(`   🎯 Spécialisation: ${layoutData.specialization_score || 'N/A'}/100`);
                if (layoutData.sectors_detailed) {
                    console.log(`   🏢 Secteurs: ${layoutData.sectors_detailed.slice(0, 3).join(', ')}${layoutData.sectors_detailed.length > 3 ? '...' : ''}`);
                }
                results.withDetailedLabels.push(layoutName);
            } else {
                console.log(`   ⚠️  Labels incomplets (${hasDetailedLabels.count}/10 catégories)`);
                console.log(`   📋 Manquant: ${hasDetailedLabels.missing.join(', ')}`);
                results.withoutDetailedLabels.push(layoutName);
            }
        });

        // Résumé final
        console.log('\n' + '='.repeat(60));
        console.log('📋 RÉSUMÉ FINAL');
        console.log('='.repeat(60));
        console.log(`✅ Layouts avec labels complets: ${results.withDetailedLabels.length}/${allLayouts.length}`);
        console.log(`⚠️  Layouts avec labels incomplets: ${results.withoutDetailedLabels.length}`);
        console.log(`❌ Layouts absents de la DB: ${results.missingFromDatabase.length}`);

        if (results.withoutDetailedLabels.length > 0) {
            console.log('\n🔧 Layouts nécessitant des améliorations:');
            results.withoutDetailedLabels.forEach(layout => {
                console.log(`   • ${layout}`);
            });
        }

        if (results.missingFromDatabase.length > 0) {
            console.log('\n❌ Layouts manquants dans la base de données:');
            results.missingFromDatabase.forEach(layout => {
                console.log(`   • ${layout}`);
            });
        }

        if (results.withDetailedLabels.length === allLayouts.length) {
            console.log('\n🎉 PARFAIT ! Tous les layouts ont des labels détaillés !');
        } else {
            console.log(`\n⚠️  ${allLayouts.length - results.withDetailedLabels.length} layouts nécessitent encore du travail.`);
        }

        return results;
    }

    checkDetailedLabels(layoutData) {
        const expectedCategories = [
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

        let presentCount = 0;
        const missingCategories = [];

        expectedCategories.forEach(category => {
            if (layoutData[category] && Array.isArray(layoutData[category]) && layoutData[category].length > 0) {
                presentCount++;
            } else {
                missingCategories.push(category);
            }
        });

        return {
            complete: presentCount >= 8, // Au moins 8/10 catégories
            count: presentCount,
            missing: missingCategories
        };
    }

    // Méthode pour afficher les détails d'un layout spécifique
    showLayoutDetails(layoutName) {
        const layoutData = this.selector.layoutDatabase.find(l => l.layout === layoutName);

        if (!layoutData) {
            console.log(`❌ Layout ${layoutName} non trouvé dans la base de données`);
            return;
        }

        console.log(`\n📄 DÉTAILS DE ${layoutName}:`);
        console.log(`   🎯 Spécialisation: ${layoutData.specialization_score || 'N/A'}/100`);
        console.log(`   🏷️  Type: ${layoutData.type}`);
        console.log(`   🎨 Mood: ${layoutData.mood}`);
        console.log(`   🌐 Universel: ${layoutData.universal ? 'Oui' : 'Non'}`);

        const categories = [
            'sectors_detailed',
            'demographics_age',
            'psychology_emotions',
            'psychology_personality',
            'interactions_engagement',
            'conversion_goals',
            'technical_performance'
        ];

        categories.forEach(category => {
            if (layoutData[category] && layoutData[category].length > 0) {
                console.log(`   ${this.getCategoryIcon(category)} ${this.getCategoryName(category)}: ${layoutData[category].slice(0, 3).join(', ')}${layoutData[category].length > 3 ? '...' : ''}`);
            }
        });

        if (layoutData.micro_labels) {
            console.log(`   🔬 Micro-labels:`);
            Object.entries(layoutData.micro_labels).forEach(([key, values]) => {
                if (Array.isArray(values)) {
                    console.log(`      ${key}: ${values.slice(0, 2).join(', ')}`);
                }
            });
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'sectors_detailed': '🏢',
            'demographics_age': '👥',
            'psychology_emotions': '😊',
            'psychology_personality': '🎭',
            'interactions_engagement': '🖱️',
            'conversion_goals': '🎯',
            'technical_performance': '⚡',
            'complexity_content': '📊'
        };
        return icons[category] || '•';
    }

    getCategoryName(category) {
        const names = {
            'sectors_detailed': 'Secteurs',
            'demographics_age': 'Âge cible',
            'psychology_emotions': 'Émotions',
            'psychology_personality': 'Personnalité',
            'interactions_engagement': 'Engagement',
            'conversion_goals': 'Objectifs',
            'technical_performance': 'Technique',
            'complexity_content': 'Complexité'
        };
        return names[category] || category;
    }
}

// Script principal
async function main() {
    const checker = new LayoutChecker();

    const command = process.argv[2];
    const layoutName = process.argv[3];

    switch (command) {
        case 'all':
            await checker.checkAllLayouts();
            break;
        case 'details':
            if (!layoutName) {
                console.error('❌ Usage: node check-all-layouts.js details <layout-name>');
                process.exit(1);
            }
            checker.showLayoutDetails(layoutName);
            break;
        default:
            console.log('🔍 Script de vérification complète des layouts\n');
            console.log('Usage:');
            console.log('  node check-all-layouts.js all               - Vérifier tous les layouts');
            console.log('  node check-all-layouts.js details <layout>  - Détails d\'un layout spécifique');
            break;
    }
}

// Lancer le script si appelé directement
if (require.main === module) {
    main().catch(console.error);
}

module.exports = LayoutChecker;