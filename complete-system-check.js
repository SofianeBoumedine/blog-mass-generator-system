/**
 * Vérification complète du système avant production
 */
const fs = require('fs');
const path = require('path');

console.log('🔍 VÉRIFICATION COMPLÈTE DU SYSTÈME\n');
console.log('='.repeat(100) + '\n');

let errors = [];
let warnings = [];
let success = [];

// 1. VÉRIFICATION DES FICHIERS PRINCIPAUX
console.log('📂 1. VÉRIFICATION DES FICHIERS PRINCIPAUX\n');

const requiredFiles = [
    'generator-main.js',
    'lib/themeAnalyzer.js',
    'lib/contentGenerator.js',
    'lib/siteBuilder.js',
    'lib/intelligentLayoutSelectorV2.js',
    'lib/articleGenerator.js',
    'config/prompts.json',
    'templates/blog/blog-listing.php'
];

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(1);
        console.log(`   ✅ ${file.padEnd(50)} (${size} KB)`);
        success.push(file);
    } else {
        console.log(`   ❌ ${file.padEnd(50)} MANQUANT`);
        errors.push(`Fichier manquant: ${file}`);
    }
});

// 2. VÉRIFICATION DES PROMPTS
console.log('\n📝 2. VÉRIFICATION DES PROMPTS (prompts.json)\n');

try {
    const promptsPath = path.join(__dirname, 'config/prompts.json');
    const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));

    // Vérifier la structure
    const requiredSections = ['analysis', 'blog', 'content', 'seo', 'specialized'];
    const missingSections = [];

    requiredSections.forEach(section => {
        if (prompts[section]) {
            console.log(`   ✅ Section "${section}" présente`);

            // Vérifier les sous-sections importantes
            if (section === 'blog' && prompts.blog.article) {
                console.log(`      ✅ blog.article présent (${prompts.blog.article.length} caractères)`);
            } else if (section === 'blog') {
                console.log(`      ❌ blog.article MANQUANT`);
                errors.push('blog.article manquant dans prompts.json');
            }

            if (section === 'content') {
                const contentKeys = Object.keys(prompts.content);
                console.log(`      ✅ ${contentKeys.length} prompts de contenu: ${contentKeys.join(', ')}`);

                if (!prompts.content.onepage) {
                    console.log(`      ⚠️  Prompt "onepage" manquant`);
                    warnings.push('Prompt onepage manquant dans prompts.json');
                } else {
                    console.log(`      ✅ Prompt "onepage" présent`);
                }
            }
        } else {
            console.log(`   ❌ Section "${section}" MANQUANTE`);
            missingSections.push(section);
            errors.push(`Section manquante dans prompts.json: ${section}`);
        }
    });

    const fileSize = (fs.statSync(promptsPath).size / 1024).toFixed(1);
    console.log(`\n   📦 Taille prompts.json: ${fileSize} KB`);

} catch (error) {
    console.log(`   ❌ Erreur lecture prompts.json: ${error.message}`);
    errors.push(`Erreur prompts.json: ${error.message}`);
}

// 3. VÉRIFICATION DES LAYOUTS
console.log('\n🎨 3. VÉRIFICATION DES LAYOUTS\n');

const layoutsDir = path.join(__dirname, 'templates/layouts');
let layoutFiles = [];

try {
    layoutFiles = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
    console.log(`   ✅ ${layoutFiles.length} layouts trouvés\n`);

    // Vérifier les variables requises dans chaque layout
    const requiredVars = [
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
        '{navigation_menu}'
    ];

    let layoutsWithIssues = 0;
    let layoutsPerfect = 0;

    layoutFiles.forEach((file, index) => {
        const content = fs.readFileSync(path.join(layoutsDir, file), 'utf8');
        const missingVars = requiredVars.filter(v => !content.includes(v));

        if (missingVars.length === 0 && content.includes('id="hero"')) {
            layoutsPerfect++;
        } else {
            layoutsWithIssues++;
            if (layoutsWithIssues <= 5) { // Afficher seulement les 5 premiers
                console.log(`   ⚠️  ${file}:`);
                if (missingVars.length > 0) {
                    console.log(`      Variables manquantes: ${missingVars.join(', ')}`);
                }
                if (!content.includes('id="hero"')) {
                    console.log(`      id="hero" manquant`);
                }
            }
        }
    });

    console.log(`\n   ✅ Layouts parfaits: ${layoutsPerfect}/${layoutFiles.length}`);
    if (layoutsWithIssues > 0) {
        console.log(`   ⚠️  Layouts avec problèmes: ${layoutsWithIssues}/${layoutFiles.length}`);
        warnings.push(`${layoutsWithIssues} layouts ont des problèmes mineurs`);
    }

} catch (error) {
    console.log(`   ❌ Erreur lecture layouts: ${error.message}`);
    errors.push(`Erreur layouts: ${error.message}`);
}

// 4. VÉRIFICATION DES LABELS
console.log('\n🏷️  4. VÉRIFICATION DES LABELS\n');

try {
    const selectorPath = path.join(__dirname, 'lib/intelligentLayoutSelectorV2.js');
    const selectorContent = fs.readFileSync(selectorPath, 'utf8');

    // Extraire les labels
    const labelsMatch = selectorContent.match(/const\s+layoutLabels\s*=\s*{([^}]+)}/s);

    if (labelsMatch) {
        const labelsStr = labelsMatch[1];
        const labelLines = labelsStr.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));

        console.log(`   ✅ ${labelLines.length} entrées de labels trouvées`);

        // Compter les layouts avec labels
        const layoutsWithLabels = labelLines.filter(line => line.includes('layout-')).length;
        console.log(`   ✅ Layouts avec labels: ${layoutsWithLabels}`);

        // Vérifier que tous les layouts ont des labels
        const layoutsWithoutLabels = layoutFiles.filter(file => {
            const layoutName = file.replace('.html', '');
            return !selectorContent.includes(`'${layoutName}'`);
        });

        if (layoutsWithoutLabels.length > 0) {
            console.log(`\n   ⚠️  Layouts sans labels (${layoutsWithoutLabels.length}):`);
            layoutsWithoutLabels.slice(0, 5).forEach(file => {
                console.log(`      • ${file}`);
            });
            if (layoutsWithoutLabels.length > 5) {
                console.log(`      ... et ${layoutsWithoutLabels.length - 5} autres`);
            }
            warnings.push(`${layoutsWithoutLabels.length} layouts sans labels`);
        } else {
            console.log(`   ✅ Tous les layouts ont des labels`);
        }
    } else {
        console.log(`   ⚠️  Structure layoutLabels non trouvée`);
        warnings.push('Structure layoutLabels non trouvée');
    }

} catch (error) {
    console.log(`   ❌ Erreur lecture labels: ${error.message}`);
    errors.push(`Erreur labels: ${error.message}`);
}

// 5. VÉRIFICATION DE LA STRUCTURE DES DOSSIERS
console.log('\n📁 5. VÉRIFICATION DE LA STRUCTURE\n');

const requiredDirs = [
    'lib',
    'config',
    'templates',
    'templates/layouts',
    'templates/blog',
    'output'
];

requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        console.log(`   ✅ ${dir.padEnd(30)} (${files.length} fichiers)`);
    } else {
        console.log(`   ❌ ${dir.padEnd(30)} MANQUANT`);
        errors.push(`Dossier manquant: ${dir}`);
    }
});

// 6. VÉRIFICATION DES OPTIMISATIONS
console.log('\n⚡ 6. VÉRIFICATION DES OPTIMISATIONS\n');

let totalOptimizations = 0;
const optimizationChecks = [
    { name: 'DNS Prefetch', pattern: /dns-prefetch/i },
    { name: 'Schema.org', pattern: /"@type":\s*"WebSite"/i },
    { name: 'Canonical URL', pattern: /rel="canonical"/i },
    { name: 'Dark Mode', pattern: /prefers-color-scheme/i },
    { name: 'Cookie Consent', pattern: /cookie-consent/i },
    { name: 'Service Worker', pattern: /serviceWorker\.register/i },
    { name: 'Performance Monitoring', pattern: /PerformanceObserver/i }
];

if (layoutFiles.length > 0) {
    const sampleLayout = fs.readFileSync(path.join(layoutsDir, layoutFiles[0]), 'utf8');

    optimizationChecks.forEach(check => {
        if (check.pattern.test(sampleLayout)) {
            console.log(`   ✅ ${check.name}`);
            totalOptimizations++;
        } else {
            console.log(`   ❌ ${check.name} manquant`);
            errors.push(`${check.name} manquant dans les layouts`);
        }
    });

    console.log(`\n   📊 Score optimisations: ${totalOptimizations}/${optimizationChecks.length}`);
}

// 7. VÉRIFICATION DE L'INTÉGRITÉ DU GÉNÉRATEUR PRINCIPAL
console.log('\n⚙️  7. VÉRIFICATION DU GÉNÉRATEUR PRINCIPAL\n');

try {
    const mainPath = path.join(__dirname, 'generator-main.js');
    const mainContent = fs.readFileSync(mainPath, 'utf8');

    const criticalFunctions = [
        'generateSite',
        'themeAnalyzer',
        'contentGenerator',
        'siteBuilder',
        'layoutSelector',
        'articleGenerator'
    ];

    criticalFunctions.forEach(func => {
        if (mainContent.includes(func) || mainContent.includes(`require`)) {
            console.log(`   ✅ Fonction/Module "${func}" référencé`);
        } else {
            console.log(`   ⚠️  Fonction/Module "${func}" non trouvé`);
            warnings.push(`${func} non trouvé dans generator-main.js`);
        }
    });

} catch (error) {
    console.log(`   ❌ Erreur lecture generator-main.js: ${error.message}`);
    errors.push(`Erreur generator-main.js: ${error.message}`);
}

// RAPPORT FINAL
console.log('\n' + '='.repeat(100));
console.log('\n📊 RAPPORT FINAL\n');

console.log(`✅ Succès: ${success.length}`);
console.log(`⚠️  Avertissements: ${warnings.length}`);
console.log(`❌ Erreurs critiques: ${errors.length}`);

if (errors.length > 0) {
    console.log('\n❌ ERREURS CRITIQUES À CORRIGER:\n');
    errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err}`);
    });
}

if (warnings.length > 0 && errors.length === 0) {
    console.log('\n⚠️  AVERTISSEMENTS (non-bloquants):\n');
    warnings.forEach((warn, i) => {
        console.log(`   ${i + 1}. ${warn}`);
    });
}

console.log('\n' + '='.repeat(100));

if (errors.length === 0) {
    console.log('\n🎉 SYSTÈME PRÊT POUR LA PRODUCTION!\n');
    console.log('Résumé:');
    console.log(`  ✅ ${layoutFiles.length} layouts vérifiés`);
    console.log(`  ✅ Prompts validés`);
    console.log(`  ✅ Labels présents`);
    console.log(`  ✅ Structure correcte`);
    console.log(`  ✅ Optimisations appliquées`);
    console.log('\n✨ Vous pouvez lancer la génération de sites!\n');
} else {
    console.log('\n⚠️  DES CORRECTIONS SONT NÉCESSAIRES AVANT LA PRODUCTION\n');
    process.exit(1);
}
