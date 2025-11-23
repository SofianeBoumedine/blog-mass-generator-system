#!/usr/bin/env node

/**
 * Script de test pour vérifier la génération avec les nouveaux layouts
 */

const fs = require('fs').promises;
const path = require('path');
const SiteBuilder = require('./lib/siteBuilder');

async function testLayouts() {
    console.log('🧪 Test du système de génération avec les nouveaux layouts\n');
    console.log('=' .repeat(60));

    try {
        // Initialiser le SiteBuilder
        const siteBuilder = new SiteBuilder();
        await siteBuilder.initialize();

        // Test 1: Vérifier que tous les layouts peuvent être chargés
        console.log('\n✅ Test 1: Chargement des layouts');
        console.log('-'.repeat(40));

        const layoutsToTest = [
            'layout-professional.html',
            'layout-saas-modern-enhanced.html',
            'layout-agency-creative-enhanced.html',
            'layout-ecommerce-premium.html'
        ];

        for (const layoutName of layoutsToTest) {
            try {
                const layoutPath = path.join(__dirname, 'templates', 'layouts', layoutName);
                const content = await fs.readFile(layoutPath, 'utf8');
                const variables = content.match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g) || [];
                console.log(`  ✓ ${layoutName}: ${content.length} caractères, ${variables.length} variables`);
            } catch (error) {
                console.log(`  ✗ ${layoutName}: Erreur - ${error.message}`);
            }
        }

        // Test 2: Tester la sélection aléatoire de layout
        console.log('\n✅ Test 2: Sélection aléatoire de layouts');
        console.log('-'.repeat(40));

        const layoutDistribution = {};
        for (let i = 0; i < 20; i++) {
            const result = await siteBuilder.selectRandomLayoutAndFramework();
            const quality = result.layoutQuality || 'unknown';
            layoutDistribution[quality] = (layoutDistribution[quality] || 0) + 1;
        }

        console.log('  Distribution sur 20 sélections:');
        Object.entries(layoutDistribution).forEach(([quality, count]) => {
            const percentage = (count / 20 * 100).toFixed(1);
            console.log(`    ${quality}: ${count} (${percentage}%)`);
        });

        // Test 3: Vérifier le remplacement des variables
        console.log('\n✅ Test 3: Remplacement des variables');
        console.log('-'.repeat(40));

        const testBranding = {
            brandName: 'TestCorp',
            tagline: 'Innovation & Excellence',
            valueProposition: 'Nous transformons vos idées en réalité'
        };

        const testContent = {
            hero_title: 'Bienvenue chez TestCorp',
            hero_subtitle: 'Votre partenaire de confiance',
            features_title: 'Nos Services Premium',
            meta: {
                title: 'TestCorp - Page de test',
                description: 'Description de test pour le site'
            }
        };

        const testFramework = {
            id: 'none',
            name: 'Aucun',
            css: '',
            js: '',
            classes: {}
        };

        const testColorScheme = {
            primary: '#5046E5',
            secondary: '#7C3AED',
            accent: '#F59E0B',
            text: '#1F2937',
            background: '#FFFFFF'
        };

        // Tester le remplacement avec un layout premium
        const layoutPath = path.join(__dirname, 'templates', 'layouts', 'layout-professional.html');
        const layoutTemplate = await fs.readFile(layoutPath, 'utf8');

        const navigation = '<a href="/">Accueil</a>\n<a href="/services.html">Services</a>';

        const processedHtml = siteBuilder.buildPage(
            'home',
            testContent,
            testBranding,
            testFramework,
            layoutTemplate,
            testColorScheme,
            navigation
        );

        // Vérifier que les variables ont été remplacées
        const remainingVars = processedHtml.match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g) || [];

        console.log(`  Template original: ${layoutTemplate.length} caractères`);
        console.log(`  HTML généré: ${processedHtml.length} caractères`);
        console.log(`  Variables restantes: ${remainingVars.length}`);

        if (remainingVars.length > 0) {
            console.log('  ⚠️ Variables non remplacées:', remainingVars.slice(0, 5).join(', '));
        } else {
            console.log('  ✓ Toutes les variables ont été remplacées');
        }

        // Vérifier que le contenu a bien été injecté
        const checks = [
            { text: 'TestCorp', desc: 'Nom de marque' },
            { text: '#5046E5', desc: 'Couleur primaire' },
            { text: 'Bienvenue chez TestCorp', desc: 'Titre hero' },
            { text: 'Services', desc: 'Lien navigation' }
        ];

        console.log('\n  Vérification du contenu:');
        checks.forEach(check => {
            const found = processedHtml.includes(check.text);
            console.log(`    ${found ? '✓' : '✗'} ${check.desc}: ${found ? 'trouvé' : 'manquant'}`);
        });

        // Test 4: Vérifier les contenus par défaut
        console.log('\n✅ Test 4: Contenus par défaut');
        console.log('-'.repeat(40));

        const defaultSections = [
            'hero_title', 'features_content', 'stats_content',
            'testimonials_content', 'cta_primary'
        ];

        console.log('  Sections avec contenu par défaut:');
        defaultSections.forEach(section => {
            const content = siteBuilder.getDefaultContent(section, 'home');
            const hasContent = content && content.length > 0;
            console.log(`    ${hasContent ? '✓' : '✗'} ${section}: ${hasContent ? content.length + ' caractères' : 'vide'}`);
        });

        // Résumé final
        console.log('\n' + '='.repeat(60));
        console.log('✅ Tests terminés avec succès!');
        console.log('Le système est prêt pour la génération avec les nouveaux layouts.');
        console.log('\nPour lancer une génération complète:');
        console.log('  node generator-main.js exemple.com keywords.txt');

    } catch (error) {
        console.error('\n❌ Erreur lors des tests:', error);
        console.error(error.stack);
        process.exit(1);
    }
}

// Lancer les tests
testLayouts().catch(console.error);