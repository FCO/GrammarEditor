## Why

Currently grammar compilation and runtime errors are displayed in a thin fixed bar at the bottom of the page. This is hard to notice, lacks visual connection to the offending code, and provides no positional context about where the error occurred. A dedicated error pane with inline error markers will make errors immediately visible and actionable, improving the debugging experience.

## What Changes

- Replace the fixed `#error-bar` with a dedicated **Error panel** that appears in the layout only when an error is present
- Add **inline error markers** — a red zigzag underline (similar to IDE spell-check underlines) on the affected text in the grammar/actions/string editor, positioned at the error's line/column
- Show a **tooltip** on hover over the marked position with the full error message
- Have the backend return **structured error data** (line, column, source) instead of a plain error string, so the frontend can position markers accurately
- The Error panel shows the error message text and is collapsible like other panels (Trace, Match, Made)

## Capabilities

### New Capabilities
- `raku-error-handling`: Structured error response from the backend (line, column, source, message) and frontend display with error pane, inline zigzag markers, and tooltip

### Modified Capabilities
- (none — no existing spec requirements are changing, only new behavior is being added)

## Impact

- **Backend** (`GrammarEngine.rakumod`): Parse compilation/runtime exceptions to extract line, column, and source context. Return structured error JSON instead of a plain string.
- **Backend** (`grammar-worker.raku`): Propagate structured error responses unchanged.
- **Backend** (`server.raku`): Unchanged (passes through responses as-is).
- **Frontend** (`index.html`): Replace `#error-bar` with panel-based error display. Add inline SVG/canvas overlay for zigzag markers on the grammar/actions/string textareas. Add tooltip logic on markers.
- **New capability spec**: Create `openspec/specs/raku-error-handling/spec.md`.
