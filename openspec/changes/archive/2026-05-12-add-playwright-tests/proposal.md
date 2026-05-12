## Why

The project currently has Vitest unit tests covering individual JS functions, but no end-to-end or integration tests that verify the full application works correctly in a browser. Adding Playwright tests will catch regressions in UI behavior, WebSocket communication, and cross-panel interactions that unit tests cannot cover.

## What Changes

- Add Playwright as a dev dependency
- Create a Playwright test suite covering all frontend features
- Add a `npm run test:e2e` script to run Playwright tests
- Update the CI/test workflow to run Playwright tests alongside existing Vitest tests
- Add configuration for running the Raku backend server in test mode

## Capabilities

### New Capabilities

- `e2e-tests`: End-to-end Playwright test suite covering grammar editing, syntax highlighting, trace/match rendering, string coloring, error display, panel toggles, view modes, theme selection, resize handles, file save/open, URL sharing, WebSocket connection, and responsive layout

### Modified Capabilities

- (none)

## Impact

- New dev dependency: `@playwright/test`
- New file: `e2e/` directory with Playwright test specs
- New NPM script: `test:e2e`
- Must ensure the Raku backend (`server.raku`) can be started/stopped in test fixtures
- Existing `t/` directory and Vitest config remain unchanged
