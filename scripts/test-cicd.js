#!/usr/bin/env node
/**
 * Test de configuration CI/CD
 */

const fs = require('fs');
const path = require('path');

console.log('\n═══════════════════════════════════════════════════');
console.log('        VÉRIFICATION CONFIGURATION CI/CD');
console.log('═══════════════════════════════════════════════════\n');

const results = [];

// 1. Vérifier package.json
console.log('📦 Vérification package.json...');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    // Vérifier les champs requis
    const required = ['name', 'version', 'dependencies'];
    const missing = required.filter(f => pkg[f] === undefined);

    if (missing.length === 0) {
        results.push({test: 'package.json', status: 'OK', msg: 'Fichier valide'});
    } else {
        results.push({test: 'package.json', status: 'BUG', msg: 'Champs manquants: ' + missing.join(', ')});
    }

    // Vérifier script generate:txt
    if (pkg.scripts && pkg.scripts['generate:txt']) {
        results.push({test: 'script generate:txt', status: 'OK', msg: pkg.scripts['generate:txt'].substring(0, 40)});
    } else {
        results.push({test: 'script generate:txt', status: 'BUG', msg: 'Script manquant'});
    }

} catch (e) {
    results.push({test: 'package.json', status: 'BUG', msg: 'JSON invalide: ' + e.message});
}

// 2. Vérifier workflow YAML
console.log('🔧 Vérification workflow GitHub...');
const workflowPath = '.github/workflows/generate-sites.yml';
if (fs.existsSync(workflowPath)) {
    const workflow = fs.readFileSync(workflowPath, 'utf8');

    // Vérifier les éléments clés
    const checks = [
        { name: 'on-push', test: workflow.includes('on:') && workflow.includes('push:'), msg: 'Trigger push configuré' },
        { name: 'workflow_dispatch', test: workflow.includes('workflow_dispatch:'), msg: 'Trigger manuel configuré' },
        { name: 'node-setup', test: workflow.includes('setup-node'), msg: 'Setup Node.js' },
        { name: 'npm-ci', test: workflow.includes('npm ci'), msg: 'Installation dépendances' },
        { name: 'generate-script', test: workflow.includes('generate-from-txt.js'), msg: 'Script de génération' },
        { name: 'artifacts', test: workflow.includes('upload-artifact'), msg: 'Upload artifacts' },
        { name: 'ftp-deploy', test: workflow.includes('FTP-Deploy-Action'), msg: 'Déploiement FTP' }
    ];

    for (const check of checks) {
        results.push({
            test: 'workflow: ' + check.name,
            status: check.test ? 'OK' : 'BUG',
            msg: check.msg
        });
    }
} else {
    results.push({test: 'workflow file', status: 'BUG', msg: 'Fichier manquant'});
}

// 3. Vérifier les scripts existent
console.log('📄 Vérification des scripts...');
const scripts = [
    'scripts/generate-from-txt.js',
    'scripts/test-all-themes.js',
    'scripts/test-integrity.js'
];

for (const script of scripts) {
    if (fs.existsSync(script)) {
        results.push({test: 'script ' + path.basename(script), status: 'OK', msg: 'Existe'});
    } else {
        results.push({test: 'script ' + path.basename(script), status: 'BUG', msg: 'Manquant'});
    }
}

// 4. Vérifier les dépendances
console.log('📚 Vérification node_modules...');
if (fs.existsSync('node_modules')) {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = Object.keys(pkg.dependencies || {});
    let missingDeps = [];

    for (const dep of deps) {
        if (fs.existsSync(path.join('node_modules', dep)) === false) {
            missingDeps.push(dep);
        }
    }

    if (missingDeps.length === 0) {
        results.push({test: 'node_modules', status: 'OK', msg: deps.length + ' dépendances installées'});
    } else {
        results.push({test: 'node_modules', status: 'BUG', msg: 'Manquantes: ' + missingDeps.join(', ')});
    }
} else {
    results.push({test: 'node_modules', status: 'WARNING', msg: 'Pas installées (npm ci requis)'});
}

// 5. Vérifier syntaxe des scripts JS (via require des modules)
console.log('🔍 Vérification syntaxe...');
const libFiles = [
    '../lib/semanticSiteGenerator',
    '../lib/semanticEntityEngine',
    '../lib/thematicContentLibrary'
];

for (const libFile of libFiles) {
    const fileName = path.basename(libFile) + '.js';
    try {
        const mod = require(libFile);
        if (mod) {
            results.push({test: 'syntax ' + fileName, status: 'OK', msg: 'Module chargé'});
        }
    } catch (e) {
        results.push({test: 'syntax ' + fileName, status: 'BUG', msg: e.message.substring(0, 50)});
    }
}

// Afficher résumé
console.log('\n═══════════════════════════════════════════════════');
console.log('            RÉSULTATS CI/CD');
console.log('═══════════════════════════════════════════════════\n');

let bugs = 0;
for (const r of results) {
    let icon = '✅';
    if (r.status === 'BUG') { icon = '❌'; bugs++; }
    if (r.status === 'WARNING') icon = '⚠️';

    console.log(icon + ' ' + r.test.padEnd(30) + ' ' + r.msg);
}

console.log('\n═══════════════════════════════════════════════════');
if (bugs === 0) {
    console.log('✅ Configuration CI/CD valide!');
} else {
    console.log('❌ ' + bugs + ' problèmes détectés');
}
console.log('═══════════════════════════════════════════════════\n');

process.exit(bugs > 0 ? 1 : 0);
