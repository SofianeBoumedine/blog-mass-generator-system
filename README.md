# 🚀 Blog Mass Generator System

Un système complet de génération en masse de sites web avec blogs intégrés, alimenté par l'IA Perplexity.

> **📖 Version Simple :** Voir [README-SIMPLE.md](README-SIMPLE.md) pour un guide d'utilisation rapide

## ✨ Fonctionnalités

- **Génération automatique de sites complets** avec pages principales et blogs
- **20+ frameworks CSS** supportés (Bootstrap, Tailwind, Bulma, etc.)
- **20+ layouts différents** pour une variété maximale
- **Analyse thématique automatique** basée sur les mots-clés
- **Génération de contenu IA** via l'API Perplexity
- **SEO optimisé** avec meta tags et schema.org
- **Système de templates modulaires**
- **Génération en masse** avec gestion de la concurrence
- **Monitoring et statistiques** d'utilisation API
- **Scripts utilitaires** pour la maintenance

## 🏗️ Architecture

```
blog-mass-generator-system/
├── generator-main.js          # Point d'entrée principal
├── lib/                       # Modules principaux
│   ├── apiClient.js          # Client API Perplexity
│   ├── themeAnalyzer.js      # Analyse thématique
│   ├── contentGenerator.js   # Génération de contenu
│   ├── siteBuilder.js        # Construction de sites
│   ├── templateEngine.js     # Moteur de templates
│   └── articleGenerator.js   # Génération d'articles
├── templates/                 # Templates et composants
│   ├── layouts/              # 20 layouts HTML
│   ├── components/           # Composants réutilisables
│   └── pages/               # Templates de pages spécialisées
├── scripts/                  # Scripts utilitaires
│   ├── cleanup.js           # Nettoyage automatique
│   ├── monitor.js           # Monitoring API
│   ├── validate-keywords.js # Validation des mots-clés
│   └── bulk-generate.js     # Génération en lot
└── examples/                # Fichiers d'exemple
```

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/your-username/blog-mass-generator-system.git
cd blog-mass-generator-system
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'API Perplexity**
```bash
export PERPLEXITY_API_KEY="votre-clé-api"
# ou créer un fichier .env
echo "PERPLEXITY_API_KEY=votre-clé-api" > .env
```

## 🚀 Utilisation

### Génération Simple

```bash
# Générer un site basique
node generator-main.js monsite.com keywords.txt

# Avec options
node generator-main.js monsite.com keywords.txt --max-articles 30 --verbose
```

### Génération en Lot

```bash
# À partir d'un fichier de configuration
node scripts/bulk-generate.js config examples/bulk-config-example.json

# Pour plusieurs domaines
node scripts/bulk-generate.js domains site1.com site2.fr site3.org --keywords keywords.txt
```

### Scripts NPM

```bash
npm run generate       # Génération simple
npm run bulk          # Génération en lot
npm run monitor       # Monitoring API
npm run cleanup       # Nettoyage
npm run validate      # Validation des mots-clés
npm run health        # Test de santé API
npm run example       # Exemple complet
```

## 📝 Format des Mots-clés

Créez un fichier texte avec un mot-clé par ligne :

```txt
# Commentaires ignorés
comment améliorer son référencement
qu'est-ce que le marketing digital
création de site web
agence marketing paris
```

## 🎨 Templates et Layouts

Le système propose **20 layouts différents** :

- **Classic** : Hero, Split-screen, Cards, Feature-focused
- **Modern** : Minimal, Clean, Grid, Magazine
- **Creative** : Artistic, Portfolio, Agency, Startup
- **Business** : Corporate, Professional, Services, Pricing
- **Specialty** : Brutalist, Retro, Cyberpunk, Glassmorphism

## ⚙️ Configuration

### Variables d'Environnement

- `PERPLEXITY_API_KEY` : Clé API Perplexity (obligatoire)

### Options en Ligne de Commande

- `--max-articles N` : Nombre maximum d'articles (défaut: 50)
- `--verbose` : Mode verbeux
- `--output-dir DIR` : Dossier de sortie personnalisé
- `--api-key KEY` : Clé API en ligne de commande

### Configuration Bulk

```json
{
  "global": {
    "keywordsFile": "keywords.txt",
    "apiKey": "${PERPLEXITY_API_KEY}",
    "maxArticles": 20
  },
  "sites": [
    {
      "domain": "monsite.com",
      "maxArticles": 30,
      "outputDir": "custom-output"
    }
  ]
}
```

## 📊 Monitoring

### Statistiques API

```bash
# Voir les statistiques du jour
npm run monitor

# Voir les statistiques totales
node scripts/monitor.js stats --period total

# Voir les alertes
node scripts/monitor.js alerts

# Tester la santé de l'API
npm run health
```

### Limites et Alertes

Le système surveille automatiquement :
- Limites quotidiennes/horaires de requêtes
- Coûts d'utilisation
- Taux d'erreur
- Temps de réponse

## 🧹 Maintenance

### Nettoyage Automatique

```bash
# Nettoyer les sites générés
npm run cleanup

# Simulation (dry-run)
node scripts/cleanup.js --dry-run

# Nettoyer les fichiers temporaires
node scripts/cleanup.js temp

# Archiver puis nettoyer
node scripts/cleanup.js archive
```

### Validation des Mots-clés

```bash
# Valider un fichier
node scripts/validate-keywords.js keywords.txt

# Valider et corriger
node scripts/validate-keywords.js keywords.txt --fix

# Valider plusieurs fichiers
node scripts/validate-keywords.js "*.txt" --multiple
```

## 🎯 Exemples d'Utilisation

### Cas d'Usage Typiques

1. **Agence Web** : Génération rapide de sites clients
2. **Affiliate Marketing** : Création de sites de niche en masse
3. **SEO Testing** : Tests A/B de différents designs
4. **Content Marketing** : Génération de blogs thématiques
5. **Prototypage** : Création rapide de maquettes

### Workflow Recommandé

1. **Préparation** : Validation des mots-clés
2. **Test** : Génération d'un site exemple
3. **Monitoring** : Surveillance de l'API
4. **Production** : Génération en lot
5. **Maintenance** : Nettoyage régulier

## 🔍 Résolution de Problèmes

### Erreurs Communes

- **Clé API manquante** : Vérifiez `PERPLEXITY_API_KEY`
- **Fichier introuvable** : Vérifiez le chemin des mots-clés
- **Quota dépassé** : Consultez `npm run monitor`
- **Erreur de génération** : Utilisez `--verbose` pour plus d'infos

### Debug

```bash
# Mode verbeux
node generator-main.js monsite.com keywords.txt --verbose

# Test de santé
npm run health

# Vérification des statistiques
npm run monitor
```

## 📈 Performance

### Optimisations

- **Concurrence contrôlée** : 3 requêtes simultanées par défaut
- **Cache intelligent** : Réutilisation des templates
- **Retry automatique** : Gestion des erreurs réseau
- **Limitation de débit** : Respect des limites API

### Métriques

- **Vitesse** : ~1-2 minutes par site complet
- **Throughput** : 10-20 sites/heure selon les limites API
- **Qualité** : Contenu optimisé SEO automatiquement

## 🛠️ Développement

### Structure du Code

- **Modulaire** : Chaque composant est indépendant
- **Extensible** : Ajout facile de nouveaux templates
- **Configurable** : Paramètres ajustables
- **Testable** : Architecture claire et documentée

### Ajouter un Template

1. Créer le fichier HTML dans `templates/layouts/`
2. Ajouter les placeholders nécessaires
3. Optionnel : Ajouter le framework CSS correspondant

### Ajouter un Framework CSS

1. Référencer l'URL CDN dans `templateEngine.js`
2. Tester la compatibilité avec les layouts existants

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir CONTRIBUTING.md pour les guidelines.

## 📞 Support

- **Issues** : GitHub Issues
- **Documentation** : Ce README
- **Examples** : Dossier `examples/`

---

**⚡ Blog Mass Generator System** - Générez des centaines de sites optimisés en quelques clics !