/**
 * Script de Correction Automatique des Layouts
 * Corrige tous les problèmes identifiés dans les 70 layouts
 */

const fs = require('fs').promises;
const path = require('path');

class LayoutFixer {
    constructor() {
        this.layoutsDir = path.join(__dirname, 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '.layouts-backup');

        this.stats = {
            totalFiles: 0,
            fixed: 0,
            errors: 0,
            improvements: {
                syntaxErrors: 0,
                seoMetaTags: 0,
                ariaLabels: 0,
                performance: 0,
                accessibility: 0,
                responsive: 0
            },
            fileDetails: []
        };
    }

    /**
     * Exécute toutes les corrections
     */
    async fixAll() {
        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('         CORRECTION AUTOMATIQUE DES LAYOUTS');
        console.log('═══════════════════════════════════════════════════════════════════\n');

        try {
            // 1. Créer backup
            await this.createBackup();

            // 2. Lister tous les layouts
            const files = await fs.readdir(this.layoutsDir);
            const htmlFiles = files.filter(f => f.endsWith('.html'));

            this.stats.totalFiles = htmlFiles.length;
            console.log(`📋 ${htmlFiles.length} layouts trouvés\n`);

            // 3. Corriger chaque fichier
            for (const file of htmlFiles) {
                await this.fixLayout(file);
            }

            // 4. Générer le rapport
            this.generateReport();

        } catch (error) {
            console.error('❌ Erreur:', error.message);
            throw error;
        }
    }

    /**
     * Crée un backup de tous les layouts
     */
    async createBackup() {
        console.log('💾 Création du backup...');

        try {
            await fs.mkdir(this.backupDir, { recursive: true });

            const files = await fs.readdir(this.layoutsDir);
            const htmlFiles = files.filter(f => f.endsWith('.html'));

            for (const file of htmlFiles) {
                const source = path.join(this.layoutsDir, file);
                const dest = path.join(this.backupDir, file);
                await fs.copyFile(source, dest);
            }

            console.log(`  ✅ ${htmlFiles.length} fichiers sauvegardés dans .layouts-backup/\n`);
        } catch (error) {
            console.error('  ❌ Erreur lors du backup:', error.message);
            throw error;
        }
    }

    /**
     * Corrige un layout spécifique
     */
    async fixLayout(filename) {
        const filePath = path.join(this.layoutsDir, filename);
        const fileStats = {
            filename,
            improvements: []
        };

        try {
            let content = await fs.readFile(filePath, 'utf8');
            const originalContent = content;

            // 1. Corriger les erreurs de syntaxe HTML
            content = this.fixHTMLSyntaxErrors(content, fileStats);

            // 2. Ajouter les meta tags SEO
            content = this.addSEOMetaTags(content, fileStats);

            // 3. Améliorer l'accessibilité
            content = this.improveAccessibility(content, fileStats);

            // 4. Optimiser les performances
            content = this.optimizePerformance(content, fileStats);

            // 5. Améliorer le responsive design
            content = this.improveResponsive(content, fileStats);

            // 6. Nettoyer les duplications CSS
            content = this.cleanDuplicateCSS(content, fileStats);

            // Sauvegarder si modifié
            if (content !== originalContent) {
                await fs.writeFile(filePath, content, 'utf8');
                this.stats.fixed++;
                this.stats.fileDetails.push(fileStats);
                console.log(`  ✅ ${filename} - ${fileStats.improvements.length} améliorations`);
            } else {
                console.log(`  ⏭️  ${filename} - Aucune modification nécessaire`);
            }

        } catch (error) {
            this.stats.errors++;
            console.error(`  ❌ ${filename} - Erreur: ${error.message}`);
        }
    }

    /**
     * 1. Corrige les erreurs de syntaxe HTML
     */
    fixHTMLSyntaxErrors(content, fileStats) {
        let modified = content;
        let count = 0;

        // Corriger les >> en trop dans les attributs style
        const regex1 = /(style="[^"]*);>>/g;
        if (modified.match(regex1)) {
            modified = modified.replace(regex1, '$1">');
            count++;
        }

        // Corriger les >> après text-decoration: none
        const regex2 = /(text-decoration:\s*none;)>>/g;
        if (modified.match(regex2)) {
            modified = modified.replace(regex2, '$1">');
            count++;
        }

        // Corriger les >> dans les balises fermantes
        const regex3 = /<\/a>>|<\/button>>|<\/div>>/g;
        if (modified.match(regex3)) {
            modified = modified.replace(regex3, (match) => match.replace('>>', '>'));
            count++;
        }

        // Corriger les > en trop après les chevrons de fermeture
        const regex4 = /(<[^>]+>)>(\{[^}]+\})/g;
        if (modified.match(regex4)) {
            modified = modified.replace(regex4, '$1$2');
            count++;
        }

        // Corriger les attributs href non fermés
        const regex5 = /href="([^"]*?)>>/g;
        if (modified.match(regex5)) {
            modified = modified.replace(regex5, 'href="$1">');
            count++;
        }

        // Corriger les >> avant les placeholders
        const regex6 = />>\{/g;
        if (modified.match(regex6)) {
            modified = modified.replace(regex6, '>{');
            count++;
        }

        if (count > 0) {
            fileStats.improvements.push(`Erreurs de syntaxe HTML corrigées (${count})`);
            this.stats.improvements.syntaxErrors += count;
        }

        return modified;
    }

    /**
     * 2. Ajoute les meta tags SEO manquants
     */
    addSEOMetaTags(content, fileStats) {
        let modified = content;
        const improvements = [];

        // Vérifier si les meta tags Open Graph existent déjà
        const hasOG = content.includes('og:title') || content.includes('property="og:');
        const hasTwitter = content.includes('twitter:card');
        const hasKeywords = content.includes('name="keywords"');

        if (!hasOG || !hasTwitter || !hasKeywords) {
            // Trouver la position après viewport
            const viewportIndex = content.indexOf('<meta name="viewport"');

            if (viewportIndex !== -1) {
                const insertPosition = content.indexOf('>', viewportIndex) + 1;

                let metaTags = '\n';

                if (!hasKeywords) {
                    metaTags += '    <meta name="keywords" content="{meta_keywords}">\n';
                    improvements.push('Meta keywords ajouté');
                }

                if (!hasOG) {
                    metaTags += `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{site_url}">
    <meta property="og:title" content="{meta_title}">
    <meta property="og:description" content="{meta_description}">
    <meta property="og:image" content="{og_image}">
`;
                    improvements.push('Open Graph tags ajoutés');
                }

                if (!hasTwitter) {
                    metaTags += `
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{site_url}">
    <meta property="twitter:title" content="{meta_title}">
    <meta property="twitter:description" content="{meta_description}">
    <meta property="twitter:image" content="{og_image}">
`;
                    improvements.push('Twitter Card tags ajoutés');
                }

                modified = modified.slice(0, insertPosition) + metaTags + modified.slice(insertPosition);
            }
        }

        if (improvements.length > 0) {
            fileStats.improvements.push(...improvements);
            this.stats.improvements.seoMetaTags += improvements.length;
        }

        return modified;
    }

    /**
     * 3. Améliore l'accessibilité
     */
    improveAccessibility(content, fileStats) {
        let modified = content;
        const improvements = [];

        // Ajouter aria-label aux inputs newsletter sans label
        const newsletterInputRegex = /<input\s+type="email"([^>]*?)(?!aria-label)([^>]*?)>/g;
        const matches = content.match(newsletterInputRegex);

        if (matches && matches.length > 0) {
            modified = modified.replace(
                /<input\s+type="email"([^>]*?)class="newsletter-input"([^>]*)>/g,
                '<input type="email"$1class="newsletter-input"$2 aria-label="Email address for newsletter subscription">'
            );
            improvements.push('ARIA labels ajoutés aux formulaires');
            this.stats.improvements.ariaLabels++;
        }

        // Ajouter role="navigation" aux navs sans role
        if (content.includes('<nav') && !content.includes('role="navigation"')) {
            modified = modified.replace(/<nav\s+class="/g, '<nav role="navigation" class="');
            improvements.push('Role navigation ajouté');
            this.stats.improvements.ariaLabels++;
        }

        // Ajouter role="main" au main content s'il n'existe pas
        if (content.includes('<main') && !content.includes('role="main"')) {
            modified = modified.replace(/<main\s+class="/g, '<main role="main" class="');
            improvements.push('Role main ajouté');
            this.stats.improvements.ariaLabels++;
        }

        // Ajouter aria-label aux boutons de menu mobile
        if (content.includes('class="nav-toggle"') && !content.includes('aria-label="Toggle navigation menu"')) {
            modified = modified.replace(
                /<button\s+class="nav-toggle"([^>]*)>/g,
                '<button class="nav-toggle"$1 aria-label="Toggle navigation menu" aria-expanded="false">'
            );
            improvements.push('ARIA labels ajoutés au menu mobile');
            this.stats.improvements.ariaLabels++;
        }

        // Ajouter loading="lazy" aux images qui ne l'ont pas
        const imgRegex = /<img\s+(?![^>]*loading=)[^>]*>/g;
        const imgMatches = content.match(imgRegex);

        if (imgMatches && imgMatches.length > 0) {
            modified = modified.replace(
                /<img\s+([^>]*?)(?!loading=)>/g,
                '<img $1 loading="lazy">'
            );
            improvements.push('Lazy loading ajouté aux images');
            this.stats.improvements.accessibility++;
        }

        if (improvements.length > 0) {
            fileStats.improvements.push(...improvements);
        }

        return modified;
    }

    /**
     * 4. Optimise les performances
     */
    optimizePerformance(content, fileStats) {
        let modified = content;
        const improvements = [];

        // Ajouter prefers-reduced-motion si animations présentes
        const hasAnimations = content.includes('@keyframes') || content.includes('animation:');
        const hasReducedMotion = content.includes('prefers-reduced-motion');

        if (hasAnimations && !hasReducedMotion) {
            // Trouver la fin du dernier @keyframes
            const lastKeyframeIndex = content.lastIndexOf('}', content.lastIndexOf('@keyframes'));

            if (lastKeyframeIndex !== -1) {
                const reducedMotionCSS = `

        /* Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }
`;
                modified = modified.slice(0, lastKeyframeIndex + 1) + reducedMotionCSS + modified.slice(lastKeyframeIndex + 1);
                improvements.push('Prefers-reduced-motion ajouté');
                this.stats.improvements.performance++;
            }
        }

        // Ajouter throttle aux mousemove listeners
        const hasMouseMove = content.includes("addEventListener('mousemove'");
        const hasThrottle = content.includes('function throttle') || content.includes('const throttle');

        if (hasMouseMove && !hasThrottle) {
            // Trouver le début du script
            const scriptStart = content.indexOf('<script>');

            if (scriptStart !== -1) {
                const throttleFunction = `
        // Throttle function for performance
        function throttle(func, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    func.apply(this, args);
                    lastCall = now;
                }
            };
        }

        `;

                const insertPos = content.indexOf('\n', scriptStart) + 1;
                modified = modified.slice(0, insertPos) + throttleFunction + modified.slice(insertPos);

                // Wrapper les mousemove listeners
                modified = modified.replace(
                    /document\.addEventListener\('mousemove',\s*(\w+)\)/g,
                    "document.addEventListener('mousemove', throttle($1, 16))"
                );

                improvements.push('Throttle ajouté aux mousemove listeners');
                this.stats.improvements.performance++;
            }
        }

        // Ajouter will-change aux éléments animés
        if (content.includes('transform:') && !content.includes('will-change:')) {
            // Ajouter will-change aux classes avec transform
            modified = modified.replace(
                /(\.[\w-]+\s*\{[^}]*transform:[^}]*)/g,
                (match) => {
                    if (!match.includes('will-change')) {
                        return match.replace('{', '{ will-change: transform;');
                    }
                    return match;
                }
            );
        }

        if (improvements.length > 0) {
            fileStats.improvements.push(...improvements);
        }

        return modified;
    }

    /**
     * 5. Améliore le responsive design
     */
    improveResponsive(content, fileStats) {
        let modified = content;
        const improvements = [];

        // Vérifier si des media queries existent
        const has425 = content.includes('max-width: 425px') || content.includes('max-width: 480px');
        const has768 = content.includes('max-width: 768px');
        const has1024 = content.includes('max-width: 1024px');

        // Si média queries manquantes, les ajouter
        if (has768 && !has425) {
            // Trouver la media query 768px
            const media768Index = content.indexOf('@media (max-width: 768px)');

            if (media768Index !== -1) {
                const mobileQuery = `
        /* Mobile phones */
        @media (max-width: 425px) {
            .container {
                padding: 1rem;
            }

            h1 {
                font-size: 1.75rem !important;
            }

            h2 {
                font-size: 1.5rem !important;
            }

            .grid, .services-grid, .features-grid {
                grid-template-columns: 1fr !important;
            }

            .nav-toggle {
                display: block;
            }

            .nav-menu {
                display: none;
            }

            .nav-menu.active {
                display: flex;
                flex-direction: column;
            }
        }

        `;

                modified = modified.slice(0, media768Index) + mobileQuery + modified.slice(media768Index);
                improvements.push('Media query mobile 425px ajoutée');
                this.stats.improvements.responsive++;
            }
        }

        if (improvements.length > 0) {
            fileStats.improvements.push(...improvements);
        }

        return modified;
    }

    /**
     * 6. Nettoie les duplications CSS
     */
    cleanDuplicateCSS(content, fileStats) {
        let modified = content;
        const improvements = [];

        // Détecter les définitions en double de .nav-container
        const navContainerMatches = content.match(/\.nav-container\s*\{[^}]*\}/g);

        if (navContainerMatches && navContainerMatches.length > 1) {
            // Garder seulement la première définition complète
            let firstFound = false;
            modified = modified.replace(/\.nav-container\s*\{[^}]*\}/g, (match) => {
                if (!firstFound) {
                    firstFound = true;
                    return match;
                }
                return ''; // Supprimer les duplicatas
            });

            improvements.push(`Duplication CSS supprimée (nav-container: ${navContainerMatches.length} -> 1)`);
            this.stats.improvements.performance++;
        }

        // Détecter les définitions en double de footer styles
        const footerMatches = content.match(/\.footer\s*\{[^}]*\}/g);

        if (footerMatches && footerMatches.length > 1) {
            let firstFooter = false;
            modified = modified.replace(/\.footer\s*\{[^}]*\}/g, (match) => {
                if (!firstFooter) {
                    firstFooter = true;
                    return match;
                }
                return '';
            });

            improvements.push(`Duplication CSS supprimée (footer: ${footerMatches.length} -> 1)`);
            this.stats.improvements.performance++;
        }

        if (improvements.length > 0) {
            fileStats.improvements.push(...improvements);
        }

        return modified;
    }

    /**
     * Génère le rapport final
     */
    generateReport() {
        console.log('\n═══════════════════════════════════════════════════════════════════');
        console.log('                    RAPPORT DE CORRECTION');
        console.log('═══════════════════════════════════════════════════════════════════\n');

        console.log('📊 STATISTIQUES GLOBALES:\n');
        console.log(`  Fichiers analysés:        ${this.stats.totalFiles}`);
        console.log(`  Fichiers corrigés:        ${this.stats.fixed}`);
        console.log(`  Fichiers avec erreurs:    ${this.stats.errors}\n`);

        console.log('✅ AMÉLIORATIONS APPLIQUÉES:\n');
        console.log(`  Erreurs syntaxe HTML:     ${this.stats.improvements.syntaxErrors}`);
        console.log(`  Meta tags SEO:            ${this.stats.improvements.seoMetaTags}`);
        console.log(`  ARIA labels:              ${this.stats.improvements.ariaLabels}`);
        console.log(`  Accessibilité:            ${this.stats.improvements.accessibility}`);
        console.log(`  Performance:              ${this.stats.improvements.performance}`);
        console.log(`  Responsive design:        ${this.stats.improvements.responsive}\n`);

        const totalImprovements = Object.values(this.stats.improvements).reduce((a, b) => a + b, 0);
        console.log(`  TOTAL AMÉLIORATIONS:      ${totalImprovements}\n`);

        if (this.stats.fileDetails.length > 0) {
            console.log('📝 DÉTAILS PAR FICHIER:\n');

            for (const file of this.stats.fileDetails) {
                if (file.improvements.length > 0) {
                    console.log(`  ${file.filename}:`);
                    file.improvements.forEach(imp => console.log(`    • ${imp}`));
                    console.log();
                }
            }
        }

        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('                         SUCCÈS !');
        console.log('═══════════════════════════════════════════════════════════════════\n');

        console.log('🎉 Tous les layouts ont été améliorés !\n');
        console.log('💾 Backup disponible dans: .layouts-backup/\n');
        console.log('🔄 Pour restaurer les originaux:');
        console.log('   $ cp .layouts-backup/*.html templates/layouts/\n');
    }
}

// Exécution
const fixer = new LayoutFixer();
fixer.fixAll().catch(console.error);
