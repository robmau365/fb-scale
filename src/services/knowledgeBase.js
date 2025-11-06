const MockKB = require('./mockKb');
const FacebookDataConnector = require('./connectors/facebookData');

class KnowledgeBase {
    constructor() {
        // Private KB support removed in public revision. Use MockKB for demos/tests.
        this.mockKb = new MockKB();
        this.fbConnector = null; // will be created via init(config) if provided
    }

    /**
     * Optional initialization to provide runtime configuration
     * e.g. { fbConfig: { accessToken, pageId, pageType } }
     */
    async init(config = {}) {
        if (config.fbConfig && config.fbConfig.accessToken && config.fbConfig.pageId) {
            this.fbConnector = new FacebookDataConnector({
                accessToken: config.fbConfig.accessToken,
                pageId: config.fbConfig.pageId,
                pageType: config.fbConfig.pageType
            });
            // initialize connector (load page info, cache insights)
            try {
                await this.fbConnector.initialize();
            } catch (e) {
                console.warn('Facebook connector initialization failed:', e.message);
                this.fbConnector = null;
            }
        } else if (process.env.FB_ACCESS_TOKEN && process.env.FB_PAGE_ID) {
            // fallback to env-based connector if present
            this.fbConnector = new FacebookDataConnector({
                accessToken: process.env.FB_ACCESS_TOKEN,
                pageId: process.env.FB_PAGE_ID,
                pageType: process.env.FB_PAGE_TYPE
            });
            try {
                await this.fbConnector.initialize();
            } catch (e) {
                console.warn('Facebook connector initialization failed (env):', e.message);
                this.fbConnector = null;
            }
        }
    }

    async connect() {
        // Initialize Facebook connector if configured
        if (this.fbConnector && typeof this.fbConnector.initialize === 'function') {
            try {
                await this.fbConnector.initialize();
            } catch (e) {
                console.warn('Facebook connector initialize during connect failed:', e.message);
            }
        }
    }

    async queryStrategy(params) {
        // Always use MockKB for strategy content; enrich with FB insights when available
        const strategy = await this.mockKb.getStrategy(params);

        // Enhance with Facebook data if available
        if (this.fbConnector) {
            try {
                const fbInsights = await this._getFacebookInsights();
                strategy.insights = fbInsights;
            } catch (error) {
                console.warn('Could not fetch Facebook insights:', error.message);
            }
        }

        return strategy;
    }

    async analyzeMetrics(metrics) {
        const analysis = await this.mockKb.analyzeMetrics(metrics);

        // Enhance analysis with Facebook data if available
        if (this.fbConnector) {
            try {
                const fbMetrics = await this._getFacebookMetrics();
                analysis.facebook = fbMetrics;
                analysis.recommendations = [
                    ...(analysis.recommendations || []),
                    ...this._generateFacebookRecommendations(fbMetrics)
                ];
            } catch (error) {
                console.warn('Could not fetch Facebook metrics:', error.message);
            }
        }

        return analysis;
    }

    async addCustomData(data) {
        // Store custom data locally in MockKB for demos/tests
        return this.mockKb.addDataPoint(data.category, data.content);
    }

    async _getFacebookInsights() {
        if (!this.fbConnector) return null;

        const [pageInsights, audienceInsights] = await Promise.all([
            this.fbConnector.getPageInsights([
                'page_impressions',
                'page_engaged_users',
                'page_fans'
            ]),
            this.fbConnector.getAudienceInsights()
        ]);

        return {
            page: pageInsights,
            audience: audienceInsights
        };
    }

    async _getFacebookMetrics() {
        if (!this.fbConnector) return null;

        return await this.fbConnector.getMonetizationMetrics();
    }

    _generateFacebookRecommendations(fbMetrics) {
        if (!fbMetrics) return [];

        const recommendations = [];

        if (fbMetrics.monetizationPotential < 50) {
            recommendations.push({
                source: 'facebook',
                priority: 'high',
                actions: fbMetrics.recommendations.map(r => r.actions).flat()
            });
        }

        return recommendations;
    }
}

module.exports = KnowledgeBase;