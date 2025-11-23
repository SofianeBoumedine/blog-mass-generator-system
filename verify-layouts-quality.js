const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════');
console.log('  VÉRIFICATION QUALITÉ DE TOUS LES LAYOUTS (1-70)');
console.log('═══════════════════════════════════════════════════\n');

const REQUIRED_PLACEHOLDERS = [
    'meta_title', 'meta_description', 'brand_name',
    'hero_title', 'hero_subtitle', 'cta_primary',
    'feature_1_title', 'feature_2_title', 'feature_3_title',
    'copyright_text', 'framework_css', 'framework_js', 'navigation_menu'
];

let totalErrors = 0;
let totalWarnings = 0;

// Fonction pour vérifier les balises HTML
function checkHTMLTags(html, fileName) {
    const errors = [];

    // Vérifier les balises importantes
    const requiredTags = ['html', 'head', 'body', 'title'];
    requiredTags.forEach(tag => {
        if (!html.includes(`<${tag}`) || !html.includes(`</${tag}>`)) {
            errors.push(`Balise <${tag}> manquante ou non fermée`);
        }
    });

    // Vérifier DOCTYPE
    if (!html.includes('<!DOCTYPE html>')) {
        errors.push('DOCTYPE manquant');
    }

    // Vérifier charset
    if (!html.includes('charset=')) {
        errors.push('Charset non défini');
    }

    // Vérifier viewport
    if (!html.includes('viewport')) {
        errors.push('Meta viewport manquant');
    }

    return errors;
}

// Fonction pour vérifier le CSS
function checkCSS(html, fileName) {
    const errors = [];

    // Extraire le CSS
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleMatch) {
        errors.push('Pas de balise <style>');
        return errors;
    }

    const css = styleMatch[1];

    // Vérifier les accolades
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        errors.push(`Accolades CSS déséquilibrées (${openBraces} ouvrantes, ${closeBraces} fermantes)`);
    }

    return errors;
}

// Fonction pour vérifier les fonts Google
function checkGoogleFonts(html, fileName) {
    const warnings = [];

    // Vérifier si des fonts Google sont déclarées
    const fontMatch = html.match(/family=([^"&]+)/);
    if (fontMatch) {
        const fontName = fontMatch[1].replace(/\+/g, ' ').split(':')[0];

        // Vérifier que la font est utilisée dans le CSS
        if (!html.includes(`font-family:`) && !html.includes(`font-family :`)) {
            warnings.push(`Font Google "${fontName}" chargée mais jamais utilisée`);
        }
    }

    return warnings;
}

// Fonction pour extraire les placeholders
function extractPlaceholders(html) {
    const regex = /\{([a-z_0-9]+)\}/g;
    const placeholders = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
        placeholders.add(match[1]);
    }
    return Array.from(placeholders);
}

// Liste de tous les layouts avec noms
const layoutNames = {
    1: 'hero', 2: 'split', 3: 'cards', 4: 'grid', 5: 'minimal',
    6: 'dark', 7: 'gradient', 8: 'creative', 9: 'portfolio', 10: 'magazine',
    11: 'ecommerce', 12: 'landing', 13: 'fullscreen', 14: 'parallax', 15: 'retrowave',
    16: 'cyberpunk', 17: 'creative', 18: 'corporate', 19: 'vintage', 20: 'modern',
    21: 'startup', 22: 'agency', 23: 'saas', 24: 'blog', 25: 'news',
    26: 'video', 27: 'music', 28: 'store', 29: 'booking', 30: 'dashboard',
    31: 'docs', 32: 'pricing', 33: 'contact', 34: 'about', 35: 'team',
    36: 'jobs', 37: 'testimonial', 38: 'features', 39: 'product', 40: 'asymmetric',
    41: 'landing-form', 42: 'split-hero', 43: 'app-landing', 44: 'portfolio-grid',
    45: 'service-showcase', 46: 'product-launch', 47: 'subscription', 48: 'webinar',
    49: 'comparison', 50: 'masonry',
    51: 'faq-center', 52: 'app-showcase', 53: 'restaurant', 54: 'real-estate',
    55: 'education', 56: 'medical', 57: 'fitness', 58: 'events', 59: 'travel',
    60: 'nonprofit', 61: 'automotive', 62: 'legal', 63: 'photography',
    64: 'beauty', 65: 'podcast', 66: 'gaming', 67: 'wedding', 68: 'coworking',
    69: 'crypto', 70: 'pets'
};

const layoutsDir = path.join(__dirname, 'templates', 'layouts');
let layoutsChecked = 0;
let layoutsWithErrors = 0;
let layoutsWithWarnings = 0;

console.log('🔍 Analyse en cours...\n');

for (let num = 1; num <= 70; num++) {
    const fileName = `layout-${num}-${layoutNames[num]}.html`;
    const filePath = path.join(layoutsDir, fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ Layout ${num}: FICHIER MANQUANT - ${fileName}`);
        totalErrors++;
        continue;
    }

    layoutsChecked++;
    const html = fs.readFileSync(filePath, 'utf8');

    let hasError = false;
    let hasWarning = false;

    // 1. Vérifier les placeholders
    const foundPlaceholders = extractPlaceholders(html);
    const missingPlaceholders = REQUIRED_PLACEHOLDERS.filter(
        p => !foundPlaceholders.includes(p)
    );

    // 2. Vérifier HTML
    const htmlErrors = checkHTMLTags(html, fileName);

    // 3. Vérifier CSS
    const cssErrors = checkCSS(html, fileName);

    // 4. Vérifier fonts
    const fontWarnings = checkGoogleFonts(html, fileName);

    // Compiler les résultats
    const allErrors = [...htmlErrors, ...cssErrors];
    const allWarnings = [...fontWarnings];

    if (missingPlaceholders.length > 0) {
        allErrors.push(`${missingPlaceholders.length} placeholders manquants`);
    }

    if (allErrors.length > 0) {
        hasError = true;
        layoutsWithErrors++;
        totalErrors += allErrors.length;
        console.log(`❌ Layout ${num} (${layoutNames[num]}):`);
        allErrors.forEach(err => console.log(`   • ${err}`));
    }

    if (allWarnings.length > 0) {
        hasWarning = true;
        layoutsWithWarnings++;
        totalWarnings += allWarnings.length;
        if (!hasError) {
            console.log(`⚠️  Layout ${num} (${layoutNames[num]}):`);
        }
        allWarnings.forEach(warn => console.log(`   • ${warn}`));
    }

    if (!hasError && !hasWarning) {
        process.stdout.write('.');
        if (layoutsChecked % 10 === 0) process.stdout.write(` ${layoutsChecked}\n`);
    }
}

console.log('\n\n═══════════════════════════════════════════════════');
console.log('  RÉSUMÉ DE LA VÉRIFICATION QUALITÉ');
console.log('═══════════════════════════════════════════════════\n');

console.log(`📊 Layouts vérifiés: ${layoutsChecked}/70`);
console.log(`✅ Layouts sans problème: ${layoutsChecked - layoutsWithErrors - layoutsWithWarnings}`);
console.log(`❌ Layouts avec erreurs: ${layoutsWithErrors}`);
console.log(`⚠️  Layouts avec warnings: ${layoutsWithWarnings}`);
console.log(`\n   Total erreurs: ${totalErrors}`);
console.log(`   Total warnings: ${totalWarnings}\n`);

if (totalErrors === 0 && totalWarnings === 0) {
    console.log('🎉 PARFAIT! Tous les layouts sont impeccables!');
    console.log('✅ HTML valide');
    console.log('✅ CSS correct');
    console.log('✅ Placeholders complets');
    console.log('✅ Prêt pour production\n');
} else if (totalErrors === 0) {
    console.log('👍 BIEN! Aucune erreur critique.');
    console.log(`⚠️  ${totalWarnings} avertissement(s) mineur(s)\n`);
} else {
    console.log(`⚠️  ${totalErrors} erreur(s) à corriger\n`);
}

console.log('═══════════════════════════════════════════════════\n');

process.exit(totalErrors > 0 ? 1 : 0);
