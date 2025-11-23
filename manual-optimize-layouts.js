/**
 * Optimisation manuelle avancée - layout par layout du dernier au premier
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

// Optimisations manuelles poussées
const manualOptimizations = {
    // Meta tags avancés pour référencement
    richMetaTags: `
    <!-- Rich Meta Tags -->
    <meta name="language" content="French">
    <meta name="distribution" content="global">
    <meta name="rating" content="general">
    <meta name="revisit-after" content="7 days">
    <meta name="format-detection" content="telephone=no">`,

    // Preload critical resources
    criticalPreload: `
    <!-- Preload Critical Resources -->
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">`,

    // Micro-optimisations CSS
    microOptimizationsCSS: `
        /* ========== MICRO-OPTIMIZATIONS ========== */
        /* Contain paint for better rendering */
        .section,
        .card,
        [class*="section"] {
            contain: layout style paint;
        }

        /* Optimize font rendering */
        * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }

        /* Optimize transforms with hardware acceleration */
        .btn,
        button,
        a[class*="btn"],
        [class*="card"]:hover,
        [class*="feature"]:hover {
            transform: translateZ(0);
            backface-visibility: hidden;
            perspective: 1000px;
        }

        /* Optimize images */
        img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
        }

        /* Prevent text selection on UI elements */
        button,
        .btn,
        [class*="btn"] {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
        }

        /* Optimize scrolling on mobile */
        body {
            -webkit-overflow-scrolling: touch;
            overflow-x: hidden;
        }`,

    // Loading state
    loadingState: `
    <!-- Loading State -->
    <div id="page-loader" class="page-loader">
        <div class="loader-spinner"></div>
        <p class="loader-text">Chargement...</p>
    </div>`,

    loadingStateCSS: `
        /* ========== PAGE LOADER ========== */
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background, #fff);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .page-loader.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(0,0,0,0.1);
            border-top-color: var(--primary, #007bff);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .loader-text {
            margin-top: 1rem;
            font-size: var(--text-sm, 0.875rem);
            color: var(--text, #333);
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }`,

    loadingStateJS: `
    <script>
    // Page Loader
    window.addEventListener('load', function() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 300);
            }, 500);
        }
    });
    </script>`,

    // Back to top enhancement
    enhancedBackToTop: `
    <script>
    // Enhanced Back to Top with progress indicator
    (function() {
        const scrollBtn = document.getElementById('scrollToTop');
        if (!scrollBtn) return;

        // Add progress circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '22');
        circle.setAttribute('cx', '25');
        circle.setAttribute('cy', '25');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', 'currentColor');
        circle.setAttribute('stroke-width', '3');
        circle.setAttribute('stroke-dasharray', '138');
        circle.setAttribute('stroke-dashoffset', '138');
        circle.style.transition = 'stroke-dashoffset 0.3s ease';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '50');
        svg.setAttribute('height', '50');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.transform = 'rotate(-90deg)';
        svg.appendChild(circle);

        if (scrollBtn.tagName === 'BUTTON') {
            scrollBtn.style.position = 'relative';
            scrollBtn.appendChild(svg);
        }

        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            const offset = 138 - (138 * scrollPercent / 100);
            circle.setAttribute('stroke-dashoffset', offset);
        }, { passive: true });
    })();
    </script>`,

    // Print styles
    printStyles: `
        /* ========== PRINT STYLES ========== */
        @media print {
            /* Hide non-essential elements */
            nav,
            .scroll-to-top,
            .cookie-consent,
            button,
            .btn,
            [class*="btn"],
            footer .social-links {
                display: none !important;
            }

            /* Optimize for print */
            body {
                background: white !important;
                color: black !important;
                font-size: 12pt;
            }

            /* Break pages appropriately */
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
            }

            img {
                max-width: 100% !important;
                page-break-inside: avoid;
            }

            /* Expand links for print */
            a[href]:after {
                content: " (" attr(href) ")";
                font-size: 0.8em;
                color: #666;
            }

            /* Better table printing */
            table {
                page-break-inside: avoid;
            }
        }`,

    // Accessibility enhancements
    a11yEnhancements: `
        /* ========== ENHANCED ACCESSIBILITY ========== */
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            * {
                border-color: currentColor !important;
            }

            button,
            .btn,
            [class*="btn"] {
                border: 2px solid currentColor !important;
            }
        }

        /* Transparent text selection */
        ::selection {
            background: var(--primary, #007bff);
            color: white;
        }

        ::-moz-selection {
            background: var(--primary, #007bff);
            color: white;
        }

        /* Better focus indicators */
        a:focus,
        button:focus,
        input:focus,
        textarea:focus,
        select:focus {
            outline: 3px solid var(--primary, #007bff);
            outline-offset: 3px;
        }

        /* Reduced transparency mode */
        @media (prefers-reduced-transparency: reduce) {
            * {
                opacity: 1 !important;
                backdrop-filter: none !important;
            }
        }`,

    // Offline support message
    offlineSupport: `
    <div id="offline-notification" class="offline-notification" style="display: none;">
        <p>⚠️ Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</p>
    </div>`,

    offlineSupportCSS: `
        /* ========== OFFLINE NOTIFICATION ========== */
        .offline-notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff9800;
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--radius-lg, 0.75rem);
            box-shadow: var(--shadow-xl, 0 20px 25px rgba(0,0,0,0.1));
            z-index: var(--z-modal, 1050);
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }`,

    offlineSupportJS: `
    <script>
    // Offline detection
    window.addEventListener('online', function() {
        const notification = document.getElementById('offline-notification');
        if (notification) notification.style.display = 'none';
    });

    window.addEventListener('offline', function() {
        const notification = document.getElementById('offline-notification');
        if (notification) notification.style.display = 'block';
    });
    </script>`,

    // Smart image loading
    smartImageLoading: `
    <script>
    // Smart Image Loading with intersection observer
    (function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Load image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }

                        // Add loaded class for animation
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });

                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observe all images with loading="lazy"
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    })();
    </script>`,

    // Fade in on scroll
    fadeInOnScroll: `
    <script>
    // Fade in on scroll animation
    (function() {
        if ('IntersectionObserver' in window) {
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-visible');
                    }
                });
            }, {
                threshold: 0.1
            });

            // Add fade-in class and observe sections
            document.querySelectorAll('.section, section').forEach(section => {
                section.classList.add('fade-in');
                fadeObserver.observe(section);
            });
        }
    })();
    </script>`,

    fadeInCSS: `
        /* ========== FADE IN ANIMATION ========== */
        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
            .fade-in {
                opacity: 1;
                transform: none;
            }
        }`,
};

async function optimizeLayoutManually(layoutFile, index, total) {
    const filePath = path.join(layoutsDir, layoutFile);
    let content = fs.readFileSync(filePath, 'utf8');
    const optimizations = [];

    console.log(`\n[${ index + 1}/${total}] 🔧 Optimisation de ${layoutFile}...`);

    // 1. Ajouter Rich Meta Tags
    if (!content.includes('name="language"') && content.includes('<meta name="viewport"')) {
        content = content.replace('<meta name="viewport"', `${manualOptimizations.richMetaTags}\n    <meta name="viewport"`);
        optimizations.push('Rich Meta Tags');
    }

    // 2. Ajouter Critical Preload
    if (!content.includes('rel="preload"') && content.includes('</head>')) {
        content = content.replace('</head>', `${manualOptimizations.criticalPreload}\n</head>`);
        optimizations.push('Critical Preload');
    }

    // 3. Ajouter Micro-optimizations CSS
    if (!content.includes('MICRO-OPTIMIZATIONS') && content.includes('</style>')) {
        content = content.replace('</style>', `${manualOptimizations.microOptimizationsCSS}\n    </style>`);
        optimizations.push('Micro-optimizations CSS');
    }

    // 4. Ajouter Print Styles
    if (!content.includes('PRINT STYLES') && content.includes('</style>')) {
        content = content.replace('</style>', `${manualOptimizations.printStyles}\n    </style>`);
        optimizations.push('Print Styles');
    }

    // 5. Ajouter Enhanced Accessibility
    if (!content.includes('ENHANCED ACCESSIBILITY') && content.includes('</style>')) {
        content = content.replace('</style>', `${manualOptimizations.a11yEnhancements}\n    </style>`);
        optimizations.push('Enhanced Accessibility');
    }

    // 6. Ajouter Fade In CSS
    if (!content.includes('FADE IN ANIMATION') && content.includes('</style>')) {
        content = content.replace('</style>', `${manualOptimizations.fadeInCSS}\n    </style>`);
        optimizations.push('Fade In Animation CSS');
    }

    // 7. Ajouter Loading State CSS
    if (!content.includes('PAGE LOADER') && content.includes('</style>')) {
        content = content.replace('</style>', `${manualOptimizations.loadingStateCSS}\n    </style>`);
        optimizations.push('Loading State CSS');
    }

    // 8. Ajouter Offline Support CSS
    if (!content.includes('OFFLINE NOTIFICATION') && content.includes('</style>')) {
        content = content.replace('</style>', `${manualOptimizations.offlineSupportCSS}\n    </style>`);
        optimizations.push('Offline Support CSS');
    }

    // 9. Ajouter Loading State HTML
    if (!content.includes('page-loader') && content.includes('<body')) {
        content = content.replace(/(<body[^>]*>)/, `$1\n${manualOptimizations.loadingState}\n`);
        optimizations.push('Loading State HTML');
    }

    // 10. Ajouter Offline Notification
    if (!content.includes('offline-notification') && content.includes('</body>')) {
        content = content.replace('</body>', `${manualOptimizations.offlineSupport}\n${manualOptimizations.offlineSupportJS}\n</body>`);
        optimizations.push('Offline Support');
    }

    // 11. Ajouter Enhanced Back to Top
    if (content.includes('scrollToTop') && !content.includes('Enhanced Back to Top')) {
        content = content.replace('</body>', `${manualOptimizations.enhancedBackToTop}\n</body>`);
        optimizations.push('Enhanced Back to Top');
    }

    // 12. Ajouter Smart Image Loading
    if (!content.includes('Smart Image Loading') && content.includes('</body>')) {
        content = content.replace('</body>', `${manualOptimizations.smartImageLoading}\n</body>`);
        optimizations.push('Smart Image Loading');
    }

    // 13. Ajouter Fade In on Scroll
    if (!content.includes('Fade in on scroll') && content.includes('</body>')) {
        content = content.replace('</body>', `${manualOptimizations.fadeInOnScroll}\n</body>`);
        optimizations.push('Fade In on Scroll');
    }

    // 14. Ajouter Loading State JS
    if (content.includes('page-loader') && !content.includes('Page Loader')) {
        content = content.replace('</body>', `${manualOptimizations.loadingStateJS}\n</body>`);
        optimizations.push('Loading State JS');
    }

    // Sauvegarder
    fs.writeFileSync(filePath, content, 'utf8');

    const fileSize = (fs.statSync(filePath).size / 1024).toFixed(1);

    if (optimizations.length > 0) {
        console.log(`   ✅ ${optimizations.length} optimisations appliquées:`);
        optimizations.forEach(opt => console.log(`      • ${opt}`));
        console.log(`   📦 Taille: ${fileSize} KB`);
    } else {
        console.log(`   ⏭️  Déjà optimisé au maximum`);
        console.log(`   📦 Taille: ${fileSize} KB`);
    }

    return optimizations.length;
}

async function manualOptimizeAll() {
    console.log('🎨 OPTIMISATION MANUELLE AVANCÉE - DU DERNIER AU PREMIER\n');
    console.log('Optimisations appliquées:');
    console.log('  🏷️  Rich Meta Tags (SEO)');
    console.log('  ⚡ Critical Resource Preload');
    console.log('  🎯 Micro-optimizations CSS (Rendering)');
    console.log('  🖨️  Print Styles');
    console.log('  ♿ Enhanced Accessibility');
    console.log('  ✨ Fade In Animations');
    console.log('  ⏳ Loading State');
    console.log('  📡 Offline Support');
    console.log('  🖼️  Smart Image Loading');
    console.log('  ⬆️  Enhanced Back to Top\n');
    console.log('='.repeat(100));

    const files = fs.readdirSync(layoutsDir)
        .filter(f => f.endsWith('.html'))
        .sort()
        .reverse(); // Du dernier au premier

    let totalOptimizations = 0;
    const startTime = Date.now();

    for (let i = 0; i < files.length; i++) {
        const optimizations = await optimizeLayoutManually(files[i], i, files.length);
        totalOptimizations += optimizations;

        // Pause entre chaque pour la lisibilité
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(100));
    console.log('\n✅ OPTIMISATION MANUELLE TERMINÉE!\n');
    console.log(`   📊 Layouts traités: ${files.length}/${files.length}`);
    console.log(`   🎯 Total optimisations: ${totalOptimizations}`);
    console.log(`   📈 Moyenne par layout: ${(totalOptimizations / files.length).toFixed(1)}`);
    console.log(`   ⏱️  Durée: ${duration}s`);
    console.log(`   🚀 Vitesse: ${(files.length / duration).toFixed(1)} layouts/s\n`);

    console.log('🎉 Tous les layouts sont maintenant ULTRA-OPTIMISÉS!\n');
    console.log('Nouvelles fonctionnalités:');
    console.log('   ✅ Animations fluides au scroll');
    console.log('   ✅ Loading state élégant');
    console.log('   ✅ Support hors ligne');
    console.log('   ✅ Optimisation print');
    console.log('   ✅ Micro-optimisations rendering');
    console.log('   ✅ Accessibilité renforcée');
    console.log('   ✅ Smart image loading');
    console.log('   ✅ Enhanced back to top avec progress\n');
}

manualOptimizeAll();
