## Context

Currently when the Raku grammar compiler or runtime produces an error, `GrammarEngine.process-grammar()` catches the exception and returns `{error: <string>}`. This is a flat error string with no positional metadata. The frontend displays it in a fixed `#error-bar` at the bottom of the viewport. There is no visual link between the error message and the offending code in the grammar/actions/string editors.

The Raku error string typically contains line and column information (e.g., `at /tmp/grammar-XXXXX:5.8` or `at /tmp/grammar-XXXXX:1`), but this is not parsed or used by the frontend.

The codebase has four editable text areas: grammar editor, actions editor, and string (input) editor. Errors can originate from:
1. Grammar compilation (Raku compiler error)
2. Actions compilation (Raku compiler error)  
3. Runtime during parse (infinite loop, method not found, etc.)

## Goals / Non-Goals

**Goals:**
- Replace the fixed `#error-bar` with a **collapsible Error panel** that appears in the layout only when there are active errors
- Extract line/column position from backend error responses and render **inline zigzag red underlines** at the error location in the affected editor
- Show the full error message as a **tooltip** when hovering over the zigzag marker
- Have the backend return **structured error data** (`line`, `column`, `source`) alongside the error message
- The Error panel auto-shows when a new error arrives and auto-hides when errors clear

**Non-Goals:**
- Multi-error display (only the first error is shown, matching current behavior)
- Real-time error checking as-you-type (errors are still shown after debounced send, same as now)
- Error squiggles on closed/collapsed editors (they reopen when the error source is relevant)
- i18n or error message translation

## Decisions

### Decision 1: Backend returns structured error data
- **Chosen**: Parse the exception in `GrammarEngine.process-grammar()` to extract line and column before returning. Add `error_line`, `error_col`, and `error_source` fields to the error response.
- **Alternatives considered**:
  - *Frontend-parsed Raku error message*: Fragile — Raku error formats vary across versions and error types.
  - *Backend returns raw exception object*: Not serializable to JSON; would need custom serialization anyway.
- **Rationale**: Structured data is precise (line/column parsed in Raku where it's most reliable), backwards-compatible (existing `error` field retained), and the frontend logic becomes simple.

### Decision 2: Inline markers via absolutely-positioned SVG overlay
- **Chosen**: An SVG overlay positioned on top of each editor container. The overlay contains a `<path>` with a red zigzag (`M ... L ...`) that spans the error line at the error column.
- **Alternatives considered**:
  - *Canvas overlay*: Harder to integrate with tooltip positioning.
  - *CSS `text-decoration` on textarea*: Not possible — textarea can't style individual lines.
  - *CSS pseudo-elements on the highlight `<pre>`*: The `<pre>` is behind the textarea; would need z-index coordination.
- **Rationale**: SVG is declarative, easy to position absolutely, supports hover events for tooltips, and integrates with the existing editor-container pattern (textarea + pre + highlights).

### Decision 3: Error panel is a collapsible right-column panel
- **Chosen**: The Error panel lives in `#right-half`, below the right-top-row and the Made panel. It uses the same collapsed-by-default pattern as the Actions and Made panels.
- **Alternatives considered**:
  - *Full-width bar below panel-area*: Would break the left/right column visual structure.
  - *Modal/overlay*: Too intrusive for an editor.
  - *Toast notification*: Dismissed too easily; user may want to reference the error.
- **Rationale**: Consistent with the existing panel system (collapsible, togglable, same visual hierarchy). It's visible-but-not-intrusive and dismissable.

### Decision 4: Backend parses error line/column from the exception string
- **Chosen**: In `GrammarEngine.process-grammar()`, the CATCH block uses a Raku regex to extract `line` and `column` from the exception's `.Str` or `.backtrace`. `error_source` is inferred from context (grammar vs actions depending on which EVAL failed).
- **Alternatives considered**:
  - *Modify `eval-runner.raku` to rescue separately for grammar vs actions*: More complex, requires changing the subprocess interface.
  - *Use Raku's `$!.line` and `$!.column` on the exception*: Not all exceptions have these methods; fallback regex parsing provides robustness.
- **Rationale**: The regex approach handles most real-world Raku compiler errors and all runtime errors gracefully (defaulting to line 1, col 1 if position can't be determined).

## Risks / Trade-offs

- **[Risk]** Raku error message format may change between versions → **Mitigation**: Backend regex is version-independent (matches common patterns), and structured parsing still falls back to the plain error string if extraction fails.
- **[Risk]** Line/column from `/tmp/grammar-XXXXX:5` refers to the temp file, not the original editor content → **Mitigation**: The backend subtracts any wrapper code offset (e.g., `my grammar MyGrammar { ... }` in wrapping) so the line/column maps to the user's actual code. For unwrapped grammars, the offset is zero.
- **[Trade-off]** Parsing error position adds a small overhead on error responses → Acceptable since errors are infrequent and the response is already an error path.
- **[Trade-off]** The zigzag SVG only marks one error position → Acceptable because Raku compilers generally report the first error only.
