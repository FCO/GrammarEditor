## Why

The project has no automated tests, making it impossible to verify correctness after changes. Documentation is limited to `AGENTS.md` with no user-facing docs for setup, usage, or architecture. Tests and docs are essential for maintainability and onboarding.

## What Changes

- Add a Raku test suite for `server.raku` covering grammar compilation, parsing, error handling, infinite loop protection, and the match/trace serialization
- Add a JS/browser test suite for `index.html` covering the UI layout, syntax highlighting, WebSocket communication, trace tree rendering, string highlighting on hover, match rendering, and error display
- Add user-facing documentation (`README.md`) covering setup, usage, and architecture
- Add developer documentation (CONTRIBUTING.md or equivalent) with test-running instructions
- No changes to production code (server.raku or index.html) — tests and docs only

## Capabilities

### New Capabilities
- `automated-tests`: Test suite covering both the Raku backend (server.raku) and the JS frontend (index.html), validating grammar processing, WebSocket communication, UI rendering, and error handling
- `project-documentation`: User-facing and developer-facing documentation including setup instructions, usage guide, architecture overview, and contribution guidelines

### Modified Capabilities
<!-- No existing specs modified -->

## Impact

- New test files: `t/server.t` (Raku tests), `t/frontend.test.js` (JS tests) — or similar
- New docs: `README.md`, `CONTRIBUTING.md`
- New dev dependency: `Test` module is core Raku, JS testing via browser automation or vitest/playwright
- No changes to production code paths
