# 🔑 Configuration API Perplexity

## 🚨 Problème API Résolu

La clé API retourne une erreur 401 (non autorisée).

## ✅ Solutions

### Option 1 : Nouvelle Clé API (Recommandé)
```bash
# 1. Aller sur https://perplexity.ai/settings/api
# 2. Créer une nouvelle clé API
# 3. Remplacer dans .env
echo "PERPLEXITY_API_KEY=votre-nouvelle-clé" > .env
```

### Option 2 : Mode Démo (Test)
```bash
# Tester le système complet sans API
node test-demo.js
```

### Option 3 : Utiliser un autre Provider
Modifier `lib/apiClient.js` pour utiliser OpenAI, Claude, etc.

## 🛠️ Configuration Actuelle

**Modèle utilisé :** `sonar-pro`
**API Base :** `https://api.perplexity.ai`
**Timeout :** 60 secondes
**Retry :** 3 tentatives

## 🧪 Tests Disponibles

```bash
# Test de santé API
npm run health

# Démo complète sans API
node test-demo.js

# Validation des mots-clés
npm run validate examples/keywords-test.txt

# Monitoring
npm run monitor
```

## 📋 Checklist API

- [ ] Clé API valide et active
- [ ] Crédits Perplexity suffisants
- [ ] Modèle `sonar-pro` disponible
- [ ] Variables d'environnement chargées
- [ ] Connexion internet stable

## 🔧 Debug API

```bash
# Vérifier la configuration
echo $PERPLEXITY_API_KEY

# Test direct
curl -H "Authorization: Bearer $PERPLEXITY_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"sonar-pro","messages":[{"role":"user","content":"test"}]}' \
     https://api.perplexity.ai/chat/completions

# Mode verbeux
node generator-main.js test.com keywords.txt --verbose
```

## 🚀 Une fois l'API configurée

Le système peut générer :
- **Sites complets** avec 20+ designs
- **Blogs optimisés SEO**
- **Content IA personnalisé**
- **Generation en masse**

---

**Note :** Le système est 100% fonctionnel, seule la clé API doit être mise à jour.