/**
 * Système de Cache Intelligent
 * Économise les appels API en cachant les réponses
 * Utilise un système de hash pour identifier les prompts similaires
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class IntelligentCache {
    constructor(config = {}) {
        this.config = {
            enabled: config.enabled !== false,
            ttl: config.ttl || 7 * 24 * 60 * 60 * 1000, // 7 jours par défaut
            maxSize: config.maxSize || 100 * 1024 * 1024, // 100MB
            cleanupInterval: config.cleanupInterval || 60 * 60 * 1000, // 1 heure
            cacheDir: config.cacheDir || path.join(__dirname, '..', '.cache'),
            similarityThreshold: config.similarityThreshold || 0.85, // 85% de similarité
            ...config
        };

        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            saves: 0,
            totalSize: 0,
            apiCallsSaved: 0,
            estimatedCostSaved: 0 // en cents
        };

        this.initializeCache();
    }

    /**
     * Initialise le système de cache
     */
    async initializeCache() {
        try {
            // Créer le dossier cache s'il n'existe pas
            await fs.mkdir(this.config.cacheDir, { recursive: true });

            // Charger le cache existant
            await this.loadCacheFromDisk();

            // Démarrer le nettoyage automatique
            if (this.config.enabled) {
                this.startCleanupInterval();
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du cache:', error.message);
        }
    }

    /**
     * Génère un hash du prompt
     */
    generateHash(prompt, options = {}) {
        const normalizedPrompt = this.normalizePrompt(prompt);
        const data = JSON.stringify({ prompt: normalizedPrompt, ...options });
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Normalise un prompt (retire les espaces superflus, met en minuscule, etc.)
     */
    normalizePrompt(prompt) {
        return prompt
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Calcule la similarité entre deux prompts (Jaccard similarity)
     */
    calculateSimilarity(prompt1, prompt2) {
        const words1 = new Set(this.normalizePrompt(prompt1).split(/\s+/));
        const words2 = new Set(this.normalizePrompt(prompt2).split(/\s+/));

        const intersection = new Set([...words1].filter(w => words2.has(w)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
    }

    /**
     * Cherche dans le cache (exact ou similaire)
     */
    async get(prompt, options = {}) {
        if (!this.config.enabled) return null;

        const hash = this.generateHash(prompt, options);

        // 1. Chercher une correspondance exacte
        if (this.cache.has(hash)) {
            const entry = this.cache.get(hash);

            // Vérifier si l'entrée n'est pas expirée
            if (Date.now() - entry.timestamp < this.config.ttl) {
                this.stats.hits++;
                this.stats.apiCallsSaved++;
                this.stats.estimatedCostSaved += this.estimateCost(prompt);

                console.log(`  💾 Cache HIT (exact): ${hash.substring(0, 8)}...`);
                return entry.content;
            } else {
                // Supprimer l'entrée expirée
                this.cache.delete(hash);
            }
        }

        // 2. Chercher une correspondance similaire
        const similarEntry = await this.findSimilarEntry(prompt);
        if (similarEntry) {
            this.stats.hits++;
            this.stats.apiCallsSaved++;
            this.stats.estimatedCostSaved += this.estimateCost(prompt);

            console.log(`  💾 Cache HIT (similar ${(similarEntry.similarity * 100).toFixed(0)}%): ${similarEntry.hash.substring(0, 8)}...`);
            return similarEntry.content;
        }

        // 3. Cache miss
        this.stats.misses++;
        console.log(`  ❌ Cache MISS: ${hash.substring(0, 8)}...`);
        return null;
    }

    /**
     * Cherche une entrée similaire dans le cache
     */
    async findSimilarEntry(prompt) {
        const threshold = this.config.similarityThreshold;
        let bestMatch = null;
        let bestSimilarity = 0;

        for (const [hash, entry] of this.cache.entries()) {
            // Vérifier si l'entrée n'est pas expirée
            if (Date.now() - entry.timestamp >= this.config.ttl) {
                continue;
            }

            const similarity = this.calculateSimilarity(prompt, entry.originalPrompt);

            if (similarity >= threshold && similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = {
                    hash,
                    content: entry.content,
                    similarity
                };
            }
        }

        return bestMatch;
    }

    /**
     * Sauvegarde dans le cache
     */
    async set(prompt, content, options = {}) {
        if (!this.config.enabled) return false;

        const hash = this.generateHash(prompt, options);
        const size = Buffer.byteLength(content, 'utf8');

        // Vérifier si on dépasse la taille max
        if (this.stats.totalSize + size > this.config.maxSize) {
            await this.cleanup(size);
        }

        const entry = {
            hash,
            originalPrompt: prompt,
            content,
            options,
            timestamp: Date.now(),
            size,
            accessCount: 0
        };

        this.cache.set(hash, entry);
        this.stats.saves++;
        this.stats.totalSize += size;

        // Sauvegarder sur le disque
        await this.saveCacheEntryToDisk(hash, entry);

        console.log(`  💾 Cache SAVE: ${hash.substring(0, 8)}... (${(size / 1024).toFixed(2)} KB)`);
        return true;
    }

    /**
     * Nettoie le cache (supprime les entrées les moins utilisées)
     */
    async cleanup(requiredSpace = 0) {
        console.log('🧹 Nettoyage du cache...');

        // Trier les entrées par accessCount (LRU - Least Recently Used)
        const entries = Array.from(this.cache.entries())
            .sort((a, b) => a[1].accessCount - b[1].accessCount);

        let freedSpace = 0;
        let removed = 0;

        for (const [hash, entry] of entries) {
            if (freedSpace >= requiredSpace && this.stats.totalSize < this.config.maxSize * 0.8) {
                break;
            }

            this.cache.delete(hash);
            this.stats.totalSize -= entry.size;
            freedSpace += entry.size;
            removed++;

            // Supprimer du disque
            await this.deleteCacheEntryFromDisk(hash);
        }

        console.log(`  ✅ ${removed} entrées supprimées, ${(freedSpace / 1024 / 1024).toFixed(2)} MB libérés`);
    }

    /**
     * Sauvegarde une entrée sur le disque
     */
    async saveCacheEntryToDisk(hash, entry) {
        try {
            const filePath = path.join(this.config.cacheDir, `${hash}.json`);
            await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf8');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du cache:', error.message);
        }
    }

    /**
     * Supprime une entrée du disque
     */
    async deleteCacheEntryFromDisk(hash) {
        try {
            const filePath = path.join(this.config.cacheDir, `${hash}.json`);
            await fs.unlink(filePath);
        } catch (error) {
            // Fichier déjà supprimé ou n'existe pas
        }
    }

    /**
     * Charge le cache depuis le disque
     */
    async loadCacheFromDisk() {
        try {
            const files = await fs.readdir(this.config.cacheDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));

            console.log(`📦 Chargement de ${jsonFiles.length} entrées du cache...`);

            for (const file of jsonFiles) {
                try {
                    const filePath = path.join(this.config.cacheDir, file);
                    const data = await fs.readFile(filePath, 'utf8');
                    const entry = JSON.parse(data);

                    // Vérifier si l'entrée n'est pas expirée
                    if (Date.now() - entry.timestamp < this.config.ttl) {
                        this.cache.set(entry.hash, entry);
                        this.stats.totalSize += entry.size;
                    } else {
                        // Supprimer l'entrée expirée
                        await fs.unlink(filePath);
                    }
                } catch (error) {
                    console.error(`Erreur lors du chargement de ${file}:`, error.message);
                }
            }

            console.log(`  ✅ ${this.cache.size} entrées chargées (${(this.stats.totalSize / 1024 / 1024).toFixed(2)} MB)`);
        } catch (error) {
            console.error('Erreur lors du chargement du cache:', error.message);
        }
    }

    /**
     * Démarre le nettoyage automatique
     */
    startCleanupInterval() {
        this.cleanupTimer = setInterval(async () => {
            await this.cleanup();
        }, this.config.cleanupInterval);
    }

    /**
     * Arrête le nettoyage automatique
     */
    stopCleanupInterval() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
    }

    /**
     * Estime le coût d'un appel API (en cents)
     */
    estimateCost(prompt) {
        // Estimation: $0.002 par 1000 tokens
        // ~4 caractères = 1 token
        const tokens = Math.ceil(prompt.length / 4);
        return (tokens / 1000) * 0.2; // 0.2 cents par 1000 tokens
    }

    /**
     * Obtient les statistiques du cache
     */
    getStats() {
        const hitRate = this.stats.hits + this.stats.misses > 0
            ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100)
            : 0;

        return {
            ...this.stats,
            hitRate: Number(hitRate.toFixed(2)) + '%',
            cacheSize: this.cache.size,
            totalSizeMB: Number((this.stats.totalSize / 1024 / 1024).toFixed(2)),
            estimatedCostSaved$: Number((this.stats.estimatedCostSaved / 100).toFixed(4))
        };
    }

    /**
     * Vide complètement le cache
     */
    async clear() {
        console.log('🗑️  Vidage complet du cache...');

        // Vider la mémoire
        this.cache.clear();

        // Supprimer les fichiers sur disque
        try {
            const files = await fs.readdir(this.config.cacheDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));

            for (const file of jsonFiles) {
                const filePath = path.join(this.config.cacheDir, file);
                await fs.unlink(filePath);
            }

            console.log(`  ✅ ${jsonFiles.length} fichiers supprimés`);
        } catch (error) {
            console.error('Erreur lors du vidage du cache:', error.message);
        }

        // Réinitialiser les stats
        this.stats.totalSize = 0;

        console.log('  ✅ Cache vidé');
    }

    /**
     * Génère un rapport de cache
     */
    generateReport() {
        const stats = this.getStats();

        return `
═══════════════════════════════════════════════════════════════════
                    RAPPORT DU CACHE INTELLIGENT
═══════════════════════════════════════════════════════════════════

📊 STATISTIQUES:

  Requêtes totales:     ${stats.hits + stats.misses}
  Cache hits:           ${stats.hits} (${stats.hitRate})
  Cache misses:         ${stats.misses}
  Entrées sauvegardées: ${stats.saves}

💾 STOCKAGE:

  Entrées en cache:     ${stats.cacheSize}
  Taille totale:        ${stats.totalSizeMB} MB / ${(this.config.maxSize / 1024 / 1024).toFixed(0)} MB
  Utilisation:          ${((stats.totalSize / this.config.maxSize) * 100).toFixed(1)}%

💰 ÉCONOMIES:

  Appels API économisés:     ${stats.apiCallsSaved}
  Coût économisé (estimé):   $${stats.estimatedCostSaved$}

⚙️  CONFIGURATION:

  Activé:               ${this.config.enabled ? 'Oui' : 'Non'}
  TTL:                  ${(this.config.ttl / 1000 / 60 / 60 / 24).toFixed(0)} jours
  Seuil de similarité:  ${(this.config.similarityThreshold * 100).toFixed(0)}%
  Nettoyage auto:       Toutes les ${(this.config.cleanupInterval / 1000 / 60).toFixed(0)} minutes

═══════════════════════════════════════════════════════════════════
`;
    }

    /**
     * Désactive le cache
     */
    disable() {
        this.config.enabled = false;
        this.stopCleanupInterval();
        console.log('⚠️  Cache désactivé');
    }

    /**
     * Active le cache
     */
    enable() {
        this.config.enabled = true;
        this.startCleanupInterval();
        console.log('✅ Cache activé');
    }

    /**
     * Obtient des informations détaillées sur une entrée
     */
    getEntryInfo(hash) {
        if (!this.cache.has(hash)) {
            return null;
        }

        const entry = this.cache.get(hash);
        const age = Date.now() - entry.timestamp;
        const ttlRemaining = this.config.ttl - age;

        return {
            hash,
            age: Math.floor(age / 1000 / 60), // minutes
            ttlRemaining: Math.floor(ttlRemaining / 1000 / 60 / 60), // heures
            size: (entry.size / 1024).toFixed(2) + ' KB',
            accessCount: entry.accessCount,
            expired: ttlRemaining <= 0
        };
    }
}

module.exports = IntelligentCache;
