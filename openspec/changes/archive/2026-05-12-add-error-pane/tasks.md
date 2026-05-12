## 1. Backend: Structured error response

- [x] 1.1 Add error position extraction logic in `GrammarEngine.process-grammar()` — parse line/column from exception via regex, add `error_line`, `error_col`, `error_source` to error response
- [x] 1.2 Update `GrammarEngine.process-grammar()` to distinguish grammar vs actions vs runtime error sources
- [x] 1.3 Add tests in `t/` for structured error response (compilation error, actions error, runtime error, successful parse)

## 2. Frontend: Error panel HTML and CSS

- [x] 2.1 Add Error panel markup to `index.html` (panel container, header with "Error" label, toggle in toggles bar)
- [x] 2.2 Add CSS for Error panel (same pattern as Made/Actions panels; red-tinted styling for error states)
- [x] 2.3 Remove the old fixed `#error-bar` element and its CSS
- [x] 3.1 Update `handleResponse()` to show/hide Error panel based on presence of `error` field
- [x] 3.2 Update `showError()` / `hideError()` to target the new Error panel instead of `#error-bar`
- [x] 3.3 Wire Error panel toggle to show/hide behavior (matching existing panel toggle pattern)
- [x] 4.1 Add SVG overlay element inside each editor container (grammar, actions, string)
- [x] 4.2 Implement function to draw a red zigzag path at given line/column coordinates
- [x] 4.3 Implement function to clear all zigzag markers
- [x] 4.4 Call zigzag drawing on error response, clearing on successful parse
- [x] 4.5 Ensure zigzag repositions on editor scroll (sync with textarea scroll)
- [x] 5.1 Add tooltip element (positioned absolute, follows the marker)
- [x] 5.2 Show tooltip with error message on hover over zigzag marker
- [x] 5.3 Hide tooltip on mouse leave

## 6. Verify and test

- [x] 6.1 Start server and worker, verify error pane appears on compilation error
- [x] 6.2 Verify zigzag marker renders at correct line/col in grammar editor
- [x] 6.3 Verify zigzag marker renders at correct line/col in actions editor
- [x] 6.4 Verify tooltip shows error message on hover
- [x] 6.5 Verify error panel hides on successful parse
- [x] 6.6 Run `raku -I. t/server.t` to confirm backend tests pass
- [x] 6.7 Run `npm test` to confirm frontend tests pass
