/**
 * Système de Monitoring et Analytics
 * Suit les performances, coûts, qualité et génère des rapports détaillés
 */

const fs = require('fs').promises;
const path = require('path');

class PerformanceMonitor {
    constructor(config = {}) {
        this.config = {
            enabled: config.enabled !== false,
            dataDir: config.dataDir || path.join(__dirname, '..', '.monitoring'),
            autoSave: config.autoSave !== false,
            saveInterval: config.saveInterval || 5 * 60 * 1000, // 5 minutes
            retentionDays: config.retentionDays || 90, // 90 jours de rétention
            ...config
        };

        // Métriques en temps réel
        this.metrics = {
            generation: {
                total: 0,
                success: 0,
                failures: 0,
                inProgress: 0,
                totalTime: 0,
                averageTime: 0,
                byType: {} // homepage, article, blog, etc.
            },
            api: {
                calls: 0,
                errors: 0,
                retries: 0,
                totalTime: 0,
                averageTime: 0,
                tokensUsed: 0,
                estimatedCost: 0,
                byModel: {}
            },
            cache: {
                hits: 0,
                misses: 0,
                hitRate: 0,
                sizeMB: 0,
                entries: 0,
                costSaved: 0
            },
            quality: {
                totalAnalyzed: 0,
                averageScore: 0,
                byGrade: {
                    A: 0,
                    B: 0,
                    C: 0,
                    D: 0,
                    F: 0
                },
                aiDetectionFlags: 0
            },
            system: {
                startTime: Date.now(),
                uptime: 0,
                memoryUsage: 0,
                errors: []
            }
        };

        // Historique des événements
        this.events = [];
        this.dailyStats = {};

        this.initialize();
    }

    /**
     * Initialise le système de monitoring
     */
    async initialize() {
        try {
            // Créer le dossier de données
            await fs.mkdir(this.config.dataDir, { recursive: true });

            // Charger les données historiques
            await this.loadHistoricalData();

            // Démarrer la sauvegarde automatique
            if (this.config.autoSave) {
                this.startAutoSave();
            }

            console.log('📊 Monitoring system initialized');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation du monitoring:', error.message);
        }
    }

    /**
     * Enregistre le début d'une génération
     */
    startGeneration(type, metadata = {}) {
        const event = {
            id: this.generateEventId(),
            type: 'generation_start',
            contentType: type,
            timestamp: Date.now(),
            metadata
        };

        this.events.push(event);
        this.metrics.generation.inProgress++;

        return event.id;
    }

    /**
     * Enregistre la fin d'une génération
     */
    endGeneration(eventId, success = true, result = {}) {
        const startEvent = this.events.find(e => e.id === eventId);
        if (!startEvent) return;

        const duration = Date.now() - startEvent.timestamp;
        const contentType = startEvent.contentType;

        // Mettre à jour les métriques
        this.metrics.generation.total++;
        this.metrics.generation.inProgress--;

        if (success) {
            this.metrics.generation.success++;
        } else {
            this.metrics.generation.failures++;
        }

        this.metrics.generation.totalTime += duration;
        this.metrics.generation.averageTime =
            this.metrics.generation.totalTime / this.metrics.generation.total;

        // Stats par type
        if (!this.metrics.generation.byType[contentType]) {
            this.metrics.generation.byType[contentType] = {
                total: 0,
                success: 0,
                failures: 0,
                totalTime: 0,
                averageTime: 0
            };
        }

        const typeStats = this.metrics.generation.byType[contentType];
        typeStats.total++;
        if (success) typeStats.success++;
        else typeStats.failures++;
        typeStats.totalTime += duration;
        typeStats.averageTime = typeStats.totalTime / typeStats.total;

        // Enregistrer l'événement de fin
        this.events.push({
            id: this.generateEventId(),
            type: 'generation_end',
            contentType,
            timestamp: Date.now(),
            duration,
            success,
            result
        });

        // Mettre à jour les stats quotidiennes
        this.updateDailyStats('generation', { success, duration, contentType });

        console.log(`  📊 Generation ${success ? '✅' : '❌'} (${duration}ms)`);
    }

    /**
     * Enregistre un appel API
     */
    recordApiCall(model, duration, tokensUsed, success = true) {
        this.metrics.api.calls++;
        this.metrics.api.totalTime += duration;
        this.metrics.api.averageTime = this.metrics.api.totalTime / this.metrics.api.calls;
        this.metrics.api.tokensUsed += tokensUsed;

        // Estimation du coût (à ajuster selon les modèles)
        const costPer1kTokens = 0.002; // $0.002 par 1000 tokens
        const cost = (tokensUsed / 1000) * costPer1kTokens;
        this.metrics.api.estimatedCost += cost;

        if (!success) {
            this.metrics.api.errors++;
        }

        // Stats par modèle
        if (!this.metrics.api.byModel[model]) {
            this.metrics.api.byModel[model] = {
                calls: 0,
                errors: 0,
                tokens: 0,
                cost: 0,
                averageTime: 0,
                totalTime: 0
            };
        }

        const modelStats = this.metrics.api.byModel[model];
        modelStats.calls++;
        if (!success) modelStats.errors++;
        modelStats.tokens += tokensUsed;
        modelStats.cost += cost;
        modelStats.totalTime += duration;
        modelStats.averageTime = modelStats.totalTime / modelStats.calls;

        this.events.push({
            id: this.generateEventId(),
            type: 'api_call',
            model,
            timestamp: Date.now(),
            duration,
            tokensUsed,
            success
        });

        this.updateDailyStats('api', { model, duration, tokensUsed, success });
    }

    /**
     * Enregistre un retry API
     */
    recordApiRetry(model, attempt) {
        this.metrics.api.retries++;

        this.events.push({
            id: this.generateEventId(),
            type: 'api_retry',
            model,
            attempt,
            timestamp: Date.now()
        });
    }

    /**
     * Enregistre les stats du cache
     */
    updateCacheStats(stats) {
        this.metrics.cache = {
            hits: stats.hits || 0,
            misses: stats.misses || 0,
            hitRate: stats.hitRate || '0%',
            sizeMB: stats.totalSizeMB || 0,
            entries: stats.cacheSize || 0,
            costSaved: stats.estimatedCostSaved$ || 0
        };
    }

    /**
     * Enregistre une analyse de qualité
     */
    recordQualityAnalysis(analysis) {
        this.metrics.quality.totalAnalyzed++;

        const score = analysis.globalScore || 0;
        const grade = analysis.grade || 'F';

        // Moyenne mobile du score
        const total = this.metrics.quality.totalAnalyzed;
        const currentAvg = this.metrics.quality.averageScore;
        this.metrics.quality.averageScore =
            (currentAvg * (total - 1) + score) / total;

        // Comptage par grade
        if (this.metrics.quality.byGrade[grade] !== undefined) {
            this.metrics.quality.byGrade[grade]++;
        }

        // Flags de détection IA
        if (analysis.aiDetection && analysis.scores.humanness < 60) {
            this.metrics.quality.aiDetectionFlags++;
        }

        this.events.push({
            id: this.generateEventId(),
            type: 'quality_analysis',
            timestamp: Date.now(),
            score,
            grade
        });

        this.updateDailyStats('quality', { score, grade });
    }

    /**
     * Enregistre une erreur système
     */
    recordError(error, context = {}) {
        const errorEntry = {
            timestamp: Date.now(),
            message: error.message || error,
            stack: error.stack,
            context
        };

        this.metrics.system.errors.push(errorEntry);

        // Garder seulement les 100 dernières erreurs
        if (this.metrics.system.errors.length > 100) {
            this.metrics.system.errors = this.metrics.system.errors.slice(-100);
        }

        this.events.push({
            id: this.generateEventId(),
            type: 'error',
            timestamp: Date.now(),
            error: errorEntry
        });

        console.error('📊 Error recorded:', error.message);
    }

    /**
     * Met à jour les statistiques quotidiennes
     */
    updateDailyStats(category, data) {
        const date = new Date().toISOString().split('T')[0];

        if (!this.dailyStats[date]) {
            this.dailyStats[date] = {
                generation: { total: 0, success: 0, failures: 0, byType: {} },
                api: { calls: 0, tokens: 0, cost: 0 },
                quality: { analyzed: 0, totalScore: 0, byGrade: {} }
            };
        }

        const dayStats = this.dailyStats[date];

        switch (category) {
            case 'generation':
                dayStats.generation.total++;
                if (data.success) dayStats.generation.success++;
                else dayStats.generation.failures++;

                if (!dayStats.generation.byType[data.contentType]) {
                    dayStats.generation.byType[data.contentType] = 0;
                }
                dayStats.generation.byType[data.contentType]++;
                break;

            case 'api':
                dayStats.api.calls++;
                dayStats.api.tokens += data.tokensUsed || 0;
                const cost = ((data.tokensUsed || 0) / 1000) * 0.002;
                dayStats.api.cost += cost;
                break;

            case 'quality':
                dayStats.quality.analyzed++;
                dayStats.quality.totalScore += data.score || 0;
                if (!dayStats.quality.byGrade[data.grade]) {
                    dayStats.quality.byGrade[data.grade] = 0;
                }
                dayStats.quality.byGrade[data.grade]++;
                break;
        }
    }

    /**
     * Met à jour les métriques système
     */
    updateSystemMetrics() {
        this.metrics.system.uptime = Date.now() - this.metrics.system.startTime;

        if (typeof process !== 'undefined' && process.memoryUsage) {
            const mem = process.memoryUsage();
            this.metrics.system.memoryUsage = Math.round(mem.heapUsed / 1024 / 1024);
        }
    }

    /**
     * Obtient toutes les métriques actuelles
     */
    getMetrics() {
        this.updateSystemMetrics();
        return { ...this.metrics };
    }

    /**
     * Génère un rapport détaillé
     */
    generateReport(period = 'all') {
        this.updateSystemMetrics();

        const m = this.metrics;
        const uptime = this.formatDuration(m.system.uptime);

        let report = `
═══════════════════════════════════════════════════════════════════
                    RAPPORT DE PERFORMANCE
═══════════════════════════════════════════════════════════════════

📅 PÉRIODE: ${period === 'all' ? 'Depuis le démarrage' : period}
⏱️  UPTIME: ${uptime}
💾 MÉMOIRE: ${m.system.memoryUsage} MB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 GÉNÉRATION DE CONTENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total généré:         ${m.generation.total}
  Succès:               ${m.generation.success} (${this.percentage(m.generation.success, m.generation.total)})
  Échecs:               ${m.generation.failures} (${this.percentage(m.generation.failures, m.generation.total)})
  En cours:             ${m.generation.inProgress}

  Temps moyen:          ${Math.round(m.generation.averageTime)}ms
  Temps total:          ${this.formatDuration(m.generation.totalTime)}
`;

        // Stats par type de contenu
        if (Object.keys(m.generation.byType).length > 0) {
            report += `\n  📊 Par type de contenu:\n`;
            for (const [type, stats] of Object.entries(m.generation.byType)) {
                const successRate = this.percentage(stats.success, stats.total);
                report += `\n     ${type}:`;
                report += `\n       Total: ${stats.total} | Succès: ${successRate}`;
                report += `\n       Temps moyen: ${Math.round(stats.averageTime)}ms\n`;
            }
        }

        report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 API (IA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Appels totaux:        ${m.api.calls}
  Erreurs:              ${m.api.errors} (${this.percentage(m.api.errors, m.api.calls)})
  Retries:              ${m.api.retries}

  Temps moyen:          ${Math.round(m.api.averageTime)}ms
  Temps total:          ${this.formatDuration(m.api.totalTime)}

  Tokens utilisés:      ${m.api.tokensUsed.toLocaleString()}
  Coût estimé:          $${m.api.estimatedCost.toFixed(4)}
`;

        // Stats par modèle
        if (Object.keys(m.api.byModel).length > 0) {
            report += `\n  📊 Par modèle:\n`;
            for (const [model, stats] of Object.entries(m.api.byModel)) {
                report += `\n     ${model}:`;
                report += `\n       Appels: ${stats.calls} | Erreurs: ${stats.errors}`;
                report += `\n       Tokens: ${stats.tokens.toLocaleString()} | Coût: $${stats.cost.toFixed(4)}`;
                report += `\n       Temps moyen: ${Math.round(stats.averageTime)}ms\n`;
            }
        }

        report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💾 CACHE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Hits:                 ${m.cache.hits}
  Misses:               ${m.cache.misses}
  Taux de réussite:     ${m.cache.hitRate}

  Entrées:              ${m.cache.entries}
  Taille:               ${m.cache.sizeMB} MB

  Coût économisé:       $${Number(m.cache.costSaved).toFixed(4)}
  Économies:            ${this.percentage(m.cache.costSaved, m.api.estimatedCost + m.cache.costSaved)}
`;

        report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ QUALITÉ DU CONTENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Contenus analysés:    ${m.quality.totalAnalyzed}
  Score moyen:          ${m.quality.averageScore.toFixed(1)}/100
  Flags IA détectés:    ${m.quality.aiDetectionFlags}

  📊 Distribution des notes:
     A (90-100):        ${m.quality.byGrade.A} (${this.percentage(m.quality.byGrade.A, m.quality.totalAnalyzed)})
     B (80-89):         ${m.quality.byGrade.B} (${this.percentage(m.quality.byGrade.B, m.quality.totalAnalyzed)})
     C (70-79):         ${m.quality.byGrade.C} (${this.percentage(m.quality.byGrade.C, m.quality.totalAnalyzed)})
     D (60-69):         ${m.quality.byGrade.D} (${this.percentage(m.quality.byGrade.D, m.quality.totalAnalyzed)})
     F (0-59):          ${m.quality.byGrade.F} (${this.percentage(m.quality.byGrade.F, m.quality.totalAnalyzed)})
`;

        // Statistiques quotidiennes
        if (Object.keys(this.dailyStats).length > 0) {
            report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 STATISTIQUES QUOTIDIENNES (7 derniers jours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
            const recentDays = Object.keys(this.dailyStats).sort().slice(-7);
            for (const date of recentDays) {
                const day = this.dailyStats[date];
                report += `\n  ${date}:`;
                report += `\n    Générations: ${day.generation.total} (${day.generation.success} succès)`;
                report += `\n    Appels API: ${day.api.calls} | Coût: $${day.api.cost.toFixed(4)}`;
                if (day.quality.analyzed > 0) {
                    const avgScore = (day.quality.totalScore / day.quality.analyzed).toFixed(1);
                    report += `\n    Qualité: ${day.quality.analyzed} analyses | Score moyen: ${avgScore}/100`;
                }
                report += '\n';
            }
        }

        // Erreurs récentes
        if (m.system.errors.length > 0) {
            report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ERREURS RÉCENTES (${Math.min(10, m.system.errors.length)} dernières)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
            const recentErrors = m.system.errors.slice(-10);
            for (const error of recentErrors) {
                const time = new Date(error.timestamp).toLocaleString();
                report += `\n  [${time}] ${error.message}`;
                if (error.context && Object.keys(error.context).length > 0) {
                    report += `\n    Context: ${JSON.stringify(error.context)}`;
                }
                report += '\n';
            }
        }

        report += `
═══════════════════════════════════════════════════════════════════
`;

        return report;
    }

    /**
     * Exporte les données en JSON
     */
    async exportData(filename = null) {
        const exportData = {
            exportDate: new Date().toISOString(),
            metrics: this.getMetrics(),
            dailyStats: this.dailyStats,
            events: this.events.slice(-1000) // Derniers 1000 événements
        };

        const fileName = filename || `monitoring-${Date.now()}.json`;
        const filePath = path.join(this.config.dataDir, fileName);

        await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), 'utf8');

        console.log(`📊 Données exportées: ${fileName}`);
        return filePath;
    }

    /**
     * Sauvegarde automatique
     */
    async save() {
        try {
            const filePath = path.join(this.config.dataDir, 'current-metrics.json');
            const data = {
                lastUpdate: Date.now(),
                metrics: this.metrics,
                dailyStats: this.dailyStats
            };

            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des métriques:', error.message);
        }
    }

    /**
     * Charge les données historiques
     */
    async loadHistoricalData() {
        try {
            const filePath = path.join(this.config.dataDir, 'current-metrics.json');
            const data = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(data);

            // Fusionner avec les métriques actuelles
            if (parsed.dailyStats) {
                this.dailyStats = parsed.dailyStats;
            }

            console.log('📊 Données historiques chargées');
        } catch (error) {
            // Pas de données historiques, pas grave
        }
    }

    /**
     * Démarre la sauvegarde automatique
     */
    startAutoSave() {
        this.saveTimer = setInterval(() => {
            this.save();
        }, this.config.saveInterval);
    }

    /**
     * Arrête la sauvegarde automatique
     */
    stopAutoSave() {
        if (this.saveTimer) {
            clearInterval(this.saveTimer);
        }
    }

    /**
     * Nettoie les anciennes données
     */
    async cleanup() {
        const cutoffDate = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);

        // Nettoyer les stats quotidiennes
        for (const date of Object.keys(this.dailyStats)) {
            const dateTs = new Date(date).getTime();
            if (dateTs < cutoffDate) {
                delete this.dailyStats[date];
            }
        }

        // Garder seulement les 10000 derniers événements
        if (this.events.length > 10000) {
            this.events = this.events.slice(-10000);
        }

        await this.save();
        console.log('🧹 Données anciennes nettoyées');
    }

    // Utilitaires

    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    percentage(value, total) {
        if (total === 0) return '0%';
        return ((value / total) * 100).toFixed(1) + '%';
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}j ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}

module.exports = PerformanceMonitor;
