/**
 * Script de nettoyage des layouts
 * Supprime tout contenu fixe inapproprié et le remplace par des placeholders dynamiques
 */

const fs = require('fs').promises;
const path = require('path');
const DynamicContentAdapter = require('../lib/dynamicContentAdapter');

class LayoutCleaner {
    constructor() {
        this.adapter = new DynamicContentAdapter();
        this.layoutsDir = path.join(__dirname, '..', 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '..', 'templates', 'layouts-backup');
    }

    async cleanAllLayouts() {
        console.log('🧹 Nettoyage de tous les layouts...\n');

        // Créer dossier de backup
        try {
            await fs.mkdir(this.backupDir, { recursive: true });
            console.log('📁 Dossier de backup créé');
        } catch (error) {
            // Le dossier existe déjà
        }

        // Lister tous les layouts
        const layoutFiles = await fs.readdir(this.layoutsDir);
        const htmlFiles = layoutFiles.filter(f => f.endsWith('.html'));

        console.log(`📄 ${htmlFiles.length} layouts trouvés\n`);

        const results = {
            cleaned: 0,
            errors: 0,
            details: []
        };

        for (const filename of htmlFiles) {
            try {
                await this.cleanSingleLayout(filename);
                results.cleaned++;
                console.log(`✅ ${filename} - nettoyé`);
            } catch (error) {
                results.errors++;
                console.error(`❌ ${filename} - erreur:`, error.message);
                results.details.push({ file: filename, error: error.message });
            }
        }

        console.log('\n📊 Résultats du nettoyage:');
        console.log(`  ✅ Layouts nettoyés: ${results.cleaned}`);
        console.log(`  ❌ Erreurs: ${results.errors}`);

        if (results.errors > 0) {
            console.log('\n🔍 Détails des erreurs:');
            results.details.forEach(({ file, error }) => {
                console.log(`  • ${file}: ${error}`);
            });
        }

        return results;
    }

    async cleanSingleLayout(filename) {
        const layoutPath = path.join(this.layoutsDir, filename);
        const backupPath = path.join(this.backupDir, filename);

        // Lire le layout original
        const originalContent = await fs.readFile(layoutPath, 'utf8');

        // Créer backup si nécessaire
        try {
            await fs.access(backupPath);
        } catch (error) {
            // Le backup n'existe pas, le créer
            await fs.writeFile(backupPath, originalContent, 'utf8');
        }

        // Nettoyer le contenu
        let cleanedContent = this.cleanLayoutContent(originalContent);

        // Ajouter les commentaires explicatifs
        cleanedContent = this.addDocumentationComments(cleanedContent, filename);

        // Écrire le layout nettoyé
        await fs.writeFile(layoutPath, cleanedContent, 'utf8');
    }

    cleanLayoutContent(content) {
        let cleaned = content;

        // Patterns de nettoyage spécifiques
        const cleaningPatterns = [
            // Navigation fixe
            {
                pattern: />\s*(Nos\s+)?Services?\s*</gi,
                replacement: '>{nav_services}<',
                description: 'Navigation Services'
            },
            {
                pattern: />\s*À\s+propos?\s*</gi,
                replacement: '>{nav_about}<',
                description: 'Navigation À propos'
            },
            {
                pattern: />\s*(Notre\s+)?Équipe?\s*</gi,
                replacement: '>{nav_team}<',
                description: 'Navigation Équipe'
            },
            {
                pattern: />\s*Contact\s*</gi,
                replacement: '>{nav_contact}<',
                description: 'Navigation Contact'
            },
            {
                pattern: />\s*Blog\s*</gi,
                replacement: '>{nav_blog}<',
                description: 'Navigation Blog'
            },
            {
                pattern: />\s*Accueil\s*</gi,
                replacement: '>{nav_home}<',
                description: 'Navigation Accueil'
            },
            {
                pattern: />\s*Carrières?\s*</gi,
                replacement: '>{nav_careers}<',
                description: 'Navigation Carrières'
            },

            // Sections de contenu fixe
            {
                pattern: /Découvrez nos guides, conseils d'experts et études de cas pour optimiser votre stratégie digitale/gi,
                replacement: '{hero_description}',
                description: 'Description hero business'
            },
            {
                pattern: /Découvrez nos guides[^<]*/gi,
                replacement: '{hero_subtitle}',
                description: 'Sous-titre hero générique'
            },
            {
                pattern: /Solutions professionnelles d'excellence/gi,
                replacement: '{hero_title}',
                description: 'Titre hero business'
            },
            {
                pattern: /Votre partenaire de confiance pour la croissance/gi,
                replacement: '{tagline}',
                description: 'Tagline business'
            },

            // CTA fixes
            {
                pattern: />Commencer<\//gi,
                replacement: '>{cta_primary}</',
                description: 'CTA Commencer'
            },
            {
                pattern: />En savoir plus<\//gi,
                replacement: '>{cta_secondary}</',
                description: 'CTA En savoir plus'
            },
            {
                pattern: />Nous contacter<\//gi,
                replacement: '>{cta_contact}</',
                description: 'CTA Contact'
            },
            {
                pattern: />Demander un devis<\//gi,
                replacement: '>{cta_quote}</',
                description: 'CTA Devis'
            },

            // Formulaires
            {
                pattern: /placeholder="Votre email"/gi,
                replacement: 'placeholder="{form_email_placeholder}"',
                description: 'Placeholder email'
            },
            {
                pattern: /placeholder="Nom"/gi,
                replacement: 'placeholder="{form_name_placeholder}"',
                description: 'Placeholder nom'
            },
            {
                pattern: /placeholder="Message"/gi,
                replacement: 'placeholder="{form_message_placeholder}"',
                description: 'Placeholder message'
            },

            // Textes descriptifs spécifiques
            {
                pattern: /experts? en/gi,
                replacement: '{descriptor_expert} en',
                description: 'Descripteur expert'
            },
            {
                pattern: /professionnel(le)?s?/gi,
                replacement: '{descriptor_professional}',
                description: 'Descripteur professionnel'
            },
            {
                pattern: /innovant(e)?s?/gi,
                replacement: '{descriptor_innovative}',
                description: 'Descripteur innovant'
            },

            // Références sectorielles spécifiques
            {
                pattern: /\bentreprise\b/gi,
                replacement: '{business_term}',
                description: 'Terme entreprise'
            },
            {
                pattern: /\bdigitale?\b/gi,
                replacement: '{domain_term}',
                description: 'Terme digital'
            },
            {
                pattern: /\bstratégie\b/gi,
                replacement: '{service_term}',
                description: 'Terme stratégie'
            },
            {
                pattern: /\bconsulting\b/gi,
                replacement: '{service_term}',
                description: 'Terme consulting'
            }
        ];

        // Appliquer tous les patterns de nettoyage
        cleaningPatterns.forEach(({ pattern, replacement, description }) => {
            const originalLength = cleaned.length;
            cleaned = cleaned.replace(pattern, replacement);
            if (cleaned.length !== originalLength) {
                console.log(`    🔧 ${description} - remplacé`);
            }
        });

        return cleaned;
    }

    addDocumentationComments(content, filename) {
        const documentationComment = `
<!--
🎯 LAYOUT DYNAMIQUE - ${filename}
=====================================

Ce layout a été automatiquement nettoyé pour être theme-agnostic.
Toutes les références textuelles fixes ont été remplacées par des variables dynamiques.

Variables disponibles:
---------------------
Navigation: {nav_home}, {nav_services}, {nav_about}, {nav_team}, {nav_contact}, {nav_blog}
Contenu: {hero_title}, {hero_subtitle}, {hero_description}, {tagline}
CTA: {cta_primary}, {cta_secondary}, {cta_contact}, {cta_quote}
Descripteurs: {descriptor_expert}, {descriptor_professional}, {descriptor_innovative}
Formulaires: {form_email_placeholder}, {form_name_placeholder}, {form_message_placeholder}
Termes sectoriels: {business_term}, {domain_term}, {service_term}

Ces variables sont automatiquement remplies selon le thème détecté:
- pets: vocabulaire mignon et familier
- business: vocabulaire professionnel et corporate
- tech: vocabulaire moderne et technique
- creative: vocabulaire artistique et inspirant
- general: vocabulaire neutre et polyvalent

Générés automatiquement par DynamicContentAdapter 🤖
-->`;

        // Insérer le commentaire après l'ouverture de <html> ou au début
        if (content.includes('<html')) {
            content = content.replace(/(<html[^>]*>)/i, `$1${documentationComment}`);
        } else {
            content = documentationComment + '\n' + content;
        }

        return content;
    }

    async restoreFromBackup(filename) {
        const layoutPath = path.join(this.layoutsDir, filename);
        const backupPath = path.join(this.backupDir, filename);

        try {
            const backupContent = await fs.readFile(backupPath, 'utf8');
            await fs.writeFile(layoutPath, backupContent, 'utf8');
            console.log(`🔄 ${filename} restauré depuis le backup`);
        } catch (error) {
            console.error(`❌ Impossible de restaurer ${filename}:`, error.message);
        }
    }

    async listBackups() {
        try {
            const backups = await fs.readdir(this.backupDir);
            console.log(`📁 ${backups.length} backups disponibles:`);
            backups.forEach(file => console.log(`  • ${file}`));
        } catch (error) {
            console.log('📁 Aucun backup trouvé');
        }
    }
}

// Script principal
async function main() {
    const cleaner = new LayoutCleaner();

    const command = process.argv[2];

    switch (command) {
        case 'clean':
            await cleaner.cleanAllLayouts();
            break;
        case 'restore':
            const filename = process.argv[3];
            if (!filename) {
                console.error('❌ Usage: node clean-layouts.js restore <filename>');
                process.exit(1);
            }
            await cleaner.restoreFromBackup(filename);
            break;
        case 'list':
            await cleaner.listBackups();
            break;
        default:
            console.log('🧹 Script de nettoyage des layouts\n');
            console.log('Usage:');
            console.log('  node clean-layouts.js clean    - Nettoie tous les layouts');
            console.log('  node clean-layouts.js restore <file> - Restaure un layout depuis backup');
            console.log('  node clean-layouts.js list     - Liste les backups disponibles');
            break;
    }
}

// Lancer le script si appelé directement
if (require.main === module) {
    main().catch(console.error);
}

module.exports = LayoutCleaner;