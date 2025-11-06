const MonetizationAgent = require('../../src/agent');

// Mock the facebookData connector used by KnowledgeBase
jest.mock('../../src/services/connectors/facebookData', () => {
    return jest.fn().mockImplementation(() => ({
        initialize: async () => { },
        getPageInsights: async (metrics) => {
            // return fake metrics structure similar to Graph API
            const data = {};
            metrics.forEach((m) => {
                data[m] = { values: [{ value: 100 }], period: 'day' };
            });
            return data;
        },
        getAudienceInsights: async () => ({ country: { US: 100 } }),
        getMonetizationMetrics: async () => ({
            monetizationPotential: 42,
            recommendations: [{ actions: ['increase video content'] }]
        })
    }));
});

describe('FB Integration (mocked connector)', () => {
    test('agent integrates facebook data when fbConfig provided', async () => {
        const agent = new MonetizationAgent();
        await agent.initialize({ fbConfig: { accessToken: 'x', pageId: '1' } });

        const strategy = await agent.getMonetizationStrategy({ type: 'ads' });
        expect(strategy).toBeDefined();
        expect(strategy.insights).toBeDefined();
        expect(strategy.insights.page).toBeDefined();

        const insights = await agent.getInsights({ reach: 1000 });
        expect(insights).toBeDefined();
        expect(insights.facebook).toBeDefined();
        expect(insights.facebook.monetizationPotential).toBeDefined();
    });
});
