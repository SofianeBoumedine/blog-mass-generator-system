#!/usr/bin/env node
/**
 * Test d'intégrité des fichiers générés
 */

const SemanticSiteGenerator = require('../lib/semanticSiteGenerator');
const fs = require('fs');
const path = require('path');

async function testIntegrity() {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('        TEST D\'INTÉGRITÉ DES FICHIERS');
    console.log('═══════════════════════════════════════════════════\n');

    const generator = new SemanticSiteGenerator();
    const results = [];
    const outputDir = 'output/test-integrity';

    // Générer un site complet
    console.log('🔨 Génération d\'un site de test...');
    await generator.generateSite(['coaching entreprise', 'consulting'], outputDir);

    // Fichiers attendus
    const expectedFiles = [
        'index.html',
        'blog/index.html',
        'blog/articles-index.json',
        '.htaccess',
        'site-config.json',
        'validation-report.json'
    ];

    // Dossiers attendus
    const expectedDirs = ['blog', 'assets'];

    console.log('\n📁 Vérification de la structure...');

    // Test 1: Tous les fichiers existent
    for (const file of expectedFiles) {
        const filePath = path.join(outputDir, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size > 0 || file === 'blog/articles-index.json') {
                results.push({test: 'file_exists', file, status: 'OK', msg: stats.size + ' bytes'});
            } else {
                results.push({test: 'file_exists', file, status: 'BUG', msg: 'Fichier vide'});
            }
        } else {
            results.push({test: 'file_exists', file, status: 'BUG', msg: 'Fichier manquant'});
        }
    }

    // Test 2: Tous les dossiers existent
    for (const dir of expectedDirs) {
        const dirPath = path.join(outputDir, dir);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            results.push({test: 'dir_exists', file: dir, status: 'OK', msg: 'Dossier créé'});
        } else {
            results.push({test: 'dir_exists', file: dir, status: 'BUG', msg: 'Dossier manquant'});
        }
    }

    console.log('\n📄 Vérification du HTML...');

    // Test 3: HTML valide (balises ouvertes/fermées)
    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf8');

    const htmlChecks = [
        { name: 'DOCTYPE', test: html.includes('<!DOCTYPE html>'), msg: 'DOCTYPE HTML5' },
        { name: 'html_open', test: html.includes('<html'), msg: 'Balise html' },
        { name: 'html_close', test: html.includes('</html>'), msg: 'Fermeture html' },
        { name: 'head', test: html.includes('<head>') && html.includes('</head>'), msg: 'Balise head' },
        { name: 'body', test: html.includes('<body') && html.includes('</body>'), msg: 'Balise body' },
        { name: 'title', test: html.includes('<title>') && html.includes('</title>'), msg: 'Balise title' },
        { name: 'meta_charset', test: html.includes('charset') && html.includes('UTF-8'), msg: 'Charset UTF-8' },
        { name: 'meta_viewport', test: html.includes('viewport'), msg: 'Meta viewport' },
        { name: 'meta_desc', test: html.includes('name="description"'), msg: 'Meta description' }
    ];

    for (const check of htmlChecks) {
        results.push({
            test: 'html_' + check.name,
            file: 'index.html',
            status: check.test ? 'OK' : 'BUG',
            msg: check.msg
        });
    }

    // Test 4: Placeholders non remplacés
    const unreplaced = html.match(/\{[a-z_0-9]+\}/gi);
    if (unreplaced) {
        results.push({test: 'placeholders', file: 'index.html', status: 'BUG', msg: unreplaced.length + ' non remplacés'});
    } else {
        results.push({test: 'placeholders', file: 'index.html', status: 'OK', msg: 'Tous remplacés'});
    }

    // Test 5: Lien Blog présent
    if (html.includes('href="/blog') || html.includes('href="blog')) {
        results.push({test: 'blog_link', file: 'index.html', status: 'OK', msg: 'Lien Blog présent'});
    } else {
        results.push({test: 'blog_link', file: 'index.html', status: 'BUG', msg: 'Lien Blog manquant'});
    }

    console.log('\n📋 Vérification du JSON...');

    // Test 6: JSON valide
    const jsonFiles = ['site-config.json', 'validation-report.json', 'blog/articles-index.json'];
    for (const jsonFile of jsonFiles) {
        try {
            const content = fs.readFileSync(path.join(outputDir, jsonFile), 'utf8');
            JSON.parse(content);
            results.push({test: 'json_valid', file: jsonFile, status: 'OK', msg: 'JSON valide'});
        } catch (e) {
            results.push({test: 'json_valid', file: jsonFile, status: 'BUG', msg: 'JSON invalide'});
        }
    }

    // Test 7: site-config contient les bonnes clés
    const siteConfig = JSON.parse(fs.readFileSync(path.join(outputDir, 'site-config.json'), 'utf8'));
    const requiredKeys = ['version', 'generatedAt', 'branding', 'theme', 'keywords', 'seo'];
    const missingKeys = requiredKeys.filter(k => siteConfig[k] === undefined);
    if (missingKeys.length === 0) {
        results.push({test: 'config_keys', file: 'site-config.json', status: 'OK', msg: 'Toutes les clés présentes'});
    } else {
        results.push({test: 'config_keys', file: 'site-config.json', status: 'BUG', msg: 'Clés manquantes: ' + missingKeys.join(', ')});
    }

    // Nettoyage
    fs.rmSync(outputDir, { recursive: true, force: true });

    // Afficher résumé
    console.log('\n═══════════════════════════════════════════════════');
    console.log('            RÉSULTATS INTÉGRITÉ');
    console.log('═══════════════════════════════════════════════════\n');

    let bugs = 0;
    for (const r of results) {
        const icon = r.status === 'OK' ? '✅' : '❌';
        const label = (r.test + ' (' + r.file + ')').substring(0, 40).padEnd(40);
        console.log(icon + ' ' + label + ' ' + r.msg);
        if (r.status === 'BUG') bugs++;
    }

    console.log('\n═══════════════════════════════════════════════════');
    if (bugs === 0) {
        console.log('✅ Intégrité parfaite! ' + results.length + ' vérifications passées');
    } else {
        console.log('❌ ' + bugs + ' problèmes d\'intégrité détectés!');
    }
    console.log('═══════════════════════════════════════════════════\n');

    return bugs;
}

testIntegrity()
    .then(bugs => process.exit(bugs > 0 ? 1 : 0))
    .catch(err => {
        console.error('Erreur:', err);
        process.exit(1);
    });
