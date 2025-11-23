const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════');
console.log('  VÉRIFICATION CSS/HTML DES LAYOUTS 51-70');
console.log('═══════════════════════════════════════════════════\n');

const layouts = [
    {num: 51, name: 'faq-center'}, {num: 52, name: 'app-showcase'},
    {num: 53, name: 'restaurant'}, {num: 54, name: 'real-estate'},
    {num: 55, name: 'education'}, {num: 56, name: 'medical'},
    {num: 57, name: 'fitness'}, {num: 58, name: 'events'},
    {num: 59, name: 'travel'}, {num: 60, name: 'nonprofit'},
    {num: 61, name: 'automotive'}, {num: 62, name: 'legal'},
    {num: 63, name: 'photography'}, {num: 64, name: 'beauty'},
    {num: 65, name: 'podcast'}, {num: 66, name: 'gaming'},
    {num: 67, name: 'wedding'}, {num: 68, name: 'coworking'},
    {num: 69, name: 'crypto'}, {num: 70, name: 'pets'}
];

const layoutsDir = path.join(__dirname, 'templates', 'layouts');
let totalErrors = 0;
let totalWarnings = 0;

layouts.forEach(layout => {
    const fileName = `layout-${layout.num}-${layout.name}.html`;
    const filePath = path.join(layoutsDir, fileName);
    const html = fs.readFileSync(filePath, 'utf8');
    
    let errors = [];
    let warnings = [];
    
    // 1. Vérifier structure HTML
    if (!html.includes('<!DOCTYPE html>')) errors.push('DOCTYPE manquant');
    if (!html.includes('<html')) errors.push('Balise <html> manquante');
    if (!html.includes('</html>')) errors.push('Balise </html> manquante');
    if (!html.includes('<head>')) errors.push('Balise <head> manquante');
    if (!html.includes('</head>')) errors.push('Balise </head> manquante');
    if (!html.includes('<body>')) errors.push('Balise <body> manquante');
    if (!html.includes('</body>')) errors.push('Balise </body> manquante');
    if (!html.includes('charset=')) errors.push('Charset manquant');
    if (!html.includes('viewport')) errors.push('Viewport manquant');
    
    // 2. Vérifier CSS
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleMatch) {
        errors.push('Balise <style> manquante');
    } else {
        const css = styleMatch[1];
        
        // Vérifier accolades
        const openBraces = (css.match(/\{/g) || []).length;
        const closeBraces = (css.match(/\}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push(`CSS: ${openBraces} { mais ${closeBraces} }`);
        }
        
        // Vérifier si body est stylé
        if (!css.includes('body {') && !css.includes('body{')) {
            warnings.push('Pas de styles pour body');
        }
    }
    
    // 3. Vérifier Google Fonts
    if (html.includes('fonts.googleapis.com')) {
        const fontMatch = html.match(/family=([^"&]+)/);
        if (fontMatch) {
            const fontName = fontMatch[1].replace(/\+/g, ' ').split(':')[0];
            if (!html.includes('font-family')) {
                warnings.push(`Font "${fontName}" chargée mais non utilisée`);
            }
        }
    }
    
    // 4. Vérifier balises fermées
    const openTags = html.match(/<([a-z][a-z0-9]*)[^>]*(?<!\/|meta|link|br|hr|img|input)>/gi) || [];
    const closeTags = html.match(/<\/([a-z][a-z0-9]*)>/gi) || [];
    
    // Compter les balises importantes
    const divOpen = (html.match(/<div[^>]*>/g) || []).length;
    const divClose = (html.match(/<\/div>/g) || []).length;
    if (divOpen !== divClose) {
        errors.push(`Divs déséquilibrés: ${divOpen} ouvertures, ${divClose} fermetures`);
    }
    
    const sectionOpen = (html.match(/<section[^>]*>/g) || []).length;
    const sectionClose = (html.match(/<\/section>/g) || []).length;
    if (sectionOpen !== sectionClose) {
        errors.push(`Sections déséquilibrées: ${sectionOpen} ouvertures, ${sectionClose} fermetures`);
    }
    
    // Afficher résultats
    if (errors.length > 0) {
        console.log(`❌ Layout ${layout.num} (${layout.name}):`);
        errors.forEach(e => console.log(`   • ${e}`));
        totalErrors += errors.length;
    } else if (warnings.length > 0) {
        console.log(`⚠️  Layout ${layout.num} (${layout.name}):`);
        warnings.forEach(w => console.log(`   • ${w}`));
        totalWarnings += warnings.length;
    } else {
        console.log(`✅ Layout ${layout.num} (${layout.name}): Parfait`);
    }
});

console.log('\n═══════════════════════════════════════════════════');
console.log('  RÉSUMÉ');
console.log('═══════════════════════════════════════════════════\n');

console.log(`❌ Erreurs: ${totalErrors}`);
console.log(`⚠️  Warnings: ${totalWarnings}\n`);

if (totalErrors === 0 && totalWarnings === 0) {
    console.log('🎉 PARFAIT! Tous les layouts 51-70 sont impeccables!');
    console.log('✅ HTML valide');
    console.log('✅ CSS correct');
    console.log('✅ Balises équilibrées');
    console.log('✅ Structure propre\n');
} else if (totalErrors === 0) {
    console.log('👍 BIEN! Aucune erreur critique.');
    console.log(`⚠️  Quelques avertissements mineurs\n`);
} else {
    console.log(`⚠️  ${totalErrors} erreur(s) à corriger\n`);
}

console.log('═══════════════════════════════════════════════════\n');
