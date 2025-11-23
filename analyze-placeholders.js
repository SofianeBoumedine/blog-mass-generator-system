#!/usr/bin/env node
/**
 * Script pour analyser tous les placeholders dans chaque layout
 */

const fs = require('fs');
const path = require('path');

// Liste de tous les placeholders gérés dans siteBuilder.js
const HANDLED_PLACEHOLDERS = [
    // Framework & couleurs
    'framework_css', 'framework_js', 'color_primary', 'color_secondary',
    'color_accent', 'color_text', 'color_background',

    // Meta & branding
    'meta_title', 'meta_description', 'meta_keywords',
    'brand_name', 'tagline', 'brand_initial',

    // Hero & CTA
    'hero_title', 'hero_subtitle', 'hero_badge_text', 'hero_description',
    'cta_title', 'cta_text', 'cta_button', 'cta_primary', 'cta_secondary',
    'cta_subtitle', 'cta_description', 'cta_contact', 'cta_benefits_text',

    // Features & Benefits
    'features_title', 'features_subtitle', 'features_content',
    'benefits_title', 'benefits_subtitle', 'benefits_content', 'benefits_cta_text',
    'feature_1_title', 'feature_2_title', 'feature_3_title',
    'feature_4_title', 'feature_5_title', 'feature_6_title',
    'feature_link_text',

    // Sections
    'section1_content', 'section2_content', 'section3_content',
    'section_badge_text', 'about_title', 'about_content', 'about_subtitle',

    // Navigation
    'navigation_menu', 'sidebar_navigation',
    'nav_item_1', 'nav_item_2', 'nav_item_3', 'nav_item_4', 'nav_item_5',
    'nav_url_1', 'nav_url_2', 'nav_url_3', 'nav_url_4', 'nav_url_5',
    'nav_cta_text', 'nav_toggle_open_label', 'nav_toggle_close_label',

    // Footer
    'footer_content', 'footer_text', 'footer_cute_prefix',
    'footer_section_1_title', 'footer_section_2_title', 'footer_section_3_title',
    'footer_link_1_text', 'footer_link_1_url', 'footer_link_2_text', 'footer_link_2_url',
    'footer_link_3_text', 'footer_link_3_url', 'footer_link_4_text', 'footer_link_4_url',
    'footer_link_5_text', 'footer_link_5_url', 'footer_link_6_text', 'footer_link_6_url',
    'footer_link_7_text', 'footer_link_7_url', 'footer_link_8_text', 'footer_link_8_url',
    'footer_link_9_text', 'footer_link_9_url', 'footer_link_10_text', 'footer_link_10_url',
    'footer_link_11_text', 'footer_link_11_url', 'footer_link_12_text', 'footer_link_12_url',

    // Testimonials
    'testimonials_badge', 'testimonials_title', 'testimonials_subtitle',
    'testimonial_1_text', 'testimonial_1_author', 'testimonial_1_position',
    'testimonial_2_text', 'testimonial_2_author', 'testimonial_2_position',
    'testimonial_3_text', 'testimonial_3_author', 'testimonial_3_position',

    // Stats
    'stat_1_number', 'stat_1_label', 'stat_2_number', 'stat_2_label',
    'stat_3_number', 'stat_3_label', 'stat_4_number', 'stat_label_support',

    // Contact
    'contact_email', 'contact_phone', 'contact_address',
    'contact_email_icon', 'contact_phone_icon', 'contact_address_icon',
    'phone_cta_text', 'phone_number',

    // Legal
    'copyright_year', 'copyright_text', 'privacy_text', 'privacy_url',
    'terms_text', 'terms_url', 'cookies_text', 'cookies_url',

    // Trust indicators
    'trust_indicator_1', 'trust_indicator_2', 'trust_indicator_3',
    'trust_company_1', 'trust_company_2', 'trust_company_3', 'trust_company_4',
    'trust_text',

    // Newsletter
    'newsletter_text', 'newsletter_placeholder', 'newsletter_button',

    // Autres
    'quality_content', 'excellence_content', 'skip_link_text',
    'masonry_content', 'price',

    // Variables d'animation (nettoyées automatiquement)
    'randomRotation', 'scrollPercent', 'x', 'y', 'yPos', 'firstChar',

    // Classes framework
    'container_class', 'navbar_class'
];

// Placeholders ajoutés dynamiquement par DynamicContentAdapter
const DYNAMIC_PLACEHOLDERS = [
    // Navigation dynamique (selon le thème)
    'nav_services', 'nav_about', 'nav_team', 'nav_blog', 'nav_contact',
    'nav_features', 'nav_testimonials', 'nav_pricing', 'nav_portfolio',

    // Section titles dynamiques
    'section_services_title', 'section_about_title', 'section_team_title',
    'section_blog_title', 'section_contact_title', 'section_features_title',
    'section_testimonials_title', 'section_pricing_title',

    // Descripteurs thématiques (varie selon le thème)
    'descriptor_adorable', 'descriptor_mignon', 'descriptor_doux',
    'descriptor_affectueux', 'descriptor_ludique', 'descriptor_expert',
    'descriptor_professional', 'descriptor_innovative',

    // Formulaires
    'form_email_placeholder', 'form_name_placeholder', 'form_message_placeholder'
];

const ALL_HANDLED = [...HANDLED_PLACEHOLDERS, ...DYNAMIC_PLACEHOLDERS];

function extractPlaceholders(html) {
    const regex = /{([a-zA-Z_][a-zA-Z0-9_]*)}/g;
    const placeholders = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
        placeholders.push(match[1]);
    }

    return [...new Set(placeholders)];
}

function analyzeLayout(layoutPath) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    const placeholders = extractPlaceholders(content);
    const layoutName = path.basename(layoutPath);

    const unhandled = placeholders.filter(p => !ALL_HANDLED.includes(p));

    return {
        layout: layoutName,
        totalPlaceholders: placeholders.length,
        placeholders: placeholders,
        unhandled: unhandled,
        hasIssues: unhandled.length > 0
    };
}

function main() {
    const layoutsDir = path.join(__dirname, 'templates', 'layouts');
    const layoutFiles = fs.readdirSync(layoutsDir).filter(f => f.endsWith('.html'));

    console.log('🔍 Analyse de tous les layouts...\n');
    console.log(`📁 ${layoutFiles.length} layouts trouvés\n`);

    const results = layoutFiles.map(file => {
        const layoutPath = path.join(layoutsDir, file);
        return analyzeLayout(layoutPath);
    });

    // Rapport par layout
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 RAPPORT PAR LAYOUT');
    console.log('═══════════════════════════════════════════════════════════════\n');

    results.forEach(result => {
        if (result.hasIssues) {
            console.log(`❌ ${result.layout}`);
            console.log(`   Placeholders total: ${result.totalPlaceholders}`);
            console.log(`   ⚠️  Non gérés (${result.unhandled.length}):`);
            result.unhandled.forEach(p => console.log(`      - {${p}}`));
            console.log('');
        } else {
            console.log(`✅ ${result.layout} - ${result.totalPlaceholders} placeholders (tous gérés)`);
        }
    });

    // Statistiques globales
    const totalIssues = results.filter(r => r.hasIssues).length;
    const allUnhandled = [...new Set(results.flatMap(r => r.unhandled))];

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📈 STATISTIQUES GLOBALES');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log(`Layouts analysés: ${results.length}`);
    console.log(`Layouts OK: ${results.length - totalIssues}`);
    console.log(`Layouts avec problèmes: ${totalIssues}`);
    console.log(`Placeholders uniques non gérés: ${allUnhandled.length}`);

    if (allUnhandled.length > 0) {
        console.log('\n⚠️  PLACEHOLDERS NON GÉRÉS (globalement):');
        allUnhandled.forEach(p => console.log(`   - {${p}}`));
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');

    if (totalIssues === 0) {
        console.log('✅ SUCCÈS: Tous les placeholders sont gérés !');
    } else {
        console.log(`⚠️  ACTION REQUISE: ${totalIssues} layout(s) ont des placeholders non gérés`);
        process.exit(1);
    }
}

main();
