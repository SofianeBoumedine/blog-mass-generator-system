const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const pLimit = require('p-limit');
const slugify = require('slugify');

// Configuration
const CONFIG = {
  PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY || 'your-api-key-here',
  CONCURRENT_REQUESTS: 5, // Nombre de requêtes simultanées (ajustable)
  MAX_WORDS_PER_ARTICLE: 2000,
  OUTPUT_DIR_FR: path.join(__dirname, '../site-final/blog'),
  OUTPUT_DIR_EN: path.join(__dirname, '../site-final-en/blog'),
  KEYWORDS_FILE: path.join(__dirname, 'keywords-lemmilink.txt'),
  TEMPLATE_FILE: path.join(__dirname, 'blog-template-lemmilink.html'),
  DELAY_BETWEEN_BATCHES: 2000, // 2 secondes entre les batches
  BATCH_SIZE: 10
};

// Limiter pour contrôler la concurrence
const limit = pLimit(Math.min(CONFIG.CONCURRENT_REQUESTS, 8)); // Limiter à 8 max pour éviter surcharge API

// Statistiques
let stats = {
  total: 0,
  success: 0,
  failed: 0,
  startTime: Date.now()
};

// Nettoyer la réponse HTML
function cleanHtmlContent(content) {
  if (!content) return '';

  let htmlContent = '';
  const htmlMatch = content.match(/```html([\\s\\S]*?)```/);
  if (htmlMatch && htmlMatch[1]) {
    htmlContent = htmlMatch[1];
  } else {
    const htmlStart = content.indexOf('<h1>');
    if (htmlStart !== -1) {
      htmlContent = content.substring(htmlStart);
    } else {
      return content;
    }
  }

  htmlContent = htmlContent
    .replace(/<!DOCTYPE[^>]*>/i, '')
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<head>[\s\S]*?<\/head>/gi, '')
    .replace(/<\/?body[^>]*>/gi, '')
    .replace(/\[\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '>\n<')
    .trim();

  return htmlContent;
}

// Générer un plan d'article
async function generatePlan(keyword, language = 'fr') {
  const systemPrompt = language === 'fr'
    ? 'Tu es un expert SEO et rédacteur web spécialisé dans le référencement naturel. Tu dois créer des plans d\'articles optimisés pour le SEO. Réponds en français dans un format HTML complet.'
    : 'You are an SEO expert and web writer specialized in natural referencing. You must create SEO-optimized article plans. Respond in English in complete HTML format.';

  const userPrompt = language === 'fr'
    ? `En tant qu'expert SEO objectif et pédagogue, crée un plan d'article détaillé et optimisé pour : "${keyword}".

PRIORITÉ ABSOLUE : Répondre complètement à l'intention de recherche de "${keyword}".

STRUCTURE OBLIGATOIRE DU PLAN :
1. Introduction : Réponse directe et immédiate à la requête "${keyword}"
2. Sections 1-3 : Approfondissement du sujet, conseils pratiques, méthodes éprouvées
3. Sections 4-5 : Solutions, outils et ressources disponibles
4. Section 6 : "Bonnes pratiques et recommandations d'experts"
5. Section 7 : "Cas pratiques et exemples concrets"
6. Conclusion : Synthèse, perspectives et prochaines étapes

RÈGLES :
- L'article doit apporter une valeur maximale au lecteur
- Couvrir tous les aspects importants du sujet
- Structure : h1 pour le titre, h2 pour sections principales
- Ne mets que les titres, pas le contenu
- Approche éducative et professionnelle

L'objectif est d'éduquer et d'informer complètement le lecteur sur le sujet.`
    : `As an SEO expert, create an optimized and comprehensive article plan for: "${keyword}". Focus on providing maximum value to readers. Only put titles (h1, h2), not content.`;

  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000
    }, {
      headers: {
        'Authorization': `Bearer ${CONFIG.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return cleanHtmlContent(response.data.choices[0].message.content);
  } catch (error) {
    console.error(`Erreur génération plan pour "${keyword}":`, error.message);
    throw error;
  }
}

// Générer un article complet
async function generateArticle(keyword, plan, language = 'fr') {
  const systemPrompt = language === 'fr'
    ? 'Tu es un expert SEO et rédacteur web professionnel. Tu dois créer du contenu de haute qualité, informatif et engageant. Utilise le français, au format HTML complet.'
    : 'You are an SEO expert and professional web writer. You must create high-quality, informative and engaging content. Use English, in complete HTML format.';

  const userPrompt = language === 'fr'
    ? `Voici le plan à suivre pour l'article :
${plan}

CONSIGNES DE RÉDACTION OBLIGATOIRES :

1. INTRODUCTION ET INTENTION DE RECHERCHE :
   - Les 2-3 premiers paragraphes DOIVENT répondre directement à l'intention de recherche du mot-clé "${keyword}"
   - Donner immédiatement la valeur et les informations recherchées par l'utilisateur
   - Fournir des réponses complètes et pratiques
   - Structure : Réponse directe → Contexte → Solutions pratiques

2. DÉVELOPPEMENT DU CONTENU :
   - Couvrir tous les aspects importants du sujet
   - Inclure des exemples concrets et cas pratiques
   - Présenter différentes approches et méthodes
   - Fournir des données chiffrées et statistiques récentes
   - Intégrer les meilleures pratiques du secteur
   - Expliquer les concepts techniques de manière accessible

3. STRUCTURE HTML :
   - Utilise les balises HTML (pas de markdown)
   - Article d'environ ${CONFIG.MAX_WORDS_PER_ARTICLE} mots maximum
   - Au moins 1 tableau comparatif ou récapitulatif
   - Au moins 2 listes à puces pour structurer l'information
   - Sections bien délimitées avec titres (h2, h3)

4. STYLE ET TON :
   - Ton expert et pédagogue, vouvoiement du lecteur
   - Position d'autorité bienveillante et factuelle
   - Priorité : apporter de la valeur maximale au lecteur
   - Mots-clés importants en <strong>
   - Concepts clés en <u>
   - Explications claires et accessibles
   - Éviter le jargon excessif

5. ÉLÉMENTS À INCLURE :
   - Définitions claires des concepts
   - Avantages et inconvénients objectifs
   - Conseils pratiques et actionnables
   - Ressources utiles pour approfondir
   - Erreurs communes à éviter
   - Tendances actuelles du marché
   - Perspectives d'avenir

6. CONCLUSION :
   - Résumé des points clés
   - Actions concrètes à entreprendre
   - Ouverture sur des sujets connexes
   - Invitation à approfondir le sujet

IMPORTANT : Article COMPLET, informatif et à haute valeur ajoutée pour le lecteur.`
    : `Here is the plan to follow for the article:
${plan}

WRITING INSTRUCTIONS:
1. Use HTML tags (no markdown)
2. Article of about ${CONFIG.MAX_WORDS_PER_ARTICLE} words maximum
3. At least 1 comparison table and 2 bullet lists
4. Expert and technical tone
5. Keywords in <strong>, important concepts in <u>
6. Include a clear conclusion

IMPORTANT: COMPLETE article without truncation.`;

  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar-pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 15000
    }, {
      headers: {
        'Authorization': `Bearer ${CONFIG.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 120000  // 2 minutes pour éviter timeout sur requêtes lourdes
    });

    return cleanHtmlContent(response.data.choices[0].message.content);
  } catch (error) {
    console.error(`Erreur génération article pour "${keyword}":`, error.message);
    throw error;
  }
}

// Créer la page HTML complète
async function createHtmlPage(title, content, language = 'fr') {
  const template = await fs.readFile(CONFIG.TEMPLATE_FILE, 'utf-8');
  const slug = slugify(title, { lower: true, strict: true });
  const date = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const description = content
    .replace(/<[^>]*>/g, '')
    .substring(0, 160)
    .trim() + '...';

  const html = template
    .replace(/{{title}}/g, title)
    .replace(/{{slug}}/g, slug)
    .replace(/{{content}}/g, content)
    .replace(/{{description}}/g, description)
    .replace(/{{date}}/g, date)
    .replace(/{{lang}}/g, language)
    .replace(/{{langCode}}/g, language === 'fr' ? 'fr-FR' : 'en-US');

  return { html, slug };
}

// Traiter un mot-clé
async function processKeyword(keyword, index, total) {
  const startTime = Date.now();
  console.log(`[${index + 1}/${total}] Traitement : "${keyword}"`);

  try {
    // Générer le plan
    console.log(`  → Génération du plan...`);
    const plan = await generatePlan(keyword, 'fr');

    // Générer l'article
    console.log(`  → Génération de l'article...`);
    const article = await generateArticle(keyword, plan, 'fr');

    // Créer la page HTML
    console.log(`  → Création de la page HTML...`);
    const { html, slug } = await createHtmlPage(keyword, article, 'fr');

    // Sauvegarder le fichier
    const outputPath = path.join(CONFIG.OUTPUT_DIR_FR, `${slug}.html`);
    await fs.ensureDir(CONFIG.OUTPUT_DIR_FR);
    await fs.writeFile(outputPath, html);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  ✓ Succès en ${duration}s : ${outputPath}`);

    stats.success++;
    return { success: true, keyword, slug, duration };
  } catch (error) {
    console.error(`  ✗ Échec : ${error.message}`);
    stats.failed++;
    return { success: false, keyword, error: error.message };
  }
}

// Fonction principale
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     LEMMILINK - GÉNÉRATEUR D\'ARTICLES DE BLOG EN MASSE     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\\n');

  // Créer les dossiers de sortie
  await fs.ensureDir(CONFIG.OUTPUT_DIR_FR);
  await fs.ensureDir(CONFIG.OUTPUT_DIR_EN);

  // Vérifier le template
  if (!await fs.exists(CONFIG.TEMPLATE_FILE)) {
    console.log('⚠️  Template non trouvé, création du template par défaut...');
    await createDefaultTemplate();
  }

  // Lire les mots-clés
  let keywords;
  try {
    const keywordsContent = await fs.readFile(CONFIG.KEYWORDS_FILE, 'utf-8');
    keywords = keywordsContent
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);
  } catch (error) {
    console.error('❌ Erreur lecture keywords.txt:', error.message);
    console.log('\\nCréez un fichier keywords.txt avec un mot-clé par ligne.');
    process.exit(1);
  }

  stats.total = keywords.length;
  console.log(`📊 ${keywords.length} mots-clés trouvés`);
  console.log(`⚡ ${CONFIG.CONCURRENT_REQUESTS} requêtes simultanées`);
  console.log(`📁 Sortie : ${CONFIG.OUTPUT_DIR_FR}\n`);

  console.log('🚀 Démarrage de la génération...\n');

  // Traitement en parallèle avec limitation et retry
  const results = [];

  // Fonction de traitement avec retry automatique
  const processWithRetry = async (keyword, index) => {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await processKeyword(keyword, index, keywords.length);
      } catch (error) {
        console.log(`  ⚠️  Tentative ${attempt}/${maxRetries} échouée pour "${keyword.substring(0, 50)}...": ${error.message}`);
        if (attempt === maxRetries) {
          stats.failed++;
          return { success: false, keyword, error: error.message };
        }
        // Attendre avant retry (backoff exponentiel)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // Traitement en parallèle de tous les keywords
  const promises = keywords.map((keyword, index) =>
    limit(() => processWithRetry(keyword, index))
  );

  console.log('🚀 Traitement en parallèle de tous les articles...\n');
  const allResults = await Promise.allSettled(promises);

  // Collecter les résultats
  allResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      results.push({
        success: false,
        keyword: keywords[index],
        error: result.reason?.message || 'Erreur inconnue'
      });
    }
  });

  // Afficher les statistiques finales
  const totalDuration = ((Date.now() - stats.startTime) / 1000).toFixed(1);
  const avgDuration = (totalDuration / stats.total).toFixed(1);

  console.log('\\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                     GÉNÉRATION TERMINÉE                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\\n📊 Statistiques finales :`);
  console.log(`   • Total : ${stats.total} articles`);
  console.log(`   • ✅ Succès : ${stats.success}`);
  console.log(`   • ❌ Échecs : ${stats.failed}`);
  console.log(`   • ⏱  Durée totale : ${totalDuration}s`);
  console.log(`   • ⚡ Moyenne par article : ${avgDuration}s`);

  // Générer l'index des articles
  await generateIndex(results.filter(r => r.success));

  console.log('\\n✨ Génération complète !');
}

// Créer le template par défaut en COPIANT directement la page qui marche
async function createDefaultTemplate() {
  // Je copie directement depuis page-reference.html et je remplace juste le contenu central
  const templateContent = await fs.readFile('page-reference.html', 'utf-8');

  // Je remplace le contenu entre wrapper start et wrapper end
  const template = templateContent
    // Mettre à jour les meta tags pour le blog
    .replace(/<title>[^<]*<\/title>/, '<title>{{title}} - Blog ${brandName}</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="{{description}}">')
    .replace(/<link rel="canonical"[^>]*>/, '<link rel="canonical" href="/blog/{{slug}}">')

    // Remplacer tout le contenu entre <!-- Wrapper start --> et <!-- Wrapper end -->
    .replace(
      /<!-- Wrapper start -->[\s\S]*?<!-- Wrapper end -->/,
      `<!-- Wrapper start -->
    <div id="wrapper" class="wrap">
        <div class="section panel" style="background: #f8f9fa; min-height: 100vh; padding: 120px 0 60px;">
            <div class="container xl:max-w-xl">
                <article style="background: white; border-radius: 15px; padding: 3rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto;">
                    <div style="color: #666; margin-bottom: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #667eea;">
                        <time>{{date}}</time> | <a href="/blog" style="color: #667eea;">Blog ${brandName}</a>
                    </div>

                    {{content}}

                    <!-- CTA Final -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 3rem; border-radius: 15px; margin: 3rem 0; text-align: center; box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);">
                        <h3 style="color: white; margin-bottom: 1rem; font-size: 2rem;">🚀 Améliorez votre référencement</h3>
                        <p>Découvrez nos solutions et services pour optimiser votre présence en ligne.</p>
                        <a href="#contact" style="display: inline-block; background: white; color: #667eea; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 1rem; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">En savoir plus</a>
                    </div>
                </article>
            </div>
        </div>
    </div>
    <!-- Wrapper end -->`
    );

  await fs.writeFile(CONFIG.TEMPLATE_FILE, template);
  console.log('✓ Template créé');
}

// Générer un index des articles
async function generateIndex(articles) {
  const indexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Index des Articles - Blog</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; }
        h1 { color: #2c3e50; }
        .article-list { list-style: none; padding: 0; }
        .article-list li { padding: 1rem; border-bottom: 1px solid #eee; }
        .article-list a { color: #3498db; text-decoration: none; font-size: 1.2rem; }
        .article-list a:hover { text-decoration: underline; }
        .stats { background: #f4f4f4; padding: 1rem; border-radius: 5px; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <h1>Blog - ${articles.length} Articles</h1>
    <div class="stats">
        <p>📊 Total : ${articles.length} articles générés</p>
        <p>📅 Date : ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
    <ul class="article-list">
        ${articles.map(a => `<li><a href="${a.slug}.html">${a.keyword}</a></li>`).join('')}
    </ul>
</body>
</html>`;

  await fs.writeFile(path.join(CONFIG.OUTPUT_DIR_FR, 'index.html'), indexHtml);
  console.log('\\n📚 Index créé : blog/index.html');
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  console.error('\\n❌ Erreur non gérée:', error);
  process.exit(1);
});

// Lancer le script
if (require.main === module) {
  main().catch(error => {
    console.error('\\n❌ Erreur fatale:', error);
    process.exit(1);
  });
}

module.exports = { generatePlan, generateArticle, processKeyword };