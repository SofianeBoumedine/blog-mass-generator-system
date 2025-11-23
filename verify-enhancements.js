/**
 * Script de vérification des améliorations appliquées
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

// Critères de vérification
const enhancementChecks = [
    { name: 'Performance: DNS Prefetch', pattern: /dns-prefetch/i, category: 'performance' },
    { name: 'Performance: Preconnect', pattern: /preconnect/i, category: 'performance' },
    { name: 'Performance: Lazy Loading', pattern: /loading="lazy"/i, category: 'performance' },
    { name: 'SEO: Schema.org', pattern: /application\/ld\+json/i, category: 'seo' },
    { name: 'SEO: Canonical URL', pattern: /rel="canonical"/i, category: 'seo' },
    { name: 'Accessibilité: Skip Link', pattern: /skip-to-content/i, category: 'accessibility' },
    { name: 'Accessibilité: ARIA Labels', pattern: /aria-label/i, category: 'accessibility' },
    { name: 'Accessibilité: Focus Visible', pattern: /focus-visible/i, category: 'accessibility' },
    { name: 'UX: Scroll to Top', pattern: /scrollToTop|scroll-to-top/i, category: 'ux' },
    { name: 'UX: Dark Mode', pattern: /DARK MODE|prefers-color-scheme/i, category: 'ux' },
    { name: 'UX: Reduced Motion', pattern: /prefers-reduced-motion/i, category: 'ux' },
    { name: 'Sécurité: noopener', pattern: /noopener/i, category: 'security' },
    { name: 'PWA: Theme Color', pattern: /theme-color/i, category: 'pwa' },
];

function analyzeLayout(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    const content = fs.readFileSync(filePath, 'utf8');

    const results = {
        file: layoutFile,
        size: (fs.statSync(filePath).size / 1024).toFixed(1) + ' KB',
        enhancements: {},
        score: 0,
        categories: {
            performance: 0,
            seo: 0,
            accessibility: 0,
            ux: 0,
            security: 0,
            pwa: 0
        }
    };

    enhancementChecks.forEach(check => {
        const found = check.pattern.test(content);
        results.enhancements[check.name] = found;
        if (found) {
            results.score++;
            results.categories[check.category]++;
        }
    });

    return results;
}

async function verifyAllEnhancements() {
    console.log('📊 VÉRIFICATION DES AMÉLIORATIONS APPLIQUÉES\n');
    console.log('='.repeat(80) + '\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html')).sort();

    const allResults = [];
    let totalScore = 0;
    const categoryTotals = {
        performance: 0,
        seo: 0,
        accessibility: 0,
        ux: 0,
        security: 0,
        pwa: 0
    };

    // Analyser tous les layouts
    files.forEach(file => {
        const result = analyzeLayout(file);
        allResults.push(result);
        totalScore += result.score;

        Object.keys(categoryTotals).forEach(cat => {
            categoryTotals[cat] += result.categories[cat];
        });
    });

    // Trier par score
    allResults.sort((a, b) => b.score - a.score);

    // Afficher les statistiques globales
    const maxScore = enhancementChecks.length;
    const avgScore = (totalScore / files.length).toFixed(1);
    const percentComplete = ((avgScore / maxScore) * 100).toFixed(0);

    console.log('📈 STATISTIQUES GLOBALES:\n');
    console.log(`   Total layouts: ${files.length}`);
    console.log(`   Score moyen: ${avgScore}/${maxScore} (${percentComplete}%)`);
    console.log(`   Score total: ${totalScore}/${files.length * maxScore}\n`);

    // Afficher par catégorie
    console.log('📊 AMÉLIORATIONS PAR CATÉGORIE:\n');
    Object.entries(categoryTotals).forEach(([category, total]) => {
        const categoryChecks = enhancementChecks.filter(c => c.category === category).length;
        const maxCategoryScore = files.length * categoryChecks;
        const percent = ((total / maxCategoryScore) * 100).toFixed(0);
        const icon = getIconForCategory(category);

        console.log(`   ${icon} ${category.padEnd(15)}: ${total}/${maxCategoryScore} (${percent}%)`);
    });

    console.log('\n' + '='.repeat(80) + '\n');

    // Layouts parfaits (score max)
    const perfectLayouts = allResults.filter(r => r.score === maxScore);
    const goodLayouts = allResults.filter(r => r.score >= maxScore * 0.8 && r.score < maxScore);
    const needsWork = allResults.filter(r => r.score < maxScore * 0.8);

    console.log(`✅ Layouts parfaits (${maxScore}/${maxScore}): ${perfectLayouts.length}`);
    console.log(`⭐ Layouts excellents (>=${Math.floor(maxScore * 0.8)}/${maxScore}): ${goodLayouts.length}`);
    console.log(`⚠️  Layouts à améliorer (<${Math.floor(maxScore * 0.8)}/${maxScore}): ${needsWork.length}\n`);

    // Top 10 layouts
    console.log('🏆 TOP 10 LAYOUTS LES MIEUX OPTIMISÉS:\n');
    allResults.slice(0, 10).forEach((result, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        console.log(`   ${medal} ${result.file.padEnd(40)} ${result.score}/${maxScore} (${result.size})`);
    });

    // Layouts nécessitant des améliorations
    if (needsWork.length > 0) {
        console.log('\n⚠️  LAYOUTS NÉCESSITANT PLUS D\'AMÉLIORATIONS:\n');
        needsWork.forEach(result => {
            console.log(`   • ${result.file.padEnd(40)} ${result.score}/${maxScore}`);

            // Afficher les améliorations manquantes
            const missing = Object.entries(result.enhancements)
                .filter(([name, found]) => !found)
                .map(([name]) => name);

            if (missing.length > 0) {
                console.log(`     Manquant: ${missing.join(', ')}`);
            }
        });
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Détail des améliorations
    console.log('📋 DÉTAIL DES AMÉLIORATIONS:\n');
    enhancementChecks.forEach(check => {
        const count = allResults.filter(r => r.enhancements[check.name]).length;
        const percent = ((count / files.length) * 100).toFixed(0);
        const bar = '█'.repeat(Math.floor(percent / 2)) + '░'.repeat(50 - Math.floor(percent / 2));

        console.log(`   ${check.name.padEnd(35)} ${bar} ${percent}% (${count}/${files.length})`);
    });

    console.log('\n' + '='.repeat(80));

    if (perfectLayouts.length === files.length) {
        console.log('\n🎉 FÉLICITATIONS! TOUS LES LAYOUTS SONT PARFAITEMENT OPTIMISÉS! 🎉\n');
    } else if (avgScore >= maxScore * 0.9) {
        console.log('\n🌟 EXCELLENT! Les layouts sont très bien optimisés!\n');
    } else if (avgScore >= maxScore * 0.7) {
        console.log('\n✅ BIEN! Les layouts sont correctement optimisés.\n');
    } else {
        console.log('\n⚠️  Des améliorations supplémentaires sont recommandées.\n');
    }

    return {
        totalLayouts: files.length,
        avgScore,
        percentComplete,
        perfect: perfectLayouts.length,
        good: goodLayouts.length,
        needsWork: needsWork.length
    };
}

function getIconForCategory(category) {
    const icons = {
        performance: '⚡',
        seo: '🔍',
        accessibility: '♿',
        ux: '✨',
        security: '🔒',
        pwa: '📱'
    };
    return icons[category] || '•';
}

verifyAllEnhancements();
