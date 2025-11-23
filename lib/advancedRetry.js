/**
 * Système de Retry Avancé avec Exponential Backoff
 * Gère les timeouts, retries intelligents et circuit breaker
 */

class AdvancedRetrySystem {
    constructor(config = {}) {
        this.config = {
            maxRetries: config.maxRetries || 5,
            initialDelay: config.initialDelay || 1000, // 1 seconde
            maxDelay: config.maxDelay || 60000, // 60 secondes
            backoffMultiplier: config.backoffMultiplier || 2,
            timeout: config.timeout || 120000, // 120 secondes (2 minutes)
            jitter: config.jitter !== false, // Ajouter du jitter par défaut
            circuitBreakerThreshold: config.circuitBreakerThreshold || 5,
            circuitBreakerTimeout: config.circuitBreakerTimeout || 60000,
            ...config
        };

        this.stats = {
            totalAttempts: 0,
            successCount: 0,
            failureCount: 0,
            retriesCount: 0,
            timeoutCount: 0,
            circuitBreakerTrips: 0,
            averageAttempts: 0,
            totalTime: 0
        };

        // Circuit breaker state
        this.circuitBreaker = {
            state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
            failures: 0,
            lastFailureTime: null,
            successesInHalfOpen: 0
        };

        this.activeRequests = new Map();
    }

    /**
     * Exécute une fonction avec retry automatique
     */
    async execute(fn, context = {}) {
        const requestId = this.generateRequestId();
        const startTime = Date.now();

        this.activeRequests.set(requestId, {
            startTime,
            context,
            attempts: 0
        });

        try {
            // Vérifier le circuit breaker
            if (this.circuitBreaker.state === 'OPEN') {
                if (Date.now() - this.circuitBreaker.lastFailureTime > this.config.circuitBreakerTimeout) {
                    this.circuitBreaker.state = 'HALF_OPEN';
                    this.circuitBreaker.successesInHalfOpen = 0;
                    console.log('  🔄 Circuit breaker: HALF_OPEN (test)');
                } else {
                    throw new Error('Circuit breaker is OPEN - trop d\'échecs récents');
                }
            }

            const result = await this.executeWithRetry(fn, context, requestId);

            // Succès
            this.stats.successCount++;
            this.handleCircuitBreakerSuccess();

            const duration = Date.now() - startTime;
            this.stats.totalTime += duration;

            return result;

        } catch (error) {
            this.stats.failureCount++;
            this.handleCircuitBreakerFailure();

            throw error;

        } finally {
            this.activeRequests.delete(requestId);

            // Mettre à jour les moyennes
            const totalRequests = this.stats.successCount + this.stats.failureCount;
            if (totalRequests > 0) {
                this.stats.averageAttempts = this.stats.totalAttempts / totalRequests;
            }
        }
    }

    /**
     * Exécute avec retry et exponential backoff
     */
    async executeWithRetry(fn, context, requestId) {
        let lastError;
        let attempt = 0;

        while (attempt < this.config.maxRetries) {
            attempt++;
            this.stats.totalAttempts++;

            const requestInfo = this.activeRequests.get(requestId);
            if (requestInfo) {
                requestInfo.attempts = attempt;
            }

            try {
                if (attempt > 1) {
                    console.log(`  🔄 Tentative ${attempt}/${this.config.maxRetries}...`);
                }

                // Exécuter avec timeout
                const result = await this.executeWithTimeout(fn, context);

                // Succès
                if (attempt > 1) {
                    this.stats.retriesCount++;
                    console.log(`  ✅ Succès après ${attempt} tentatives`);
                }

                return result;

            } catch (error) {
                lastError = error;

                // Logger l'erreur
                if (attempt === 1) {
                    console.log(`  ❌ Échec: ${error.message}`);
                } else {
                    console.log(`  ❌ Tentative ${attempt} échouée: ${error.message}`);
                }

                // Vérifier si c'est un timeout
                if (error.message && error.message.includes('Timeout')) {
                    this.stats.timeoutCount++;
                }

                // Vérifier si on doit retry
                if (!this.shouldRetry(error, attempt)) {
                    console.log(`  ⛔ Abandon après ${attempt} tentatives`);
                    throw error;
                }

                // Attendre avant le prochain retry (exponential backoff)
                if (attempt < this.config.maxRetries) {
                    const delay = this.calculateBackoff(attempt);
                    console.log(`  ⏳ Attente ${delay}ms avant retry...`);
                    await this.sleep(delay);
                }
            }
        }

        // Toutes les tentatives ont échoué
        console.log(`  ⛔ Échec définitif après ${this.config.maxRetries} tentatives`);
        throw lastError;
    }

    /**
     * Exécute une fonction avec timeout
     */
    async executeWithTimeout(fn, context) {
        return Promise.race([
            fn(context),
            this.createTimeoutPromise(this.config.timeout)
        ]);
    }

    /**
     * Crée une promise de timeout
     */
    createTimeoutPromise(timeout) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout après ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * Calcule le délai de backoff (exponential backoff with jitter)
     */
    calculateBackoff(attempt) {
        // Exponential backoff: delay = initialDelay * (multiplier ^ (attempt - 1))
        let delay = this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1);

        // Limiter au maxDelay
        delay = Math.min(delay, this.config.maxDelay);

        // Ajouter du jitter (randomisation) pour éviter les thundering herds
        if (this.config.jitter) {
            const jitterRange = delay * 0.3; // 30% de jitter
            const jitter = Math.random() * jitterRange;
            delay = delay + jitter;
        }

        return Math.floor(delay);
    }

    /**
     * Détermine si on doit retry
     */
    shouldRetry(error, attempt) {
        // Ne pas retry si on a atteint le max
        if (attempt >= this.config.maxRetries) {
            return false;
        }

        // Toujours retry les timeouts
        if (error.message && error.message.includes('Timeout')) {
            return true;
        }

        // Retry les erreurs réseau
        if (error.code === 'ECONNREFUSED' ||
            error.code === 'ENOTFOUND' ||
            error.code === 'ETIMEDOUT' ||
            error.code === 'ECONNRESET') {
            return true;
        }

        // Retry les erreurs HTTP 5xx et 429 (rate limit)
        if (error.statusCode >= 500 || error.statusCode === 429) {
            return true;
        }

        // Ne pas retry les erreurs 4xx (client errors)
        if (error.statusCode >= 400 && error.statusCode < 500) {
            return false;
        }

        // Par défaut, retry
        return true;
    }

    /**
     * Gère le succès pour le circuit breaker
     */
    handleCircuitBreakerSuccess() {
        if (this.circuitBreaker.state === 'HALF_OPEN') {
            this.circuitBreaker.successesInHalfOpen++;

            // Si 3 succès consécutifs en HALF_OPEN, fermer le circuit
            if (this.circuitBreaker.successesInHalfOpen >= 3) {
                this.circuitBreaker.state = 'CLOSED';
                this.circuitBreaker.failures = 0;
                console.log('  ✅ Circuit breaker: CLOSED (récupéré)');
            }
        } else if (this.circuitBreaker.state === 'CLOSED') {
            // Réduire le compteur d'échecs progressivement
            if (this.circuitBreaker.failures > 0) {
                this.circuitBreaker.failures--;
            }
        }
    }

    /**
     * Gère l'échec pour le circuit breaker
     */
    handleCircuitBreakerFailure() {
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailureTime = Date.now();

        if (this.circuitBreaker.state === 'HALF_OPEN') {
            // Échec en HALF_OPEN, rouvrir immédiatement
            this.circuitBreaker.state = 'OPEN';
            this.stats.circuitBreakerTrips++;
            console.log('  ⚠️  Circuit breaker: OPEN (échec en test)');

        } else if (this.circuitBreaker.failures >= this.config.circuitBreakerThreshold) {
            // Trop d'échecs, ouvrir le circuit
            this.circuitBreaker.state = 'OPEN';
            this.stats.circuitBreakerTrips++;
            console.log(`  ⚠️  Circuit breaker: OPEN (${this.circuitBreaker.failures} échecs)` );
        }
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Génère un ID unique pour une requête
     */
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Obtient les statistiques
     */
    getStats() {
        const totalRequests = this.stats.successCount + this.stats.failureCount;
        const successRate = totalRequests > 0
            ? (this.stats.successCount / totalRequests * 100).toFixed(1)
            : 0;

        return {
            ...this.stats,
            totalRequests,
            successRate: successRate + '%',
            averageTime: totalRequests > 0
                ? Math.round(this.stats.totalTime / totalRequests)
                : 0,
            circuitBreakerState: this.circuitBreaker.state,
            activeRequests: this.activeRequests.size
        };
    }

    /**
     * Génère un rapport
     */
    generateReport() {
        const stats = this.getStats();

        return `
═══════════════════════════════════════════════════════════════════
                    ADVANCED RETRY SYSTEM - RAPPORT
═══════════════════════════════════════════════════════════════════

📊 STATISTIQUES GLOBALES:

  Requêtes totales:        ${stats.totalRequests}
  Succès:                  ${stats.successCount} (${stats.successRate})
  Échecs:                  ${stats.failureCount}
  Temps moyen:             ${stats.averageTime}ms

📈 RETRIES:

  Tentatives totales:      ${stats.totalAttempts}
  Retries effectués:       ${stats.retriesCount}
  Tentatives moyennes:     ${stats.averageAttempts.toFixed(2)}
  Timeouts:                ${stats.timeoutCount}

🔌 CIRCUIT BREAKER:

  État actuel:             ${stats.circuitBreakerState}
  Ouvertures totales:      ${stats.circuitBreakerTrips}
  Échecs actuels:          ${this.circuitBreaker.failures}
  Seuil:                   ${this.config.circuitBreakerThreshold}

⚙️  CONFIGURATION:

  Max retries:             ${this.config.maxRetries}
  Timeout:                 ${this.config.timeout}ms
  Initial delay:           ${this.config.initialDelay}ms
  Max delay:               ${this.config.maxDelay}ms
  Backoff multiplier:      ${this.config.backoffMultiplier}x
  Jitter:                  ${this.config.jitter ? 'Activé' : 'Désactivé'}

⏱️  REQUÊTES ACTIVES:

  En cours:                ${stats.activeRequests}

═══════════════════════════════════════════════════════════════════
`;
    }

    /**
     * Réinitialise les stats
     */
    resetStats() {
        this.stats = {
            totalAttempts: 0,
            successCount: 0,
            failureCount: 0,
            retriesCount: 0,
            timeoutCount: 0,
            circuitBreakerTrips: 0,
            averageAttempts: 0,
            totalTime: 0
        };
    }

    /**
     * Réinitialise le circuit breaker
     */
    resetCircuitBreaker() {
        this.circuitBreaker = {
            state: 'CLOSED',
            failures: 0,
            lastFailureTime: null,
            successesInHalfOpen: 0
        };
        console.log('  ✅ Circuit breaker réinitialisé');
    }

    /**
     * Force la fermeture du circuit breaker
     */
    forceCloseCircuitBreaker() {
        this.circuitBreaker.state = 'CLOSED';
        this.circuitBreaker.failures = 0;
        console.log('  ✅ Circuit breaker forcé à CLOSED');
    }
}

module.exports = AdvancedRetrySystem;
