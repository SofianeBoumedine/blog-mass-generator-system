const https = require('https');
const { URL } = require('url');
require('dotenv').config();

class ApiClient {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.PERPLEXITY_API_KEY;
        this.baseUrl = config.baseUrl || 'https://api.perplexity.ai';
        this.model = config.model || 'sonar-pro';
        this.timeout = config.timeout || 60000; // 60 secondes
        this.retryAttempts = config.retryAttempts || 3;
        this.retryDelay = config.retryDelay || 2000; // 2 secondes

        // Statistiques
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            totalTokens: 0,
            averageResponseTime: 0
        };
    }

    /**
     * Génère du contenu via l'API Perplexity
     */
    async generateContent(prompt, options = {}) {
        const startTime = Date.now();
        this.stats.totalRequests++;

        const requestOptions = {
            model: options.model || this.model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: options.maxTokens || 4000,
            temperature: options.temperature || 0.7,
            top_p: options.topP || 0.9,
            stream: false
        };

        try {
            const response = await this.makeRequest('/chat/completions', requestOptions);

            if (response.choices && response.choices.length > 0) {
                const content = response.choices[0].message.content;

                // Mettre à jour les statistiques
                this.stats.successfulRequests++;
                if (response.usage) {
                    this.stats.totalTokens += response.usage.total_tokens || 0;
                }

                const responseTime = Date.now() - startTime;
                this.updateAverageResponseTime(responseTime);

                return content;
            } else {
                throw new Error('Réponse API invalide: aucun contenu généré');
            }
        } catch (error) {
            this.stats.failedRequests++;
            console.error('Erreur lors de la génération de contenu:', error.message);
            throw error;
        }
    }

    /**
     * Effectue une requête HTTP vers l'API
     */
    async makeRequest(endpoint, data, attempt = 1) {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                return reject(new Error('Clé API Perplexity manquante. Définissez PERPLEXITY_API_KEY dans les variables d\'environnement.'));
            }

            const url = new URL(endpoint, this.baseUrl);
            const postData = JSON.stringify(data);

            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'BlogMassGenerator/1.0'
                },
                timeout: this.timeout
            };

            const req = https.request(options, (res) => {
                let body = '';

                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            const response = JSON.parse(body);
                            resolve(response);
                        } else {
                            let errorMessage = `Erreur HTTP ${res.statusCode}`;
                            try {
                                const errorData = JSON.parse(body);
                                errorMessage = errorData.error?.message || errorMessage;
                            } catch (e) {
                                // Impossible de parser l'erreur JSON
                            }
                            reject(new Error(errorMessage));
                        }
                    } catch (parseError) {
                        reject(new Error(`Erreur de parsing JSON: ${parseError.message}`));
                    }
                });
            });

            req.on('error', async (error) => {
                // Retry logic
                if (attempt < this.retryAttempts) {
                    console.log(`Tentative ${attempt} échouée, retry dans ${this.retryDelay}ms...`);
                    await this.delay(this.retryDelay);
                    try {
                        const result = await this.makeRequest(endpoint, data, attempt + 1);
                        resolve(result);
                    } catch (retryError) {
                        reject(retryError);
                    }
                } else {
                    reject(new Error(`Erreur réseau après ${this.retryAttempts} tentatives: ${error.message}`));
                }
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Timeout après ${this.timeout}ms`));
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * Génère plusieurs contenus en parallèle avec limitation de concurrence
     */
    async generateMultipleContent(prompts, options = {}) {
        const concurrencyLimit = options.concurrency || 3;
        const results = [];
        const errors = [];

        // Diviser les prompts en batches
        for (let i = 0; i < prompts.length; i += concurrencyLimit) {
            const batch = prompts.slice(i, i + concurrencyLimit);

            const batchPromises = batch.map(async (prompt, index) => {
                try {
                    const content = await this.generateContent(prompt, options);
                    return { index: i + index, content, success: true };
                } catch (error) {
                    const errorResult = {
                        index: i + index,
                        error: error.message,
                        success: false
                    };
                    errors.push(errorResult);
                    return errorResult;
                }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);

            // Délai entre les batches pour éviter la surcharge
            if (i + concurrencyLimit < prompts.length) {
                await this.delay(options.batchDelay || 1000);
            }
        }

        return {
            results: results.filter(r => r.success),
            errors: errors,
            totalRequests: prompts.length,
            successCount: results.filter(r => r.success).length,
            errorCount: errors.length
        };
    }

    /**
     * Valide un prompt avant l'envoi
     */
    validatePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') {
            throw new Error('Le prompt doit être une chaîne de caractères non vide');
        }

        if (prompt.length < 10) {
            throw new Error('Le prompt est trop court (minimum 10 caractères)');
        }

        if (prompt.length > 100000) {
            throw new Error('Le prompt est trop long (maximum 100000 caractères)');
        }

        return true;
    }

    /**
     * Estime le nombre de tokens d'un prompt
     */
    estimateTokens(text) {
        // Estimation approximative : 1 token ≈ 4 caractères pour le français
        return Math.ceil(text.length / 4);
    }

    /**
     * Vérifie la santé de l'API
     */
    async healthCheck() {
        try {
            const testPrompt = "Réponds simplement 'OK' pour confirmer que l'API fonctionne.";
            const response = await this.generateContent(testPrompt, { maxTokens: 10 });
            return {
                status: 'healthy',
                response: response.trim(),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Met à jour le temps de réponse moyen
     */
    updateAverageResponseTime(responseTime) {
        if (this.stats.successfulRequests === 1) {
            this.stats.averageResponseTime = responseTime;
        } else {
            this.stats.averageResponseTime =
                (this.stats.averageResponseTime * (this.stats.successfulRequests - 1) + responseTime) /
                this.stats.successfulRequests;
        }
    }

    /**
     * Obtient les statistiques d'utilisation
     */
    getStats() {
        return {
            ...this.stats,
            successRate: this.stats.totalRequests > 0
                ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2) + '%'
                : '0%',
            averageResponseTimeFormatted: this.stats.averageResponseTime.toFixed(0) + 'ms'
        };
    }

    /**
     * Remet à zéro les statistiques
     */
    resetStats() {
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            totalTokens: 0,
            averageResponseTime: 0
        };
    }

    /**
     * Configure les paramètres de l'API
     */
    configure(config) {
        if (config.apiKey) this.apiKey = config.apiKey;
        if (config.model) this.model = config.model;
        if (config.timeout) this.timeout = config.timeout;
        if (config.retryAttempts) this.retryAttempts = config.retryAttempts;
        if (config.retryDelay) this.retryDelay = config.retryDelay;
    }

    /**
     * Délai utilitaire
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Génère un contenu avec retry automatique et gestion d'erreur améliorée
     */
    async generateContentSafe(prompt, options = {}) {
        try {
            this.validatePrompt(prompt);

            const estimatedTokens = this.estimateTokens(prompt);
            if (estimatedTokens > 120000) { // Limite de sécurité
                throw new Error(`Prompt trop long: ${estimatedTokens} tokens estimés (max: 120000)`);
            }

            return await this.generateContent(prompt, options);
        } catch (error) {
            console.error(`Erreur lors de la génération de contenu: ${error.message}`);

            // Retourner un contenu par défaut en cas d'erreur
            if (options.fallbackContent) {
                return options.fallbackContent;
            }

            throw error;
        }
    }

    /**
     * Teste la connectivité et les paramètres
     */
    async testConnection() {
        console.log('🔍 Test de connexion à l\'API Perplexity...');

        try {
            const health = await this.healthCheck();

            if (health.status === 'healthy') {
                console.log('✅ Connexion réussie !');
                console.log(`  Modèle: ${this.model}`);
                console.log(`  Réponse: ${health.response}`);
                return true;
            } else {
                console.log('❌ Connexion échouée:', health.error);
                return false;
            }
        } catch (error) {
            console.log('❌ Test de connexion échoué:', error.message);
            return false;
        }
    }
}

module.exports = ApiClient;