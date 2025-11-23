/**
 * Vérification des layouts numérotés (layout-1 à layout-70)
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

console.log('🔍 VÉRIFICATION DES LAYOUTS NUMÉROTÉS (layout-1 à layout-70)\n');
console.log('='.repeat(100) + '\n');

// Lister les layouts numérotés
const allLayouts = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
const numberedLayouts = allLayouts.filter(f => f.match(/^layout-\d+/)).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
});

console.log(`📊 Total layouts numérotés: ${numberedLayouts.length}\n`);

let totalScore = 0;
let totalMax = 0;
const results = [];
let errorCount = 0;

// Analyser par batch pour affichage condensé
const batchSize = 10;
for (let i = 0; i < numberedLayouts.length; i += batchSize) {
    const batch = numberedLayouts.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(numberedLayouts.length / batchSize);

    console.log(`📦 Batch ${batchNum}/${totalBatches}: Layouts ${i + 1}-${Math.min(i + batchSize, numberedLayouts.length)}\n`);

    batch.forEach(file => {
        const filePath = path.join(layoutsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const size = (fs.statSync(filePath).size / 1024).toFixed(1);

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

        const hasErrors = failed > 0 || missingVars.length > 0;
        if (hasErrors) errorCount++;

        // Affichage condensé
        if (hasErrors) {
            console.log(`   ⚠️  ${file.padEnd(40)} ${grade} (${percentage}%) - ${size} KB`);
            if (failed > 0) {
                console.log(`       ❌ Manquant: ${missing.join(', ')}`);
            }
            if (missingVars.length > 0) {
                console.log(`       ⚠️  Variables: ${missingVars.slice(0, 3).join(', ')}${missingVars.length > 3 ? '...' : ''}`);
            }
        } else {
            console.log(`   ✅ ${file.padEnd(40)} ${grade} (${percentage}%)`);
        }

        results.push({
            file,
            score,
            percentage: parseFloat(percentage),
            grade,
            missing: missing.length,
            missingVars: missingVars.length,
            size
        });
    });

    console.log('');
}

// Résumé
console.log('='.repeat(100));
console.log('\n📊 RÉSUMÉ GLOBAL\n');

const avgPercentage = ((totalScore / totalMax) * 100).toFixed(1);
console.log(`   Score moyen: ${avgPercentage}%`);
console.log(`   Score total: ${totalScore}/${totalMax}`);
console.log(`   Layouts parfaits: ${results.filter(r => r.percentage === 100).length}/${numberedLayouts.length}`);
console.log(`   Layouts avec problèmes: ${errorCount}/${numberedLayouts.length}`);

// Distribution des grades
const gradeDistribution = {};
results.forEach(r => {
    const gradeKey = r.grade.split(' ')[1];
    gradeDistribution[gradeKey] = (gradeDistribution[gradeKey] || 0) + 1;
});

console.log('\n   Distribution:');
Object.entries(gradeDistribution).sort().reverse().forEach(([grade, count]) => {
    const bar = '█'.repeat(Math.floor(count / 5));
    console.log(`      ${grade}: ${bar} ${count}`);
});

// Statistiques par score
const scoreRanges = {
    '100%': results.filter(r => r.percentage === 100).length,
    '95-99%': results.filter(r => r.percentage >= 95 && r.percentage < 100).length,
    '90-94%': results.filter(r => r.percentage >= 90 && r.percentage < 95).length,
    '85-89%': results.filter(r => r.percentage >= 85 && r.percentage < 90).length,
    '<85%': results.filter(r => r.percentage < 85).length
};

console.log('\n   Par score:');
Object.entries(scoreRanges).forEach(([range, count]) => {
    if (count > 0) {
        const bar = '█'.repeat(Math.floor(count / 5));
        console.log(`      ${range.padEnd(10)}: ${bar} ${count}`);
    }
});

// Layouts problématiques
const problematic = results.filter(r => r.percentage < 90);
if (problematic.length > 0) {
    console.log(`\n⚠️  LAYOUTS À AMÉLIORER (< 90%): ${problematic.length}\n`);
    problematic.slice(0, 10).forEach(r => {
        console.log(`   • ${r.file}: ${r.percentage}% (${r.missing} optimisations, ${r.missingVars} variables)`);
    });
    if (problematic.length > 10) {
        console.log(`   ... et ${problematic.length - 10} autres`);
    }
}

// Top 10
console.log(`\n🏆 TOP 10 LAYOUTS:\n`);
results.sort((a, b) => b.percentage - a.percentage).slice(0, 10).forEach((r, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
    console.log(`   ${medal} ${r.file.padEnd(45)} ${r.grade} (${r.percentage}%)`);
});

console.log('\n' + '='.repeat(100) + '\n');

if (avgPercentage >= 95) {
    console.log('🎉 EXCELLENT! Tous les layouts numérotés sont optimisés au niveau entreprise!\n');
} else if (avgPercentage >= 90) {
    console.log('✅ TRÈS BIEN! Les layouts numérotés sont bien optimisés.\n');
} else if (avgPercentage >= 80) {
    console.log('⚠️  BIEN! Quelques optimisations peuvent être ajoutées.\n');
} else {
    console.log('🔧 ATTENTION! Les layouts numérotés nécessitent des optimisations.\n');
}
