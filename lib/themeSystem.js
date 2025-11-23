/**
 * Système de Thèmes Avancé pour Blog Mass Generator
 * Génère automatiquement des palettes de couleurs cohérentes et professionnelles
 */

class ThemeSystem {
    constructor() {
        this.themes = {
            // Thèmes Professionnels
            corporate: {
                name: 'Corporate Professional',
                primary: '#2563eb',
                secondary: '#1e40af',
                accent: '#3b82f6',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                text: '#1f2937',
                textLight: '#6b7280',
                background: '#ffffff',
                backgroundAlt: '#f9fafb',
                border: '#e5e7eb',
                gradient: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                fonts: {
                    heading: "'Inter', -apple-system, sans-serif",
                    body: "'Inter', -apple-system, sans-serif"
                }
            },

            tech: {
                name: 'Tech Startup',
                primary: '#8b5cf6',
                secondary: '#7c3aed',
                accent: '#a78bfa',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                text: '#1f2937',
                textLight: '#6b7280',
                background: '#ffffff',
                backgroundAlt: '#faf5ff',
                border: '#e9d5ff',
                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                fonts: {
                    heading: "'Poppins', sans-serif",
                    body: "'Inter', sans-serif"
                }
            },

            creative: {
                name: 'Creative Agency',
                primary: '#ec4899',
                secondary: '#db2777',
                accent: '#f472b6',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                text: '#1f2937',
                textLight: '#6b7280',
                background: '#ffffff',
                backgroundAlt: '#fdf2f8',
                border: '#fce7f3',
                gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                fonts: {
                    heading: "'Playfair Display', serif",
                    body: "'Source Sans Pro', sans-serif"
                }
            },

            nature: {
                name: 'Eco Nature',
                primary: '#10b981',
                secondary: '#059669',
                accent: '#34d399',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                text: '#1f2937',
                textLight: '#4b5563',
                background: '#ffffff',
                backgroundAlt: '#ecfdf5',
                border: '#d1fae5',
                gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                fonts: {
                    heading: "'Merriweather', serif",
                    body: "'Open Sans', sans-serif"
                }
            },

            luxury: {
                name: 'Luxury Premium',
                primary: '#d97706',
                secondary: '#b45309',
                accent: '#f59e0b',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#dc2626',
                text: '#18181b',
                textLight: '#52525b',
                background: '#ffffff',
                backgroundAlt: '#fffbeb',
                border: '#fde68a',
                gradient: 'linear-gradient(135deg, #d97706 0%, #7c2d12 100%)',
                fonts: {
                    heading: "'Cormorant Garamond', serif",
                    body: "'Lato', sans-serif"
                }
            },

            dark: {
                name: 'Dark Mode',
                primary: '#818cf8',
                secondary: '#6366f1',
                accent: '#a5b4fc',
                success: '#34d399',
                warning: '#fbbf24',
                error: '#f87171',
                text: '#f3f4f6',
                textLight: '#9ca3af',
                background: '#111827',
                backgroundAlt: '#1f2937',
                border: '#374151',
                gradient: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                fonts: {
                    heading: "'Space Grotesk', sans-serif",
                    body: "'Inter', sans-serif"
                }
            },

            minimal: {
                name: 'Minimal Clean',
                primary: '#000000',
                secondary: '#404040',
                accent: '#808080',
                success: '#059669',
                warning: '#d97706',
                error: '#dc2626',
                text: '#000000',
                textLight: '#525252',
                background: '#ffffff',
                backgroundAlt: '#fafafa',
                border: '#e5e5e5',
                gradient: 'linear-gradient(135deg, #000000 0%, #404040 100%)',
                fonts: {
                    heading: "'Helvetica Neue', sans-serif",
                    body: "'Helvetica Neue', sans-serif"
                }
            },

            ocean: {
                name: 'Ocean Blue',
                primary: '#0891b2',
                secondary: '#0e7490',
                accent: '#06b6d4',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                text: '#0f172a',
                textLight: '#475569',
                background: '#ffffff',
                backgroundAlt: '#f0f9ff',
                border: '#bae6fd',
                gradient: 'linear-gradient(135deg, #0891b2 0%, #0c4a6e 100%)',
                fonts: {
                    heading: "'Montserrat', sans-serif",
                    body: "'Roboto', sans-serif"
                }
            }
        };

        this.colorSchemes = this.generateColorSchemes();
        this.animations = this.generateAnimations();
    }

    /**
     * Génère des schémas de couleurs complémentaires
     */
    generateColorSchemes() {
        return {
            monochromatic: (baseColor) => {
                // Génère une palette monochromatique
                const hsl = this.hexToHsl(baseColor);
                return {
                    light: this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 95)),
                    lighter: this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 40, 98)),
                    base: baseColor,
                    dark: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)),
                    darker: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 40, 5))
                };
            },

            complementary: (baseColor) => {
                // Génère des couleurs complémentaires
                const hsl = this.hexToHsl(baseColor);
                return {
                    base: baseColor,
                    complement: this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
                    split1: this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
                    split2: this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
                };
            },

            triadic: (baseColor) => {
                // Génère une triade de couleurs
                const hsl = this.hexToHsl(baseColor);
                return {
                    base: baseColor,
                    triadic1: this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
                    triadic2: this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
                };
            },

            analogous: (baseColor) => {
                // Génère des couleurs analogues
                const hsl = this.hexToHsl(baseColor);
                return {
                    base: baseColor,
                    analog1: this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
                    analog2: this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
                };
            }
        };
    }

    /**
     * Génère des animations CSS personnalisées
     */
    generateAnimations() {
        return {
            fadeIn: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `,
            slideInUp: `
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `,
            slideInDown: `
                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `,
            scaleIn: `
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `,
            rotate: `
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `,
            pulse: `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                }
            `,
            gradient: `
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `,
            float: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
            `,
            shimmer: `
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
            `,
            bounce: `
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    25% { transform: translateY(-20px); }
                    50% { transform: translateY(0); }
                    75% { transform: translateY(-10px); }
                }
            `
        };
    }

    /**
     * Sélectionne un thème basé sur les mots-clés
     */
    selectThemeByKeywords(keywords) {
        const keywordString = keywords.join(' ').toLowerCase();

        // Mapping des mots-clés aux thèmes
        const themeKeywords = {
            corporate: ['business', 'entreprise', 'corporate', 'finance', 'consulting', 'cabinet'],
            tech: ['tech', 'startup', 'software', 'app', 'digital', 'innovation', 'ai', 'data'],
            creative: ['design', 'creative', 'agency', 'art', 'studio', 'portfolio'],
            nature: ['eco', 'nature', 'bio', 'green', 'sustainable', 'organic', 'environnement'],
            luxury: ['luxury', 'premium', 'exclusive', 'high-end', 'prestige', 'élégant'],
            ocean: ['ocean', 'marine', 'nautique', 'mer', 'plage', 'voyage'],
            minimal: ['minimal', 'simple', 'clean', 'moderne', 'épuré']
        };

        // Compter les correspondances
        let bestMatch = 'corporate';
        let maxMatches = 0;

        for (const [theme, themeWords] of Object.entries(themeKeywords)) {
            const matches = themeWords.filter(word => keywordString.includes(word)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = theme;
            }
        }

        return this.themes[bestMatch];
    }

    /**
     * Génère un thème personnalisé basé sur une couleur
     */
    generateCustomTheme(primaryColor, name = 'Custom Theme') {
        const schemes = this.colorSchemes;
        const monochromatic = schemes.monochromatic(primaryColor);
        const complementary = schemes.complementary(primaryColor);

        return {
            name: name,
            primary: primaryColor,
            secondary: monochromatic.dark,
            accent: complementary.complement,
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            text: monochromatic.darker,
            textLight: monochromatic.base,
            background: '#ffffff',
            backgroundAlt: monochromatic.lighter,
            border: monochromatic.light,
            gradient: `linear-gradient(135deg, ${primaryColor} 0%, ${monochromatic.dark} 100%)`,
            fonts: {
                heading: "'Inter', sans-serif",
                body: "'Inter', sans-serif"
            }
        };
    }

    /**
     * Génère le CSS complet pour un thème
     */
    generateThemeCSS(theme) {
        return `
            :root {
                /* Colors */
                --color-primary: ${theme.primary};
                --color-secondary: ${theme.secondary};
                --color-accent: ${theme.accent};
                --color-success: ${theme.success};
                --color-warning: ${theme.warning};
                --color-error: ${theme.error};
                --color-text: ${theme.text};
                --color-text-light: ${theme.textLight};
                --color-background: ${theme.background};
                --color-background-alt: ${theme.backgroundAlt};
                --color-border: ${theme.border};

                /* Gradients */
                --gradient-primary: ${theme.gradient};
                --gradient-secondary: linear-gradient(135deg, ${theme.secondary} 0%, ${theme.accent} 100%);
                --gradient-hero: ${theme.gradient};

                /* Typography */
                --font-heading: ${theme.fonts.heading};
                --font-body: ${theme.fonts.body};

                /* Spacing */
                --space-xs: 0.25rem;
                --space-sm: 0.5rem;
                --space-md: 1rem;
                --space-lg: 1.5rem;
                --space-xl: 2rem;
                --space-2xl: 3rem;
                --space-3xl: 4rem;

                /* Shadows */
                --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
                --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
                --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
                --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
                --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

                /* Border Radius */
                --radius-sm: 0.25rem;
                --radius-md: 0.375rem;
                --radius-lg: 0.5rem;
                --radius-xl: 0.75rem;
                --radius-2xl: 1rem;
                --radius-full: 9999px;

                /* Transitions */
                --transition-fast: 150ms ease;
                --transition-base: 250ms ease;
                --transition-slow: 350ms ease;

                /* Z-index */
                --z-dropdown: 100;
                --z-sticky: 200;
                --z-overlay: 300;
                --z-modal: 400;
                --z-toast: 500;
            }

            /* Utility Classes */
            .gradient-text {
                background: var(--gradient-primary);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .glass-effect {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .hover-lift {
                transition: transform var(--transition-base);
            }

            .hover-lift:hover {
                transform: translateY(-4px);
            }

            .hover-glow:hover {
                box-shadow: 0 0 20px var(--color-primary);
            }

            /* Animations */
            ${Object.values(this.animations).join('\n')}

            /* Animation utility classes */
            .animate-fadeIn { animation: fadeIn 0.5s ease; }
            .animate-slideInUp { animation: slideInUp 0.6s ease; }
            .animate-slideInDown { animation: slideInDown 0.6s ease; }
            .animate-scaleIn { animation: scaleIn 0.5s ease; }
            .animate-pulse { animation: pulse 2s infinite; }
            .animate-float { animation: float 3s ease-in-out infinite; }
            .animate-bounce { animation: bounce 2s ease-in-out infinite; }
            .animate-gradient {
                background-size: 200% 200%;
                animation: gradient 3s ease infinite;
            }
        `;
    }

    /**
     * Convertit hex en HSL
     */
    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * Convertit HSL en hex
     */
    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * Applique un thème au document
     */
    applyTheme(themeName) {
        const theme = this.themes[themeName] || this.themes.corporate;
        const css = this.generateThemeCSS(theme);

        // Créer ou mettre à jour la balise style
        let styleElement = document.getElementById('theme-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'theme-styles';
            document.head.appendChild(styleElement);
        }

        styleElement.innerHTML = css;

        // Sauvegarder le thème actuel
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('selected-theme', themeName);
        }

        return theme;
    }

    /**
     * Obtient le thème sauvegardé ou par défaut
     */
    getSavedTheme() {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('selected-theme') || 'corporate';
        }
        return 'corporate';
    }

    /**
     * Export des thèmes pour utilisation dans les templates
     */
    exportThemes() {
        return this.themes;
    }

    /**
     * Génère une palette complète pour un site
     */
    generateSitePalette(keywords, brandName) {
        const theme = this.selectThemeByKeywords(keywords);
        const palette = {
            ...theme,
            brandName: brandName,
            keywords: keywords,
            generatedAt: new Date().toISOString()
        };

        return palette;
    }
}

module.exports = ThemeSystem;