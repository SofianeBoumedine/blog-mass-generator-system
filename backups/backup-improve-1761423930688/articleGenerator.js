const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ArticleGenerator {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.prompts = null;
        this.articleTemplate = null;
        this.generatedCount = 0;
        this.failedKeywords = [];
    }

    async initialize() {
        const promptsPath = path.join(__dirname, '..', 'config', 'prompts.json');
        this.prompts = JSON.parse(await fs.readFile(promptsPath, 'utf8'));

        // Charger le template d'article
        const templatePath = path.join(__dirname, '..', 'templates', 'template.html');
        try {
            this.articleTemplate = await fs.readFile(templatePath, 'utf8');
        } catch (error) {
            console.log('⚠️  Template par défaut non trouvé, utilisation du template intégré');
            this.articleTemplate = this.getDefaultTemplate();
        }
    }

    /**
     * Génère tous les articles pour le blog
     */
    async generateArticles(keywords, outputDir, branding, analysis, options = {}) {
        const {
            articlesPerKeyword = 1,
            maxArticles = 50,
            delayBetweenArticles = 3000,
            startFrom = 0
        } = options;

        console.log(`\n📝 Génération des articles de blog...`);
        console.log(`  • ${keywords.length} mots-clés disponibles`);
        console.log(`  • Maximum ${maxArticles} articles à générer\n`);

        const blogDir = path.join(outputDir, 'blog');
        await fs.mkdir(blogDir, { recursive: true });

        const articles = [];
        let totalGenerated = 0;

        for (let i = startFrom; i < keywords.length && totalGenerated < maxArticles; i++) {
            const keyword = keywords[i];
            console.log(`  [${i + 1}/${Math.min(keywords.length, maxArticles)}] ${keyword}`);

            for (let j = 0; j < articlesPerKeyword && totalGenerated < maxArticles; j++) {
                try {
                    const article = await this.generateSingleArticle(
                        keyword,
                        branding,
                        analysis,
                        j > 0 ? ` - Partie ${j + 1}` : ''
                    );

                    const filename = await this.saveArticle(article, blogDir, keyword);
                    articles.push({
                        keyword,
                        filename,
                        title: article.title,
                        generatedAt: new Date().toISOString()
                    });

                    totalGenerated++;
                    this.generatedCount++;
                    console.log(`    ✅ Article généré: ${filename}`);

                    // Délai entre les articles
                    if (totalGenerated < maxArticles) {
                        await this.delay(delayBetweenArticles);
                    }

                } catch (error) {
                    console.error(`    ❌ Échec pour "${keyword}":`, error.message);
                    this.failedKeywords.push({ keyword, error: error.message });
                }
            }
        }

        // Créer un index des articles
        await this.createArticlesIndex(articles, blogDir);

        // Créer le template d'article réutilisable
        await this.createArticleTemplate(blogDir, branding);
        console.log(`  📋 Template d'article créé: _template-article.html`);

        // Créer le README d'utilisation
        await this.createTemplateReadme(blogDir);
        console.log(`  📖 Guide d'utilisation créé: README.txt`);

        console.log(`\n✅ Génération terminée: ${totalGenerated} articles créés`);
        if (this.failedKeywords.length > 0) {
            console.log(`⚠️  ${this.failedKeywords.length} échecs`);
        }

        return {
            generated: totalGenerated,
            articles,
            failed: this.failedKeywords
        };
    }

    /**
     * Génère un article unique
     */
    async generateSingleArticle(keyword, branding, analysis, suffix = '') {
        const wordCount = this.getRandomWordCount();

        const prompt = this.prompts.blog.article
            .replace('{keyword}', keyword + suffix)
            .replace('{brandName}', branding.brandName)
            .replace('{wordCount}', wordCount)
            .replace('{tone}', analysis.tone)
            .replace('{theme}', analysis.theme);

        const content = await this.apiClient.generateContent(prompt);

        // Parser le contenu
        const article = this.parseArticleContent(content, keyword);

        // Ajouter les métadonnées
        article.meta = {
            title: this.generateMetaTitle(article.title, branding.brandName),
            description: this.generateMetaDescription(article.introduction),
            keywords: this.generateKeywords(keyword, analysis.relatedThemes),
            author: branding.brandName,
            publishDate: new Date().toISOString()
        };

        // Enrichir avec schema.org
        article.schema = this.generateSchema(article, branding, keyword);

        return article;
    }

    /**
     * Parse le contenu de l'article généré
     */
    parseArticleContent(rawContent, keyword) {
        const article = {
            title: '',
            introduction: '',
            content: '',
            conclusion: '',
            sections: []
        };

        // Extraire le titre
        const titleMatch = rawContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (titleMatch) {
            article.title = titleMatch[1].replace(/<[^>]*>/g, '');
        } else {
            const firstLine = rawContent.split('\n')[0];
            article.title = firstLine.replace(/^#\s*/, '').replace(/[*_]/g, '');
        }

        // Extraire l'introduction
        const introMatch = rawContent.match(/introduction[:\s]*([\s\S]*?)(?=\n\n|<h2|##)/i);
        if (introMatch) {
            article.introduction = this.cleanText(introMatch[1]);
        } else {
            // Prendre le premier paragraphe
            const firstParaMatch = rawContent.match(/<p>(.*?)<\/p>/);
            if (firstParaMatch) {
                article.introduction = firstParaMatch[1];
            }
        }

        // Extraire les sections
        const sectionMatches = rawContent.matchAll(/<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|<h3|$)/gi);
        for (const match of sectionMatches) {
            article.sections.push({
                title: match[1].replace(/<[^>]*>/g, ''),
                content: this.cleanText(match[2])
            });
        }

        // Si pas de sections trouvées, essayer avec markdown
        if (article.sections.length === 0) {
            const mdSections = rawContent.matchAll(/##\s+(.*?)\n([\s\S]*?)(?=\n##|$)/g);
            for (const match of mdSections) {
                article.sections.push({
                    title: match[1],
                    content: this.cleanText(match[2])
                });
            }
        }

        // Extraire la conclusion
        const conclusionMatch = rawContent.match(/conclusion[:\s]*([\s\S]*?)(?=\n\n|$)/i);
        if (conclusionMatch) {
            article.conclusion = this.cleanText(conclusionMatch[1]);
        }

        // Construire le contenu HTML complet
        article.content = this.buildArticleHTML(article);

        return article;
    }

    /**
     * Construit le HTML de l'article
     */
    buildArticleHTML(article) {
        let html = '';

        // Introduction
        if (article.introduction) {
            html += `<div class="article-introduction">${article.introduction}</div>\n\n`;
        }

        // Sections
        for (const section of article.sections) {
            html += `<h2>${section.title}</h2>\n`;
            html += `${section.content}\n\n`;
        }

        // Conclusion
        if (article.conclusion) {
            html += `<div class="article-conclusion">\n`;
            html += `<h2>Conclusion</h2>\n`;
            html += `${article.conclusion}\n`;
            html += `</div>`;
        }

        return html;
    }

    /**
     * Sauvegarde un article dans un fichier
     */
    async saveArticle(article, blogDir, keyword) {
        // Générer le nom de fichier
        const slug = this.generateSlug(article.title || keyword);
        const filename = `${slug}.html`;
        const filepath = path.join(blogDir, filename);

        // Remplir le template
        let html = this.articleTemplate;

        // Remplacer les placeholders
        html = html.replace(/{title}/g, article.title);
        html = html.replace(/{meta_title}/g, article.meta.title);
        html = html.replace(/{meta_description}/g, article.meta.description);
        html = html.replace(/{meta_keywords}/g, article.meta.keywords);
        html = html.replace(/{author}/g, article.meta.author);
        html = html.replace(/{publish_date}/g, article.meta.publishDate);
        html = html.replace(/{content}/g, article.content);
        html = html.replace(/{schema_json}/g, JSON.stringify(article.schema));
        html = html.replace(/{keyword}/g, keyword);

        // Ajouter la date formatée
        const date = new Date();
        const dateFormatted = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        html = html.replace(/{date}/g, dateFormatted);

        // Sauvegarder
        await fs.writeFile(filepath, html, 'utf8');

        return filename;
    }

    /**
     * Crée un index des articles générés
     */
    async createArticlesIndex(articles, blogDir) {
        const indexPath = path.join(blogDir, 'articles-index.json');
        const index = {
            generatedAt: new Date().toISOString(),
            totalArticles: articles.length,
            articles: articles.map(a => ({
                title: a.title,
                keyword: a.keyword,
                filename: a.filename,
                url: `/blog/${a.filename}`,
                generatedAt: a.generatedAt
            }))
        };

        await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
        console.log(`  📑 Index créé: articles-index.json`);
    }

    /**
     * Génère le slug pour l'URL
     */
    generateSlug(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 60);
    }

    /**
     * Génère le meta title
     */
    generateMetaTitle(title, brandName) {
        const cleanTitle = title.substring(0, 40);
        return `${cleanTitle} | ${brandName}`;
    }

    /**
     * Génère la meta description
     */
    generateMetaDescription(introduction) {
        const clean = introduction
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        return clean.substring(0, 155) + '...';
    }

    /**
     * Génère les keywords
     */
    generateKeywords(mainKeyword, relatedThemes) {
        const keywords = [mainKeyword];
        if (relatedThemes && relatedThemes.length > 0) {
            keywords.push(...relatedThemes.slice(0, 4));
        }
        return keywords.join(', ');
    }

    /**
     * Génère le schema.org
     */
    generateSchema(article, branding, keyword) {
        return {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': article.title,
            'description': article.meta.description,
            'keywords': keyword,
            'author': {
                '@type': 'Organization',
                'name': branding.brandName
            },
            'datePublished': article.meta.publishDate,
            'dateModified': article.meta.publishDate,
            'publisher': {
                '@type': 'Organization',
                'name': branding.brandName,
                'logo': {
                    '@type': 'ImageObject',
                    'url': `/assets/images/logo.png`
                }
            }
        };
    }

    /**
     * Nettoie le texte
     */
    cleanText(text) {
        return text
            .replace(/```[a-z]*\n?/g, '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^\s*[-*]\s+/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => {
                if (!line.startsWith('<')) {
                    return `<p>${line}</p>`;
                }
                return line;
            })
            .join('\n');
    }

    /**
     * Génère un nombre de mots aléatoire
     */
    getRandomWordCount() {
        return Math.floor(Math.random() * (2500 - 1500 + 1)) + 1500;
    }

    /**
     * Template par défaut si le fichier n'existe pas
     */
    getDefaultTemplate() {
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{meta_description}">
    <meta name="keywords" content="{meta_keywords}">
    <meta name="author" content="{author}">

    <!-- Open Graph -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_description}">
    <meta property="og:type" content="article">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {schema_json}
    </script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 40px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }

        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        .article-meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 20px;
        }

        .article-content {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .article-content h2 {
            font-size: 1.8em;
            margin: 30px 0 15px;
            color: #34495e;
        }

        .article-content h3 {
            font-size: 1.4em;
            margin: 25px 0 15px;
            color: #34495e;
        }

        .article-content p {
            margin-bottom: 15px;
            text-align: justify;
        }

        .article-introduction {
            font-size: 1.1em;
            font-weight: 500;
            margin-bottom: 30px;
            padding: 20px;
            background: #ecf0f1;
            border-left: 4px solid #3498db;
        }

        .article-conclusion {
            margin-top: 40px;
            padding: 20px;
            background: #e8f5e9;
            border-radius: 8px;
        }

        footer {
            text-align: center;
            padding: 40px 0;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>{title}</h1>
            <div class="article-meta">
                Publié le {date} par {author}
            </div>
        </div>
    </header>

    <main class="container">
        <article class="article-content">
            {content}
        </article>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 {author}. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>`;
    }

    /**
     * Crée un template d'article réutilisable pour créer manuellement de nouveaux articles
     */
    async createArticleTemplate(blogDir, branding) {
        const templatePath = path.join(blogDir, '_template-article.html');

        const templateHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- ⬇️ REMPLACER: Titre de l'article (pour l'onglet du navigateur) -->
    <title>Votre Titre Ici | ${branding.brandName}</title>

    <!-- ⬇️ REMPLACER: Description courte pour SEO (150-160 caractères) -->
    <meta name="description" content="Description de votre article pour les moteurs de recherche...">

    <!-- ⬇️ REMPLACER: Mots-clés séparés par des virgules -->
    <meta name="keywords" content="mot-clé 1, mot-clé 2, mot-clé 3">

    <meta name="author" content="${branding.brandName}">

    <!-- Open Graph pour réseaux sociaux -->
    <meta property="og:title" content="Votre Titre Ici">
    <meta property="og:description" content="Description de votre article...">
    <meta property="og:type" content="article">

    <!-- Schema.org pour SEO -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Votre Titre Ici",
        "description": "Description de votre article...",
        "keywords": "mot-clé principal",
        "author": {
            "@type": "Organization",
            "name": "${branding.brandName}"
        },
        "datePublished": "2024-01-01T00:00:00Z",
        "dateModified": "2024-01-01T00:00:00Z",
        "publisher": {
            "@type": "Organization",
            "name": "${branding.brandName}",
            "logo": {
                "@type": "ImageObject",
                "url": "/assets/images/logo.png"
            }
        }
    }
    </script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: white;
            padding: 40px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }

        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            color: #2c3e50;
        }

        .article-meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 20px;
        }

        .article-content {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .article-content h2 {
            font-size: 1.8em;
            margin: 30px 0 15px;
            color: #34495e;
        }

        .article-content h3 {
            font-size: 1.4em;
            margin: 25px 0 15px;
            color: #34495e;
        }

        .article-content p {
            margin-bottom: 15px;
            text-align: justify;
        }

        .article-introduction {
            font-size: 1.1em;
            font-weight: 500;
            margin-bottom: 30px;
            padding: 20px;
            background: #ecf0f1;
            border-left: 4px solid #3498db;
        }

        .article-conclusion {
            margin-top: 40px;
            padding: 20px;
            background: #e8f5e9;
            border-radius: 8px;
        }

        footer {
            text-align: center;
            padding: 40px 0;
            color: #7f8c8d;
        }

        /* Classes utiles pour mise en forme */
        .highlight {
            background: #fff3cd;
            padding: 2px 6px;
            border-radius: 3px;
        }

        .quote {
            border-left: 4px solid #3498db;
            padding-left: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #555;
        }

        ul, ol {
            margin-left: 30px;
            margin-bottom: 15px;
        }

        li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <!-- ⬇️ REMPLACER: Titre principal de l'article (H1) -->
            <h1>Votre Titre d'Article Ici</h1>

            <div class="article-meta">
                <!-- ⬇️ REMPLACER: Date de publication (format: 15 janvier 2024) -->
                Publié le <strong>15 janvier 2024</strong> par ${branding.brandName}
            </div>
        </div>
    </header>

    <main class="container">
        <article class="article-content">

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!--                    SECTION INTRODUCTION                          -->
            <!-- ═══════════════════════════════════════════════════════════════ -->

            <!-- Introduction mise en avant (optionnel mais recommandé) -->
            <div class="article-introduction">
                <!-- ⬇️ REMPLACER: Paragraphe d'introduction accrocheur (2-3 phrases) -->
                <p>Votre introduction percutante ici. Elle doit capter l'attention du lecteur et présenter brièvement le sujet de l'article.</p>
            </div>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!--                    CONTENU PRINCIPAL                             -->
            <!-- ═══════════════════════════════════════════════════════════════ -->

            <!-- ⬇️ REMPLACER: Première section -->
            <h2>Titre de la Première Section</h2>
            <p>Contenu de votre première section. Développez votre sujet avec des paragraphes clairs et structurés.</p>
            <p>Vous pouvez ajouter plusieurs paragraphes pour développer vos idées.</p>

            <!-- Exemple de liste à puces -->
            <ul>
                <li>Premier point important</li>
                <li>Deuxième point important</li>
                <li>Troisième point important</li>
            </ul>

            <!-- ⬇️ REMPLACER: Deuxième section -->
            <h2>Titre de la Deuxième Section</h2>
            <p>Contenu de votre deuxième section.</p>

            <!-- Sous-section si nécessaire -->
            <h3>Sous-titre Optionnel</h3>
            <p>Détails supplémentaires avec un sous-titre.</p>

            <!-- Exemple de citation ou mise en avant -->
            <div class="quote">
                "Une citation importante ou un point clé à mettre en valeur."
            </div>

            <!-- ⬇️ REMPLACER: Troisième section -->
            <h2>Titre de la Troisième Section</h2>
            <p>Contenu de votre troisième section. N'hésitez pas à utiliser des <span class="highlight">mises en surbrillance</span> pour les informations importantes.</p>

            <!-- Exemple de liste numérotée -->
            <ol>
                <li>Première étape</li>
                <li>Deuxième étape</li>
                <li>Troisième étape</li>
            </ol>

            <!-- ═══════════════════════════════════════════════════════════════ -->
            <!--                       CONCLUSION                                 -->
            <!-- ═══════════════════════════════════════════════════════════════ -->

            <!-- Conclusion mise en avant -->
            <div class="article-conclusion">
                <h2>Conclusion</h2>
                <!-- ⬇️ REMPLACER: Paragraphe de conclusion (2-3 phrases) -->
                <p>Votre conclusion ici. Résumez les points clés et proposez éventuellement une ouverture ou un appel à l'action.</p>
            </div>

        </article>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 ${branding.brandName}. Tous droits réservés.</p>
        </div>
    </footer>
</body>
</html>

<!--
═══════════════════════════════════════════════════════════════════════════
                        GUIDE D'UTILISATION RAPIDE
═══════════════════════════════════════════════════════════════════════════

1. COPIER ce fichier et le RENOMMER:
   Exemple: copier vers "mon-nouvel-article.html"

2. REMPLACER tous les éléments marqués avec "⬇️ REMPLACER:"
   - Titre dans <title>
   - Description dans <meta name="description">
   - Mots-clés dans <meta name="keywords">
   - Titre H1 principal
   - Date de publication
   - Introduction
   - Sections H2 avec leur contenu
   - Conclusion

3. PERSONNALISER le contenu:
   - Ajoutez autant de sections H2 que nécessaire
   - Utilisez H3 pour des sous-sections
   - Ajoutez des listes (ul/ol) pour structurer
   - Utilisez les classes CSS disponibles:
     * .highlight : surbrillance jaune
     * .quote : citation avec bordure bleue
     * .article-introduction : bloc introduction
     * .article-conclusion : bloc conclusion

4. SAUVEGARDER et tester dans un navigateur

5. VÉRIFIER:
   ✅ Tous les "⬇️ REMPLACER:" sont modifiés
   ✅ Le titre H1 est unique et descriptif
   ✅ La meta description fait 150-160 caractères
   ✅ Les sections sont bien structurées (H2 > H3)
   ✅ La date est à jour

Pour plus de détails, consultez README.txt dans le dossier /blog/

═══════════════════════════════════════════════════════════════════════════
-->`;

        await fs.writeFile(templatePath, templateHTML, 'utf8');
    }

    /**
     * Crée un README avec les instructions d'utilisation du template
     */
    async createTemplateReadme(blogDir) {
        const readmePath = path.join(blogDir, 'README.txt');

        const readmeContent = `═══════════════════════════════════════════════════════════════════════════
                    GUIDE D'UTILISATION DU TEMPLATE D'ARTICLE
                              Dossier /blog/
═══════════════════════════════════════════════════════════════════════════

📋 FICHIER TEMPLATE: _template-article.html

Ce fichier est un modèle vierge que vous pouvez utiliser pour créer
manuellement de nouveaux articles de blog. Il a exactement la même structure
et le même style que les articles générés automatiquement.

───────────────────────────────────────────────────────────────────────────
🚀 ÉTAPES POUR CRÉER UN NOUVEL ARTICLE
───────────────────────────────────────────────────────────────────────────

1. COPIER LE TEMPLATE

   Copiez le fichier "_template-article.html" et renommez-le:

   Exemple:
   - mon-guide-complet.html
   - astuces-pratiques-2024.html
   - tutoriel-debutant.html

   ⚠️ N'utilisez PAS d'espaces ni de caractères spéciaux dans le nom.
   ⚠️ Ne modifiez PAS le fichier "_template-article.html" original.


2. OUVRIR LE FICHIER DANS UN ÉDITEUR

   Utilisez un éditeur de texte ou de code:
   - VS Code, Sublime Text, Notepad++, Atom, etc.
   - Ou même le Bloc-notes (Windows) / TextEdit (Mac)


3. REMPLACER LES SECTIONS MARQUÉES "⬇️ REMPLACER:"

   Cherchez tous les commentaires "⬇️ REMPLACER:" et modifiez:

   ┌─────────────────────────────────────────────────────────────────┐
   │ A. META TAGS (lignes 6-19)                                      │
   └─────────────────────────────────────────────────────────────────┘

   ✏️ <title> : Titre pour l'onglet du navigateur
      Exemple: "10 Astuces pour Débuter | MonSite"

   ✏️ <meta name="description"> : Description SEO (150-160 caractères)
      Exemple: "Découvrez nos 10 astuces essentielles pour bien débuter.
                Un guide pratique et complet pour les débutants."

   ✏️ <meta name="keywords"> : Mots-clés séparés par virgules
      Exemple: "astuces débutant, guide pratique, tutoriel, conseils"

   ┌─────────────────────────────────────────────────────────────────┐
   │ B. TITRE PRINCIPAL (ligne ~175)                                 │
   └─────────────────────────────────────────────────────────────────┘

   ✏️ <h1> : Titre principal de l'article
      Exemple: "10 Astuces Essentielles pour Bien Débuter"

      ⚠️ Important: Utilisez UN SEUL H1 par article

   ┌─────────────────────────────────────────────────────────────────┐
   │ C. DATE DE PUBLICATION (ligne ~179)                             │
   └─────────────────────────────────────────────────────────────────┘

   ✏️ Date : Format "jour mois année"
      Exemple: "15 janvier 2024"

   ┌─────────────────────────────────────────────────────────────────┐
   │ D. INTRODUCTION (ligne ~192)                                    │
   └─────────────────────────────────────────────────────────────────┘

   ✏️ Paragraphe d'introduction : 2-3 phrases accrocheuses
      Présentez le sujet et captez l'attention du lecteur

   ┌─────────────────────────────────────────────────────────────────┐
   │ E. SECTIONS H2 (lignes ~202+)                                   │
   └─────────────────────────────────────────────────────────────────┘

   ✏️ Remplacez les titres et contenus des sections
   ✏️ Ajoutez autant de sections H2 que nécessaire
   ✏️ Utilisez H3 pour des sous-sections si besoin

   ┌─────────────────────────────────────────────────────────────────┐
   │ F. CONCLUSION (ligne ~245)                                      │
   └─────────────────────────────────────────────────────────────────┘

   ✏️ Paragraphe de conclusion : Résumé + ouverture


4. PERSONNALISER LE CONTENU

   Utilisez ces éléments HTML pour structurer:

   📝 Paragraphes:
      <p>Votre texte ici</p>

   📝 Titres:
      <h2>Titre de section</h2>
      <h3>Sous-titre</h3>

   📝 Listes à puces:
      <ul>
          <li>Premier point</li>
          <li>Deuxième point</li>
      </ul>

   📝 Listes numérotées:
      <ol>
          <li>Première étape</li>
          <li>Deuxième étape</li>
      </ol>

   📝 Mise en surbrillance:
      <span class="highlight">texte important</span>

   📝 Citation:
      <div class="quote">
          "Votre citation ici"
      </div>


5. VÉRIFICATION AVANT PUBLICATION

   ✅ Tous les "⬇️ REMPLACER:" ont été modifiés
   ✅ Le titre H1 est unique et descriptif
   ✅ La meta description fait 150-160 caractères
   ✅ Les mots-clés sont pertinents (4-6 mots-clés)
   ✅ La date est correcte
   ✅ Les sections sont bien structurées (H2 > H3 > paragraphes)
   ✅ Pas de fautes d'orthographe
   ✅ Les liens fonctionnent (si vous en avez ajouté)


6. TESTER L'ARTICLE

   - Ouvrez le fichier HTML dans votre navigateur
   - Vérifiez que tout s'affiche correctement
   - Testez sur mobile (responsive)
   - Vérifiez les couleurs et la lisibilité

───────────────────────────────────────────────────────────────────────────
🎨 CLASSES CSS DISPONIBLES
───────────────────────────────────────────────────────────────────────────

.article-introduction    Bloc introduction avec fond gris et bordure bleue
.article-conclusion      Bloc conclusion avec fond vert clair
.highlight              Surbrillance jaune pour texte important
.quote                  Citation avec bordure bleue et style italique

Exemple d'utilisation:
<div class="article-introduction">
    <p>Votre intro percutante...</p>
</div>

───────────────────────────────────────────────────────────────────────────
💡 CONSEILS DE RÉDACTION
───────────────────────────────────────────────────────────────────────────

1. Titre H1: Court, percutant, avec mot-clé principal
2. Introduction: Capter l'attention en 2-3 phrases
3. Sections: 3-5 sections H2 pour un article standard
4. Paragraphes: 3-5 lignes maximum par paragraphe
5. Listes: Utilisez-les pour améliorer la lisibilité
6. Conclusion: Résumé + appel à l'action
7. SEO: Incluez vos mots-clés naturellement dans le texte
8. Longueur: 800-2000 mots pour un bon référencement

───────────────────────────────────────────────────────────────────────────
🔧 DÉPANNAGE
───────────────────────────────────────────────────────────────────────────

❌ L'article ne s'affiche pas correctement?
   → Vérifiez que vous n'avez pas supprimé de balises importantes
   → Assurez-vous que toutes les balises sont bien fermées
   → Exemple: <p>...</p>, <div>...</div>

❌ Le style CSS ne fonctionne pas?
   → Ne modifiez pas la section <style> du template
   → Utilisez les classes CSS fournies

❌ Les caractères spéciaux s'affichent mal?
   → Vérifiez que l'encodage du fichier est UTF-8
   → Ne supprimez pas <meta charset="UTF-8">

───────────────────────────────────────────────────────────────────────────
📁 STRUCTURE DU DOSSIER /blog/
───────────────────────────────────────────────────────────────────────────

/blog/
  ├── _template-article.html      ← Modèle à copier (NE PAS modifier)
  ├── README.txt                  ← Ce fichier
  ├── articles-index.json         ← Index des articles générés
  ├── article-1.html              ← Articles générés automatiquement
  ├── article-2.html
  ├── ...
  └── votre-article.html          ← Vos articles manuels

───────────────────────────────────────────────────────────────────────────
📞 BESOIN D'AIDE?
───────────────────────────────────────────────────────────────────────────

Le fichier "_template-article.html" contient des commentaires détaillés
qui vous guident à chaque étape. Consultez-le pour des exemples concrets.

═══════════════════════════════════════════════════════════════════════════

Bonne rédaction! 🚀

═══════════════════════════════════════════════════════════════════════════`;

        await fs.writeFile(readmePath, readmeContent, 'utf8');
    }

    /**
     * Délai utilitaire
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ArticleGenerator;