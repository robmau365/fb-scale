/**
 * Example usage of the Facebook Monetization Toolkit with different page types
 */

const MonetizationAgent = require('../agent');
const { PAGE_TYPES } = require('../services/connectors/constants');

async function ecommerceExample() {
    const agent = new MonetizationAgent();
    await agent.initialize({
        pageType: PAGE_TYPES.ECOMMERCE,
        fbConfig: {
            accessToken: process.env.FB_ACCESS_TOKEN,
            pageId: process.env.FB_PAGE_ID
        }
    });

    // Get e-commerce specific strategy
    const strategy = await agent.getMonetizationStrategy({
        type: 'shopping',
        audience: {
            region: 'US',
            interests: ['fashion', 'online shopping']
        }
    });

    // Analyze shop performance
    const insights = await agent.getInsights({
        timeframe: 'last_30_days',
        metrics: ['shop_conversion', 'product_views']
    });

    return {
        strategy,
        insights,
        recommendations: insights.facebook.recommendations
    };
}

async function contentCreatorExample() {
    const agent = new MonetizationAgent();
    await agent.initialize({
        pageType: PAGE_TYPES.CONTENT_CREATOR,
        fbConfig: {
            accessToken: process.env.FB_ACCESS_TOKEN,
            pageId: process.env.FB_PAGE_ID
        }
    });

    // Get content creator strategy
    const strategy = await agent.getMonetizationStrategy({
        type: 'content',
        focus: ['video', 'live_streaming']
    });

    // Analyze content performance
    const insights = await agent.getInsights({
        timeframe: 'last_30_days',
        contentTypes: ['video', 'live']
    });

    // Get specific video performance
    const videoAnalysis = await agent.kb.fbConnector.getContentPerformance('video');

    return {
        strategy,
        insights,
        videoPerformance: videoAnalysis,
        recommendations: insights.facebook.recommendations
    };
}

async function localBusinessExample() {
    const agent = new MonetizationAgent();
    await agent.initialize({
        pageType: PAGE_TYPES.LOCAL_BUSINESS,
        fbConfig: {
            accessToken: process.env.FB_ACCESS_TOKEN,
            pageId: process.env.FB_PAGE_ID
        }
    });

    // Get local business strategy
    const strategy = await agent.getMonetizationStrategy({
        type: 'local',
        location: {
            city: 'San Francisco',
            radius: '10mi'
        }
    });

    // Analyze local performance
    const insights = await agent.getInsights({
        timeframe: 'last_30_days',
        metrics: ['store_visits', 'local_awareness']
    });

    return {
        strategy,
        insights,
        recommendations: insights.facebook.recommendations
    };
}

// Example of adding custom data points
async function addCustomDataExample(agent) {
    // Add performance screenshots
    await agent.kb.addCustomData({
        category: 'facebook_metrics',
        content: {
            type: 'analytics_screenshot',
            imageData: 'base64_encoded_screenshot',
            metrics: {
                reach: 25000,
                engagement: 0.15,
                conversions: 250
            }
        }
    });

    // Add custom audience data
    await agent.kb.addCustomData({
        category: 'audience_data',
        content: {
            type: 'customer_survey',
            responses: [
                { question: 'Preferred content type', answer: 'Video tutorials' },
                { question: 'Shopping frequency', answer: 'Weekly' }
            ]
        }
    });

    // Add custom strategy
    await agent.kb.addStrategy('hybrid_events', {
        name: 'Hybrid Events Monetization',
        steps: [
            'Create virtual event series',
            'Set up hybrid ticketing',
            'Implement live commerce during events',
            'Capture attendee data for retargeting'
        ],
        metrics: ['event_attendance', 'ticket_sales', 'live_sales'],
        bestPractices: [
            'Use FB Live with shopping features',
            'Create event-specific product collections',
            'Implement early-bird pricing',
            'Enable post-event content access'
        ]
    });
}

module.exports = {
    ecommerceExample,
    contentCreatorExample,
    localBusinessExample,
    addCustomDataExample
};