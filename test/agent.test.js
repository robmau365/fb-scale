const MonetizationAgent = require('../src/agent');
const KnowledgeBase = require('../src/services/knowledgeBase');

jest.mock('../src/services/knowledgeBase');

describe('MonetizationAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new MonetizationAgent();
  });

  test('getMonetizationStrategy returns valid strategy', async () => {
    const params = {
      type: 'ads',
      audience: { region: 'US', interests: ['technology'] }
    };

    const strategy = await agent.getMonetizationStrategy(params);
    expect(strategy).toBeDefined();
    expect(strategy.name).toBeDefined();
    expect(strategy.steps).toBeInstanceOf(Array);
  });

  test('invalid strategy type throws error', async () => {
    const params = {
      type: 'invalid',
      audience: { region: 'US' }
    };

    await expect(agent.getMonetizationStrategy(params)).rejects.toThrow();
  });
});