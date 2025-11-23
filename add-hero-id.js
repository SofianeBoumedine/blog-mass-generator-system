/**
 * Script pour ajouter id="hero" à la première section/hero de chaque layout
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

function addHeroId(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    let content = fs.readFileSync(filePath, 'utf8');

    // Patterns possibles pour la section hero
    const heroPatterns = [
        /<section class="hero/i,
        /<section class="[^"]*hero[^"]*"/i,
        /<div class="hero/i,
        /<div class="[^"]*hero[^"]*"/i,
        /<header[^>]*>/i
    ];

    let modified = false;

    // Essayer chaque pattern
    for (const pattern of heroPatterns) {
        if (content.match(pattern)) {
            // Vérifier si l'ID hero n'existe pas déjà
            if (!content.includes('id="hero"')) {
                // Ajouter l'id à la première occurrence
                content = content.replace(pattern, (match) => {
                    if (match.includes('id=')) {
                        return match; // Déjà un ID, ne pas modifier
                    }
                    // Ajouter id="hero"
                    return match.replace('>', ' id="hero">');
                });
                modified = true;
                console.log(`  ✅ ${layoutFile} - id="hero" ajouté`);
                break;
            }
        }
    }

    if (!modified && !content.includes('id="hero"')) {
        // Si aucun pattern trouvé, ajouter une section hero au début du body
        const bodyMatch = content.match(/<body[^>]*>/);
        if (bodyMatch) {
            const insertPoint = content.indexOf(bodyMatch[0]) + bodyMatch[0].length;
            const heroSection = '\n    <!-- Hero Section -->\n    <section id="hero" class="hero-section">\n        {hero_content}\n    </section>\n';
            content = content.slice(0, insertPoint) + heroSection + content.slice(insertPoint);
            modified = true;
            console.log(`  ✅ ${layoutFile} - section hero créée`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } else {
        console.log(`  ⏭️  ${layoutFile} - id="hero" déjà présent`);
        return false;
    }
}

async function processAllLayouts() {
    console.log('🔧 Ajout de id="hero" aux layouts...\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
    let count = 0;

    for (const file of files) {
        try {
            if (addHeroId(file)) {
                count++;
            }
        } catch (error) {
            console.log(`  ❌ ${file} - erreur:`, error.message);
        }
    }

    console.log(`\n✅ Terminé! ${count}/${files.length} layouts modifiés`);
}

processAllLayouts();
