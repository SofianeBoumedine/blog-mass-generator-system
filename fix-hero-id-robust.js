/**
 * Script robuste pour ajouter id="hero" à TOUTES les sections hero
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

function addHeroIdRobust(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    let content = fs.readFileSync(filePath, 'utf8');

    // Si id="hero" existe déjà, skip
    if (content.includes('id="hero"')) {
        console.log(`  ⏭️  ${layoutFile} - id="hero" déjà présent`);
        return false;
    }

    // Liste exhaustive de patterns pour la section hero (capture jusqu'au >)
    const patterns = [
        // Sections avec class contenant "hero"
        { regex: /<section\s+class="[^"]*hero[^"]*"[^>]*>/i, name: 'section class hero' },
        // Divs avec class contenant "hero"
        { regex: /<div\s+class="[^"]*hero[^"]*"[^>]*>/i, name: 'div class hero' },
        // Headers
        { regex: /<header\s+class="[^"]*"[^>]*>/i, name: 'header class' },
        { regex: /<header[^>]*>/i, name: 'header' },
    ];

    let modified = false;

    for (const { regex, name } of patterns) {
        const match = content.match(regex);
        if (match) {
            const fullMatch = match[0]; // e.g., '<section class="hero-kawaii">'

            // Vérifier si cette balise a déjà un id="hero"
            if (fullMatch.includes('id="hero"')) {
                continue; // Essayer le pattern suivant
            }

            // Vérifier si cette balise a déjà un autre id
            if (fullMatch.includes('id=')) {
                continue; // Skip si autre ID existe
            }

            // Ajouter id="hero" juste avant le >
            const newTag = fullMatch.replace(/>$/, ' id="hero">');
            content = content.replace(fullMatch, newTag);
            modified = true;
            console.log(`  ✅ ${layoutFile} - id="hero" ajouté (${name})`);
            break;
        }
    }

    if (!modified) {
        console.log(`  ⚠️  ${layoutFile} - aucun pattern hero trouvé`);
        return false;
    }

    // Sauvegarder
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
}

async function processAllLayouts() {
    console.log('🔧 Ajout robuste de id="hero" à tous les layouts...\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
    let count = 0;

    for (const file of files) {
        try {
            if (addHeroIdRobust(file)) {
                count++;
            }
        } catch (error) {
            console.log(`  ❌ ${file} - erreur:`, error.message);
        }
    }

    console.log(`\n✅ Terminé! ${count}/${files.length} layouts modifiés`);
}

processAllLayouts();
