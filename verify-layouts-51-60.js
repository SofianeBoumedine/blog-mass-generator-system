const fs = require('fs');
const path = require('path');

// Liste des placeholders requis
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

// Fonction pour extraire tous les placeholders d'un fichier HTML
function extractPlaceholders(html) {
    const regex = /\{([a-z_0-9]+)\}/g;
    const placeholders = new Set();
    let match;

    while ((match = regex.exec(html)) !== null) {
        placeholders.add(match[1]);
    }

    return Array.from(placeholders);
}

// Vérifier les layouts 51-60
console.log('═══════════════════════════════════════════════════');
console.log('  VÉRIFICATION DES LAYOUTS 51-60');
console.log('═══════════════════════════════════════════════════\n');

const layoutsDir = path.join(__dirname, 'templates', 'layouts');
const layoutsToCheck = [
    { num: 51, name: 'FAQ Center' },
    { num: 52, name: 'App Showcase' },
    { num: 53, name: 'Restaurant' },
    { num: 54, name: 'Real Estate' },
    { num: 55, name: 'Education' },
    { num: 56, name: 'Medical' },
    { num: 57, name: 'Fitness' },
    { num: 58, name: 'Events' },
    { num: 59, name: 'Travel' },
    { num: 60, name: 'Nonprofit' }
];

const nameMapping = {
    51: 'faq-center',
    52: 'app-showcase',
    53: 'restaurant',
    54: 'real-estate',
    55: 'education',
    56: 'medical',
    57: 'fitness',
    58: 'events',
    59: 'travel',
    60: 'nonprofit'
};

let allValid = true;
const results = [];

layoutsToCheck.forEach(layout => {
    const fileName = `layout-${layout.num}-${nameMapping[layout.num]}.html`;
    const filePath = path.join(layoutsDir, fileName);

    console.log(`\n📄 Layout ${layout.num}: ${layout.name}`);
    console.log(`   Fichier: ${fileName}`);

    if (!fs.existsSync(filePath)) {
        console.log(`   ❌ FICHIER NON TROUVÉ`);
        allValid = false;
        results.push({ layout: layout.num, name: layout.name, status: 'MISSING', missing: [] });
        return;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const foundPlaceholders = extractPlaceholders(html);

    const missingPlaceholders = REQUIRED_PLACEHOLDERS.filter(
        placeholder => !foundPlaceholders.includes(placeholder)
    );

    if (missingPlaceholders.length === 0) {
        console.log(`   ✅ Tous les placeholders requis présents (${REQUIRED_PLACEHOLDERS.length}/${REQUIRED_PLACEHOLDERS.length})`);
        results.push({ layout: layout.num, name: layout.name, status: 'OK', missing: [] });
    } else {
        console.log(`   ❌ Placeholders manquants (${missingPlaceholders.length}):`);
        missingPlaceholders.forEach(p => console.log(`      - {${p}}`));
        allValid = false;
        results.push({ layout: layout.num, name: layout.name, status: 'INCOMPLETE', missing: missingPlaceholders });
    }

    console.log(`   📋 Total placeholders: ${foundPlaceholders.length}`);
});

// Résumé final
console.log('\n═══════════════════════════════════════════════════');
console.log('  RÉSUMÉ');
console.log('═══════════════════════════════════════════════════\n');

const okCount = results.filter(r => r.status === 'OK').length;
const incompleteCount = results.filter(r => r.status === 'INCOMPLETE').length;
const missingCount = results.filter(r => r.status === 'MISSING').length;

console.log(`✅ Layouts complets: ${okCount}/10`);
console.log(`⚠️  Layouts incomplets: ${incompleteCount}/10`);
console.log(`❌ Layouts manquants: ${missingCount}/10`);

if (allValid) {
    console.log('\n🎉 SUCCÈS: Tous les layouts 51-60 sont complets!\n');
} else {
    console.log('\n⚠️  ATTENTION: Certains layouts nécessitent des corrections\n');
}

console.log('═══════════════════════════════════════════════════\n');

process.exit(allValid ? 0 : 1);
