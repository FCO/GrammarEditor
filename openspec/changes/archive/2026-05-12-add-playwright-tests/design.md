## Context

The Grammar Editor is a single-page web app with a JS frontend (`index.html`) and a Raku/Cro WebSocket backend (`server.raku`). Existing tests are Vitest unit tests in `t/frontend.test.js` that test individual JS functions (escapeHtml, debounce, renderTrace, etc.) in a happy-dom environment. There are no browser-based integration tests.

Key architecture details:
- Frontend connects to backend via WebSocket at `ws://localhost:3001/ws`
- Grammar evaluation is delegated to a worker at `http://localhost:9000/eval` (optional)
- Snapshot sharing via `POST/GET /_store` endpoints backed by SQLite
- All UI state (panels, resize, theme) is managed in the browser with no framework

## Goals / Non-Goals

**Goals:**
- Create a Playwright E2E test suite that exercises all UI features in a real Chromium browser
- Test WebSocket connection lifecycle and grammar evaluation flow
- Test the full snapshot share/create/load flow
- Cover responsive layout behavior
- Integrate into the existing NPM test infrastructure

**Non-Goals:**
- Testing the Raku worker service (out of scope; tests use direct in-process Raku evaluation)
- Performance or load testing
- Visual regression / screenshot tests (future enhancement)
- Mobile device testing

## Decisions

1. **Self-hosted backend in tests** – Tests will start `server.raku` as a child process and wait for the WebSocket to be ready. This avoids needing a separate test server setup. Use Playwright `globalSetup`/`globalTeardown` for process management.

2. **Test data directory** – Use a temporary SQLite database file for snapshots during tests to avoid polluting the development database. Set `GRAMMAR_SNAPSHOTS_DB` env var.

3. **Feature-based file organization** – One file per feature group (e.g., `grammar-editing.spec.js`, `trace-match.spec.js`, `sharing.spec.js`) for maintainability. A shared `fixtures.js` provides the test server setup.

4. **Default grammar as test input** – Use the same default grammar (`unit grammar MyGrammar; token TOP { <letter>+ } ...`) and string (`hello`) that the app starts with. Test with custom grammars for edge cases.

5. **WebSocket helper** – Create a utility to wait for the WS connection to be established and for grammar evaluation responses, since the app debounces input (300ms) before sending.

6. **No screenshot-based testing** – All assertions use DOM selectors and text content matching rather than screenshot comparison, keeping tests fast and stable.

7. **Separate NPM script** – `test:e2e` runs Playwright. The existing `test` script (Vitest) is unchanged.

## Risks / Trade-offs

- [Raku server startup time] → Mitigation: Use global setup with a generous startup timeout (30s) and health-check polling
- [Port conflicts] → Mitigation: Allow `PORT` env var override; default to 3002 for tests to avoid clashing with dev server
- [Fragile selectors] → Mitigation: Prefer data attributes (`data-testid`) or semantic selectors over CSS class names that may change
- [Shiki highlighting in tests] → Mitigation: Highlight is async but deterministic; await rendering in assertions
- [No headless mode support on all platforms] → Mitigation: Use `chromium` only, with `headless: true` by default
