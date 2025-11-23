# 🚀 Génération Massive de Sites Web

Système optimisé pour générer **10 à 100 sites web en parallèle** à partir de fichiers de mots-clés.

## 🎯 Vue d'ensemble

Le système peut traiter simultanément plusieurs fichiers de mots-clés et générer automatiquement:
- **10-100 sites web complets** en parallèle
- **Domaines automatiques** basés sur les mots-clés
- **Layouts adaptatifs** selon la thématique
- **Articles de blog** pertinents
- **Rapports de performance** détaillés

## ⚡ Modes de Performance

| Mode | Concurrence | Délai | Usage recommandé |
|------|-------------|-------|------------------|
| **Standard** | 10 sites | 2000ms | Usage normal (1-25 sites) |
| **Turbo** | 25 sites | 1000ms | Génération rapide (25-50 sites) |
| **Extrême** | 50 sites | 500ms | Masse importante (50-100 sites) ⚠️ |

## 🏗️ Configuration Rapide

### 1. Préparer l'environnement
```bash
# Configuration automatique
node scripts/setup-mass-generation.js
```

### 2. Préparer vos fichiers de mots-clés
```
keywords/
├── chatons.txt
├── cuisine-francaise.txt
├── technologie-2024.txt
├── fitness-sport.txt
└── ... (tous vos fichiers .txt)
```

**Format des fichiers :**
```
# chatons.txt
chatons mignons
chat domestique
soins félins
jouets pour chat
alimentation chaton
```

### 3. Lancer la génération massive

```bash
# Mode standard (10 sites parallèles)
node scripts/mass-generator.js

# Mode turbo (25 sites parallèles)
node scripts/mass-generator.js --turbo

# Mode extrême (50 sites parallèles)
node scripts/mass-generator.js --extreme

# Configuration personnalisée pour 100 fichiers
node scripts/mass-generator.js --concurrency 30 --delay 1000
```

## 📋 Commandes Disponibles

### Configuration
```bash
# Setup automatique
node scripts/setup-mass-generation.js

# Configuration optimisée pour N sites
node scripts/setup-mass-generation.js config 50
```

### Génération Standard (legacy)
```bash
# Génération par configuration JSON
node scripts/bulk-generate.js config sites.json

# Génération par liste de domaines
node scripts/bulk-generate.js domains site1.com site2.com --keywords keywords.txt
```

### Génération Massive (nouveau)
```bash
# Découverte automatique des fichiers keywords
node scripts/mass-generator.js --keywords-dir ./mes-keywords

# Options avancées
node scripts/mass-generator.js \
  --concurrency 20 \
  --delay 1500 \
  --max-articles 30 \
  --keywords-dir ./keywords \
  --output-dir ./sites-generes
```

## ⚙️ Options de Performance

| Option | Description | Défaut | Recommandé |
|--------|-------------|---------|------------|
| `--concurrency` | Sites en parallèle | 10 | 10-25 (normal), 30-50 (puissant) |
| `--delay` | Délai entre lots (ms) | 2000 | 1000-3000 |
| `--max-articles` | Articles par site | 30 | 20-50 |
| `--keywords-dir` | Dossier des keywords | ./keywords | Votre dossier |
| `--output-dir` | Dossier de sortie | ./output | Votre choix |

## 📊 Exemples de Performance

### Scénario 1: 10 sites web
```bash
node scripts/mass-generator.js --concurrency 10
# ⏱️ Temps estimé: 15-25 minutes
# 🚀 Vitesse: ~0.5 site/minute
```

### Scénario 2: 50 sites web
```bash
node scripts/mass-generator.js --turbo
# ⏱️ Temps estimé: 45-60 minutes
# 🚀 Vitesse: ~1 site/minute
```

### Scénario 3: 100 sites web
```bash
node scripts/mass-generator.js --extreme
# ⏱️ Temps estimé: 90-120 minutes
# 🚀 Vitesse: ~1.2 site/minute
```

## 🎯 Optimisations selon le nombre de sites

| Nombre de sites | Concurrence | Délai | Commande |
|-----------------|-------------|-------|----------|
| 1-10 | 5 | 3000ms | `--concurrency 5 --delay 3000` |
| 10-25 | 10 | 2000ms | Mode standard (défaut) |
| 25-50 | 20 | 1500ms | `--concurrency 20 --delay 1500` |
| 50-100 | 30 | 1000ms | `--concurrency 30 --delay 1000` |
| 100+ | 50 | 500ms | `--extreme` ⚠️ |

## 📂 Structure des Résultats

```
output/
├── chatons-mignons.com/
│   ├── index.html
│   ├── services.html
│   ├── blog.php
│   └── blog/
├── cuisine-francaise-traditionnelle.com/
│   ├── index.html
│   └── ...
└── mass-generation-report-2024-01-01.json
```

## 📊 Rapport de Performance

Le système génère automatiquement un rapport JSON avec:
- **Statistiques globales** (succès, échecs, durée)
- **Performance par site** (temps de génération)
- **Métriques de vitesse** (sites/minute)
- **Configuration utilisée**

```json
{
  "stats": {
    "total_sites": 50,
    "successful": 48,
    "failed": 2,
    "sites_per_minute": 1.2,
    "average_duration_per_site": 45000
  },
  "performance": {
    "concurrency": 25,
    "batches": 2,
    "delay_between_batches": 1000
  }
}
```

## ⚠️ Bonnes Pratiques

### Performance
- **Commencez petit**: Testez avec 5-10 sites d'abord
- **Surveillez les ressources**: CPU, mémoire, réseau
- **Ajustez la concurrence**: Selon votre machine et API

### Fichiers de mots-clés
- **5-15 mots-clés par fichier** (optimal)
- **Mots-clés spécifiques** pour de meilleurs résultats
- **Noms de fichiers descriptifs** (ex: `cuisine-italienne.txt`)

### Limitations
- **API Rate Limits**: Respectez les limites Perplexity
- **Espace disque**: ~50-100MB par site généré
- **Mémoire**: ~100-200MB par site en parallèle

## 🚨 Dépannage

### Erreurs communes
```bash
# Trop de sites en parallèle
Error: API rate limit exceeded
→ Réduire --concurrency ou augmenter --delay

# Fichiers keywords vides
Error: No keywords found
→ Vérifier le format des fichiers .txt

# Manque d'espace disque
Error: ENOSPC
→ Libérer de l'espace ou changer --output-dir
```

### Monitoring
```bash
# Surveiller l'utilisation CPU/mémoire
top -p $(pgrep -f mass-generator)

# Vérifier l'espace disque
df -h ./output/
```

## 🎉 Exemple Complet

```bash
# 1. Configuration
node scripts/setup-mass-generation.js

# 2. Ajouter vos fichiers keywords dans ./keywords/

# 3. Génération optimisée pour 25 sites
node scripts/mass-generator.js --turbo

# 4. Résultats dans ./output/ + rapport JSON
```

---

**🚀 Prêt à générer massivement ? Commencez par `node scripts/setup-mass-generation.js` !**