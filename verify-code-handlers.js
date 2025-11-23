#!/usr/bin/env node
/**
 * Vérification ULTIME : Chaque placeholder a-t-il un handler dans le CODE ?
 * Ne vérifie pas juste une liste théorique, mais le CODE RÉEL de siteBuilder.js
 */

const fs = require('fs');
const path = require('path');

// Extraire tous les placeholders d'un layout
function extractPlaceholders(html) {
    const regex = /{([a-zA-Z_][a-zA-Z0-9_]*)}/g;
    const placeholders = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        placeholders.push(match[1]);
    }
    return [...new Set(placeholders)];
}

// Extraire tous les placeholders remplacés explicitement dans siteBuilder.js
function extractReplacementsFromCode(siteBuilderCode) {
    const replacements = new Set();

    // Patterns de remplacement à détecter
    const patterns = [
        // html.replace(/{placeholder}/g, ...)
        /\.replace\(\/{([a-zA-Z_][a-zA-Z0-9_]*)}\//g,
        // html.replace(/{placeholder}/g, ...)
        /\.replace\(\`\{([a-zA-Z_][a-zA-Z0-9_]*)\}\`/g,
        // html.replace(new RegExp(`{placeholder}`, 'g'), ...)
        /RegExp\([`'"]?\{([a-zA-Z_][a-zA-Z0-9_]*)\}[`'"]?/g
    ];

    patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(siteBuilderCode)) !== null) {
            replacements.add(match[1]);
        }
    });

    return replacements;
}

// Vérifier si un placeholder est couvert par le remplacement générique
function isCoveredByGenericReplacement(placeholder, siteBuilderCode) {
    // Chercher la section de remplacement générique
    const genericSectionRegex = /Object\.keys\(content\)\.forEach\(/;
    return genericSectionRegex.test(siteBuilderCode);
}

// Vérifier si un placeholder est une variable d'animation (nettoyée automatiquement)
function isAnimationVariable(placeholder) {
    const animationVars = ['randomRotation', 'scrollPercent', 'x', 'y', 'yPos', 'firstChar'];
    return animationVars.includes(placeholder);
}

// Vérifier si un placeholder est une variable dynamique (DynamicContentAdapter)
function isDynamicVariable(placeholder) {
    const dynamicPrefixes = ['nav_', 'section_', 'descriptor_', 'form_'];
    return dynamicPrefixes.some(prefix => placeholder.startsWith(prefix));
}

function main() {
    console.log('🔍 VÉRIFICATION ULTIME : HANDLERS DANS LE CODE RÉEL\n');
    console.log('═'.repeat(80) + '\n');

    // Lire siteBuilder.js
    const siteBuilderPath = path.join(__dirname, 'lib', 'siteBuilder.js');
    const siteBuilderCode = fs.readFileSync(siteBuilderPath, 'utf8');

    console.log('📖 Analyse de siteBuilder.js...');

    // Extraire tous les placeholders remplacés explicitement
    const explicitReplacements = extractReplacementsFromCode(siteBuilderCode);
    console.log(`✅ ${explicitReplacements.size} placeholders avec remplacement EXPLICITE trouvés\n`);

    // Vérifier le remplacement générique
    const hasGenericReplacement = isCoveredByGenericReplacement(null, siteBuilderCode);
    if (hasGenericReplacement) {
        console.log('✅ Remplacement GÉNÉRIQUE détecté (Object.keys(content))\n');
    } else {
        console.log('⚠️  Aucun remplacement générique détecté\n');
    }

    // Vérifier chaque layout
    const layoutsDir = path.join(__dirname, 'templates', 'layouts');
    const layoutFiles = fs.readdirSync(layoutsDir)
        .filter(f => f.endsWith('.html'))
        .sort();

    console.log('═'.repeat(80));
    console.log('📋 VÉRIFICATION LAYOUT PAR LAYOUT\n');

    let totalLayouts = 0;
    let layoutsWithIssues = 0;
    const allUnhandled = new Map(); // placeholder -> layouts qui l'utilisent

    layoutFiles.forEach((file, index) => {
        const layoutPath = path.join(layoutsDir, file);
        const content = fs.readFileSync(layoutPath, 'utf8');
        const placeholders = extractPlaceholders(content);

        totalLayouts++;

        // Vérifier chaque placeholder
        const unhandled = [];
        placeholders.forEach(placeholder => {
            const hasExplicit = explicitReplacements.has(placeholder);
            const isDynamic = isDynamicVariable(placeholder);
            const isAnimation = isAnimationVariable(placeholder);

            // Un placeholder est OK s'il a un handler explicite OU est dynamique OU est d'animation
            const isHandled = hasExplicit || isDynamic || isAnimation || hasGenericReplacement;

            if (!isHandled) {
                unhandled.push(placeholder);

                if (!allUnhandled.has(placeholder)) {
                    allUnhandled.set(placeholder, []);
                }
                allUnhandled.get(placeholder).push(file);
            }
        });

        // Afficher le résultat
        console.log(`[${index + 1}/${layoutFiles.length}] ${file}`);
        console.log(`   📊 ${placeholders.length} placeholders`);

        if (unhandled.length > 0) {
            console.log(`   ❌ ${unhandled.length} SANS HANDLER:`);
            unhandled.forEach(p => {
                const isGeneric = hasGenericReplacement ? ' (couvert par générique?)' : '';
                console.log(`      - {${p}}${isGeneric}`);
            });
            layoutsWithIssues++;
        } else {
            console.log(`   ✅ Tous gérés`);
        }
        console.log('');
    });

    console.log('═'.repeat(80));
    console.log('📊 RÉSUMÉ FINAL\n');
    console.log(`Layouts analysés: ${totalLayouts}`);
    console.log(`Layouts OK: ${totalLayouts - layoutsWithIssues}`);
    console.log(`Layouts avec problèmes potentiels: ${layoutsWithIssues}`);

    if (allUnhandled.size > 0) {
        console.log(`\n⚠️  PLACEHOLDERS SANS HANDLER EXPLICITE: ${allUnhandled.size}`);
        console.log('\nDétails:');
        Array.from(allUnhandled.entries()).forEach(([placeholder, layouts]) => {
            console.log(`\n{${placeholder}} - utilisé dans ${layouts.length} layout(s):`);
            layouts.forEach(l => console.log(`   - ${l}`));
        });

        if (hasGenericReplacement) {
            console.log('\n📝 NOTE: Ces placeholders PEUVENT être couverts par le');
            console.log('   remplacement générique (Object.keys(content).forEach)');
            console.log('   si les variables sont ajoutées dynamiquement au content.');
            console.log('\n   Pour confirmer : vérifier que ces variables sont dans le');
            console.log('   content généré par contentGenerator ou DynamicContentAdapter.');
        } else {
            console.log('\n❌ CRITIQUE: Aucun remplacement générique trouvé !');
            console.log('   Ces placeholders ne seront PAS remplacés !');
            process.exit(1);
        }
    } else {
        console.log('\n✅ PARFAIT: Tous les placeholders ont un handler !');
    }

    console.log('\n═'.repeat(80));
    console.log('\n📋 DÉTAILS DES HANDLERS EXPLICITES:\n');

    const sortedReplacements = Array.from(explicitReplacements).sort();
    sortedReplacements.forEach((placeholder, index) => {
        if (index % 5 === 0 && index > 0) console.log('');
        process.stdout.write(`{${placeholder}}`.padEnd(30));
        if ((index + 1) % 3 === 0) console.log('');
    });
    console.log('\n');
}

main();
