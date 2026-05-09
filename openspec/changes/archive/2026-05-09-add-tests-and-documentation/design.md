## Context

The project consists of a Raku/Cro WebSocket backend (`server.raku`) and a vanilla JS frontend (`index.html`). Neither has automated tests. Documentation is limited to `AGENTS.md` (developer notes only).

Testing approaches differ by language:
- Raku has a built-in `Test` module — no external dependencies needed
- JS frontend needs a browser-like environment (jsdom, Playwright, or Vitest with happy-dom)

## Goals / Non-Goals

**Goals:**
- Raku test suite covering server.raku: grammar compilation, parsing, trace tree, match serialization, error handling, infinite loop protection
- JS test suite covering index.html: syntax highlighting, WebSocket message handling, trace rendering, match rendering, string highlighting, error display
- Project documentation: README.md (setup/usage), CONTRIBUTING.md (dev workflow)

**Non-Goals:**
- Integration/E2E tests connecting frontend to real backend
- CI pipeline configuration
- Performance or load testing
- Production code changes

## Decisions

1. **Raku testing with built-in `Test` + `Test::Mock`** — Use Raku's core `Test` module and `Proc::Async` to start the server and send WebSocket messages. No external test framework needed.
2. **JS testing with Vitest + happy-dom** — Vitest provides a modern test runner compatible with vanilla JS. happy-dom provides a browser-like DOM without a real browser. Playwright is overkill for unit-testing DOM rendering logic.
3. **Test file layout** — `t/server.t` for Raku backend tests, `t/frontend.test.js` for JS frontend tests. The `t/` directory is standard for Raku projects.
4. **Documentation as markdown** — `README.md` for user-facing guide, `CONTRIBUTING.md` for developer setup and test commands. Both in project root.
5. **No spec tests (yet)** — The proposal identifies two new capabilities (`automated-tests`, `project-documentation`), but these are meta-capabilities. The specs define what the tests and docs should cover, not what the production system does.

## Risks / Trade-offs

- **Fragile DOM tests** — Rendering tests rely on DOM structure. If the UI layout changes, tests need updating. Mitigation: keep selectors stable (use data attributes or IDs).
- **No real WebSocket in tests** — Using Vitest + happy-dom means WebSocket behavior must be mocked/stubbed. A true end-to-end test would need Playwright hitting the real server. Mitigation: mock the WS layer and test message handling logic separately.
