#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

class KeywordValidator {
    constructor() {
        this.stats = {
            totalLines: 0,
            validKeywords: 0,
            emptyLines: 0,
            comments: 0,
            duplicates: 0,
            tooShort: 0,
            tooLong: 0,
            invalidChars: 0,
            suggestions: []
        };

        this.rules = {
            minLength: 2,
            maxLength: 100,
            allowedChars: /^[a-zA-ZÀ-ÿ0-9\s\-_',\.]+$/,
            maxDuplicates: 0
        };
    }

    /**
     * Valide un fichier de mots-clés
     */
    async validateFile(filePath, options = {}) {
        console.log(`🔍 Validation du fichier: ${filePath}\n`);

        try {
            // Vérifier que le fichier existe
            await fs.access(filePath);

            // Lire le contenu
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.split('\n');

            this.stats.totalLines = lines.length;

            // Analyser chaque ligne
            const keywords = [];
            const seenKeywords = new Set();

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                const lineNumber = i + 1;

                const result = this.validateKeyword(line, lineNumber);

                if (result.isValid) {
                    // Vérifier les doublons
                    const lowerKeyword = line.toLowerCase();
                    if (seenKeywords.has(lowerKeyword)) {
                        this.stats.duplicates++;
                        this.addSuggestion(`Ligne ${lineNumber}: Doublon détecté "${line}"`);
                    } else {
                        seenKeywords.add(lowerKeyword);
                        keywords.push({
                            keyword: line,
                            line: lineNumber,
                            length: line.length
                        });
                        this.stats.validKeywords++;
                    }
                }
            }

            // Analyser les patterns
            await this.analyzePatterns(keywords);

            // Afficher le rapport
            this.displayReport();

            // Suggérer des corrections si demandé
            if (options.fix) {
                await this.generateCorrectedFile(filePath, keywords);
            }

            return {
                isValid: this.stats.validKeywords > 0 && this.getErrorCount() === 0,
                stats: this.stats,
                keywords: keywords
            };

        } catch (error) {
            console.error('❌ Erreur lors de la validation:', error.message);
            return { isValid: false, error: error.message };
        }
    }

    /**
     * Valide un mot-clé individuel
     */
    validateKeyword(keyword, lineNumber) {
        // Ligne vide
        if (!keyword) {
            this.stats.emptyLines++;
            return { isValid: false, reason: 'empty' };
        }

        // Commentaire
        if (keyword.startsWith('#')) {
            this.stats.comments++;
            return { isValid: false, reason: 'comment' };
        }

        // Trop court
        if (keyword.length < this.rules.minLength) {
            this.stats.tooShort++;
            this.addSuggestion(`Ligne ${lineNumber}: "${keyword}" trop court (min: ${this.rules.minLength} caractères)`);
            return { isValid: false, reason: 'too_short' };
        }

        // Trop long
        if (keyword.length > this.rules.maxLength) {
            this.stats.tooLong++;
            this.addSuggestion(`Ligne ${lineNumber}: "${keyword}" trop long (max: ${this.rules.maxLength} caractères)`);
            return { isValid: false, reason: 'too_long' };
        }

        // Caractères invalides
        if (!this.rules.allowedChars.test(keyword)) {
            this.stats.invalidChars++;
            this.addSuggestion(`Ligne ${lineNumber}: "${keyword}" contient des caractères invalides`);
            return { isValid: false, reason: 'invalid_chars' };
        }

        return { isValid: true };
    }

    /**
     * Analyse les patterns dans les mots-clés
     */
    async analyzePatterns(keywords) {
        const patterns = {
            lengths: {},
            firstWords: {},
            categories: {
                questions: 0,
                brands: 0,
                locations: 0,
                actions: 0
            }
        };

        keywords.forEach(({ keyword, length }) => {
            // Analyser les longueurs
            const lengthRange = Math.floor(length / 10) * 10;
            patterns.lengths[`${lengthRange}-${lengthRange + 9}`] =
                (patterns.lengths[`${lengthRange}-${lengthRange + 9}`] || 0) + 1;

            // Analyser les premiers mots
            const firstWord = keyword.split(' ')[0].toLowerCase();
            patterns.firstWords[firstWord] = (patterns.firstWords[firstWord] || 0) + 1;

            // Détecter les catégories
            if (/^(comment|pourquoi|quand|où|que|qui|quel)/i.test(keyword)) {
                patterns.categories.questions++;
            }
            if (/\b(meilleur|top|comparatif|vs|versus)\b/i.test(keyword)) {
                patterns.categories.brands++;
            }
            if (/\b(paris|france|lyon|marseille|toulouse|bordeaux)\b/i.test(keyword)) {
                patterns.categories.locations++;
            }
            if (/^(acheter|vendre|trouver|choisir|installer|créer)/i.test(keyword)) {
                patterns.categories.actions++;
            }
        });

        this.patterns = patterns;

        // Ajouter des suggestions basées sur les patterns
        const topFirstWords = Object.entries(patterns.firstWords)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (topFirstWords.length > 0) {
            this.addSuggestion(`Mots les plus fréquents en début: ${topFirstWords.map(([word, count]) => `"${word}" (${count})`).join(', ')}`);
        }

        // Suggestions de diversification
        if (patterns.categories.questions > keywords.length * 0.8) {
            this.addSuggestion('⚠️  Beaucoup de questions détectées. Considérez ajouter plus de mots-clés informatifs.');
        }

        if (patterns.categories.actions < keywords.length * 0.1) {
            this.addSuggestion('💡 Peu de mots-clés d\'action détectés. Considérez ajouter des termes comme "acheter", "choisir", etc.');
        }
    }

    /**
     * Affiche le rapport de validation
     */
    displayReport() {
        console.log('📊 RAPPORT DE VALIDATION');
        console.log('='.repeat(50));

        // Statistiques générales
        console.log(`📝 Lignes totales: ${this.stats.totalLines}`);
        console.log(`✅ Mots-clés valides: ${this.stats.validKeywords}`);
        console.log(`📄 Lignes vides: ${this.stats.emptyLines}`);
        console.log(`💬 Commentaires: ${this.stats.comments}`);

        // Erreurs
        const errorCount = this.getErrorCount();
        if (errorCount > 0) {
            console.log('\n❌ ERREURS DÉTECTÉES:');
            if (this.stats.duplicates > 0) {
                console.log(`  🔄 Doublons: ${this.stats.duplicates}`);
            }
            if (this.stats.tooShort > 0) {
                console.log(`  📏 Trop courts: ${this.stats.tooShort}`);
            }
            if (this.stats.tooLong > 0) {
                console.log(`  📏 Trop longs: ${this.stats.tooLong}`);
            }
            if (this.stats.invalidChars > 0) {
                console.log(`  🚫 Caractères invalides: ${this.stats.invalidChars}`);
            }
        } else {
            console.log('\n✅ Aucune erreur détectée !');
        }

        // Patterns
        if (this.patterns) {
            console.log('\n📈 ANALYSE DES PATTERNS:');

            // Répartition par longueur
            console.log('  Répartition par longueur:');
            Object.entries(this.patterns.lengths)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .forEach(([range, count]) => {
                    const percentage = (count / this.stats.validKeywords * 100).toFixed(1);
                    console.log(`    ${range} chars: ${count} (${percentage}%)`);
                });

            // Catégories
            console.log('  Catégories détectées:');
            Object.entries(this.patterns.categories).forEach(([category, count]) => {
                if (count > 0) {
                    const percentage = (count / this.stats.validKeywords * 100).toFixed(1);
                    console.log(`    ${this.getCategoryIcon(category)} ${category}: ${count} (${percentage}%)`);
                }
            });
        }

        // Suggestions
        if (this.stats.suggestions.length > 0) {
            console.log('\n💡 SUGGESTIONS:');
            this.stats.suggestions.forEach(suggestion => {
                console.log(`  • ${suggestion}`);
            });
        }

        // Résumé final
        console.log('\n' + '='.repeat(50));
        if (errorCount === 0 && this.stats.validKeywords > 0) {
            console.log('✅ VALIDATION RÉUSSIE - Fichier prêt à utiliser');
        } else {
            console.log('❌ VALIDATION ÉCHOUÉE - Corrections nécessaires');
        }

        console.log(`📊 Taux de validité: ${(this.stats.validKeywords / this.stats.totalLines * 100).toFixed(1)}%`);
    }

    /**
     * Obtient l'icône pour une catégorie
     */
    getCategoryIcon(category) {
        const icons = {
            questions: '❓',
            brands: '🏷️',
            locations: '📍',
            actions: '⚡'
        };
        return icons[category] || '📊';
    }

    /**
     * Obtient le nombre total d'erreurs
     */
    getErrorCount() {
        return this.stats.duplicates + this.stats.tooShort +
               this.stats.tooLong + this.stats.invalidChars;
    }

    /**
     * Ajoute une suggestion
     */
    addSuggestion(suggestion) {
        this.stats.suggestions.push(suggestion);
    }

    /**
     * Génère un fichier corrigé
     */
    async generateCorrectedFile(originalPath, validKeywords) {
        const correctedPath = originalPath.replace(/\.txt$/, '-corrected.txt');

        const content = [
            '# Fichier corrigé automatiquement',
            `# Généré le: ${new Date().toISOString()}`,
            `# Mots-clés valides: ${validKeywords.length}`,
            '',
            ...validKeywords.map(k => k.keyword)
        ].join('\n');

        await fs.writeFile(correctedPath, content);
        console.log(`\n✅ Fichier corrigé généré: ${correctedPath}`);
    }

    /**
     * Valide plusieurs fichiers
     */
    async validateMultipleFiles(patterns) {
        console.log(`🔍 Validation de plusieurs fichiers: ${patterns.join(', ')}\n`);

        const results = [];

        for (const pattern of patterns) {
            // Trouver les fichiers correspondant au pattern
            const files = await this.findFiles(pattern);

            for (const file of files) {
                console.log(`\n${'='.repeat(60)}`);
                const result = await this.validateFile(file);
                results.push({ file, ...result });

                // Reset stats for next file
                this.resetStats();
            }
        }

        // Résumé global
        console.log(`\n${'='.repeat(60)}`);
        console.log('📊 RÉSUMÉ GLOBAL');
        console.log('='.repeat(60));

        const totalValid = results.filter(r => r.isValid).length;
        const totalFiles = results.length;

        console.log(`📁 Fichiers validés: ${totalFiles}`);
        console.log(`✅ Fichiers valides: ${totalValid}`);
        console.log(`❌ Fichiers avec erreurs: ${totalFiles - totalValid}`);

        if (totalFiles > 0) {
            console.log(`📊 Taux de réussite: ${(totalValid / totalFiles * 100).toFixed(1)}%`);
        }

        return results;
    }

    /**
     * Trouve les fichiers correspondant à un pattern
     */
    async findFiles(pattern) {
        const files = [];

        try {
            if (pattern.includes('*')) {
                // Pattern glob simple
                const dir = path.dirname(pattern) || '.';
                const namePattern = path.basename(pattern);
                const regex = new RegExp(namePattern.replace(/\*/g, '.*'));

                const entries = await fs.readdir(dir);
                for (const entry of entries) {
                    if (regex.test(entry)) {
                        files.push(path.join(dir, entry));
                    }
                }
            } else {
                // Fichier simple
                files.push(pattern);
            }
        } catch (error) {
            console.error(`❌ Erreur lors de la recherche de fichiers: ${error.message}`);
        }

        return files;
    }

    /**
     * Remet à zéro les statistiques
     */
    resetStats() {
        this.stats = {
            totalLines: 0,
            validKeywords: 0,
            emptyLines: 0,
            comments: 0,
            duplicates: 0,
            tooShort: 0,
            tooLong: 0,
            invalidChars: 0,
            suggestions: []
        };
        this.patterns = null;
    }

    /**
     * Configure les règles de validation
     */
    setRules(rules) {
        this.rules = { ...this.rules, ...rules };
        console.log('✅ Règles de validation mises à jour:', this.rules);
    }
}

// Interface CLI
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
        console.log(`
🔍 Validateur de Mots-clés - Blog Mass Generator

Usage: node validate-keywords.js <file|pattern> [options]

Arguments:
  file|pattern    Fichier ou pattern à valider (ex: *.txt, keywords.txt)

Options:
  --fix           Génère un fichier corrigé
  --min-length N  Longueur minimale des mots-clés (défaut: 2)
  --max-length N  Longueur maximale des mots-clés (défaut: 100)
  --multiple      Valide plusieurs fichiers selon le pattern

Exemples:
  node validate-keywords.js keywords.txt              # Valider un fichier
  node validate-keywords.js keywords.txt --fix       # Valider et corriger
  node validate-keywords.js "*.txt" --multiple       # Valider tous les .txt
  node validate-keywords.js keywords.txt --min-length 5  # Règles personnalisées

Formats supportés:
  • Un mot-clé par ligne
  • Lignes vides ignorées
  • Commentaires avec # ignorés
  • Caractères autorisés: lettres, chiffres, espaces, - _ ' , .
        `);
        return;
    }

    const validator = new KeywordValidator();
    const filePath = args[0];

    // Configuration des règles
    if (args.includes('--min-length')) {
        const minLength = parseInt(args[args.indexOf('--min-length') + 1]);
        validator.setRules({ minLength });
    }

    if (args.includes('--max-length')) {
        const maxLength = parseInt(args[args.indexOf('--max-length') + 1]);
        validator.setRules({ maxLength });
    }

    const options = {
        fix: args.includes('--fix'),
        multiple: args.includes('--multiple')
    };

    try {
        let results;

        if (options.multiple) {
            results = await validator.validateMultipleFiles([filePath]);
        } else {
            results = await validator.validateFile(filePath, options);
        }

        // Code de sortie selon le résultat
        if (Array.isArray(results)) {
            const hasErrors = results.some(r => !r.isValid);
            process.exit(hasErrors ? 1 : 0);
        } else {
            process.exit(results.isValid ? 0 : 1);
        }

    } catch (error) {
        console.error('❌ Erreur fatale:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = KeywordValidator;