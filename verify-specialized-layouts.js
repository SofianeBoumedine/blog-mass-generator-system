/**
 * Vérification des layouts spécialisés
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

// Critères de vérification
const checks = [
    { name: 'DNS Prefetch', pattern: /dns-prefetch/i },
    { name: 'Schema.org', pattern: /"@type":\s*"(WebSite|Organization)"/i },
    { name: 'Canonical URL', pattern: /rel="canonical"/i },
    { name: 'Meta Robots', pattern: /name="robots"/i },
    { name: 'Skip to Content', pattern: /skip-to-content/i },
    { name: 'ARIA Labels', pattern: /aria-label/i },
    { name: 'Dark Mode', pattern: /prefers-color-scheme/i },
    { name: 'Cookie Consent', pattern: /cookie-consent/i },
    { name: 'Service Worker', pattern: /serviceWorker\.register/i },
    { name: 'Theme Color', pattern: /theme-color/i },
    { name: 'Performance Monitoring', pattern: /PerformanceObserver/i },
    { name: 'Open Graph', pattern: /og:title|og:description/i }
];

// Variables requises one-page
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

console.log('🔍 VÉRIFICATION DES LAYOUTS SPÉCIALISÉS\n');
console.log('='.repeat(100) + '\n');

// Lister les layouts spécialisés
const allLayouts = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
const specializedLayouts = allLayouts.filter(f => !f.match(/^layout-\d+/));

console.log(`📊 Total layouts spécialisés: ${specializedLayouts.length}\n`);

let totalScore = 0;
let totalMax = 0;
const results = [];

specializedLayouts.forEach((file, index) => {
    const filePath = path.join(layoutsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const size = (fs.statSync(filePath).size / 1024).toFixed(1);

    console.log(`\n[${ index + 1}/${specializedLayouts.length}] ${file} (${size} KB)`);

    let score = 0;
    let passed = 0;
    let failed = 0;
    const missing = [];

    // Vérifier les optimisations
    checks.forEach(check => {
        if (check.pattern.test(content)) {
            passed++;
            score++;
        } else {
            failed++;
            missing.push(check.name);
        }
    });

    // Vérifier les variables requises
    const missingVars = requiredVars.filter(v => !content.includes(v));

    const percentage = ((score / checks.length) * 100).toFixed(1);
    totalScore += score;
    totalMax += checks.length;

    let grade;
    if (percentage >= 95) grade = '🟢 A+';
    else if (percentage >= 90) grade = '🟢 A';
    else if (percentage >= 85) grade = '🟡 B+';
    else if (percentage >= 80) grade = '🟡 B';
    else if (percentage >= 75) grade = '🟠 C+';
    else grade = '🔴 C';

    console.log(`   Score: ${score}/${checks.length} (${percentage}%) ${grade}`);
    console.log(`   ✅ Optimisations présentes: ${passed}`);

    if (failed > 0) {
        console.log(`   ❌ Optimisations manquantes: ${failed}`);
        console.log(`      ${missing.join(', ')}`);
    }

    if (missingVars.length > 0) {
        console.log(`   ⚠️  Variables manquantes: ${missingVars.length}`);
        if (missingVars.length <= 3) {
            console.log(`      ${missingVars.join(', ')}`);
        }
    } else {
        console.log(`   ✅ Toutes les variables one-page présentes`);
    }

    results.push({
        file,
        score,
        percentage: parseFloat(percentage),
        grade,
        missing: missing.length,
        missingVars: missingVars.length
    });
});

// Résumé
console.log('\n' + '='.repeat(100));
console.log('\n📊 RÉSUMÉ GLOBAL\n');

const avgPercentage = ((totalScore / totalMax) * 100).toFixed(1);
console.log(`   Score moyen: ${avgPercentage}%`);
console.log(`   Score total: ${totalScore}/${totalMax}`);

// Distribution des grades
const gradeDistribution = {};
results.forEach(r => {
    const gradeKey = r.grade.split(' ')[1];
    gradeDistribution[gradeKey] = (gradeDistribution[gradeKey] || 0) + 1;
});

console.log('\n   Distribution:');
Object.entries(gradeDistribution).sort().reverse().forEach(([grade, count]) => {
    const bar = '█'.repeat(count);
    console.log(`      ${grade}: ${bar} ${count}`);
});

// Layouts problématiques
const problematic = results.filter(r => r.percentage < 90);
if (problematic.length > 0) {
    console.log(`\n⚠️  LAYOUTS À AMÉLIORER (< 90%):\n`);
    problematic.forEach(r => {
        console.log(`   • ${r.file}: ${r.percentage}% (${r.missing} optimisations manquantes)`);
    });
}

// Top layouts
console.log(`\n🏆 TOP LAYOUTS:\n`);
results.sort((a, b) => b.percentage - a.percentage).slice(0, 5).forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    console.log(`   ${medal} ${r.file.padEnd(45)} ${r.grade} (${r.percentage}%)`);
});

console.log('\n' + '='.repeat(100) + '\n');

if (avgPercentage >= 95) {
    console.log('🎉 EXCELLENT! Tous les layouts spécialisés sont optimisés au niveau entreprise!\n');
} else if (avgPercentage >= 90) {
    console.log('✅ TRÈS BIEN! Les layouts spécialisés sont bien optimisés.\n');
} else if (avgPercentage >= 80) {
    console.log('⚠️  BIEN! Quelques optimisations peuvent être ajoutées.\n');
} else {
    console.log('🔧 ATTENTION! Les layouts spécialisés nécessitent des optimisations.\n');
}
