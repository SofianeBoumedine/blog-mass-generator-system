#!/usr/bin/env node
/**
 * Vérifie que les 20 nouveaux layouts ont tous les placeholders nécessaires
 */

const fs = require('fs');
const path = require('path');

// Placeholders ESSENTIELS que chaque layout doit avoir
const REQUIRED_PLACEHOLDERS = [
    'meta_title',
    'meta_description',
    'brand_name',
    'hero_title',
    'hero_subtitle',
    'cta_primary',
    'feature_1_title',
    'feature_2_title',
    'feature_3_title',
    'copyright_text',
    'framework_css',
    'framework_js',
    'navigation_menu'
];

// Placeholders RECOMMANDÉS (warning si absents)
const RECOMMENDED_PLACEHOLDERS = [
    'tagline',
    'color_primary',
    'color_secondary',
    'feature_1_description',
    'feature_2_description',
    'feature_3_description',
    'contact_email',
    'footer_content'
];

function extractPlaceholders(html) {
    const regex = /{([a-zA-Z_][a-zA-Z0-9_]*)}/g;
    const placeholders = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
        placeholders.add(match[1]);
    }
    return placeholders;
}

function verifyLayout(layoutFile) {
    const layoutPath = path.join(__dirname, 'templates', 'layouts', layoutFile);
    const html = fs.readFileSync(layoutPath, 'utf8');
    const placeholders = extractPlaceholders(html);

    const result = {
        file: layoutFile,
        total: placeholders.size,
        missing: [],
        warnings: [],
        ok: true
    };

    // Vérifier les placeholders requis
    REQUIRED_PLACEHOLDERS.forEach(required => {
        if (!placeholders.has(required)) {
            result.missing.push(required);
            result.ok = false;
        }
    });

    // Vérifier les placeholders recommandés
    RECOMMENDED_PLACEHOLDERS.forEach(recommended => {
        if (!placeholders.has(recommended)) {
            result.warnings.push(recommended);
        }
    });

    return result;
}

function main() {
    console.log('🔍 VÉRIFICATION DES 20 NOUVEAUX LAYOUTS\n');
    console.log('═'.repeat(80) + '\n');

    const layoutsDir = path.join(__dirname, 'templates', 'layouts');
    const newLayouts = fs.readdirSync(layoutsDir)
        .filter(f => {
            const match = f.match(/layout-(\d+)/);
            if (!match) return false;
            const num = parseInt(match[1]);
            return num >= 21 && num <= 40 && f.endsWith('.html');
        })
        .sort();

    let totalOK = 0;
    let totalProblems = 0;
    const problems = [];

    newLayouts.forEach((file, index) => {
        const result = verifyLayout(file);

        console.log(`[${index + 1}/20] ${file}`);
        console.log(`   📊 ${result.total} placeholders totaux`);

        if (result.missing.length > 0) {
            console.log(`   ❌ ${result.missing.length} REQUIS MANQUANTS:`);
            result.missing.forEach(p => console.log(`      - {${p}}`));
            totalProblems++;
            problems.push({ file, missing: result.missing });
        } else {
            console.log(`   ✅ Tous les placeholders requis présents`);
            totalOK++;
        }

        if (result.warnings.length > 0) {
            console.log(`   ⚠️  ${result.warnings.length} recommandés absents: ${result.warnings.slice(0, 3).join(', ')}${result.warnings.length > 3 ? '...' : ''}`);
        }

        console.log('');
    });

    console.log('═'.repeat(80));
    console.log('\n📊 RÉSUMÉ FINAL\n');
    console.log(`Layouts vérifiés: ${newLayouts.length}`);
    console.log(`Layouts OK: ${totalOK}`);
    console.log(`Layouts avec problèmes: ${totalProblems}`);

    if (totalProblems > 0) {
        console.log('\n❌ PROBLÈMES DÉTECTÉS:\n');
        problems.forEach(({ file, missing }) => {
            console.log(`${file}:`);
            missing.forEach(p => console.log(`   - {${p}}`));
        });
        console.log('\n⚠️  ACTION REQUISE: Ajouter les placeholders manquants');
        process.exit(1);
    } else {
        console.log('\n✅ PARFAIT: Tous les nouveaux layouts ont les placeholders requis!\n');
        console.log('📋 Placeholders requis vérifiés:');
        REQUIRED_PLACEHOLDERS.forEach(p => console.log(`   ✅ {${p}}`));
        console.log('');
    }
}

main();
