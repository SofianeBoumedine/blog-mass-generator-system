/**
 * Script pour ajouter les sections one-page à tous les layouts
 */
const fs = require('fs');
const path = require('path');

const layoutsDir = path.join(__dirname, 'templates/layouts');

// Template des sections one-page à ajouter
const onepageSections = `
    <!-- ========== SECTION SERVICES ========== -->
    <section id="services" class="section services-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{services_title}</h2>
                {services_subtitle}
            </div>
            <div class="services-content">
                {services_content}
            </div>
        </div>
    </section>

    <!-- ========== SECTION ABOUT ========== -->
    <section id="about" class="section about-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{about_title}</h2>
                {about_subtitle}
            </div>
            <div class="about-content">
                {about_content}
            </div>
        </div>
    </section>

    <!-- ========== SECTION PRICING ========== -->
    <section id="pricing" class="section pricing-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{pricing_title}</h2>
                {pricing_subtitle}
            </div>
            <div class="pricing-content">
                {pricing_content}
            </div>
        </div>
    </section>

    <!-- ========== SECTION TESTIMONIALS ========== -->
    <section id="testimonials" class="section testimonials-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{testimonials_title}</h2>
                {testimonials_subtitle}
            </div>
            <div class="testimonials-content">
                {testimonials_content}
            </div>
        </div>
    </section>

    <!-- ========== SECTION CONTACT ========== -->
    <section id="contact" class="section contact-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{contact_title}</h2>
                {contact_subtitle}
            </div>
            <div class="contact-content">
                {contact_content}
            </div>
        </div>
    </section>
`;

// CSS de base pour les sections
const sectionCSS = `
        /* ========== ONE-PAGE SECTIONS ========== */
        .section {
            padding: 80px 0;
            min-height: 400px;
        }

        .section:nth-child(even) {
            background: rgba(0,0,0,0.02);
        }

        .section-header {
            text-align: center;
            margin-bottom: 60px;
        }

        .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--text, #333);
        }

        .services-content,
        .about-content,
        .pricing-content,
        .testimonials-content,
        .contact-content {
            max-width: 1200px;
            margin: 0 auto;
        }

        .services-grid,
        .pricing-grid,
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .service-item,
        .pricing-card,
        .testimonial {
            background: var(--card-bg, white);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .service-item:hover,
        .pricing-card:hover,
        .testimonial:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .contact-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;
        }

        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 1rem;
            border: 2px solid var(--primary, #007bff);
            border-radius: 8px;
            font-family: inherit;
        }

        .contact-form button {
            background: var(--primary, #007bff);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
        }

        .contact-form button:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        @media (max-width: 768px) {
            .section {
                padding: 40px 0;
            }

            .section-title {
                font-size: 2rem;
            }

            .contact-content {
                grid-template-columns: 1fr;
            }

            .services-grid,
            .pricing-grid,
            .testimonials-grid {
                grid-template-columns: 1fr;
            }
        }
`;

async function addOnepageSectionsToLayout(layoutFile) {
    const filePath = path.join(layoutsDir, layoutFile);
    let content = fs.readFileSync(filePath, 'utf8');

    // Vérifier si les sections existent déjà
    if (content.includes('<!-- ========== SECTION SERVICES ==========')) {
        console.log(`  ⏭️  ${layoutFile} - sections déjà présentes`);
        return false;
    }

    // Ajouter le CSS dans le <style>
    if (content.includes('</style>')) {
        content = content.replace('</style>', `${sectionCSS}\n    </style>`);
    }

    // Trouver où insérer les sections (avant le footer ou avant </body>)
    let insertPoint = content.indexOf('<footer');

    if (insertPoint === -1) {
        insertPoint = content.indexOf('</body>');
    }

    if (insertPoint === -1) {
        console.log(`  ⚠️  ${layoutFile} - point d'insertion non trouvé`);
        return false;
    }

    // Insérer les sections
    content = content.slice(0, insertPoint) + onepageSections + '\n' + content.slice(insertPoint);

    // Sauvegarder
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${layoutFile} - sections ajoutées`);
    return true;
}

async function processAllLayouts() {
    console.log('🔧 Ajout des sections one-page à tous les layouts...\n');

    const files = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));
    let count = 0;

    for (const file of files) {
        try {
            if (await addOnepageSectionsToLayout(file)) {
                count++;
            }
        } catch (error) {
            console.log(`  ❌ ${file} - erreur:`, error.message);
        }
    }

    console.log(`\n✅ Terminé! ${count}/${files.length} layouts modifiés`);
}

processAllLayouts();
