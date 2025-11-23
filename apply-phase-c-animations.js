const fs = require('fs').promises;
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('         APPLICATION DES ANIMATIONS PHASE C');
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

// Animations avancées à ajouter
const ADVANCED_ANIMATIONS = `
        /* ═══════════════════════════════════════════════════════════════ */
        /* PHASE C - ANIMATIONS AVANCÉES */
        /* ═══════════════════════════════════════════════════════════════ */

        /* Keyframes - Fade In Up */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Keyframes - Fade In */
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        /* Keyframes - Slide In Left */
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Keyframes - Slide In Right */
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Keyframes - Scale In */
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Keyframes - Pulse */
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        /* Animation d'entrée pour le hero */
        [class*="hero"] h1,
        [class*="hero"] .hero-title,
        [class*="-hero"] h1 {
            animation: fadeInUp 0.8s ease-out;
        }

        [class*="hero"] p,
        [class*="hero"] .hero-subtitle,
        [class*="-hero"] p {
            animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }

        [class*="hero"] [class*="btn"],
        [class*="hero"] a[class*="btn"],
        [class*="-hero"] [class*="btn"] {
            animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }

        /* Animation pour les cards */
        [class*="card"]:not([class*="card-float"]),
        [class*="-card"],
        .feature,
        .feature-app {
            animation: fadeInUp 0.6s ease-out backwards;
        }

        /* Délais d'animation pour les cards (effet cascade) */
        [class*="card"]:nth-child(1),
        [class*="-card"]:nth-child(1),
        .feature:nth-child(1) {
            animation-delay: 0.1s;
        }

        [class*="card"]:nth-child(2),
        [class*="-card"]:nth-child(2),
        .feature:nth-child(2) {
            animation-delay: 0.2s;
        }

        [class*="card"]:nth-child(3),
        [class*="-card"]:nth-child(3),
        .feature:nth-child(3) {
            animation-delay: 0.3s;
        }

        [class*="card"]:nth-child(4),
        [class*="-card"]:nth-child(4) {
            animation-delay: 0.4s;
        }

        [class*="card"]:nth-child(5),
        [class*="-card"]:nth-child(5) {
            animation-delay: 0.5s;
        }

        [class*="card"]:nth-child(6),
        [class*="-card"]:nth-child(6) {
            animation-delay: 0.6s;
        }

        /* Animation pour les sections */
        section {
            animation: fadeIn 0.8s ease-out;
        }

        /* Animation pour la navigation */
        nav,
        [class*="nav"],
        [class*="-nav"] {
            animation: fadeIn 0.5s ease-out;
        }

        /* Animation pour les titres de sections */
        section h2,
        [class*="section"] h2 {
            animation: fadeInUp 0.6s ease-out;
        }

        /* Animation pour les stats */
        [class*="stat"] h3,
        [class*="-stat"] h3 {
            animation: scaleIn 0.8s ease-out backwards;
        }

        /* Animation hover pulse pour CTA */
        [class*="cta"] [class*="btn"]:hover,
        [class*="-cta"] [class*="btn"]:hover {
            animation: pulse 0.6s ease-in-out;
        }

        /* Optimisation animations avec prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
`;

async function applyAnimations() {
    let animated = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🚀 Démarrage des animations Phase C...\n');
    console.log('📋 Animations à appliquer:');
    console.log('  ✅ Fade In Up (hero, cards, sections)');
    console.log('  ✅ Fade In (global)');
    console.log('  ✅ Slide In Left/Right');
    console.log('  ✅ Scale In (stats)');
    console.log('  ✅ Pulse (CTA hover)');
    console.log('  ✅ Cascade effect (délais progressifs)');
    console.log('  ✅ Accessibility (prefers-reduced-motion)\n');
    console.log('─────────────────────────────────────────────────────────────────\n');

    for (const layout of layouts) {
        const fileName = `layout-${layout.num}-${layout.name}.html`;
        const filePath = path.join(layoutsDir, fileName);

        try {
            console.log(`📄 Layout ${layout.num} (${layout.name})...`);

            let html = await fs.readFile(filePath, 'utf8');

            // Vérifier si Phase C est déjà appliquée
            if (html.includes('PHASE C - ANIMATIONS AVANCÉES')) {
                console.log(`  ⏭️  Phase C déjà appliquée, passage au suivant\n`);
                skipped++;
                continue;
            }

            // Vérifier que Phase B est présente
            if (!html.includes('PHASE B - OPTIMISATIONS PERFORMANCE')) {
                console.log(`  ⚠️  Phase B non trouvée, Phase C requiert Phase B\n`);
                errors++;
                continue;
            }

            // Trouver la fin du bloc Phase B
            const phaseBEnd = html.indexOf('/* PHASE B - OPTIMISATIONS PERFORMANCE */');

            if (phaseBEnd === -1) {
                console.log(`  ❌ Bloc Phase B non trouvé\n`);
                errors++;
                continue;
            }

            // Trouver la fin du bloc Phase B
            const nextRule = html.indexOf('\n        }', phaseBEnd);
            const insertPosition = html.indexOf('\n', nextRule) + 1;

            // Insérer les animations
            html = html.slice(0, insertPosition) +
                   ADVANCED_ANIMATIONS +
                   html.slice(insertPosition);

            // Écrire le fichier
            await fs.writeFile(filePath, html, 'utf8');

            console.log(`  ✅ Animations appliquées avec succès`);
            console.log(`  📊 +${ADVANCED_ANIMATIONS.split('\n').length} lignes ajoutées`);
            console.log(`  🎬 6 keyframes ajoutées\n`);
            animated++;

        } catch (error) {
            console.log(`  ❌ Erreur: ${error.message}\n`);
            errors++;
        }
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('                      RÉSUMÉ DES ANIMATIONS');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log(`✅ Layouts animés:       ${animated}/20`);
    console.log(`⏭️  Layouts déjà à jour:  ${skipped}/20`);
    console.log(`❌ Erreurs:              ${errors}/20\n`);

    if (animated > 0) {
        console.log('🎉 ANIMATIONS PHASE C APPLIQUÉES AVEC SUCCÈS!\n');
        console.log('🎬 BÉNÉFICES VISUELS:');
        console.log('  • Hero animé au chargement (fade-in-up)');
        console.log('  • Cards avec effet cascade progressif');
        console.log('  • Sections avec fade-in élégant');
        console.log('  • Stats avec scale-in impactant');
        console.log('  • CTA avec pulse au hover');
        console.log('  • Navigation fluide dès le départ');
        console.log('  • Accessibilité: animations désactivables\n');
        console.log('  • Effet "WOW" professionnel garanti!\n');
    }

    if (animated + skipped === 20) {
        console.log('✅ TOUS LES LAYOUTS SONT MAINTENANT ANIMÉS (100%)!\n');
        console.log('🎬 EXPÉRIENCE PREMIUM MAXIMALE ATTEINTE!\n');
    }

    console.log('═══════════════════════════════════════════════════════════════════\n');
}

applyAnimations().catch(console.error);
