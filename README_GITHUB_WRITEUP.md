Facebook Monetization Toolkit — Public Repository Write-up

Overview
--------
This repository contains the "Facebook Monetization Toolkit", an AI-enabled toolkit and example agent that provides monetization strategies for Facebook pages. The public repository uses a built-in MockKB for testing and offline use. It can also connect directly to the Facebook Graph API to fetch page insights and enrich recommendations (see Security & privacy notes below).

Goals
-----
- Provide a production-ready agent that does not include any private ebook content.
- The public repository does not include a private-KB example or host any ebook content. Advanced external KB integrations have been removed from the public codebase to avoid accidental disclosure of private ebook content.
- Provide a mock KB so users can run and test the agent locally without credentials.
- Offer CI checks that prevent accidental inclusion of ebook/private files.

What I changed
---------------
- Created a sanitized Node.js project skeleton with agent, services, utils and tests.
- Removed any embedded ebook content. No ebooks are included.
- Implemented `KnowledgeBase` abstraction that supports:
  - `PRIVATE_KB_URL` (external KB) and `KB_API_KEY`
  - Local MockKB fallback
  - Optional Facebook connector (configured via env or runtime `fbConfig`)
- Added a `FacebookDataConnector` with page-type analysis and monetization scoring.
- Added a `scoring` utility for robust monetization potential scoring.
- Note: A private KB template was removed from the public repository to reduce accidental exposure. Advanced users can implement their own private KB service and integrate it separately with the agent logic.
- CI workflow (`.github/workflows/ci.yml`) to run tests and check for forbidden files (ebooks/private data).
- Expanded MockKB with multiple strategy types and runtime extensibility.
- Unit tests and examples demonstrating usage.

How to run locally
------------------
1. Install dependencies:

```bash
npm ci
```

2. Copy `.env.example` to `.env` and set values. For local testing you can use MockKB (no credentials required). To enable Facebook enrichment, add your Facebook page token and ID (advanced):

```
FB_ACCESS_TOKEN=your_facebook_access_token
FB_PAGE_ID=your_facebook_page_id
```

3. Run tests:

```bash
npm test
```

4. Use the agent programmatically:

See `examples/pageTypeExamples.js` for ready-to-run examples.

Security & privacy notes
------------------------
- This public repo intentionally omits any ebook files. Host your ebook-derived KB separately and point `PRIVATE_KB_URL` to it.
- Ensure `KB_API_KEY`, `FB_ACCESS_TOKEN` and any secrets are stored as environment variables and never committed.
- CI sanitizer will fail if ebook file extensions or obvious private-data files are present.

CI / GitHub Actions
-------------------
- The workflow runs tests and a basic sanitizer to block common ebook extensions and private file paths from being committed.

Limitations & Next steps
------------------------
- The scoring algorithm is a heuristic; for production you may want to tune weights and caps using historical data.
- The private KB server is a template and not secure; you should run a hardened KB service for production (authentication, rate-limiting, storage, backups).
- Consider adding E2E tests that spin up the private-KB template and a mock Facebook API for integration tests.

Contact & contribution
----------------------
If you want more features (tighter scoring, integration with Facebook marketing API, e2e tests, or a hosted KB connector), open an issue or PR.