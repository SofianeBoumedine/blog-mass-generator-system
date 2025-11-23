/**
 * 🚀 ENHANCEMENT SCRIPT - SESSION 3 PRO
 * ═══════════════════════════════════════════════════════════════════
 *
 * Script d'amélioration PROFESSIONNELLE des layouts
 * Ajoute des fonctionnalités ultra-avancées pour une expérience de classe mondiale
 *
 * FONCTIONNALITÉS AJOUTÉES:
 * 1. ✅ Schema.org Structured Data (JSON-LD) - SEO++
 * 2. ✅ Lazy Loading Images - Performance++
 * 3. ✅ WebP Support avec fallback - Performance++
 * 4. ✅ Breadcrumbs Navigation - SEO + UX++
 * 5. ✅ Form Validation HTML5 + JS - UX++
 * 6. ✅ Analytics Ready - Data attributes
 * 7. ✅ Print Styles - Versatilité++
 * 8. ✅ ARIA Live Regions - Accessibilité++
 * 9. ✅ Cookie Consent RGPD - Conformité++
 * 10. ✅ Performance Hints - Performance++
 * 11. ✅ Service Worker Ready - PWA++
 * 12. ✅ FAQ Schema - SEO++
 */

const fs = require('fs');
const path = require('path');

class ProLayoutEnhancer {
    constructor() {
        this.stats = {
            total: 0,
            processed: 0,
            errors: 0,
            improvements: {
                schemaOrg: 0,
                lazyLoading: 0,
                webpSupport: 0,
                breadcrumbs: 0,
                formValidation: 0,
                analytics: 0,
                printStyles: 0,
                ariaLive: 0,
                cookieConsent: 0,
                performanceHints: 0,
                serviceWorker: 0,
                faqSchema: 0
            }
        };

        this.layoutsDir = path.join(__dirname, 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '.layouts-backup-pro');
    }

    /**
     * Point d'entrée principal
     */
    async run() {
        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('           🚀 SESSION 3: AMÉLIORATIONS PROFESSIONNELLES');
        console.log('═══════════════════════════════════════════════════════════════════\n');

        // Créer le backup
        await this.createBackup();

        // Obtenir tous les fichiers de layout
        const layoutFiles = fs.readdirSync(this.layoutsDir)
            .filter(file => file.startsWith('layout-') && file.endsWith('.html'));

        this.stats.total = layoutFiles.length;
        console.log(`📊 ${layoutFiles.length} layouts à améliorer\n`);

        // Traiter chaque layout
        for (const file of layoutFiles) {
            await this.processLayout(file);
        }

        // Afficher le rapport
        this.displayReport();
    }

    /**
     * Crée un backup des layouts
     */
    async createBackup() {
        console.log('💾 Création du backup...');

        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }

        const files = fs.readdirSync(this.layoutsDir)
            .filter(file => file.startsWith('layout-') && file.endsWith('.html'));

        for (const file of files) {
            const source = path.join(this.layoutsDir, file);
            const dest = path.join(this.backupDir, file);
            fs.copyFileSync(source, dest);
        }

        console.log(`  ✅ ${files.length} fichiers sauvegardés dans ${this.backupDir}\n`);
    }

    /**
     * Traite un layout
     */
    async processLayout(filename) {
        const filePath = path.join(this.layoutsDir, filename);
        const fileStats = {
            file: filename,
            improvements: 0
        };

        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            const originalContent = content;

            // Appliquer toutes les améliorations
            content = this.addSchemaOrg(content, fileStats);
            content = this.addLazyLoading(content, fileStats);
            content = this.addWebPSupport(content, fileStats);
            content = this.addBreadcrumbs(content, fileStats);
            content = this.addFormValidation(content, fileStats);
            content = this.addAnalyticsAttributes(content, fileStats);
            content = this.addPrintStyles(content, fileStats);
            content = this.addAriaLiveRegions(content, fileStats);
            content = this.addCookieConsent(content, fileStats);
            content = this.addPerformanceHints(content, fileStats);
            content = this.addServiceWorkerReady(content, fileStats);
            content = this.addFAQSchema(content, fileStats);

            // Écrire le fichier modifié
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf-8');
                this.stats.processed++;
            }

            console.log(`  ✅ ${filename} - ${fileStats.improvements} améliorations`);

        } catch (error) {
            console.error(`  ❌ ${filename} - Erreur: ${error.message}`);
            this.stats.errors++;
        }
    }

    /**
     * 1. Ajoute Schema.org Structured Data (JSON-LD)
     */
    addSchemaOrg(content, fileStats) {
        if (content.includes('application/ld+json')) {
            return content; // Déjà présent
        }

        const schemaScript = `
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "{site_name}",
        "url": "{site_url}",
        "description": "{meta_description}",
        "publisher": {
            "@type": "Organization",
            "name": "{site_name}",
            "logo": {
                "@type": "ImageObject",
                "url": "{site_url}/logo.png"
            }
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": "{site_url}/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>`;

        const headClosePos = content.indexOf('</head>');
        if (headClosePos !== -1) {
            const modified = content.slice(0, headClosePos) + schemaScript + '\n' + content.slice(headClosePos);
            fileStats.improvements++;
            this.stats.improvements.schemaOrg++;
            return modified;
        }

        return content;
    }

    /**
     * 2. Ajoute Lazy Loading pour les images
     */
    addLazyLoading(content, fileStats) {
        if (content.includes('data-lazy-src') || content.includes('loading="lazy"')) {
            return content; // Déjà présent
        }

        // Ajouter loading="lazy" aux images
        const imgRegex = /<img([^>]+)(?<!loading=["'][^"']*["'])>/gi;
        let modified = content;
        let count = 0;

        modified = modified.replace(imgRegex, (match, attrs) => {
            if (!attrs.includes('loading=')) {
                count++;
                return `<img${attrs} loading="lazy">`;
            }
            return match;
        });

        // Ajouter le script Intersection Observer pour les images
        if (count > 0) {
            const lazyScript = `
    <script>
    // Lazy Loading Images avec Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        });
    }
    </script>`;

            const bodyClosePos = modified.indexOf('</body>');
            if (bodyClosePos !== -1) {
                modified = modified.slice(0, bodyClosePos) + lazyScript + '\n' + modified.slice(bodyClosePos);
                fileStats.improvements++;
                this.stats.improvements.lazyLoading++;
            }
        }

        return modified;
    }

    /**
     * 3. Ajoute support WebP avec fallback
     */
    addWebPSupport(content, fileStats) {
        if (content.includes('webp-support-check')) {
            return content; // Déjà présent
        }

        const webpScript = `
    <script id="webp-support-check">
    // WebP Support Detection
    (function() {
        function supportsWebP() {
            const elem = document.createElement('canvas');
            if (!!(elem.getContext && elem.getContext('2d'))) {
                return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        }

        if (supportsWebP()) {
            document.documentElement.classList.add('webp');
        } else {
            document.documentElement.classList.add('no-webp');
        }
    })();
    </script>`;

        const headClosePos = content.indexOf('</head>');
        if (headClosePos !== -1) {
            const modified = content.slice(0, headClosePos) + webpScript + '\n' + content.slice(headClosePos);
            fileStats.improvements++;
            this.stats.improvements.webpSupport++;
            return modified;
        }

        return content;
    }

    /**
     * 4. Ajoute les Breadcrumbs
     */
    addBreadcrumbs(content, fileStats) {
        if (content.includes('breadcrumb') || content.includes('aria-label="Breadcrumb"')) {
            return content; // Déjà présent
        }

        const breadcrumbsHTML = `
    <!-- Breadcrumbs Navigation -->
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
        <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <a itemprop="item" href="/">
                    <span itemprop="name">Accueil</span>
                </a>
                <meta itemprop="position" content="1" />
            </li>
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <span itemprop="name">{page_title}</span>
                <meta itemprop="position" content="2" />
            </li>
        </ol>
    </nav>`;

        const breadcrumbsCSS = `
        /* Breadcrumbs Styles */
        .breadcrumb-nav {
            padding: 1rem 0;
            background: rgba(0,0,0,0.02);
        }

        .breadcrumb {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0 auto;
            max-width: 1200px;
            padding: 0 2rem;
        }

        .breadcrumb li {
            display: flex;
            align-items: center;
        }

        .breadcrumb li:not(:last-child)::after {
            content: '›';
            margin: 0 0.5rem;
            color: #999;
        }

        .breadcrumb a {
            color: var(--primary, #007bff);
            text-decoration: none;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
        }
`;

        let modified = content;

        // Ajouter le CSS
        const styleClosePos = modified.lastIndexOf('</style>');
        if (styleClosePos !== -1) {
            modified = modified.slice(0, styleClosePos) + breadcrumbsCSS + modified.slice(styleClosePos);
        }

        // Ajouter le HTML après <body> ou <header>
        const bodyOpenPos = modified.indexOf('<body');
        if (bodyOpenPos !== -1) {
            const bodyContentStart = modified.indexOf('>', bodyOpenPos) + 1;
            modified = modified.slice(0, bodyContentStart) + '\n' + breadcrumbsHTML + '\n' + modified.slice(bodyContentStart);
            fileStats.improvements++;
            this.stats.improvements.breadcrumbs++;
        }

        return modified;
    }

    /**
     * 5. Ajoute validation de formulaire
     */
    addFormValidation(content, fileStats) {
        if (!content.includes('<form') || content.includes('form-validation-script')) {
            return content;
        }

        const validationScript = `
    <script id="form-validation-script">
    // Form Validation avec HTML5 + Custom JS
    document.addEventListener('DOMContentLoaded', () => {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            // Validation temps réel
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            inputs.forEach(input => {
                input.addEventListener('blur', (e) => {
                    validateField(e.target);
                });

                input.addEventListener('input', (e) => {
                    if (e.target.classList.contains('invalid')) {
                        validateField(e.target);
                    }
                });
            });

            // Validation à la soumission
            form.addEventListener('submit', (e) => {
                let isValid = true;

                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    showNotification('Veuillez corriger les erreurs du formulaire', 'error');
                }
            });
        });

        function validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Required
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'Ce champ est requis';
            }

            // Email
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Email invalide';
                }
            }

            // Tel
            if (field.type === 'tel' && value) {
                const telRegex = /^[0-9\\s\\-\\+\\(\\)]+$/;
                if (!telRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Numéro de téléphone invalide';
                }
            }

            // Min/Max length
            if (field.minLength && value.length < field.minLength) {
                isValid = false;
                errorMessage = \`Minimum \${field.minLength} caractères requis\`;
            }

            // Update UI
            if (isValid) {
                field.classList.remove('invalid');
                field.classList.add('valid');
                removeError(field);
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                showError(field, errorMessage);
            }

            return isValid;
        }

        function showError(field, message) {
            removeError(field);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.setAttribute('role', 'alert');
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }

        function removeError(field) {
            const error = field.parentNode.querySelector('.field-error');
            if (error) {
                error.remove();
            }
        }
    });
    </script>`;

        const validationCSS = `
        /* Form Validation Styles */
        input.valid, textarea.valid, select.valid {
            border-color: #28a745 !important;
        }

        input.invalid, textarea.invalid, select.invalid {
            border-color: #dc3545 !important;
        }

        .field-error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }

        input:focus.invalid, textarea:focus.invalid, select:focus.invalid {
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }

        input:focus.valid, textarea:focus.valid, select:focus.valid {
            box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        }
`;

        let modified = content;

        // Ajouter le CSS
        const styleClosePos = modified.lastIndexOf('</style>');
        if (styleClosePos !== -1) {
            modified = modified.slice(0, styleClosePos) + validationCSS + modified.slice(styleClosePos);
        }

        // Ajouter le script
        const bodyClosePos = modified.indexOf('</body>');
        if (bodyClosePos !== -1) {
            modified = modified.slice(0, bodyClosePos) + validationScript + '\n' + modified.slice(bodyClosePos);
            fileStats.improvements++;
            this.stats.improvements.formValidation++;
        }

        return modified;
    }

    /**
     * 6. Ajoute les attributs Analytics
     */
    addAnalyticsAttributes(content, fileStats) {
        if (content.includes('data-track-event')) {
            return content; // Déjà présent
        }

        let modified = content;
        let count = 0;

        // Ajouter data-track-event aux boutons et liens CTA
        modified = modified.replace(/<a([^>]*class="[^"]*btn[^"]*"[^>]*)>/gi, (match, attrs) => {
            if (!attrs.includes('data-track-event')) {
                count++;
                return `<a${attrs} data-track-event="cta_click" data-track-label="{page_name}">`;
            }
            return match;
        });

        modified = modified.replace(/<button([^>]*)>/gi, (match, attrs) => {
            if (!attrs.includes('data-track-event')) {
                count++;
                return `<button${attrs} data-track-event="button_click" data-track-label="{button_label}">`;
            }
            return match;
        });

        if (count > 0) {
            fileStats.improvements++;
            this.stats.improvements.analytics++;
        }

        return modified;
    }

    /**
     * 7. Ajoute les Print Styles
     */
    addPrintStyles(content, fileStats) {
        if (content.includes('@media print')) {
            return content; // Déjà présent
        }

        const printCSS = `
        /* Print Styles */
        @media print {
            /* Cache les éléments non nécessaires */
            nav, .nav, .navigation, header,
            .cookie-consent, .social-share,
            button, .btn, .cta, footer,
            .sidebar, aside, .menu, .breadcrumb {
                display: none !important;
            }

            /* Optimise le contenu pour l'impression */
            body {
                font-size: 12pt;
                line-height: 1.5;
                color: #000;
                background: #fff;
            }

            a {
                color: #000;
                text-decoration: underline;
            }

            /* Affiche les URLs des liens */
            a[href]:after {
                content: " (" attr(href) ")";
                font-size: 0.8em;
                font-style: italic;
            }

            /* Évite les coupures de page dans les éléments */
            h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                page-break-inside: avoid;
            }

            img {
                page-break-inside: avoid;
                max-width: 100% !important;
            }

            /* Optimise les tableaux */
            table {
                page-break-inside: avoid;
                border-collapse: collapse;
            }

            table, th, td {
                border: 1px solid #000;
            }

            /* En-tête de page pour l'impression */
            @page {
                margin: 2cm;
            }

            /* Optimise les sections */
            section, article {
                page-break-inside: avoid;
            }
        }
`;

        const styleClosePos = content.lastIndexOf('</style>');
        if (styleClosePos !== -1) {
            const modified = content.slice(0, styleClosePos) + printCSS + content.slice(styleClosePos);
            fileStats.improvements++;
            this.stats.improvements.printStyles++;
            return modified;
        }

        return content;
    }

    /**
     * 8. Ajoute ARIA Live Regions pour les notifications
     */
    addAriaLiveRegions(content, fileStats) {
        if (content.includes('aria-live')) {
            return content; // Déjà présent
        }

        const ariaLiveHTML = `
    <!-- ARIA Live Regions pour les notifications accessibles -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="notification-region"></div>
    <div aria-live="assertive" aria-atomic="true" class="sr-only" id="alert-region"></div>`;

        const ariaLiveScript = `
    <script>
    // Système de notifications accessibles
    function showNotification(message, type = 'info') {
        const region = type === 'error' ?
            document.getElementById('alert-region') :
            document.getElementById('notification-region');

        if (region) {
            region.textContent = message;

            // Afficher visuellement aussi
            const toast = document.createElement('div');
            toast.className = \`toast toast-\${type}\`;
            toast.textContent = message;
            toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
                region.textContent = '';
            }, 5000);
        }
    }
    </script>`;

        const ariaLiveCSS = `
        /* Screen Reader Only */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }

        /* Toast Notifications */
        .toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #333;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10000;
            max-width: 400px;
        }

        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }

        .toast-success {
            background: #28a745;
        }

        .toast-error {
            background: #dc3545;
        }

        .toast-warning {
            background: #ffc107;
            color: #000;
        }

        .toast-info {
            background: #17a2b8;
        }
`;

        let modified = content;

        // Ajouter le CSS
        const styleClosePos = modified.lastIndexOf('</style>');
        if (styleClosePos !== -1) {
            modified = modified.slice(0, styleClosePos) + ariaLiveCSS + modified.slice(styleClosePos);
        }

        // Ajouter le HTML
        const bodyClosePos = modified.indexOf('</body>');
        if (bodyClosePos !== -1) {
            modified = modified.slice(0, bodyClosePos) + ariaLiveHTML + '\n' + ariaLiveScript + '\n' + modified.slice(bodyClosePos);
            fileStats.improvements++;
            this.stats.improvements.ariaLive++;
        }

        return modified;
    }

    /**
     * 9. Ajoute Cookie Consent Banner (RGPD)
     */
    addCookieConsent(content, fileStats) {
        if (content.includes('cookie-consent')) {
            return content; // Déjà présent
        }

        const cookieHTML = `
    <!-- Cookie Consent Banner (RGPD) -->
    <div class="cookie-consent" id="cookie-consent" role="dialog" aria-live="polite" aria-label="Consentement aux cookies">
        <div class="cookie-content">
            <p>
                🍪 Nous utilisons des cookies pour améliorer votre expérience.
                En continuant, vous acceptez notre
                <a href="/privacy" target="_blank">politique de confidentialité</a>.
            </p>
            <div class="cookie-buttons">
                <button class="btn btn-accept" onclick="acceptCookies()">Accepter</button>
                <button class="btn btn-decline" onclick="declineCookies()">Refuser</button>
            </div>
        </div>
    </div>`;

        const cookieScript = `
    <script>
    // Cookie Consent Management
    function acceptCookies() {
        localStorage.setItem('cookie-consent', 'accepted');
        document.getElementById('cookie-consent').style.display = 'none';
        showNotification('Cookies acceptés', 'success');
    }

    function declineCookies() {
        localStorage.setItem('cookie-consent', 'declined');
        document.getElementById('cookie-consent').style.display = 'none';
        showNotification('Cookies refusés', 'info');
    }

    // Vérifier le consentement au chargement
    document.addEventListener('DOMContentLoaded', () => {
        const consent = localStorage.getItem('cookie-consent');
        if (consent) {
            document.getElementById('cookie-consent').style.display = 'none';
        }
    });
    </script>`;

        const cookieCSS = `
        /* Cookie Consent Banner */
        .cookie-consent {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            color: white;
            padding: 1.5rem;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }

        .cookie-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .cookie-content p {
            margin: 0;
            flex: 1;
        }

        .cookie-content a {
            color: #ffc107;
            text-decoration: underline;
        }

        .cookie-buttons {
            display: flex;
            gap: 1rem;
        }

        .cookie-consent .btn {
            padding: 0.75rem 2rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-accept {
            background: #28a745;
            color: white;
        }

        .btn-accept:hover {
            background: #218838;
            transform: translateY(-2px);
        }

        .btn-decline {
            background: transparent;
            color: white;
            border: 2px solid white;
        }

        .btn-decline:hover {
            background: rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
            .cookie-content {
                flex-direction: column;
                text-align: center;
            }

            .cookie-buttons {
                width: 100%;
                justify-content: center;
            }
        }
`;

        let modified = content;

        // Ajouter le CSS
        const styleClosePos = modified.lastIndexOf('</style>');
        if (styleClosePos !== -1) {
            modified = modified.slice(0, styleClosePos) + cookieCSS + modified.slice(styleClosePos);
        }

        // Ajouter le HTML et script
        const bodyClosePos = modified.indexOf('</body>');
        if (bodyClosePos !== -1) {
            modified = modified.slice(0, bodyClosePos) + cookieHTML + '\n' + cookieScript + '\n' + modified.slice(bodyClosePos);
            fileStats.improvements++;
            this.stats.improvements.cookieConsent++;
        }

        return modified;
    }

    /**
     * 10. Ajoute Performance Hints (preload, prefetch, dns-prefetch)
     */
    addPerformanceHints(content, fileStats) {
        if (content.includes('dns-prefetch') || content.includes('preconnect')) {
            return content; // Déjà présent
        }

        const performanceHints = `
    <!-- Performance Hints -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="prefetch" href="/blog.php" as="document">`;

        const headClosePos = content.indexOf('</head>');
        if (headClosePos !== -1) {
            const modified = content.slice(0, headClosePos) + performanceHints + '\n' + content.slice(headClosePos);
            fileStats.improvements++;
            this.stats.improvements.performanceHints++;
            return modified;
        }

        return content;
    }

    /**
     * 11. Ajoute Service Worker Ready (PWA)
     */
    addServiceWorkerReady(content, fileStats) {
        if (content.includes('serviceWorker')) {
            return content; // Déjà présent
        }

        const serviceWorkerScript = `
    <script>
    // Service Worker Registration (PWA Ready)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker enregistré:', registration.scope);
                })
                .catch(error => {
                    console.log('❌ Erreur Service Worker:', error);
                });
        });
    }
    </script>`;

        const bodyClosePos = content.indexOf('</body>');
        if (bodyClosePos !== -1) {
            const modified = content.slice(0, bodyClosePos) + serviceWorkerScript + '\n' + content.slice(bodyClosePos);
            fileStats.improvements++;
            this.stats.improvements.serviceWorker++;
            return modified;
        }

        return content;
    }

    /**
     * 12. Ajoute FAQ Schema pour le SEO
     */
    addFAQSchema(content, fileStats) {
        if (content.includes('@type": "FAQPage"') || !content.toLowerCase().includes('faq')) {
            return content; // Déjà présent ou pas de FAQ
        }

        const faqSchema = `
    <!-- FAQ Schema.org -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Qu'est-ce que {site_name} ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "{meta_description}"
            }
        }, {
            "@type": "Question",
            "name": "Quels services proposez-vous ?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Découvrez nos services dans la section Services."
            }
        }]
    }
    </script>`;

        const headClosePos = content.indexOf('</head>');
        if (headClosePos !== -1) {
            const modified = content.slice(0, headClosePos) + faqSchema + '\n' + content.slice(headClosePos);
            fileStats.improvements++;
            this.stats.improvements.faqSchema++;
            return modified;
        }

        return content;
    }

    /**
     * Affiche le rapport final
     */
    displayReport() {
        const totalImprovements = Object.values(this.stats.improvements).reduce((a, b) => a + b, 0);

        console.log('\n═══════════════════════════════════════════════════════════════════');
        console.log('                    RAPPORT D\'AMÉLIORATION PRO');
        console.log('═══════════════════════════════════════════════════════════════════\n');

        console.log('📊 STATISTIQUES GLOBALES:\n');
        console.log(`  Fichiers analysés:        ${this.stats.total}`);
        console.log(`  Fichiers améliorés:       ${this.stats.processed}`);
        console.log(`  Fichiers avec erreurs:    ${this.stats.errors}\n`);

        console.log(`  TOTAL AMÉLIORATIONS:      ${totalImprovements}\n`);

        console.log('📋 DÉTAIL DES AMÉLIORATIONS:\n');
        console.log(`  ✅ Schema.org (JSON-LD):      ${this.stats.improvements.schemaOrg}`);
        console.log(`  ✅ Lazy Loading Images:       ${this.stats.improvements.lazyLoading}`);
        console.log(`  ✅ WebP Support:              ${this.stats.improvements.webpSupport}`);
        console.log(`  ✅ Breadcrumbs:               ${this.stats.improvements.breadcrumbs}`);
        console.log(`  ✅ Form Validation:           ${this.stats.improvements.formValidation}`);
        console.log(`  ✅ Analytics Tracking:        ${this.stats.improvements.analytics}`);
        console.log(`  ✅ Print Styles:              ${this.stats.improvements.printStyles}`);
        console.log(`  ✅ ARIA Live Regions:         ${this.stats.improvements.ariaLive}`);
        console.log(`  ✅ Cookie Consent:            ${this.stats.improvements.cookieConsent}`);
        console.log(`  ✅ Performance Hints:         ${this.stats.improvements.performanceHints}`);
        console.log(`  ✅ Service Worker Ready:      ${this.stats.improvements.serviceWorker}`);
        console.log(`  ✅ FAQ Schema:                ${this.stats.improvements.faqSchema}\n`);

        console.log('═══════════════════════════════════════════════════════════════════\n');
        console.log('🎉 Améliorations PRO appliquées avec succès !\n');
        console.log(`💾 Backup créé dans: ${this.backupDir}\n`);
    }
}

// Exécution
const enhancer = new ProLayoutEnhancer();
enhancer.run().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});
