// Simple demo that uses the MockKB to show agent output without any credentials
const MonetizationAgent = require('../src/agent');

async function runDemo() {
    const agent = new MonetizationAgent();
    // Initialize with no FB config -> MockKB used
    await agent.initialize();

    const params = {
        type: 'content',
        audience: { region: 'US', interests: ['technology', 'video'] },
        customData: false
    };

    const strategy = await agent.getMonetizationStrategy(params);
    console.log('=== Strategy ===');
    console.log(JSON.stringify(strategy, null, 2));

    const insights = await agent.getInsights({ reach: 12000, engagement: 0.06 });
    console.log('=== Insights ===');
    console.log(JSON.stringify(insights, null, 2));
}

if (require.main === module) {
    runDemo().catch(err => {
        console.error('Demo failed:', err);
        process.exit(1);
    });
}

module.exports = runDemo;