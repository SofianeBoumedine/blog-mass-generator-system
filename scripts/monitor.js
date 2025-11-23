#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const ApiClient = require('../lib/apiClient');

class ApiMonitor {
    constructor() {
        this.statsFile = path.join(__dirname, '../data/api-usage.json');
        this.alertsFile = path.join(__dirname, '../data/alerts.json');
        this.apiClient = new ApiClient();

        // Limites par défaut (ajustables)
        this.limits = {
            dailyRequests: 1000,
            hourlyRequests: 100,
            dailyCost: 50.0, // dollars
            monthlyCost: 500.0
        };

        // Prix estimés Perplexity (à ajuster selon les tarifs réels)
        this.pricing = {
            inputTokenPer1K: 0.0005,  // $0.0005 per 1K input tokens
            outputTokenPer1K: 0.0015  // $0.0015 per 1K output tokens
        };
    }

    /**
     * Initialise le système de monitoring
     */
    async initialize() {
        try {
            await fs.mkdir(path.dirname(this.statsFile), { recursive: true });

            // Créer le fichier de stats s'il n'existe pas
            try {
                await fs.access(this.statsFile);
            } catch {
                await this.resetStats();
            }

            // Créer le fichier d'alertes s'il n'existe pas
            try {
                await fs.access(this.alertsFile);
            } catch {
                await fs.writeFile(this.alertsFile, JSON.stringify([], null, 2));
            }

            console.log('✅ Monitoring API initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error.message);
        }
    }

    /**
     * Enregistre une utilisation d'API
     */
    async recordUsage(tokens = {}, responseTime = 0, success = true) {
        try {
            const stats = await this.loadStats();
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const hour = now.getHours();

            // Initialiser les stats du jour si nécessaire
            if (!stats.daily[today]) {
                stats.daily[today] = {
                    requests: 0,
                    tokens: { input: 0, output: 0, total: 0 },
                    responseTime: 0,
                    errors: 0,
                    hourly: {}
                };
            }

            const dailyStats = stats.daily[today];

            // Initialiser les stats de l'heure si nécessaire
            if (!dailyStats.hourly[hour]) {
                dailyStats.hourly[hour] = {
                    requests: 0,
                    tokens: { input: 0, output: 0, total: 0 },
                    errors: 0
                };
            }

            // Mettre à jour les statistiques
            dailyStats.requests++;
            dailyStats.hourly[hour].requests++;

            if (tokens.input) {
                dailyStats.tokens.input += tokens.input;
                dailyStats.hourly[hour].tokens.input += tokens.input;
            }
            if (tokens.output) {
                dailyStats.tokens.output += tokens.output;
                dailyStats.hourly[hour].tokens.output += tokens.output;
            }
            if (tokens.total) {
                dailyStats.tokens.total += tokens.total;
                dailyStats.hourly[hour].tokens.total += tokens.total;
            }

            // Mettre à jour le temps de réponse moyen
            const currentAvg = dailyStats.responseTime || 0;
            dailyStats.responseTime = (currentAvg * (dailyStats.requests - 1) + responseTime) / dailyStats.requests;

            if (!success) {
                dailyStats.errors++;
                dailyStats.hourly[hour].errors++;
            }

            // Mettre à jour les totaux
            stats.totals.requests++;
            stats.totals.tokens.input += tokens.input || 0;
            stats.totals.tokens.output += tokens.output || 0;
            stats.totals.tokens.total += tokens.total || 0;
            stats.lastUpdated = now.toISOString();

            await this.saveStats(stats);

            // Vérifier les limites
            await this.checkLimits(stats, today, hour);

        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement:', error.message);
        }
    }

    /**
     * Vérifie les limites et génère des alertes
     */
    async checkLimits(stats, today, hour) {
        const alerts = [];
        const dailyStats = stats.daily[today];

        // Vérification des limites quotidiennes
        if (dailyStats.requests >= this.limits.dailyRequests) {
            alerts.push({
                type: 'quota_exceeded',
                level: 'critical',
                message: `Limite quotidienne de requêtes atteinte: ${dailyStats.requests}/${this.limits.dailyRequests}`,
                timestamp: new Date().toISOString()
            });
        } else if (dailyStats.requests >= this.limits.dailyRequests * 0.8) {
            alerts.push({
                type: 'quota_warning',
                level: 'warning',
                message: `80% de la limite quotidienne atteinte: ${dailyStats.requests}/${this.limits.dailyRequests}`,
                timestamp: new Date().toISOString()
            });
        }

        // Vérification des limites horaires
        const hourlyRequests = dailyStats.hourly[hour]?.requests || 0;
        if (hourlyRequests >= this.limits.hourlyRequests) {
            alerts.push({
                type: 'rate_limit',
                level: 'critical',
                message: `Limite horaire de requêtes atteinte: ${hourlyRequests}/${this.limits.hourlyRequests}`,
                timestamp: new Date().toISOString()
            });
        }

        // Vérification des coûts
        const dailyCost = this.calculateCost(dailyStats.tokens);
        if (dailyCost >= this.limits.dailyCost) {
            alerts.push({
                type: 'cost_exceeded',
                level: 'critical',
                message: `Limite de coût quotidien atteinte: $${dailyCost.toFixed(2)}/$${this.limits.dailyCost}`,
                timestamp: new Date().toISOString()
            });
        }

        // Sauvegarder les alertes
        if (alerts.length > 0) {
            await this.saveAlerts(alerts);
            alerts.forEach(alert => {
                console.log(`🚨 ${alert.level.toUpperCase()}: ${alert.message}`);
            });
        }
    }

    /**
     * Calcule le coût estimé
     */
    calculateCost(tokens) {
        const inputCost = (tokens.input || 0) / 1000 * this.pricing.inputTokenPer1K;
        const outputCost = (tokens.output || 0) / 1000 * this.pricing.outputTokenPer1K;
        return inputCost + outputCost;
    }

    /**
     * Affiche les statistiques
     */
    async displayStats(period = 'today') {
        try {
            const stats = await this.loadStats();
            const today = new Date().toISOString().split('T')[0];

            console.log('📊 STATISTIQUES D\'UTILISATION API\n');
            console.log('='.repeat(50));

            if (period === 'today' && stats.daily[today]) {
                const dailyStats = stats.daily[today];
                const cost = this.calculateCost(dailyStats.tokens);

                console.log(`📅 AUJOURD'HUI (${today})`);
                console.log(`📞 Requêtes: ${dailyStats.requests}`);
                console.log(`🎯 Tokens: ${dailyStats.tokens.total?.toLocaleString() || 0}`);
                console.log(`  ↳ Input: ${dailyStats.tokens.input?.toLocaleString() || 0}`);
                console.log(`  ↳ Output: ${dailyStats.tokens.output?.toLocaleString() || 0}`);
                console.log(`💰 Coût estimé: $${cost.toFixed(4)}`);
                console.log(`⏱️  Temps moyen: ${dailyStats.responseTime?.toFixed(0) || 0}ms`);
                console.log(`❌ Erreurs: ${dailyStats.errors || 0}`);
                console.log(`✅ Taux de réussite: ${((dailyStats.requests - (dailyStats.errors || 0)) / dailyStats.requests * 100).toFixed(1)}%`);

                // Afficher les stats horaires
                console.log('\n⏰ RÉPARTITION HORAIRE:');
                Object.entries(dailyStats.hourly || {})
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .forEach(([hour, hourStats]) => {
                        console.log(`  ${hour.padStart(2, '0')}h: ${hourStats.requests} req, ${(hourStats.tokens.total || 0).toLocaleString()} tokens`);
                    });

            } else if (period === 'total') {
                const totalCost = this.calculateCost(stats.totals.tokens);

                console.log('📈 STATISTIQUES TOTALES');
                console.log(`📞 Requêtes: ${stats.totals.requests?.toLocaleString() || 0}`);
                console.log(`🎯 Tokens: ${stats.totals.tokens.total?.toLocaleString() || 0}`);
                console.log(`💰 Coût total estimé: $${totalCost.toFixed(2)}`);

                // Afficher les derniers jours
                console.log('\n📅 DERNIERS JOURS:');
                const recentDays = Object.entries(stats.daily)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 7);

                recentDays.forEach(([date, dayStats]) => {
                    const dayCost = this.calculateCost(dayStats.tokens);
                    console.log(`  ${date}: ${dayStats.requests} req, $${dayCost.toFixed(3)}`);
                });
            }

            // Afficher les limites actuelles
            console.log('\n⚠️  LIMITES CONFIGURÉES:');
            console.log(`  Requêtes/jour: ${this.limits.dailyRequests}`);
            console.log(`  Requêtes/heure: ${this.limits.hourlyRequests}`);
            console.log(`  Coût/jour: $${this.limits.dailyCost}`);
            console.log(`  Coût/mois: $${this.limits.monthlyCost}`);

        } catch (error) {
            console.error('❌ Erreur lors de l\'affichage:', error.message);
        }
    }

    /**
     * Affiche les alertes récentes
     */
    async displayAlerts() {
        try {
            const alerts = await this.loadAlerts();

            console.log('🚨 ALERTES RÉCENTES\n');
            console.log('='.repeat(50));

            if (alerts.length === 0) {
                console.log('✅ Aucune alerte récente');
                return;
            }

            // Grouper par type
            const groupedAlerts = alerts.reduce((acc, alert) => {
                acc[alert.type] = acc[alert.type] || [];
                acc[alert.type].push(alert);
                return acc;
            }, {});

            Object.entries(groupedAlerts).forEach(([type, typeAlerts]) => {
                console.log(`\n${this.getAlertIcon(type)} ${type.toUpperCase()}:`);
                typeAlerts
                    .slice(-5) // Dernières 5 alertes de ce type
                    .forEach(alert => {
                        const date = new Date(alert.timestamp).toLocaleString('fr-FR');
                        console.log(`  ${date}: ${alert.message}`);
                    });
            });

        } catch (error) {
            console.error('❌ Erreur lors de l\'affichage des alertes:', error.message);
        }
    }

    /**
     * Obtient l'icône pour un type d'alerte
     */
    getAlertIcon(type) {
        const icons = {
            quota_exceeded: '🚫',
            quota_warning: '⚠️',
            rate_limit: '⏰',
            cost_exceeded: '💸'
        };
        return icons[type] || '🔔';
    }

    /**
     * Teste la santé de l'API
     */
    async healthCheck() {
        console.log('🔍 Test de santé de l\'API...\n');

        try {
            const startTime = Date.now();
            const health = await this.apiClient.healthCheck();
            const responseTime = Date.now() - startTime;

            console.log(`Status: ${health.status === 'healthy' ? '✅ SAIN' : '❌ DÉFAILLANT'}`);
            console.log(`Temps de réponse: ${responseTime}ms`);
            console.log(`Timestamp: ${health.timestamp}`);

            if (health.response) {
                console.log(`Réponse: ${health.response}`);
            }

            if (health.error) {
                console.log(`Erreur: ${health.error}`);
            }

            return health.status === 'healthy';

        } catch (error) {
            console.log('❌ ERREUR lors du test de santé:', error.message);
            return false;
        }
    }

    /**
     * Charge les statistiques
     */
    async loadStats() {
        try {
            const content = await fs.readFile(this.statsFile, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return this.getEmptyStats();
        }
    }

    /**
     * Sauvegarde les statistiques
     */
    async saveStats(stats) {
        await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));
    }

    /**
     * Remet à zéro les statistiques
     */
    async resetStats() {
        const emptyStats = this.getEmptyStats();
        await this.saveStats(emptyStats);
        console.log('✅ Statistiques remises à zéro');
    }

    /**
     * Obtient la structure vide des statistiques
     */
    getEmptyStats() {
        return {
            totals: {
                requests: 0,
                tokens: { input: 0, output: 0, total: 0 }
            },
            daily: {},
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Charge les alertes
     */
    async loadAlerts() {
        try {
            const content = await fs.readFile(this.alertsFile, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            return [];
        }
    }

    /**
     * Sauvegarde les alertes
     */
    async saveAlerts(newAlerts) {
        const existingAlerts = await this.loadAlerts();
        const allAlerts = [...existingAlerts, ...newAlerts];

        // Garder seulement les 100 dernières alertes
        const recentAlerts = allAlerts.slice(-100);

        await fs.writeFile(this.alertsFile, JSON.stringify(recentAlerts, null, 2));
    }

    /**
     * Configure les limites
     */
    setLimits(limits) {
        this.limits = { ...this.limits, ...limits };
        console.log('✅ Limites mises à jour:', this.limits);
    }
}

// Interface CLI
async function main() {
    const args = process.argv.slice(2);
    const monitor = new ApiMonitor();

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
📊 Monitor API - Blog Mass Generator

Usage: node monitor.js [command] [options]

Commandes:
  stats       Affiche les statistiques (défaut)
  alerts      Affiche les alertes récentes
  health      Teste la santé de l'API
  reset       Remet à zéro les statistiques
  limits      Configure les limites

Options pour stats:
  --period today|total    Période à afficher (défaut: today)

Options pour limits:
  --daily-requests N      Limite quotidienne de requêtes
  --hourly-requests N     Limite horaire de requêtes
  --daily-cost N          Limite quotidienne de coût ($)
  --monthly-cost N        Limite mensuelle de coût ($)

Exemples:
  node monitor.js                           # Statistiques du jour
  node monitor.js stats --period total      # Statistiques totales
  node monitor.js health                    # Test de santé
  node monitor.js limits --daily-requests 2000  # Configure la limite
        `);
        return;
    }

    await monitor.initialize();

    const command = args[0] || 'stats';

    try {
        switch (command) {
            case 'stats':
                const period = args.includes('--period') ?
                    args[args.indexOf('--period') + 1] : 'today';
                await monitor.displayStats(period);
                break;

            case 'alerts':
                await monitor.displayAlerts();
                break;

            case 'health':
                await monitor.healthCheck();
                break;

            case 'reset':
                await monitor.resetStats();
                break;

            case 'limits':
                const limits = {};
                if (args.includes('--daily-requests')) {
                    limits.dailyRequests = parseInt(args[args.indexOf('--daily-requests') + 1]);
                }
                if (args.includes('--hourly-requests')) {
                    limits.hourlyRequests = parseInt(args[args.indexOf('--hourly-requests') + 1]);
                }
                if (args.includes('--daily-cost')) {
                    limits.dailyCost = parseFloat(args[args.indexOf('--daily-cost') + 1]);
                }
                if (args.includes('--monthly-cost')) {
                    limits.monthlyCost = parseFloat(args[args.indexOf('--monthly-cost') + 1]);
                }
                monitor.setLimits(limits);
                break;

            default:
                console.log(`❌ Commande inconnue: ${command}`);
                console.log('Utilisez --help pour voir les commandes disponibles');
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ApiMonitor;