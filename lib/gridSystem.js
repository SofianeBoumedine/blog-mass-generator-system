/**
 * Système de grille responsive avancé
 * Génère automatiquement des CSS Grid et Flexbox layouts
 * avec des breakpoints adaptatifs et des utilitaires
 */

class GridSystem {
    constructor() {
        this.breakpoints = {
            xs: '0px',
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            xxl: '1400px'
        };

        this.containerSizes = {
            xs: '100%',
            sm: '540px',
            md: '720px',
            lg: '960px',
            xl: '1140px',
            xxl: '1320px'
        };

        this.gridColumns = 12;
        this.gutterSizes = {
            xs: '0.5rem',
            sm: '1rem',
            md: '1.5rem',
            lg: '2rem',
            xl: '3rem'
        };
    }

    /**
     * Génère le CSS complet du système de grille
     * @param {Object} options - Options de configuration
     * @returns {string} CSS généré
     */
    generateGridCSS(options = {}) {
        const config = {
            includeUtilities: true,
            includeComponents: true,
            prefix: '',
            ...options
        };

        let css = this.generateBaseCSS(config);
        css += this.generateContainerCSS(config);
        css += this.generateGridCSS_Internal(config);
        css += this.generateFlexboxCSS(config);

        if (config.includeUtilities) {
            css += this.generateUtilityCSS(config);
        }

        if (config.includeComponents) {
            css += this.generateComponentCSS(config);
        }

        return css;
    }

    /**
     * Génère les CSS de base et variables
     */
    generateBaseCSS(config) {
        const prefix = config.prefix;

        return `
/* === SYSTÈME DE GRILLE AVANCÉ === */
:root {
    /* Breakpoints */
    --grid-xs: ${this.breakpoints.xs};
    --grid-sm: ${this.breakpoints.sm};
    --grid-md: ${this.breakpoints.md};
    --grid-lg: ${this.breakpoints.lg};
    --grid-xl: ${this.breakpoints.xl};
    --grid-xxl: ${this.breakpoints.xxl};

    /* Container sizes */
    --container-xs: ${this.containerSizes.xs};
    --container-sm: ${this.containerSizes.sm};
    --container-md: ${this.containerSizes.md};
    --container-lg: ${this.containerSizes.lg};
    --container-xl: ${this.containerSizes.xl};
    --container-xxl: ${this.containerSizes.xxl};

    /* Gutters */
    --gutter-xs: ${this.gutterSizes.xs};
    --gutter-sm: ${this.gutterSizes.sm};
    --gutter-md: ${this.gutterSizes.md};
    --gutter-lg: ${this.gutterSizes.lg};
    --gutter-xl: ${this.gutterSizes.xl};

    /* Grid columns */
    --grid-columns: ${this.gridColumns};
}

/* Box sizing reset */
*,
*::before,
*::after {
    box-sizing: border-box;
}
`;
    }

    /**
     * Génère les CSS pour les containers
     */
    generateContainerCSS(config) {
        const prefix = config.prefix;

        let css = `
/* === CONTAINERS === */
.${prefix}container,
.${prefix}container-fluid {
    width: 100%;
    padding-right: var(--gutter-md);
    padding-left: var(--gutter-md);
    margin-right: auto;
    margin-left: auto;
}

.${prefix}container-fluid {
    max-width: none;
}
`;

        // Générer les containers responsives
        Object.entries(this.breakpoints).forEach(([size, breakpoint]) => {
            if (size !== 'xs') {
                css += `
@media (min-width: ${breakpoint}) {
    .${prefix}container {
        max-width: var(--container-${size});
    }
}`;
            }
        });

        // Containers spécifiques
        Object.entries(this.containerSizes).forEach(([size, maxWidth]) => {
            css += `
.${prefix}container-${size} {
    max-width: ${maxWidth};
    width: 100%;
    padding-right: var(--gutter-md);
    padding-left: var(--gutter-md);
    margin-right: auto;
    margin-left: auto;
}`;
        });

        return css;
    }

    /**
     * Génère les CSS Grid classes
     */
    generateGridCSS_Internal(config) {
        const prefix = config.prefix;

        let css = `
/* === CSS GRID SYSTEM === */
.${prefix}grid {
    display: grid;
    gap: var(--gutter-md);
}

/* Auto-fit grids */
.${prefix}grid-auto-fit {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.${prefix}grid-auto-fill {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Equal columns */
.${prefix}grid-2 { grid-template-columns: repeat(2, 1fr); }
.${prefix}grid-3 { grid-template-columns: repeat(3, 1fr); }
.${prefix}grid-4 { grid-template-columns: repeat(4, 1fr); }
.${prefix}grid-5 { grid-template-columns: repeat(5, 1fr); }
.${prefix}grid-6 { grid-template-columns: repeat(6, 1fr); }

/* Common layouts */
.${prefix}grid-sidebar-left {
    grid-template-columns: 250px 1fr;
}

.${prefix}grid-sidebar-right {
    grid-template-columns: 1fr 250px;
}

.${prefix}grid-holy-grail {
    grid-template-areas:
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}

.${prefix}grid-header { grid-area: header; }
.${prefix}grid-sidebar { grid-area: sidebar; }
.${prefix}grid-main { grid-area: main; }
.${prefix}grid-aside { grid-area: aside; }
.${prefix}grid-footer { grid-area: footer; }

/* Grid gaps */
.${prefix}gap-0 { gap: 0; }
.${prefix}gap-xs { gap: var(--gutter-xs); }
.${prefix}gap-sm { gap: var(--gutter-sm); }
.${prefix}gap-md { gap: var(--gutter-md); }
.${prefix}gap-lg { gap: var(--gutter-lg); }
.${prefix}gap-xl { gap: var(--gutter-xl); }

/* Column spans */`;

        for (let i = 1; i <= this.gridColumns; i++) {
            css += `
.${prefix}col-span-${i} { grid-column: span ${i}; }`;
        }

        css += `
.${prefix}col-span-full { grid-column: 1 / -1; }

/* Row spans */
.${prefix}row-span-1 { grid-row: span 1; }
.${prefix}row-span-2 { grid-row: span 2; }
.${prefix}row-span-3 { grid-row: span 3; }
.${prefix}row-span-4 { grid-row: span 4; }
.${prefix}row-span-5 { grid-row: span 5; }
.${prefix}row-span-6 { grid-row: span 6; }
.${prefix}row-span-full { grid-row: 1 / -1; }

/* Grid placement */
.${prefix}justify-start { justify-self: start; }
.${prefix}justify-center { justify-self: center; }
.${prefix}justify-end { justify-self: end; }
.${prefix}justify-stretch { justify-self: stretch; }

.${prefix}align-start { align-self: start; }
.${prefix}align-center { align-self: center; }
.${prefix}align-end { align-self: end; }
.${prefix}align-stretch { align-self: stretch; }
`;

        // Responsive grid classes
        Object.entries(this.breakpoints).forEach(([size, breakpoint]) => {
            if (size !== 'xs') {
                css += `
@media (min-width: ${breakpoint}) {`;

                // Grid columns
                for (let i = 1; i <= 6; i++) {
                    css += `
    .${prefix}grid-${size}-${i} { grid-template-columns: repeat(${i}, 1fr); }`;
                }

                // Column spans
                for (let i = 1; i <= this.gridColumns; i++) {
                    css += `
    .${prefix}col-${size}-span-${i} { grid-column: span ${i}; }`;
                }

                css += `
    .${prefix}col-${size}-span-full { grid-column: 1 / -1; }
}`;
            }
        });

        return css;
    }

    /**
     * Génère les CSS Flexbox classes
     */
    generateFlexboxCSS(config) {
        const prefix = config.prefix;

        return `
/* === FLEXBOX SYSTEM === */
.${prefix}flex { display: flex; }
.${prefix}inline-flex { display: inline-flex; }

/* Flex direction */
.${prefix}flex-row { flex-direction: row; }
.${prefix}flex-row-reverse { flex-direction: row-reverse; }
.${prefix}flex-col { flex-direction: column; }
.${prefix}flex-col-reverse { flex-direction: column-reverse; }

/* Flex wrap */
.${prefix}flex-wrap { flex-wrap: wrap; }
.${prefix}flex-nowrap { flex-wrap: nowrap; }
.${prefix}flex-wrap-reverse { flex-wrap: wrap-reverse; }

/* Justify content */
.${prefix}justify-start { justify-content: flex-start; }
.${prefix}justify-end { justify-content: flex-end; }
.${prefix}justify-center { justify-content: center; }
.${prefix}justify-between { justify-content: space-between; }
.${prefix}justify-around { justify-content: space-around; }
.${prefix}justify-evenly { justify-content: space-evenly; }

/* Align items */
.${prefix}items-start { align-items: flex-start; }
.${prefix}items-end { align-items: flex-end; }
.${prefix}items-center { align-items: center; }
.${prefix}items-baseline { align-items: baseline; }
.${prefix}items-stretch { align-items: stretch; }

/* Align content */
.${prefix}content-start { align-content: flex-start; }
.${prefix}content-end { align-content: flex-end; }
.${prefix}content-center { align-content: center; }
.${prefix}content-between { align-content: space-between; }
.${prefix}content-around { align-content: space-around; }
.${prefix}content-evenly { align-content: space-evenly; }

/* Flex grow/shrink */
.${prefix}flex-1 { flex: 1 1 0%; }
.${prefix}flex-auto { flex: 1 1 auto; }
.${prefix}flex-initial { flex: 0 1 auto; }
.${prefix}flex-none { flex: none; }

.${prefix}grow { flex-grow: 1; }
.${prefix}grow-0 { flex-grow: 0; }
.${prefix}shrink { flex-shrink: 1; }
.${prefix}shrink-0 { flex-shrink: 0; }

/* Order */
.${prefix}order-1 { order: 1; }
.${prefix}order-2 { order: 2; }
.${prefix}order-3 { order: 3; }
.${prefix}order-4 { order: 4; }
.${prefix}order-5 { order: 5; }
.${prefix}order-6 { order: 6; }
.${prefix}order-first { order: -9999; }
.${prefix}order-last { order: 9999; }
.${prefix}order-none { order: 0; }
`;
    }

    /**
     * Génère les utilitaires CSS
     */
    generateUtilityCSS(config) {
        const prefix = config.prefix;

        return `
/* === UTILITIES === */
/* Display */
.${prefix}block { display: block; }
.${prefix}inline-block { display: inline-block; }
.${prefix}inline { display: inline; }
.${prefix}hidden { display: none; }

/* Position */
.${prefix}static { position: static; }
.${prefix}fixed { position: fixed; }
.${prefix}absolute { position: absolute; }
.${prefix}relative { position: relative; }
.${prefix}sticky { position: sticky; }

/* Spacing */
.${prefix}m-0 { margin: 0; }
.${prefix}m-1 { margin: 0.25rem; }
.${prefix}m-2 { margin: 0.5rem; }
.${prefix}m-3 { margin: 1rem; }
.${prefix}m-4 { margin: 1.5rem; }
.${prefix}m-5 { margin: 3rem; }
.${prefix}m-auto { margin: auto; }

.${prefix}mx-auto { margin-left: auto; margin-right: auto; }
.${prefix}my-auto { margin-top: auto; margin-bottom: auto; }

.${prefix}p-0 { padding: 0; }
.${prefix}p-1 { padding: 0.25rem; }
.${prefix}p-2 { padding: 0.5rem; }
.${prefix}p-3 { padding: 1rem; }
.${prefix}p-4 { padding: 1.5rem; }
.${prefix}p-5 { padding: 3rem; }

/* Width */
.${prefix}w-full { width: 100%; }
.${prefix}w-auto { width: auto; }
.${prefix}w-fit { width: fit-content; }
.${prefix}w-min { width: min-content; }
.${prefix}w-max { width: max-content; }

/* Height */
.${prefix}h-full { height: 100%; }
.${prefix}h-screen { height: 100vh; }
.${prefix}h-auto { height: auto; }
.${prefix}h-fit { height: fit-content; }
.${prefix}h-min { height: min-content; }
.${prefix}h-max { height: max-content; }

/* Text alignment */
.${prefix}text-left { text-align: left; }
.${prefix}text-center { text-align: center; }
.${prefix}text-right { text-align: right; }
.${prefix}text-justify { text-align: justify; }

/* Visibility */
.${prefix}visible { visibility: visible; }
.${prefix}invisible { visibility: hidden; }

/* Overflow */
.${prefix}overflow-auto { overflow: auto; }
.${prefix}overflow-hidden { overflow: hidden; }
.${prefix}overflow-visible { overflow: visible; }
.${prefix}overflow-scroll { overflow: scroll; }

/* Z-index */
.${prefix}z-0 { z-index: 0; }
.${prefix}z-10 { z-index: 10; }
.${prefix}z-20 { z-index: 20; }
.${prefix}z-30 { z-index: 30; }
.${prefix}z-40 { z-index: 40; }
.${prefix}z-50 { z-index: 50; }
`;
    }

    /**
     * Génère les composants CSS prêts à l'emploi
     */
    generateComponentCSS(config) {
        const prefix = config.prefix;

        return `
/* === COMPOSANTS PRÊTS À L'EMPLOI === */

/* Card Grid */
.${prefix}card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--gutter-lg);
}

.${prefix}card-grid-sm {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--gutter-md);
}

.${prefix}card-grid-lg {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: var(--gutter-xl);
}

/* Feature Grid */
.${prefix}feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--gutter-lg);
    align-items: start;
}

/* Pricing Grid */
.${prefix}pricing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--gutter-lg);
    align-items: end;
}

/* Gallery Grid */
.${prefix}gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--gutter-sm);
}

.${prefix}gallery-masonry {
    columns: 4;
    column-gap: var(--gutter-md);
}

/* Dashboard Layout */
.${prefix}dashboard {
    display: grid;
    grid-template-areas:
        "sidebar header header"
        "sidebar main main"
        "sidebar main main";
    grid-template-columns: 250px 1fr;
    grid-template-rows: 60px 1fr;
    min-height: 100vh;
}

.${prefix}dashboard-sidebar { grid-area: sidebar; }
.${prefix}dashboard-header { grid-area: header; }
.${prefix}dashboard-main { grid-area: main; }

/* Article Layout */
.${prefix}article-layout {
    display: grid;
    grid-template-columns: 1fr min(65ch, 100%) 1fr;
    gap: var(--gutter-md);
}

.${prefix}article-layout > * {
    grid-column: 2;
}

.${prefix}article-layout .${prefix}full-bleed {
    grid-column: 1 / -1;
}

/* Hero Layouts */
.${prefix}hero-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    min-height: 80vh;
    gap: var(--gutter-xl);
}

.${prefix}hero-centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 80vh;
    gap: var(--gutter-lg);
}

/* Navigation Layouts */
.${prefix}nav-horizontal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--gutter-md);
}

.${prefix}nav-vertical {
    display: flex;
    flex-direction: column;
    gap: var(--gutter-sm);
    padding: var(--gutter-md);
}

/* Footer Layouts */
.${prefix}footer-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--gutter-lg);
}

/* Responsive utilities */
@media (max-width: 768px) {
    .${prefix}hero-split {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .${prefix}dashboard {
        grid-template-areas:
            "header"
            "main"
            "sidebar";
        grid-template-columns: 1fr;
        grid-template-rows: 60px 1fr auto;
    }

    .${prefix}gallery-masonry {
        columns: 2;
    }

    .${prefix}card-grid,
    .${prefix}feature-grid,
    .${prefix}pricing-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .${prefix}gallery-masonry {
        columns: 1;
    }
}
`;
    }

    /**
     * Génère une grille personnalisée basée sur le contenu
     * @param {Object} contentData - Données du contenu
     * @returns {string} CSS personnalisé
     */
    generateCustomGrid(contentData) {
        const { sections, layout, breakpoints } = contentData;

        let css = '';

        // Analyser les sections pour déterminer la meilleure grille
        if (sections) {
            const sectionCount = sections.length;

            if (sectionCount <= 2) {
                css += `.content-grid { grid-template-columns: 1fr 1fr; }`;
            } else if (sectionCount <= 3) {
                css += `.content-grid { grid-template-columns: repeat(3, 1fr); }`;
            } else if (sectionCount <= 4) {
                css += `.content-grid { grid-template-columns: repeat(2, 1fr); }`;
            } else {
                css += `.content-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }`;
            }
        }

        // Ajouter des breakpoints personnalisés si fournis
        if (breakpoints) {
            Object.entries(breakpoints).forEach(([size, rules]) => {
                css += `@media (${size}) { ${rules} }`;
            });
        }

        return css;
    }

    /**
     * Optimise automatiquement la grille pour les performances
     * @param {string} css - CSS à optimiser
     * @returns {string} CSS optimisé
     */
    optimizeGrid(css) {
        // Supprimer les doublons
        const lines = css.split('\n');
        const uniqueLines = [...new Set(lines)];

        // Minifier si nécessaire
        let optimized = uniqueLines.join('\n');

        // Optimisations spécifiques
        optimized = optimized
            .replace(/\s+/g, ' ') // Réduire les espaces multiples
            .replace(/;\s*}/g, '}') // Supprimer les point-virgules avant les accolades
            .replace(/\{\s*/g, '{') // Supprimer les espaces après les accolades ouvrantes
            .replace(/\s*\}/g, '}'); // Supprimer les espaces avant les accolades fermantes

        return optimized;
    }

    /**
     * Valide le CSS généré
     * @param {string} css - CSS à valider
     * @returns {Object} Résultat de la validation
     */
    validateCSS(css) {
        const issues = [];
        const warnings = [];

        // Vérifications basiques
        const braceCount = (css.match(/\{/g) || []).length;
        const closeBraceCount = (css.match(/\}/g) || []).length;

        if (braceCount !== closeBraceCount) {
            issues.push('Nombre d\'accolades ouvrantes et fermantes non égal');
        }

        // Vérifier les propriétés CSS invalides
        const invalidProperties = css.match(/[^{};]+:\s*[^{};]*[{}]/g);
        if (invalidProperties) {
            warnings.push('Propriétés CSS potentiellement invalides détectées');
        }

        return {
            isValid: issues.length === 0,
            issues,
            warnings,
            stats: {
                size: css.length,
                rules: (css.match(/\{[^}]*\}/g) || []).length,
                mediaQueries: (css.match(/@media[^{]*\{/g) || []).length
            }
        };
    }
}

module.exports = GridSystem;