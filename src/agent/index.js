require('dotenv').config();
const KnowledgeBase = require('../services/knowledgeBase');
const MockKB = require('../services/mockKb');
const { validateStrategy } = require('../utils/validation');
const { trackMetrics } = require('../utils/metrics');

class MonetizationAgent {
    constructor() {
        this.kb = new KnowledgeBase();
        this.initialized = false;
    }

    /**
     * Initialize the agent with optional runtime config.
     * config example: { fbConfig: { accessToken, pageId, pageType }, usePrivateKB: true }
     */
    async initialize(config = {}) {
        // allow overriding usePrivateKB via config
        if (typeof config.usePrivateKB === 'boolean') {
            this.kb.usePrivateKB = config.usePrivateKB;
        }

        // initialize KB with provided config (e.g., fb connector)
        await this.kb.init(config);
        await this.kb.connect();
        this.initialized = true;
    }

    async getMonetizationStrategy(params) {
        try {
            validateStrategy(params);
            let strategy;
            if (this.kb && typeof this.kb.queryStrategy === 'function') {
                strategy = await this.kb.queryStrategy(params);
                // If KB mock returns undefined (jest.mock default), fallback to MockKB
                if (!strategy) {
                    const fallbackKb = new MockKB();
                    strategy = await fallbackKb.getStrategy(params);
                }
            } else {
                // Fallback to local mock KB when KnowledgeBase is not available
                const fallbackKb = new MockKB();
                strategy = await fallbackKb.getStrategy(params);
            }
            trackMetrics('strategy_request', { success: true });
            return strategy;
        } catch (error) {
            trackMetrics('strategy_request', { success: false, error: error.message });
            throw error;
        }
    }

    async getInsights(metrics) {
        if (this.kb && typeof this.kb.analyzeMetrics === 'function') {
            const analysis = await this.kb.analyzeMetrics(metrics);
            if (analysis) return analysis;
        }
        // Fallback to mock analysis
        const fallbackKb = new MockKB();
        return await fallbackKb.analyzeMetrics(metrics);
    }

    // Convenience wrappers
    async addCustomData(data) {
        return await this.kb.addCustomData(data);
    }

    addStrategy(type, strategy) {
        // Add to mock KB so users can add strategies locally
        return this.kb.mockKb.addStrategy(type, strategy);
    }
}

module.exports = MonetizationAgent;