# Facebook Monetization Toolkit

An AI-powered toolkit for Facebook monetization strategies and optimization.

## Features

- AI-driven monetization strategy recommendations
- Audience analysis and insights
- Performance metrics tracking
- Support for external knowledge base integration
- Fallback to built-in strategies when offline
 - Built-in MockKB for demos and testing

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure your environment variables:
*This public repository no longer includes or depends on a private knowledge-base example.*
To run locally, use the included MockKB (no credentials required). Advanced Facebook integration is supported by providing the following environment variables (local testing only):

- `FB_ACCESS_TOKEN`: Short-lived page access token for testing (do not commit)
- `FB_PAGE_ID`: Facebook Page ID
- `OPENAI_API_KEY`: Your OpenAI API key (if you use OpenAI features)

Security disclaimer: IMPORTANT — This project is a prototype and not production-ready. Do NOT commit credentials or sensitive data. See the Security section below for hardening guidelines.

## Usage

```javascript
const MonetizationAgent = require('./src/agent');

const agent = new MonetizationAgent();
await agent.initialize();

// Get monetization strategy
const strategy = await agent.getMonetizationStrategy({
  type: 'ads',
  audience: {
    region: 'US',
    interests: ['technology']
  }
});

// Get performance insights
const insights = await agent.getInsights({
  reach: 10000,
  engagement: 0.05,
  conversion: 0.02
});
```

## Development

```bash
# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format
```

## Facebook Integration (advanced)

The agent can enrich strategies with Facebook Page insights when you provide a short-lived page access token and page id. This is intended for local testing only. For production, implement OAuth, a secrets manager, and secure token rotation.

Example `.env` entries (local testing):
```env
FB_ACCESS_TOKEN=your_facebook_access_token
FB_PAGE_ID=your_facebook_page_id
```

If Facebook credentials are not provided the agent will use the built-in MockKB and still function for demos and testing.

## MockKB (demo & testing)

The repository ships with a built-in MockKB so anyone can try the agent without Facebook credentials or any external knowledge base.

Quick demo (no credentials required):

```bash
# from the project root
node examples/demoMock.js
```

What MockKB is for:
- Demos: shows realistic but synthetic strategies and recommendations.
- Tests: used by the unit test suite so tests run quickly and deterministically.
- Offline / developer mode: lets you iterate without external services.

If you want richer behaviour, you can add custom strategies at runtime using `agent.addStrategy(type, strategy)` or add custom data via `agent.addCustomData({ category, content })`.

## Security checklist (expanded)

Before deploying any part of this project to production, follow these steps:

1. Use Facebook OAuth flows for production token issuance.
  - Do not store user passwords.
  - Request the minimum scopes you need (least privilege).
  - Use short-lived access tokens and refresh tokens where applicable.

2. Secrets management
  - Store tokens and API keys in a secrets manager (e.g., GitHub Secrets, AWS Secrets Manager, HashiCorp Vault) — do NOT put them in `.env` in a repository.
  - For CI, use repository secrets and never print secrets to logs.

3. Network & transport
  - Enforce HTTPS for all external endpoints.
  - Use TLS 1.2+ and validate certificates.

4. Token rotation & monitoring
  - Rotate access tokens regularly and audit token use.
  - Log auth failures and suspicious activity; monitor rates of API calls.

5. Data minimization & privacy
  - Only collect and store metrics you need.
  - Mask or avoid storing PII; follow GDPR/CCPA or regional privacy laws.

6. CI checks & pre-commit
  - Use the included CI sanitizer that fails on committed `.env` files and common binary ebook extensions.
  - Optionally enable a pre-commit hook (see `.husky/pre-commit.sample`) to block committing `.env`.

7. Production readiness
  - Add rate limiting, retries with exponential backoff, and circuit breakers for external APIs.
  - Add observability (metrics, traces) and alerting for critical failures.

If you want, I can add an optional OAuth helper example that demonstrates the correct flow for obtaining short-lived Facebook tokens (for advanced users only).

## Security guidance (short)

- Never commit `.env` or credentials to version control.
- Use short-lived tokens and follow Facebook OAuth for production.
- Use a secrets manager (GitHub Secrets, AWS Secrets Manager, etc.) for CI and production deployments.
- Enforce HTTPS for any external endpoints and rotate credentials regularly.
- Treat user data and analytics as sensitive — consult applicable data privacy laws before storing or processing.

## License

MIT