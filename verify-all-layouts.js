/**
 * Script de vérification complète de TOUS les layouts
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

// Variables requises pour une one-page complète
const requiredVariables = [
    '{hero_title}',
    '{hero_subtitle}',
    '{hero_content}',
    '{services_title}',
    '{services_content}',
    '{about_title}',
    '{about_content}',
    '{pricing_title}',
    '{pricing_content}',
    '{testimonials_title}',
    '{testimonials_content}',
    '{contact_title}',
    '{contact_content}',
    '{cta_button}',
    '{brand_name}',
    '{navigation_menu}'
];

// Sections HTML requises
const requiredSections = [
    'SECTION SERVICES',
    'SECTION ABOUT',
    'SECTION PRICING',
    'SECTION TESTIMONIALS',
    'SECTION CONTACT'
];

function verifyLayout(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    const content = fs.readFileSync(filePath, 'utf8');

    const errors = [];
    const warnings = [];
    const info = [];

    // 1. Vérifier les variables requises
    const missingVars = [];
    requiredVariables.forEach(varName => {
        if (!content.includes(varName)) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        errors.push(`Variables manquantes: ${missingVars.join(', ')}`);
    }

    // 2. Vérifier les sections
    const missingSections = [];
    requiredSections.forEach(section => {
        if (!content.includes(section)) {
            missingSections.push(section);
        }
    });

    if (missingSections.length > 0) {
        errors.push(`Sections manquantes: ${missingSections.join(', ')}`);
    }

    // 3. Vérifier id="hero"
    if (!content.includes('id="hero"')) {
        warnings.push('Pas de id="hero" pour le smooth scroll');
    }

    // 4. Vérifier le CSS des sections
    if (!content.includes('.section') && !content.includes('.services-section')) {
        warnings.push('Styles CSS des sections possiblement manquants');
    }

    // 5. Vérifier la navigation
    if (!content.includes('{navigation_menu}')) {
        errors.push('Variable {navigation_menu} manquante');
    }

    // 6. Compter les variables totales
    const allVars = content.match(/\{[a-z_]+\}/g) || [];
    const uniqueVars = [...new Set(allVars)];
    info.push(`${uniqueVars.length} variables uniques trouvées`);

    // 7. Vérifier la taille du fichier
    const sizeKB = (content.length / 1024).toFixed(1);
    info.push(`Taille: ${sizeKB} KB`);

    return { errors, warnings, info };
}

async function verifyAllLayouts() {
    console.log('🔍 VÉRIFICATION COMPLÈTE DE TOUS LES LAYOUTS\n');
    console.log('='.repeat(80) + '\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html')).sort();

    let totalErrors = 0;
    let totalWarnings = 0;
    let perfectLayouts = 0;

    const results = [];

    files.forEach((file, index) => {
        const { errors, warnings, info } = verifyLayout(file);

        const status = errors.length === 0
            ? (warnings.length === 0 ? '✅ PARFAIT' : '⚠️  WARNING')
            : '❌ ERREUR';

        if (errors.length === 0 && warnings.length === 0) {
            perfectLayouts++;
        }

        totalErrors += errors.length;
        totalWarnings += warnings.length;

        results.push({
            file,
            status,
            errors,
            warnings,
            info
        });

        // Afficher le résumé
        console.log(`[${index + 1}/${files.length}] ${status} ${file}`);

        if (errors.length > 0) {
            errors.forEach(err => console.log(`     ❌ ${err}`));
        }

        if (warnings.length > 0) {
            warnings.forEach(warn => console.log(`     ⚠️  ${warn}`));
        }

        // Afficher les infos seulement pour les layouts avec problèmes
        if (errors.length > 0 || warnings.length > 0) {
            info.forEach(i => console.log(`     ℹ️  ${i}`));
        }

        console.log('');
    });

    // Rapport final
    console.log('='.repeat(80));
    console.log('\n📊 RAPPORT FINAL:\n');
    console.log(`   Total layouts: ${files.length}`);
    console.log(`   ✅ Parfaits: ${perfectLayouts}`);
    console.log(`   ⚠️  Avec warnings: ${results.filter(r => r.warnings.length > 0 && r.errors.length === 0).length}`);
    console.log(`   ❌ Avec erreurs: ${results.filter(r => r.errors.length > 0).length}`);
    console.log(`   Total erreurs: ${totalErrors}`);
    console.log(`   Total warnings: ${totalWarnings}`);

    if (perfectLayouts === files.length) {
        console.log('\n🎉 TOUS LES LAYOUTS SONT PARFAITS! 🎉\n');
    } else {
        console.log('\n⚠️  Des corrections sont nécessaires.\n');

        // Lister les layouts avec erreurs
        const layoutsWithErrors = results.filter(r => r.errors.length > 0);
        if (layoutsWithErrors.length > 0) {
            console.log('\n❌ Layouts à corriger:');
            layoutsWithErrors.forEach(r => {
                console.log(`   - ${r.file}`);
            });
        }
    }

    return {
        totalLayouts: files.length,
        perfect: perfectLayouts,
        withWarnings: results.filter(r => r.warnings.length > 0 && r.errors.length === 0).length,
        withErrors: results.filter(r => r.errors.length > 0).length
    };
}

verifyAllLayouts();
