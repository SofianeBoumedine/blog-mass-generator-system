#!/usr/bin/env node
/**
 * Test complet de tous les thèmes
 * Vérifie la génération, les placeholders et la cohérence
 */

const fs = require('fs');
const path = require('path');
const SemanticSiteGenerator = require('../lib/semanticSiteGenerator');

const themes = {
    'pets': ['chien', 'chat', 'animal de compagnie'],
    'tech': ['logiciel', 'saas', 'cloud computing'],
    'business': ['conseil', 'stratégie', 'entreprise'],
    'creative': ['design', 'graphique', 'logo'],
    'health': ['médecin', 'santé', 'consultation'],
    'education': ['formation', 'cpf', 'certification'],
    'legal': ['avocat', 'droit', 'juridique'],
    'finance': ['patrimoine', 'investissement', 'épargne'],
    'ecommerce': ['boutique', 'achat en ligne', 'livraison'],
    'fitness': ['sport', 'coach sportif', 'musculation'],
    'realestate': ['immobilier', 'appartement', 'maison'],
    'food': ['restaurant', 'cuisine', 'gastronomie']
};

async function testAllThemes() {
    const results = [];

    console.log('\n═══════════════════════════════════════════════════');
    console.log('           TEST DE TOUS LES THÈMES');
    console.log('═══════════════════════════════════════════════════\n');

    for (const [themeName, keywords] of Object.entries(themes)) {
        const outputDir = path.join('output', 'test-' + themeName);

        try {
            const generator = new SemanticSiteGenerator();
            const result = await generator.generateSite(keywords, outputDir);

            // Vérifier les placeholders non remplacés
            const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8');
            const unreplaced = html.match(/\{[a-z_0-9]+\}/gi);

            const passed = result.validationReport.score >= 95 && !unreplaced;

            results.push({
                theme: themeName,
                detected: result.theme,
                score: result.validationReport.score,
                unreplaced: unreplaced ? unreplaced.length : 0,
                issues: result.validationReport.issues,
                passed
            });

            // Nettoyer
            fs.rmSync(outputDir, { recursive: true, force: true });

        } catch (err) {
            results.push({
                theme: themeName,
                error: err.message,
                passed: false
            });
        }
    }

    // Afficher les résultats
    console.log('\n═══════════════════════════════════════════════════');
    console.log('           RAPPORT FINAL');
    console.log('═══════════════════════════════════════════════════\n');

    let allPassed = true;

    for (const r of results) {
        const status = r.passed ? '✅' : '❌';

        if (r.error) {
            console.log(`${status} ${r.theme.padEnd(12)} ERREUR: ${r.error}`);
            allPassed = false;
        } else {
            const unreplacedInfo = r.unreplaced > 0 ? ` ⚠️ ${r.unreplaced} placeholders` : '';
            console.log(`${status} ${r.theme.padEnd(12)} → ${r.detected.padEnd(12)} Score: ${r.score}/100${unreplacedInfo}`);

            if (r.issues && r.issues.length > 0) {
                r.issues.forEach(issue => console.log(`   └─ ${issue}`));
            }

            if (!r.passed) allPassed = false;
        }
    }

    console.log('\n═══════════════════════════════════════════════════');
    if (allPassed) {
        console.log('✅ TOUS LES TESTS PASSÉS - SYSTÈME PRÊT!');
    } else {
        console.log('❌ CERTAINS TESTS ONT ÉCHOUÉ');
    }
    console.log('═══════════════════════════════════════════════════\n');

    return allPassed;
}

testAllThemes()
    .then(passed => process.exit(passed ? 0 : 1))
    .catch(err => {
        console.error('Erreur fatale:', err);
        process.exit(1);
    });
