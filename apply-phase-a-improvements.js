const fs = require('fs').promises;
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('         APPLICATION DES AMÉLIORATIONS PHASE A');
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

// Amélioration universelle à ajouter
const UNIVERSAL_IMPROVEMENTS = `
        /* ═══════════════════════════════════════════════════════════════ */
        /* AMÉLIORATIONS PHASE A - UX Premium */
        /* ═══════════════════════════════════════════════════════════════ */

        /* Smooth Scroll Navigation */
        html {
            scroll-behavior: smooth;
        }

        /* Advanced Link Hover Effects */
        a {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        a:not([class*="btn"]):not([class*="button"]):hover {
            opacity: 0.8;
        }

        /* Enhanced Button Interactions */
        button,
        [class*="btn"],
        [class*="button"],
        [type="submit"] {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }

        button:hover,
        [class*="btn"]:hover,
        [class*="button"]:hover,
        [type="submit"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        button:active,
        [class*="btn"]:active,
        [class*="button"]:active,
        [type="submit"]:active {
            transform: translateY(0);
        }

        /* Premium Card Hover Effects */
        [class*="card"]:not([class*="card-float"]),
        [class*="-card"],
        .feature,
        .feature-app,
        .property-card,
        .course-card,
        .service-card,
        .portfolio-item,
        .product-card,
        .team-member,
        .testimonial,
        .pricing-card,
        .category-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [class*="card"]:hover:not([class*="card-float"]),
        [class*="-card"]:hover,
        .feature:hover,
        .feature-app:hover,
        .property-card:hover,
        .course-card:hover,
        .service-card:hover,
        .portfolio-item:hover,
        .product-card:hover,
        .team-member:hover,
        .testimonial:hover,
        .pricing-card:hover,
        .category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }

        /* Focus Styles for Accessibility */
        button:focus-visible,
        [class*="btn"]:focus-visible,
        a:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
            outline: 3px solid currentColor;
            outline-offset: 3px;
        }

        /* Input Fields Enhancement */
        input,
        select,
        textarea {
            transition: all 0.3s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
`;

async function applyImprovements() {
    let improved = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Démarrage des améliorations Phase A...\n');
    console.log('📋 Améliorations à appliquer:');
    console.log('  ✅ Smooth scroll navigation');
    console.log('  ✅ Advanced link hover effects');
    console.log('  ✅ Enhanced button interactions');
    console.log('  ✅ Premium card hover effects');
    console.log('  ✅ Focus styles for accessibility');
    console.log('  ✅ Input fields enhancement\n');
    console.log('─────────────────────────────────────────────────────────────────\n');

    for (const layout of layouts) {
        const fileName = `layout-${layout.num}-${layout.name}.html`;
        const filePath = path.join(layoutsDir, fileName);

        try {
            console.log(`📄 Layout ${layout.num} (${layout.name})...`);

            let html = await fs.readFile(filePath, 'utf8');

            // Vérifier si les améliorations sont déjà appliquées
            if (html.includes('AMÉLIORATIONS PHASE A')) {
                console.log(`  ⏭️  Déjà amélioré, passage au suivant\n`);
                skipped++;
                continue;
            }

            // Trouver la position après * { margin: 0; padding: 0; box-sizing: border-box; }
            const insertPosition = html.indexOf('* { margin: 0; padding: 0; box-sizing: border-box; }');

            if (insertPosition === -1) {
                console.log(`  ❌ Pattern de base non trouvé\n`);
                errors++;
                continue;
            }

            // Trouver la fin de cette ligne
            const endOfLine = html.indexOf('\n', insertPosition);

            // Insérer les améliorations
            html = html.slice(0, endOfLine + 1) +
                   UNIVERSAL_IMPROVEMENTS +
                   html.slice(endOfLine + 1);

            // Écrire le fichier
            await fs.writeFile(filePath, html, 'utf8');

            console.log(`  ✅ Améliorations appliquées avec succès`);
            console.log(`  📊 +${UNIVERSAL_IMPROVEMENTS.split('\n').length} lignes ajoutées\n`);
            improved++;

        } catch (error) {
            console.log(`  ❌ Erreur: ${error.message}\n`);
            errors++;
        }
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                      RÉSUMÉ DES AMÉLIORATIONS');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log(`✅ Layouts améliorés:    ${improved}/20`);
    console.log(`⏭️  Layouts déjà à jour:  ${skipped}/20`);
    console.log(`❌ Erreurs:              ${errors}/20\n`);

    if (improved > 0) {
        console.log('🎉 AMÉLIORATIONS APPLIQUÉES AVEC SUCCÈS!\n');
        console.log('📊 BÉNÉFICES:');
        console.log('  • Navigation plus fluide (smooth scroll)');
        console.log('  • Interactions premium sur tous les boutons');
        console.log('  • Hover effects uniformes et professionnels');
        console.log('  • Meilleure accessibilité (focus visible)');
        console.log('  • Micro-interactions sur les formulaires\n');
    }

    if (improved + skipped === 20) {
        console.log('✅ TOUS LES LAYOUTS SONT MAINTENANT AMÉLIORÉS (100%)!\n');
    }

    console.log('═══════════════════════════════════════════════════════════════════\n');
}

applyImprovements().catch(console.error);
