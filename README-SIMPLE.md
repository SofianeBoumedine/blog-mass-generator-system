# 🚀 Blog Mass Generator

Génère automatiquement des sites web complets avec blogs en utilisant l'IA Perplexity.

## ⚡ Installation Rapide

```bash
# 1. Cloner et installer
git clone https://github.com/your-repo/blog-mass-generator-system.git
cd blog-mass-generator-system
npm install

# 2. Test démo (sans API)
npm run demo

# 3. Configurer l'API (pour production)
echo "PERPLEXITY_API_KEY=votre-clé-api" > .env

# 4. Créer un fichier de mots-clés (optionnel)
echo "comment créer un site web
agence web paris
développement web" > keywords.txt
```

## 🎯 Utilisation

### Démo complète (sans API)
```bash
npm run demo                     # Démonstration complète
```

### Générer 1 site (avec API)
```bash
node generator-main.js monsite.com keywords.txt
```

### Générer plusieurs sites
```bash
node scripts/bulk-generate.js domains site1.com site2.fr --keywords keywords.txt
```

### Autres commandes
```bash
npm run validate keywords.txt    # Valider les mots-clés
npm run monitor                  # Voir les stats API
npm run cleanup                  # Nettoyer les sites générés
npm run health                   # Test API
```

## 📁 Ce qui est généré

Chaque site contient :
- **Pages principales** : Accueil, Services, À propos, Contact, Tarifs, FAQ
- **Blog complet** : Articles optimisés SEO + listing PHP
- **Design responsive** : 20+ frameworks CSS (Bootstrap, Tailwind, etc.)
- **Optimisation SEO** : Meta tags, Schema.org, Open Graph

## 🔧 Options

```bash
# Personnaliser la génération
node generator-main.js monsite.com keywords.txt \
  --max-articles 30 \
  --verbose \
  --output-dir mon-dossier
```

## 📊 Formats supportés

**Mots-clés** (`keywords.txt`) :
```txt
# Commentaires ignorés
comment créer un site web
agence web spécialisée
développement application mobile
```

**Configuration bulk** (`config.json`) :
```json
{
  "global": {
    "keywordsFile": "keywords.txt",
    "maxArticles": 20
  },
  "sites": [
    {"domain": "site1.com"},
    {"domain": "site2.fr", "maxArticles": 30}
  ]
}
```

## 🛠️ Résolution de problèmes

- **"Clé API manquante"** → Définir `PERPLEXITY_API_KEY`
- **"Fichier introuvable"** → Vérifier le chemin des mots-clés
- **Erreur de génération** → Ajouter `--verbose` pour plus d'infos

## 📈 Performance

- **Vitesse** : 1-2 minutes par site complet
- **Capacité** : 10-20 sites/heure (selon quota API)
- **Contenu** : Articles de 800-1500 mots optimisés SEO

## 🎨 Templates disponibles

20 designs différents :
- Classic (Hero, Cards, Split-screen)
- Modern (Minimal, Clean, Grid)
- Business (Corporate, Professional)
- Creative (Artistic, Agency)

---

**Support** : GitHub Issues | **License** : MIT