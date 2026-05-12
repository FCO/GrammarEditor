## 1. Setup and Infrastructure

- [x] 1.1 Install `@playwright/test` as a dev dependency
- [x] 1.2 Create `e2e/` directory structure with `fixtures.js`, `mock-server.js`
- [x] 1.3 Add `test:e2e` script to `package.json` that starts server, runs Playwright, stops server
- [x] 1.4 Create `playwright.config.js` with chromium, headless mode, port 3002 for test server
- [x] 1.5 Create `e2e/fixtures.js` — helper to wait for WS connection, debounce timeout, and response parsing

## 2. Test: Application Load and Default Content

- [x] 2.1 Write test: page loads with default grammar and input string
- [x] 2.2 Write test: status bar shows "Connected" after WS connects

## 3. Test: Grammar Evaluation (Trace, Match, Made, String Coloring)

- [x] 3.1 Write test: valid grammar produces trace tree with MATCH badges and fail badges
- [x] 3.2 Write test: match panel shows parsed match data
- [x] 3.3 Write test: string input area shows colored output after evaluation
- [x] 3.4 Write test: error panel appears on invalid grammar with error message
- [x] 3.5 Write test: Ctrl+Enter forces immediate re-parse
- [x] 3.6 Write test: made panel displays .made value when actions are provided

## 4. Test: Trace Tree Interaction

- [x] 4.1 Write test: trace nodes expand/collapse on click
- [x] 4.2 Write test: top-level nodes expanded by default (depth < 2)
- [x] 4.3 Write test: hovering trace node highlights string region
- [x] 4.4 Write test: trace and match trees both render after evaluation

## 5. Test: Match Tree Interaction

- [x] 5.1 Write test: match tree shows matched rules with data
- [x] 5.2 Write test: match nodes display captured string data

## 6. Test: String Coloring Details

- [x] 6.1 Write test: matched characters render as colored spans
- [x] 6.2 Write test: unmatched characters get `unmatched-char` class with wavy underline
- [x] 6.3 Write test: partial match shows mixed colored and unmatched characters

## 7. Test: Panel Visibility and View Modes

- [x] 7.1 Write test: toggle checkboxes hide/show panels
- [x] 7.2 Write test: hiding last right panel hides right half
- [x] 7.3 Write test: DSL button shows only Input + Made panels (disabled after click)
- [x] 7.4 Write test: PRO button shows all panels (disabled after click)

## 8. Test: Theme Selection

- [x] 8.1 Write test: theme dropdown populated with 12+ options
- [x] 8.2 Write test: changing theme re-evaluates grammar (new highlight colors)

## 9. Test: Panel Resize Handles

- [x] 9.1 Write test: resize handles exist between adjacent visible panels

## 10. Test: URL Snapshot Sharing

- [x] 10.1 Write test: Share button triggers snapshot creation via POST /_store
- [x] 10.2 Write test: snapshot store endpoint returns grammar, string, and actions data

## 11. Test: Actions Editor

- [x] 11.1 Write test: actions panel toggle shows/hides the actions editor
- [x] 11.2 Write test: made panel shows value from evaluation when visible

## 12. Test: Keyboard Shortcuts

- [x] 12.1 Write test: Tab inserts tab character in grammar editor
- [x] 12.2 Write test: Tab inserts tab character in actions editor

## 13. Test: Error Zigzag Overlay

- [x] 13.1 Write test: zigzag SVG appears on parse error
- [x] 13.2 Write test: error body shows error message when error occurs

## 14. Test: Responsive Layout

- [x] 14.1 Write test: narrow viewport (375px) stacks panels vertically

## 15. Test: WebSocket Reconnection

- [x] 15.1 Write test: closing WS shows "Reconnecting..." status (via /admin/close-ws endpoint)
- [x] 15.2 Write test: reconnects and resumes evaluations after WS close

## 16. Test: File Operations

- [x] 16.1 Write test: save grammar triggers download
- [x] 16.2 Write test: save string triggers download
- [x] 16.3 Write test: open grammar loads file content via file chooser

## 17. Test: Grammar Syntax Highlighting

- [x] 17.1 Write test: highlight output shows grammar code on page load
- [x] 17.2 Write test: highlight updates on grammar input
- [x] 17.3 Write test: empty grammar shows empty highlight
- [x] 17.4 Write test: empty grammar after non-empty clears highlight
- [x] 17.5 Write test: actions highlight shows actions code

## 18. Test: Hover Interaction (Cross-Panel)

- [x] 18.1 Write test: trace node hover highlights corresponding match node
- [x] 18.2 Write test: match node hover highlights string region
- [x] 18.3 Write test: match node hover highlights corresponding trace node

## 19. Test: Theme Color Change

- [x] 19.1 Write test: changing theme changes string coloring palette colors
- [x] 19.2 Write test: highlight output is populated after theme change

## 20. Test: Additional Coverage

- [x] 20.1 Write test: error tooltip appears on zigzag hover
- [x] 20.2 Write test: grammar panel toggle hides and shows grammar editor

## 21. Verification

- [x] 21.1 Run `npm run test:e2e` and confirm all tests pass (65/65)
- [x] 21.2 Run `npm test` and confirm existing Vitest tests still pass (58/58)
