/**
 * Gestionnaire de File d'Attente Intelligent
 * Gère la génération de contenu avec priorités, rate limiting et optimisation
 */

class QueueManager {
    constructor(config = {}) {
        this.config = {
            concurrency: config.concurrency || 3, // Nombre de tâches parallèles
            rateLimit: config.rateLimit || 10, // Requêtes par minute
            priorityLevels: config.priorityLevels || ['high', 'normal', 'low'],
            maxRetries: config.maxRetries || 3,
            timeout: config.timeout || 120000, // 2 minutes
            ...config
        };

        this.queues = {
            high: [],
            normal: [],
            low: []
        };

        this.running = new Map();
        this.completed = [];
        this.failed = [];

        this.stats = {
            total: 0,
            completed: 0,
            failed: 0,
            running: 0,
            queued: 0,
            totalTime: 0,
            averageTime: 0
        };

        this.rateLimiter = {
            requests: [],
            window: 60000 // 1 minute
        };

        this.isProcessing = false;
    }

    /**
     * Ajoute une tâche à la file
     */
    async add(task, priority = 'normal') {
        if (!this.config.priorityLevels.includes(priority)) {
            priority = 'normal';
        }

        const queueItem = {
            id: this.generateTaskId(),
            task,
            priority,
            addedAt: Date.now(),
            attempts: 0,
            status: 'queued'
        };

        this.queues[priority].push(queueItem);
        this.stats.total++;
        this.stats.queued++;

        // Démarrer le processing si pas déjà en cours
        if (!this.isProcessing) {
            this.process();
        }

        return queueItem.id;
    }

    /**
     * Ajoute plusieurs tâches en batch
     */
    async addBatch(tasks, priority = 'normal') {
        const ids = [];

        for (const task of tasks) {
            const id = await this.add(task, priority);
            ids.push(id);
        }

        return ids;
    }

    /**
     * Process la file d'attente
     */
    async process() {
        if (this.isProcessing) return;

        this.isProcessing = true;
        console.log('🚀 Démarrage du traitement de la file d\'attente...\n');

        while (this.hasTasksRemaining()) {
            // Attendre si on a atteint la concurrence max
            while (this.running.size >= this.config.concurrency) {
                await this.sleep(100);
            }

            // Attendre si on a atteint le rate limit
            await this.waitForRateLimit();

            // Obtenir la prochaine tâche (par priorité)
            const queueItem = this.getNextTask();

            if (queueItem) {
                this.executeTask(queueItem);
            } else {
                // Pas de tâche disponible, attendre un peu
                await this.sleep(100);
            }
        }

        // Attendre que toutes les tâches en cours se terminent
        while (this.running.size > 0) {
            await this.sleep(100);
        }

        this.isProcessing = false;
        console.log('\n✅ Traitement de la file d\'attente terminé\n');
        this.displaySummary();
    }

    /**
     * Vérifie s'il reste des tâches
     */
    hasTasksRemaining() {
        return this.queues.high.length > 0 ||
               this.queues.normal.length > 0 ||
               this.queues.low.length > 0 ||
               this.running.size > 0;
    }

    /**
     * Obtient la prochaine tâche (par priorité)
     */
    getNextTask() {
        // Priorité: high -> normal -> low
        for (const priority of this.config.priorityLevels) {
            if (this.queues[priority].length > 0) {
                const task = this.queues[priority].shift();
                this.stats.queued--;
                return task;
            }
        }

        return null;
    }

    /**
     * Exécute une tâche
     */
    async executeTask(queueItem) {
        queueItem.status = 'running';
        queueItem.startedAt = Date.now();
        queueItem.attempts++;

        this.running.set(queueItem.id, queueItem);
        this.stats.running++;

        // Enregistrer pour le rate limiting
        this.rateLimiter.requests.push(Date.now());

        try {
            // Exécuter la tâche avec timeout
            const result = await Promise.race([
                queueItem.task(),
                this.createTimeoutPromise(this.config.timeout)
            ]);

            // Succès
            queueItem.status = 'completed';
            queueItem.completedAt = Date.now();
            queueItem.duration = queueItem.completedAt - queueItem.startedAt;
            queueItem.result = result;

            this.completed.push(queueItem);
            this.stats.completed++;
            this.stats.totalTime += queueItem.duration;

            console.log(`  ✅ [${queueItem.id}] Terminé en ${queueItem.duration}ms`);

        } catch (error) {
            // Échec
            queueItem.error = error.message;

            // Retry si possible
            if (queueItem.attempts < this.config.maxRetries) {
                console.log(`  ⚠️  [${queueItem.id}] Échec (tentative ${queueItem.attempts}/${this.config.maxRetries}), retry...`);

                // Remettre dans la queue
                queueItem.status = 'queued';
                this.queues[queueItem.priority].push(queueItem);
                this.stats.queued++;

            } else {
                // Échec définitif
                queueItem.status = 'failed';
                queueItem.failedAt = Date.now();
                queueItem.duration = queueItem.failedAt - queueItem.startedAt;

                this.failed.push(queueItem);
                this.stats.failed++;

                console.log(`  ❌ [${queueItem.id}] Échec définitif: ${error.message}`);
            }

        } finally {
            this.running.delete(queueItem.id);
            this.stats.running--;

            // Mettre à jour la moyenne
            if (this.stats.completed > 0) {
                this.stats.averageTime = Math.round(this.stats.totalTime / this.stats.completed);
            }
        }
    }

    /**
     * Attend si le rate limit est atteint
     */
    async waitForRateLimit() {
        // Nettoyer les anciennes requêtes
        const now = Date.now();
        this.rateLimiter.requests = this.rateLimiter.requests.filter(
            time => now - time < this.rateLimiter.window
        );

        // Vérifier le rate limit
        if (this.rateLimiter.requests.length >= this.config.rateLimit) {
            const oldestRequest = this.rateLimiter.requests[0];
            const waitTime = this.rateLimiter.window - (now - oldestRequest);

            if (waitTime > 0) {
                console.log(`  ⏳ Rate limit atteint, attente ${Math.round(waitTime / 1000)}s...`);
                await this.sleep(waitTime);
            }
        }
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
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Génère un ID de tâche
     */
    generateTaskId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    /**
     * Affiche le résumé
     */
    displaySummary() {
        const stats = this.getStats();

        console.log('═══════════════════════════════════════════════════════════════════');
        console.log('                    RÉSUMÉ DE LA FILE D\'ATTENTE');
        console.log('═══════════════════════════════════════════════════════════════════\n');
        console.log('📊 STATISTIQUES:\n');
        console.log(`  Total de tâches:         ${stats.total}`);
        console.log(`  Complétées:              ${stats.completed} (${stats.successRate})`);
        console.log(`  Échouées:                ${stats.failed}`);
        console.log(`  En cours:                ${stats.running}`);
        console.log(`  En attente:              ${stats.queued}\n`);
        console.log('⏱️  TEMPS:\n');
        console.log(`  Temps moyen:             ${stats.averageTime}ms`);
        console.log(`  Temps total:             ${Math.round(stats.totalTime / 1000)}s\n`);
        console.log('═══════════════════════════════════════════════════════════════════\n');
    }

    /**
     * Obtient les statistiques
     */
    getStats() {
        const successRate = this.stats.total > 0
            ? ((this.stats.completed / this.stats.total) * 100).toFixed(1) + '%'
            : '0%';

        return {
            ...this.stats,
            successRate,
            failureRate: this.stats.total > 0
                ? ((this.stats.failed / this.stats.total) * 100).toFixed(1) + '%'
                : '0%'
        };
    }

    /**
     * Génère un rapport détaillé
     */
    generateReport() {
        const stats = this.getStats();

        let report = `
═══════════════════════════════════════════════════════════════════
                    QUEUE MANAGER - RAPPORT DÉTAILLÉ
═══════════════════════════════════════════════════════════════════

📊 STATISTIQUES GLOBALES:

  Tâches totales:          ${stats.total}
  Complétées:              ${stats.completed} (${stats.successRate})
  Échouées:                ${stats.failed} (${stats.failureRate})
  En cours:                ${stats.running}
  En attente:              ${stats.queued}

⏱️  PERFORMANCE:

  Temps moyen/tâche:       ${stats.averageTime}ms
  Temps total:             ${Math.round(stats.totalTime / 1000)}s
  Débit moyen:             ${stats.completed > 0 ? (stats.completed / (stats.totalTime / 60000)).toFixed(2) : 0} tâches/min

⚙️  CONFIGURATION:

  Concurrence:             ${this.config.concurrency}
  Rate limit:              ${this.config.rateLimit} req/min
  Max retries:             ${this.config.maxRetries}
  Timeout:                 ${this.config.timeout}ms

📋 FILE D'ATTENTE:

  High priority:           ${this.queues.high.length}
  Normal priority:         ${this.queues.normal.length}
  Low priority:            ${this.queues.low.length}
`;

        // Tâches échouées
        if (this.failed.length > 0) {
            report += `\n❌ TÂCHES ÉCHOUÉES (${this.failed.length}):\n\n`;

            for (const task of this.failed.slice(-10)) { // Dernières 10
                report += `  • [${task.id}] ${task.error}\n`;
                report += `    Tentatives: ${task.attempts}, Durée: ${task.duration}ms\n\n`;
            }
        }

        report += `═══════════════════════════════════════════════════════════════════\n`;

        return report;
    }

    /**
     * Obtient le statut d'une tâche
     */
    getTaskStatus(taskId) {
        // Chercher dans running
        if (this.running.has(taskId)) {
            return this.running.get(taskId);
        }

        // Chercher dans completed
        const completed = this.completed.find(t => t.id === taskId);
        if (completed) return completed;

        // Chercher dans failed
        const failed = this.failed.find(t => t.id === taskId);
        if (failed) return failed;

        // Chercher dans les queues
        for (const priority of this.config.priorityLevels) {
            const queued = this.queues[priority].find(t => t.id === taskId);
            if (queued) return queued;
        }

        return null;
    }

    /**
     * Annule une tâche
     */
    cancelTask(taskId) {
        // Retirer des queues
        for (const priority of this.config.priorityLevels) {
            const index = this.queues[priority].findIndex(t => t.id === taskId);
            if (index !== -1) {
                const task = this.queues[priority].splice(index, 1)[0];
                task.status = 'cancelled';
                this.failed.push(task);
                this.stats.queued--;
                this.stats.failed++;
                return true;
            }
        }

        return false;
    }

    /**
     * Vide toutes les queues
     */
    clear() {
        for (const priority of this.config.priorityLevels) {
            this.queues[priority] = [];
        }
        this.stats.queued = 0;
    }

    /**
     * Réinitialise complètement
     */
    reset() {
        this.clear();
        this.completed = [];
        this.failed = [];
        this.stats = {
            total: 0,
            completed: 0,
            failed: 0,
            running: 0,
            queued: 0,
            totalTime: 0,
            averageTime: 0
        };
    }

    /**
     * Pause le processing
     */
    pause() {
        this.isProcessing = false;
        console.log('⏸️  File d\'attente mise en pause');
    }

    /**
     * Reprend le processing
     */
    resume() {
        if (!this.isProcessing && this.hasTasksRemaining()) {
            console.log('▶️  File d\'attente reprise');
            this.process();
        }
    }
}

module.exports = QueueManager;
