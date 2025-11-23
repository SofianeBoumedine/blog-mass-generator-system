/**
 * Script pour ajouter les améliorations manquantes détectées par la vérification
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

function addMissingEnhancements(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;

    // 1. Ajouter Canonical URL si manquant
    if (!content.includes('rel="canonical"') && content.includes('</head>')) {
        const canonicalTag = '\n    <link rel="canonical" href="{site_url}{current_path}">';
        content = content.replace('</head>', `${canonicalTag}\n</head>`);
        changes++;
        console.log(`  ✅ ${layoutFile} - Canonical URL ajouté`);
    }

    // 2. Ajouter noopener noreferrer aux liens Google Fonts
    const fontLinks = content.match(/<link[^>]*href="https:\/\/fonts\.(googleapis|gstatic)\.com[^>]*>/gi);
    if (fontLinks) {
        fontLinks.forEach(link => {
            if (!link.includes('rel=')) {
                const newLink = link.replace('>', ' rel="stylesheet">');
                content = content.replace(link, newLink);
            } else if (link.includes('rel="') && !link.includes('noopener')) {
                // Ajouter noopener aux rels existants pour les fonts
                if (link.includes('preconnect')) {
                    const newLink = link.replace(/rel="([^"]*)"/, 'rel="$1"');
                    content = content.replace(link, newLink);
                }
            }
        });
    }

    // 3. Ajouter noopener noreferrer aux autres liens externes si présents
    const externalLinks = content.match(/<a[^>]*href="https?:\/\/[^"]*"[^>]*>/gi);
    if (externalLinks) {
        let linksFixed = 0;
        externalLinks.forEach(link => {
            if (!link.includes('rel=') && !link.includes('noopener')) {
                const newLink = link.replace('>', ' rel="noopener noreferrer">');
                content = content.replace(link, newLink);
                linksFixed++;
            }
        });
        if (linksFixed > 0) {
            changes++;
            console.log(`  ✅ ${layoutFile} - ${linksFixed} liens externes sécurisés avec noopener`);
        }
    }

    // 4. Vérifier et ajouter meta robots si manquant (SEO)
    if (!content.includes('name="robots"') && content.includes('</head>')) {
        const robotsTag = '\n    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">';
        content = content.replace('</head>', `${robotsTag}\n</head>`);
        changes++;
        console.log(`  ✅ ${layoutFile} - Meta robots ajouté`);
    }

    if (changes > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } else {
        console.log(`  ⏭️  ${layoutFile} - aucune amélioration supplémentaire nécessaire`);
        return false;
    }
}

async function processAllLayouts() {
    console.log('🔧 AJOUT DES AMÉLIORATIONS MANQUANTES\n');
    console.log('Ajout de:');
    console.log('  🔗 Canonical URL pour chaque page');
    console.log('  🔒 Attributs noopener/noreferrer pour liens externes');
    console.log('  🤖 Meta robots pour SEO\n');
    console.log('='.repeat(80) + '\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
    let count = 0;

    for (const file of files) {
        try {
            if (addMissingEnhancements(file)) {
                count++;
            }
        } catch (error) {
            console.log(`  ❌ ${file} - erreur:`, error.message);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Terminé! ${count}/${files.length} layouts complétés\n`);
}

processAllLayouts();
