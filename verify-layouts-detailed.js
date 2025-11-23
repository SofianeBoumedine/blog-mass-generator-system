#!/usr/bin/env node
/**
 * Vérification EXHAUSTIVE de chaque layout individuellement
 */

const fs = require('fs');
const path = require('path');

// Tous les placeholders gérés
const HANDLED = {
    // Framework & Couleurs
    framework: ['framework_css', 'framework_js', 'container_class', 'navbar_class'],
    colors: ['color_primary', 'color_secondary', 'color_accent', 'color_text', 'color_background'],

    // Meta & Branding
    meta: ['meta_title', 'meta_description', 'meta_keywords'],
    branding: ['brand_name', 'tagline', 'brand_initial'],

    // Hero & CTA
    hero: ['hero_title', 'hero_subtitle', 'hero_badge_text', 'hero_description'],
    cta: ['cta_title', 'cta_text', 'cta_button', 'cta_primary', 'cta_secondary',
          'cta_subtitle', 'cta_description', 'cta_contact', 'cta_benefits_text'],

    // Features & Benefits
    features: ['features_title', 'features_subtitle', 'features_content',
               'feature_1_title', 'feature_2_title', 'feature_3_title',
               'feature_4_title', 'feature_5_title', 'feature_6_title', 'feature_link_text'],
    benefits: ['benefits_title', 'benefits_subtitle', 'benefits_content', 'benefits_cta_text'],

    // Sections & Content
    sections: ['section1_content', 'section2_content', 'section3_content',
               'section_badge_text', 'about_title', 'about_content', 'about_subtitle',
               'quality_content', 'excellence_content'],

    // Navigation
    navigation: ['navigation_menu', 'sidebar_navigation',
                 'nav_item_1', 'nav_item_2', 'nav_item_3', 'nav_item_4', 'nav_item_5',
                 'nav_url_1', 'nav_url_2', 'nav_url_3', 'nav_url_4', 'nav_url_5',
                 'nav_cta_text', 'nav_toggle_open_label', 'nav_toggle_close_label',
                 'skip_link_text'],

    // Footer
    footer: ['footer_content', 'footer_text', 'footer_cute_prefix',
             'footer_section_1_title', 'footer_section_2_title', 'footer_section_3_title',
             'footer_link_1_text', 'footer_link_1_url', 'footer_link_2_text', 'footer_link_2_url',
             'footer_link_3_text', 'footer_link_3_url', 'footer_link_4_text', 'footer_link_4_url',
             'footer_link_5_text', 'footer_link_5_url', 'footer_link_6_text', 'footer_link_6_url',
             'footer_link_7_text', 'footer_link_7_url', 'footer_link_8_text', 'footer_link_8_url',
             'footer_link_9_text', 'footer_link_9_url', 'footer_link_10_text', 'footer_link_10_url',
             'footer_link_11_text', 'footer_link_11_url', 'footer_link_12_text', 'footer_link_12_url'],

    // Testimonials
    testimonials: ['testimonials_badge', 'testimonials_title', 'testimonials_subtitle',
                   'testimonial_1_text', 'testimonial_1_author', 'testimonial_1_position',
                   'testimonial_2_text', 'testimonial_2_author', 'testimonial_2_position',
                   'testimonial_3_text', 'testimonial_3_author', 'testimonial_3_position'],

    // Stats
    stats: ['stat_1_number', 'stat_1_label', 'stat_2_number', 'stat_2_label',
            'stat_3_number', 'stat_3_label', 'stat_4_number', 'stat_label_support'],

    // Contact
    contact: ['contact_email', 'contact_phone', 'contact_address',
              'contact_email_icon', 'contact_phone_icon', 'contact_address_icon',
              'phone_cta_text', 'phone_number'],

    // Legal
    legal: ['copyright_year', 'copyright_text', 'privacy_text', 'privacy_url',
            'terms_text', 'terms_url', 'cookies_text', 'cookies_url'],

    // Trust & Social
    trust: ['trust_indicator_1', 'trust_indicator_2', 'trust_indicator_3',
            'trust_company_1', 'trust_company_2', 'trust_company_3', 'trust_company_4',
            'trust_text'],

    // Newsletter
    newsletter: ['newsletter_text', 'newsletter_placeholder', 'newsletter_button'],

    // Autres
    misc: ['masonry_content', 'price', 'randomRotation', 'scrollPercent',
           'x', 'y', 'yPos', 'firstChar'],

    // Variables dynamiques (DynamicContentAdapter)
    dynamic_nav: ['nav_services', 'nav_about', 'nav_team', 'nav_blog', 'nav_contact',
                  'nav_features', 'nav_testimonials', 'nav_pricing', 'nav_portfolio'],
    dynamic_sections: ['section_services_title', 'section_about_title', 'section_team_title',
                       'section_blog_title', 'section_contact_title', 'section_features_title',
                       'section_testimonials_title', 'section_pricing_title'],
    dynamic_descriptors: ['descriptor_adorable', 'descriptor_mignon', 'descriptor_doux',
                          'descriptor_affectueux', 'descriptor_ludique',
                          'descriptor_expert', 'descriptor_professional', 'descriptor_innovative'],
    dynamic_forms: ['form_email_placeholder', 'form_name_placeholder', 'form_message_placeholder']
};

// Créer une liste plate de tous les placeholders gérés
const ALL_HANDLED = Object.values(HANDLED).flat();

function extractPlaceholders(html) {
    const regex = /{([a-zA-Z_][a-zA-Z0-9_]*)}/g;
    const placeholders = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        placeholders.push(match[1]);
    }
    return [...new Set(placeholders)];
}

function categorizeplaceholder(placeholder) {
    for (const [category, list] of Object.entries(HANDLED)) {
        if (list.includes(placeholder)) {
            return category;
        }
    }
    return null;
}

function analyzeLayoutDetailed(layoutPath) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    const placeholders = extractPlaceholders(content);
    const layoutName = path.basename(layoutPath);

    const categorized = {};
    const unhandled = [];

    placeholders.forEach(p => {
        const category = categorizeplaceholder(p);
        if (category) {
            if (!categorized[category]) categorized[category] = [];
            categorized[category].push(p);
        } else {
            unhandled.push(p);
        }
    });

    return {
        layout: layoutName,
        totalPlaceholders: placeholders.length,
        categorized: categorized,
        unhandled: unhandled,
        hasIssues: unhandled.length > 0
    };
}

function main() {
    const layoutsDir = path.join(__dirname, 'templates', 'layouts');
    const layoutFiles = fs.readdirSync(layoutsDir)
        .filter(f => f.endsWith('.html'))
        .sort();

    console.log('🔍 VÉRIFICATION DÉTAILLÉE DE CHAQUE LAYOUT\n');
    console.log(`📁 ${layoutFiles.length} layouts à vérifier\n`);
    console.log('═'.repeat(80) + '\n');

    let totalIssues = 0;
    const allUnhandled = new Set();

    layoutFiles.forEach((file, index) => {
        const layoutPath = path.join(layoutsDir, file);
        const result = analyzeLayoutDetailed(layoutPath);

        console.log(`[${index + 1}/${layoutFiles.length}] ${result.layout}`);
        console.log('─'.repeat(80));
        console.log(`📊 Total placeholders: ${result.totalPlaceholders}`);

        if (result.hasIssues) {
            console.log(`❌ PROBLÈME: ${result.unhandled.length} placeholders non gérés`);
            result.unhandled.forEach(p => {
                console.log(`   ⚠️  {${p}}`);
                allUnhandled.add(p);
            });
            totalIssues++;
        } else {
            console.log(`✅ OK: Tous les placeholders sont gérés`);
        }

        // Afficher les catégories utilisées
        const categories = Object.keys(result.categorized).sort();
        if (categories.length > 0) {
            console.log(`📦 Catégories utilisées: ${categories.join(', ')}`);

            // Détails par catégorie
            categories.forEach(cat => {
                const count = result.categorized[cat].length;
                console.log(`   • ${cat}: ${count} placeholder(s)`);
            });
        }

        console.log('');
    });

    console.log('═'.repeat(80));
    console.log('📈 RÉSUMÉ FINAL\n');
    console.log(`Layouts analysés: ${layoutFiles.length}`);
    console.log(`Layouts OK: ${layoutFiles.length - totalIssues}`);
    console.log(`Layouts avec problèmes: ${totalIssues}`);

    if (allUnhandled.size > 0) {
        console.log(`\n⚠️  PLACEHOLDERS NON GÉRÉS (total unique: ${allUnhandled.size}):`);
        Array.from(allUnhandled).sort().forEach(p => {
            console.log(`   - {${p}}`);
        });
        console.log('\n❌ ACTION REQUISE: Ajouter ces placeholders au système de gestion');
        process.exit(1);
    } else {
        console.log('\n✅ PARFAIT: Tous les placeholders de tous les layouts sont gérés !');
        console.log(`✅ ${ALL_HANDLED.length} placeholders uniques reconnus dans le système`);
    }
}

main();
