const fs = require('fs').promises;
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('     VÉRIFICATION DÉTAILLÉE DE CHAQUE LAYOUT (51-70)');
console.log('═══════════════════════════════════════════════════════════════════\n');

const REQUIRED_PLACEHOLDERS = [
    'meta_title', 'meta_description', 'brand_name',
    'hero_title', 'hero_subtitle', 'cta_primary',
    'feature_1_title', 'feature_2_title', 'feature_3_title',
    'copyright_text', 'framework_css', 'framework_js', 'navigation_menu'
];

const layouts = [
    { num: 51, name: 'faq-center', description: 'FAQ/Support Center' },
    { num: 52, name: 'app-showcase', description: 'App Mobile Showcase' },
    { num: 53, name: 'restaurant', description: 'Restaurant/Food' },
    { num: 54, name: 'real-estate', description: 'Immobilier/Real Estate' },
    { num: 55, name: 'education', description: 'Formation/Éducation' },
    { num: 56, name: 'medical', description: 'Médical/Santé' },
    { num: 57, name: 'fitness', description: 'Fitness/Sport' },
    { num: 58, name: 'events', description: 'Événements' },
    { num: 59, name: 'travel', description: 'Voyage/Tourisme' },
    { num: 60, name: 'nonprofit', description: 'Association/ONG' },
    { num: 61, name: 'automotive', description: 'Automobile' },
    { num: 62, name: 'legal', description: 'Juridique/Avocat' },
    { num: 63, name: 'photography', description: 'Photographie' },
    { num: 64, name: 'beauty', description: 'Beauté/Spa' },
    { num: 65, name: 'podcast', description: 'Podcast/Audio' },
    { num: 66, name: 'gaming', description: 'Gaming/Esports' },
    { num: 67, name: 'wedding', description: 'Mariage' },
    { num: 68, name: 'coworking', description: 'Coworking' },
    { num: 69, name: 'crypto', description: 'Crypto/Blockchain' },
    { num: 70, name: 'pets', description: 'Animaux/Vétérinaire' }
];

const layoutsDir = path.join(__dirname, 'templates', 'layouts');
let totalErrors = 0;
let totalWarnings = 0;
let perfectLayouts = 0;

/**
 * Vérifie un layout en détail
 */
async function checkLayout(layout) {
    const fileName = `layout-${layout.num}-${layout.name}.html`;
    const filePath = path.join(layoutsDir, fileName);

    console.log(`\n${'─'.repeat(67)}`);
    console.log(`📄 LAYOUT ${layout.num}: ${layout.description.toUpperCase()}`);
    console.log(`   Fichier: ${fileName}`);
    console.log(`${'─'.repeat(67)}\n`);

    let errors = [];
    let warnings = [];
    let checks = {
        fileExists: false,
        htmlStructure: false,
        cssValid: false,
        placeholders: false,
        balancedTags: false,
        googleFonts: false,
        metaTags: false,
        responsive: false
    };

    // 1. Vérifier que le fichier existe
    try {
        await fs.access(filePath);
        checks.fileExists = true;
        console.log('✅ Fichier existe');
    } catch (error) {
        errors.push('Fichier introuvable');
        console.log('❌ Fichier introuvable');
        totalErrors++;
        return { checks, errors, warnings };
    }

    // Lire le contenu
    const html = await fs.readFile(filePath, 'utf8');
    const fileSize = (html.length / 1024).toFixed(2);
    console.log(`✅ Taille: ${fileSize} KB`);

    // 2. Vérifier la structure HTML de base
    const htmlChecks = {
        doctype: html.includes('<!DOCTYPE html>'),
        htmlTag: html.includes('<html'),
        htmlClose: html.includes('</html>'),
        headTag: html.includes('<head>'),
        headClose: html.includes('</head>'),
        bodyTag: html.includes('<body>'),
        bodyClose: html.includes('</body>'),
        charset: html.includes('charset='),
        viewport: html.includes('viewport'),
        title: html.includes('<title>')
    };

    const allHtmlValid = Object.values(htmlChecks).every(v => v);
    checks.htmlStructure = allHtmlValid;

    if (allHtmlValid) {
        console.log('✅ Structure HTML5 complète');
    } else {
        const missing = Object.entries(htmlChecks)
            .filter(([k, v]) => !v)
            .map(([k]) => k);
        errors.push(`Structure HTML incomplète: ${missing.join(', ')}`);
        console.log(`❌ Structure HTML incomplète: ${missing.join(', ')}`);
        totalErrors++;
    }

    // 3. Vérifier les meta tags
    const metaChecks = {
        charset: html.includes('charset='),
        viewport: html.includes('viewport'),
        title: html.includes('<title>'),
        hasMetaTags: html.match(/<meta/g)?.length >= 3
    };

    checks.metaTags = Object.values(metaChecks).every(v => v);
    if (checks.metaTags) {
        console.log('✅ Meta tags présents');
    } else {
        warnings.push('Meta tags incomplets');
        console.log('⚠️  Meta tags incomplets');
        totalWarnings++;
    }

    // 4. Vérifier le CSS
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleMatch) {
        errors.push('Balise <style> manquante');
        console.log('❌ Balise <style> manquante');
        totalErrors++;
    } else {
        const css = styleMatch[1];
        const openBraces = (css.match(/\{/g) || []).length;
        const closeBraces = (css.match(/\}/g) || []).length;

        if (openBraces === closeBraces) {
            checks.cssValid = true;
            console.log(`✅ CSS valide (${openBraces} règles)`);
        } else {
            errors.push(`CSS déséquilibré: ${openBraces} { vs ${closeBraces} }`);
            console.log(`❌ CSS déséquilibré: ${openBraces} { vs ${closeBraces} }`);
            totalErrors++;
        }

        // Vérifier responsive
        if (css.includes('@media')) {
            checks.responsive = true;
            console.log('✅ Responsive design (@media queries)');
        } else {
            warnings.push('Pas de @media queries');
            console.log('⚠️  Pas de @media queries');
            totalWarnings++;
        }
    }

    // 5. Vérifier les balises équilibrées
    const divOpen = (html.match(/<div[^>]*>/g) || []).length;
    const divClose = (html.match(/<\/div>/g) || []).length;
    const sectionOpen = (html.match(/<section[^>]*>/g) || []).length;
    const sectionClose = (html.match(/<\/section>/g) || []).length;

    if (divOpen === divClose && sectionOpen === sectionClose) {
        checks.balancedTags = true;
        console.log(`✅ Balises équilibrées (${divOpen} div, ${sectionOpen} sections)`);
    } else {
        if (divOpen !== divClose) {
            errors.push(`Divs déséquilibrés: ${divOpen} ouvertures, ${divClose} fermetures`);
            console.log(`❌ Divs déséquilibrés: ${divOpen} vs ${divClose}`);
            totalErrors++;
        }
        if (sectionOpen !== sectionClose) {
            errors.push(`Sections déséquilibrées: ${sectionOpen} ouvertures, ${sectionClose} fermetures`);
            console.log(`❌ Sections déséquilibrées: ${sectionOpen} vs ${sectionClose}`);
            totalErrors++;
        }
    }

    // 6. Vérifier les placeholders requis
    const regex = /\{([a-z_0-9]+)\}/g;
    const foundPlaceholders = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
        foundPlaceholders.add(match[1]);
    }

    const missingPlaceholders = REQUIRED_PLACEHOLDERS.filter(p => !foundPlaceholders.has(p));
    const extraPlaceholders = Array.from(foundPlaceholders).filter(p => !REQUIRED_PLACEHOLDERS.includes(p));

    if (missingPlaceholders.length === 0) {
        checks.placeholders = true;
        console.log(`✅ Tous les placeholders requis (13/13)`);
        if (foundPlaceholders.size > 13) {
            console.log(`   ℹ️  ${foundPlaceholders.size} placeholders au total (+${foundPlaceholders.size - 13} additionnels)`);
        }
    } else {
        errors.push(`${missingPlaceholders.length} placeholders manquants`);
        console.log(`❌ ${missingPlaceholders.length} placeholders manquants:`);
        missingPlaceholders.forEach(p => console.log(`   • {${p}}`));
        totalErrors++;
    }

    // 7. Vérifier Google Fonts
    if (html.includes('fonts.googleapis.com')) {
        checks.googleFonts = true;
        const fontMatch = html.match(/family=([^"&]+)/);
        if (fontMatch) {
            const fontName = fontMatch[1].replace(/\+/g, ' ').split(':')[0];
            console.log(`✅ Google Font: ${fontName}`);

            // Vérifier que la font est utilisée dans le CSS
            if (styleMatch && styleMatch[1].includes('font-family')) {
                console.log('✅ Font utilisée dans le CSS');
            } else {
                warnings.push('Font chargée mais non utilisée');
                console.log('⚠️  Font chargée mais non utilisée');
                totalWarnings++;
            }
        }
    } else {
        warnings.push('Pas de Google Font');
        console.log('⚠️  Pas de Google Font');
        totalWarnings++;
    }

    // 8. Vérifier la présence de sections importantes
    const sections = {
        nav: html.includes('<nav'),
        header: html.includes('<header'),
        main: html.includes('<main'),
        footer: html.includes('<footer')
    };

    const sectionsPresent = Object.entries(sections).filter(([k, v]) => v).length;
    console.log(`ℹ️  Sections sémantiques: ${sectionsPresent}/4 (nav, header, main, footer)`);

    // 9. Compter les éléments interactifs
    const buttons = (html.match(/<button/g) || []).length;
    const links = (html.match(/<a /g) || []).length;
    const forms = (html.match(/<form/g) || []).length;
    console.log(`ℹ️  Éléments: ${buttons} boutons, ${links} liens, ${forms} formulaires`);

    // RÉSUMÉ DU LAYOUT
    console.log('\n📊 RÉSUMÉ:');
    const allChecks = Object.values(checks).every(v => v);

    if (allChecks && errors.length === 0 && warnings.length === 0) {
        console.log('   🎉 PARFAIT! Layout 100% valide');
        perfectLayouts++;
    } else if (errors.length === 0) {
        console.log(`   👍 BON (${warnings.length} avertissement${warnings.length > 1 ? 's' : ''})`);
    } else {
        console.log(`   ⚠️  PROBLÈMES: ${errors.length} erreur${errors.length > 1 ? 's' : ''}, ${warnings.length} warning${warnings.length > 1 ? 's' : ''}`);
    }

    return { checks, errors, warnings };
}

/**
 * Fonction principale
 */
async function run() {
    const results = [];

    for (const layout of layouts) {
        const result = await checkLayout(layout);
        results.push({
            layout: layout.num,
            name: layout.name,
            description: layout.description,
            ...result
        });
    }

    // RÉSUMÉ FINAL
    console.log('\n\n═══════════════════════════════════════════════════════════════════');
    console.log('                     RÉSUMÉ FINAL DÉTAILLÉ');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    console.log('📊 STATISTIQUES GLOBALES:\n');
    console.log(`   • Layouts vérifiés: ${layouts.length}`);
    console.log(`   • Layouts parfaits: ${perfectLayouts} (${((perfectLayouts / layouts.length) * 100).toFixed(0)}%)`);
    console.log(`   • Erreurs totales: ${totalErrors}`);
    console.log(`   • Avertissements totaux: ${totalWarnings}\n`);

    // Lister les layouts par état
    const perfect = results.filter(r => r.errors.length === 0 && r.warnings.length === 0);
    const withWarnings = results.filter(r => r.errors.length === 0 && r.warnings.length > 0);
    const withErrors = results.filter(r => r.errors.length > 0);

    if (perfect.length > 0) {
        console.log(`🎉 PARFAITS (${perfect.length}):`, perfect.map(r => r.layout).join(', '));
    }

    if (withWarnings.length > 0) {
        console.log(`⚠️  AVEC WARNINGS (${withWarnings.length}):`, withWarnings.map(r => r.layout).join(', '));
    }

    if (withErrors.length > 0) {
        console.log(`❌ AVEC ERREURS (${withErrors.length}):`, withErrors.map(r => r.layout).join(', '));
    }

    console.log('\n───────────────────────────────────────────────────────────────────');
    console.log('VÉRIFICATIONS PAR CRITÈRE:\n');

    const criteriaStats = {
        'Fichiers existants': results.filter(r => r.checks.fileExists).length,
        'Structure HTML': results.filter(r => r.checks.htmlStructure).length,
        'CSS valide': results.filter(r => r.checks.cssValid).length,
        'Placeholders OK': results.filter(r => r.checks.placeholders).length,
        'Balises équilibrées': results.filter(r => r.checks.balancedTags).length,
        'Google Fonts': results.filter(r => r.checks.googleFonts).length,
        'Meta tags': results.filter(r => r.checks.metaTags).length,
        'Responsive': results.filter(r => r.checks.responsive).length
    };

    Object.entries(criteriaStats).forEach(([criteria, count]) => {
        const percentage = ((count / layouts.length) * 100).toFixed(0);
        const icon = count === layouts.length ? '✅' : count > layouts.length * 0.8 ? '⚠️' : '❌';
        console.log(`   ${icon} ${criteria}: ${count}/${layouts.length} (${percentage}%)`);
    });

    console.log('\n═══════════════════════════════════════════════════════════════════');

    if (totalErrors === 0 && totalWarnings === 0) {
        console.log('\n🎉 EXCELLENT! TOUS LES LAYOUTS SONT PARFAITS!\n');
        console.log('✅ Aucune erreur détectée');
        console.log('✅ Aucun avertissement');
        console.log('✅ 20/20 layouts validés');
        console.log('✅ Structure propre et organisée');
        console.log('✅ Prêt pour production\n');
    } else if (totalErrors === 0) {
        console.log('\n👍 BON! Layouts fonctionnels\n');
        console.log(`⚠️  ${totalWarnings} avertissement(s) mineur(s)`);
        console.log('✅ Aucune erreur critique');
        console.log('✅ Utilisable en production\n');
    } else {
        console.log('\n⚠️  DES CORRECTIONS SONT NÉCESSAIRES\n');
        console.log(`❌ ${totalErrors} erreur(s) détectée(s)`);
        console.log(`⚠️  ${totalWarnings} avertissement(s)\n`);
    }

    console.log('═══════════════════════════════════════════════════════════════════\n');

    process.exit(totalErrors > 0 ? 1 : 0);
}

run().catch(console.error);
