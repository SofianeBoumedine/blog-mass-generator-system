const fs = require('fs').promises;
const path = require('path');

// Amélioration de la navigation pour tous les layouts
const improvedNavStyles = `
    /* Navigation améliorée */
    .nav-container {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .nav-wrapper {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav-brand {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary, #333);
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .nav-brand:hover {
        color: var(--accent, #667eea);
    }

    .nav-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 2rem; /* Espacement entre les éléments */
        align-items: center;
    }

    .nav-item {
        margin: 0;
    }

    .nav-link {
        color: #555;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        transition: all 0.3s ease;
        display: inline-block;
    }

    .nav-link:hover {
        background: rgba(102, 126, 234, 0.1);
        color: var(--primary, #667eea);
        transform: translateY(-2px);
    }

    .nav-cta {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white !important;
        padding: 0.75rem 1.5rem !important;
        border-radius: 25px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .nav-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    /* Mobile menu */
    .nav-toggle {
        display: none;
        flex-direction: column;
        cursor: pointer;
    }

    .nav-toggle span {
        width: 25px;
        height: 3px;
        background: #333;
        margin: 3px 0;
        transition: 0.3s;
        border-radius: 3px;
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background: white;
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 2rem 0;
            gap: 1rem;
        }

        .nav-menu.active {
            left: 0;
        }

        .nav-toggle {
            display: flex;
        }
    }

    /* Ajout d'espace après la nav fixe */
    body {
        padding-top: 70px;
    }
`;

const improvedNavHTML = `
    <!-- Navigation améliorée -->
    <nav class="nav-container">
        <div class="nav-wrapper">
            <a href="/" class="nav-brand">{brand_name}</a>
            <div class="nav-toggle" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
                <li class="nav-item"><a href="/services" class="nav-link">Services</a></li>
                <li class="nav-item"><a href="/solutions" class="nav-link">Solutions</a></li>
                <li class="nav-item"><a href="/blog" class="nav-link">Blog</a></li>
                <li class="nav-item"><a href="/about" class="nav-link">À propos</a></li>
                <li class="nav-item"><a href="#contact" class="nav-link nav-cta">Contact</a></li>
            </ul>
        </div>
    </nav>

    <script>
        function toggleMenu() {
            const menu = document.querySelector('.nav-menu');
            menu.classList.toggle('active');
        }
    </script>
`;

// Amélioration du footer
const improvedFooterHTML = `
    <!-- Footer amélioré -->
    <footer class="footer-enhanced">
        <div class="footer-container">
            <div class="footer-grid">
                <!-- Section Entreprise -->
                <div class="footer-section">
                    <h3 class="footer-title">{brand_name}</h3>
                    <p class="footer-description">{footer_text}</p>
                    <div class="footer-social">
                        <a href="#" class="social-link" aria-label="Facebook">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="LinkedIn">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- Section Services -->
                <div class="footer-section">
                    <h4 class="footer-subtitle">Services</h4>
                    <ul class="footer-links">
                        <li><a href="/seo">SEO & Référencement</a></li>
                        <li><a href="/content">Création de contenu</a></li>
                        <li><a href="/audit">Audit SEO</a></li>
                        <li><a href="/consulting">Consulting</a></li>
                    </ul>
                </div>

                <!-- Section Ressources -->
                <div class="footer-section">
                    <h4 class="footer-subtitle">Ressources</h4>
                    <ul class="footer-links">
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/guides">Guides pratiques</a></li>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/support">Support</a></li>
                    </ul>
                </div>

                <!-- Section Contact -->
                <div class="footer-section">
                    <h4 class="footer-subtitle">Contact</h4>
                    <ul class="footer-contact">
                        <li>📧 contact@{brand_name}.fr</li>
                        <li>📞 +33 1 23 45 67 89</li>
                        <li>📍 Paris, France</li>
                    </ul>
                    <div class="footer-newsletter">
                        <p>Inscrivez-vous à notre newsletter</p>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Votre email" class="newsletter-input">
                            <button type="submit" class="newsletter-btn">S'inscrire</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2024 {brand_name}. Tous droits réservés.</p>
                <div class="footer-legal">
                    <a href="/privacy">Confidentialité</a>
                    <span>|</span>
                    <a href="/terms">Conditions</a>
                    <span>|</span>
                    <a href="/cookies">Cookies</a>
                </div>
            </div>
        </div>
    </footer>

    <style>
        /* Footer amélioré */
        .footer-enhanced {
            background: linear-gradient(135deg, #1a1a2e, #0f0f1e);
            color: #ffffff;
            padding: 4rem 0 2rem;
            margin-top: 4rem;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-title {
            color: #ffffff;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-weight: bold;
        }

        .footer-subtitle {
            color: #ffffff;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .footer-description {
            color: #b0b0b0;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }

        .footer-social {
            display: flex;
            gap: 1rem;
        }

        .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            color: #ffffff;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: var(--primary, #667eea);
            transform: translateY(-3px);
        }

        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-links li {
            margin-bottom: 0.75rem;
        }

        .footer-links a {
            color: #b0b0b0;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .footer-links a:hover {
            color: var(--primary, #667eea);
            transform: translateX(5px);
        }

        .footer-contact {
            list-style: none;
            padding: 0;
            margin: 0 0 1.5rem 0;
            color: #b0b0b0;
        }

        .footer-contact li {
            margin-bottom: 0.75rem;
        }

        .footer-newsletter {
            margin-top: 1.5rem;
        }

        .footer-newsletter p {
            color: #ffffff;
            margin-bottom: 1rem;
            font-weight: 500;
        }

        .newsletter-form {
            display: flex;
            gap: 0.5rem;
        }

        .newsletter-input {
            flex: 1;
            padding: 0.75rem;
            border: none;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            outline: none;
        }

        .newsletter-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-btn {
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .newsletter-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            flex-wrap: wrap;
            gap: 1rem;
        }

        .footer-legal {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .footer-legal a {
            color: #b0b0b0;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-legal a:hover {
            color: var(--primary, #667eea);
        }

        .footer-legal span {
            color: #666;
        }

        @media (max-width: 768px) {
            .footer-grid {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            .footer-bottom {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
`;

async function improveLayoutsNavFooter() {
    const layoutsDir = path.join(__dirname, 'templates/layouts');
    const layouts = await fs.readdir(layoutsDir);

    console.log('🔧 Amélioration de la navigation et des footers...');

    for (const layout of layouts) {
        if (!layout.endsWith('.html')) continue;

        const filePath = path.join(layoutsDir, layout);
        let content = await fs.readFile(filePath, 'utf-8');

        // Ajouter les styles de navigation améliorés si pas déjà présents
        if (!content.includes('nav-container')) {
            // Ajouter les styles de nav dans le <style> existant
            content = content.replace('</style>', `${improvedNavStyles}\n</style>`);

            // Ajouter la navigation HTML après <body>
            content = content.replace('<body>', `<body>\n${improvedNavHTML}`);
        }

        // Remplacer le footer existant par le footer amélioré
        // Chercher et remplacer le footer existant
        content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, improvedFooterHTML);

        // Si pas de footer, l'ajouter avant </body>
        if (!content.includes('<footer')) {
            content = content.replace('</body>', `${improvedFooterHTML}\n</body>`);
        }

        await fs.writeFile(filePath, content);
        console.log(`✅ ${layout} amélioré`);
    }

    console.log('\n✨ Tous les layouts ont été améliorés !');
}

// Exécuter l'amélioration
improveLayoutsNavFooter().catch(console.error);