/**
 * Vérification finale complète avec scoring avancé
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

// Critères de vérification avancés
const advancedChecks = [
    // Performance (6 critères)
    { name: 'DNS Prefetch', pattern: /dns-prefetch/i, category: 'performance', weight: 2 },
    { name: 'Preconnect', pattern: /preconnect/i, category: 'performance', weight: 2 },
    { name: 'Lazy Loading', pattern: /loading="lazy"/i, category: 'performance', weight: 3 },
    { name: 'Performance Monitoring', pattern: /PerformanceObserver|Web Vitals/i, category: 'performance', weight: 2 },
    { name: 'Will-Change Optimization', pattern: /will-change:/i, category: 'performance', weight: 1 },

    // SEO (7 critères)
    { name: 'Schema.org WebSite', pattern: /"@type":\s*"WebSite"/i, category: 'seo', weight: 3 },
    { name: 'Schema.org Organization', pattern: /"@type":\s*"Organization"/i, category: 'seo', weight: 2 },
    { name: 'Canonical URL', pattern: /rel="canonical"/i, category: 'seo', weight: 3 },
    { name: 'Meta Robots', pattern: /name="robots"/i, category: 'seo', weight: 2 },
    { name: 'Open Graph Enrichi', pattern: /og:site_name|og:locale/i, category: 'seo', weight: 2 },
    { name: 'Twitter Card', pattern: /twitter:card/i, category: 'seo', weight: 1 },

    // Accessibilité (5 critères)
    { name: 'Skip to Content', pattern: /skip-to-content/i, category: 'accessibility', weight: 3 },
    { name: 'ARIA Labels', pattern: /aria-label/i, category: 'accessibility', weight: 2 },
    { name: 'Focus Visible', pattern: /focus-visible/i, category: 'accessibility', weight: 2 },
    { name: 'Screen Reader Only', pattern: /sr-only/i, category: 'accessibility', weight: 1 },
    { name: 'Keyboard Navigation', pattern: /keydown|keyboard/i, category: 'accessibility', weight: 2 },

    // UX (5 critères)
    { name: 'Scroll to Top', pattern: /scrollToTop|scroll-to-top/i, category: 'ux', weight: 2 },
    { name: 'Dark Mode', pattern: /prefers-color-scheme/i, category: 'ux', weight: 3 },
    { name: 'Reduced Motion', pattern: /prefers-reduced-motion/i, category: 'ux', weight: 2 },
    { name: 'Cookie Consent', pattern: /cookie-consent/i, category: 'ux', weight: 3 },
    { name: 'Smooth Scroll', pattern: /scroll-behavior:\s*smooth/i, category: 'ux', weight: 1 },

    // Sécurité (5 critères)
    { name: 'XSS Protection', pattern: /X-XSS-Protection/i, category: 'security', weight: 3 },
    { name: 'Clickjacking Protection', pattern: /X-Frame-Options/i, category: 'security', weight: 3 },
    { name: 'Content Type Options', pattern: /X-Content-Type-Options/i, category: 'security', weight: 2 },
    { name: 'Referrer Policy', pattern: /name="referrer"/i, category: 'security', weight: 2 },
    { name: 'Noopener Links', pattern: /noopener|noreferrer/i, category: 'security', weight: 1 },

    // PWA (5 critères)
    { name: 'Theme Color', pattern: /theme-color/i, category: 'pwa', weight: 2 },
    { name: 'Manifest', pattern: /rel="manifest"/i, category: 'pwa', weight: 3 },
    { name: 'Service Worker', pattern: /serviceWorker\.register/i, category: 'pwa', weight: 3 },
    { name: 'Apple Touch Icon', pattern: /apple-touch-icon/i, category: 'pwa', weight: 1 },
    { name: 'Apple Web App', pattern: /apple-mobile-web-app/i, category: 'pwa', weight: 1 },

    // Enterprise (5 critères)
    { name: 'Analytics Ready', pattern: /Google Tag Manager|gtag|dataLayer/i, category: 'enterprise', weight: 2 },
    { name: 'CSS Variables System', pattern: /--space-|--text-|--radius-/i, category: 'enterprise', weight: 2 },
    { name: 'RGPD Compliance', pattern: /cookie-consent|RGPD/i, category: 'enterprise', weight: 3 },
    { name: 'Performance Tracking', pattern: /Performance.*Observer|LCP|FID|CLS/i, category: 'enterprise', weight: 2 },
    { name: 'Advanced Animations', pattern: /@keyframes|animation:/i, category: 'enterprise', weight: 1 },
];

function analyzeLayoutAdvanced(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    const content = fs.readFileSync(filePath, 'utf8');
    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(1);

    const results = {
        file: layoutFile,
        size: fileSize + ' KB',
        score: 0,
        maxScore: 0,
        percentage: 0,
        categories: {},
        missing: [],
        grade: ''
    };

    // Initialiser les catégories
    const categories = {};
    advancedChecks.forEach(check => {
        if (!categories[check.category]) {
            categories[check.category] = { found: 0, max: 0, items: [] };
        }
    });

    // Analyser chaque critère
    advancedChecks.forEach(check => {
        const found = check.pattern.test(content);
        results.maxScore += check.weight;
        categories[check.category].max += check.weight;

        if (found) {
            results.score += check.weight;
            categories[check.category].found += check.weight;
            categories[check.category].items.push({ name: check.name, status: '✅' });
        } else {
            results.missing.push(check.name);
            categories[check.category].items.push({ name: check.name, status: '❌' });
        }
    });

    results.categories = categories;
    results.percentage = ((results.score / results.maxScore) * 100).toFixed(1);

    // Attribution du grade
    if (results.percentage >= 95) results.grade = 'A+';
    else if (results.percentage >= 90) results.grade = 'A';
    else if (results.percentage >= 85) results.grade = 'B+';
    else if (results.percentage >= 80) results.grade = 'B';
    else if (results.percentage >= 75) results.grade = 'C+';
    else if (results.percentage >= 70) results.grade = 'C';
    else results.grade = 'D';

    return results;
}

async function finalVerification() {
    console.log('🎯 VÉRIFICATION FINALE COMPLÈTE - NIVEAU ENTREPRISE\n');
    console.log('='.repeat(100) + '\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html')).sort();
    const allResults = [];

    let totalScore = 0;
    let totalMaxScore = 0;

    // Analyser tous les layouts
    files.forEach(file => {
        const result = analyzeLayoutAdvanced(file);
        allResults.push(result);
        totalScore += parseFloat(result.score);
        totalMaxScore += parseFloat(result.maxScore);
    });

    // Trier par score
    allResults.sort((a, b) => b.percentage - a.percentage);

    // Statistiques globales
    const avgPercentage = ((totalScore / totalMaxScore) * 100).toFixed(1);
    const gradeDistribution = {};
    allResults.forEach(r => {
        gradeDistribution[r.grade] = (gradeDistribution[r.grade] || 0) + 1;
    });

    console.log('📊 STATISTIQUES GLOBALES:\n');
    console.log(`   Total layouts analysés: ${files.length}`);
    console.log(`   Score moyen: ${avgPercentage}%`);
    console.log(`   Score total: ${totalScore.toFixed(0)}/${totalMaxScore}`);

    console.log('\n   Distribution des grades:');
    Object.keys(gradeDistribution).sort().reverse().forEach(grade => {
        const count = gradeDistribution[grade];
        const bar = '█'.repeat(Math.floor(count / 2));
        console.log(`      ${grade}: ${bar} ${count} layouts`);
    });

    // Statistiques par catégorie
    console.log('\n📈 PERFORMANCE PAR CATÉGORIE:\n');
    const categoryStats = {};

    allResults.forEach(result => {
        Object.entries(result.categories).forEach(([cat, data]) => {
            if (!categoryStats[cat]) {
                categoryStats[cat] = { found: 0, max: 0 };
            }
            categoryStats[cat].found += data.found;
            categoryStats[cat].max += data.max;
        });
    });

    Object.entries(categoryStats).forEach(([category, stats]) => {
        const percent = ((stats.found / stats.max) * 100).toFixed(1);
        const icon = getCategoryIcon(category);
        const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));
        console.log(`   ${icon} ${category.padEnd(15)}: ${bar} ${percent}%`);
    });

    console.log('\n' + '='.repeat(100) + '\n');

    // Top 10
    console.log('🏆 TOP 10 LAYOUTS - MEILLEURS SCORES:\n');
    allResults.slice(0, 10).forEach((result, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const gradeEmoji = result.grade.startsWith('A') ? '🟢' : result.grade.startsWith('B') ? '🟡' : '🟠';
        console.log(`   ${medal} ${result.file.padEnd(45)} ${gradeEmoji} ${result.grade} (${result.percentage}%) - ${result.size}`);
    });

    // Layouts nécessitant attention
    const needsAttention = allResults.filter(r => parseFloat(r.percentage) < 90);
    if (needsAttention.length > 0) {
        console.log(`\n⚠️  LAYOUTS NÉCESSITANT ATTENTION (< 90%):\n`);
        needsAttention.forEach(result => {
            console.log(`   • ${result.file.padEnd(45)} ${result.grade} (${result.percentage}%)`);
            if (result.missing.length > 0 && result.missing.length <= 3) {
                console.log(`     Manquant: ${result.missing.join(', ')}`);
            }
        });
    }

    console.log('\n' + '='.repeat(100));

    // Résumé final
    if (avgPercentage >= 95) {
        console.log('\n🎉 EXCELLENCE! Score moyen ≥ 95% - Niveau ENTREPRISE ATTEINT! 🎉\n');
    } else if (avgPercentage >= 90) {
        console.log('\n🌟 EXCELLENT! Score moyen ≥ 90% - Très haute qualité!\n');
    } else if (avgPercentage >= 85) {
        console.log('\n✅ TRÈS BIEN! Score moyen ≥ 85% - Bonne qualité!\n');
    } else {
        console.log('\n📈 BIEN! Des améliorations sont possibles.\n');
    }

    // Détails par catégorie
    console.log('📋 DÉTAILS PAR CATÉGORIE:\n');
    Object.entries(categoryStats).forEach(([category, stats]) => {
        const percent = ((stats.found / stats.max) * 100).toFixed(1);
        const icon = getCategoryIcon(category);
        console.log(`   ${icon} ${category.toUpperCase()}:`);
        console.log(`      Score: ${stats.found}/${stats.max} (${percent}%)`);

        // Afficher les items de la première layout comme exemple
        const exampleLayout = allResults[0];
        if (exampleLayout.categories[category]) {
            const items = exampleLayout.categories[category].items;
            items.forEach(item => {
                console.log(`      ${item.status} ${item.name}`);
            });
        }
        console.log('');
    });

    console.log('='.repeat(100) + '\n');

    return {
        totalLayouts: files.length,
        avgPercentage,
        gradeDistribution,
        categoryStats,
        needsAttention: needsAttention.length
    };
}

function getCategoryIcon(category) {
    const icons = {
        performance: '⚡',
        seo: '🔍',
        accessibility: '♿',
        ux: '✨',
        security: '🔒',
        pwa: '📱',
        enterprise: '🏢'
    };
    return icons[category] || '•';
}

finalVerification();
