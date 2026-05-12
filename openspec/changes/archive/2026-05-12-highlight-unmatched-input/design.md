## Context

The Input pane displays the user's test string with syntax coloring applied per matched rule. The `renderStringColored()` function already computes which character ranges are matched by collecting all trace nodes with `pos_start`/`pos_end` and assigning each character position to the deepest matching node. Characters not covered by any node are rendered as plain text with no visual distinction.

The trace tree from the backend provides full position coverage of all attempted parses. Unmatched characters are simply the gaps between matched `[pos_start, pos_end)` intervals in the leaf-level trace nodes.

## Goals / Non-Goals

**Goals:**
- Mark every character in the input string that is not within any matched trace node's `[pos_start, pos_end)` range
- Use a red squiggly underline style consistent with the error color theme
- The marking updates automatically on every parse (same debounce cycle as existing coloring)
- The marking is purely visual and does not affect textarea interaction

**Non-Goals:**
- Interactive hover/tooltip on unmatched regions (the error pane + zigzag markers already cover error details)
- Backend changes — the position data is already sufficient
- Differentiating between partial vs total parse failure (any unmatched character gets the same treatment)

## Decisions

### Decision 1: Leverage existing `renderStringColored()` function
- **Chosen**: Modify the existing `renderStringColored()` to add a red squiggly span class for characters where `posRule[i]` is null. Use a CSS class `.unmatched-char` with `text-decoration: wavy underline #f38ba8`.
- **Alternatives considered**:
  - *Separate SVG overlay*: More complex, harder to sync with text scroll.
  - *Separate rendering pass*: Would duplicate the character-position loop.
- **Rationale**: The `renderStringColored` function already iterates character positions and builds HTML. Adding a style for the unmatched case (the `else` branch at line 1176) is minimal and leverages existing infrastructure.

### Decision 2: Unmatched characters preserve nearest rule color or fall back to grey
- **Chosen**: For characters where `posRule[i]` is null (unmatched), walk outward to the nearest enclosing matched node's color. If none exists (no match at all), use grey (`#6c7086`). Apply the red wavy underline on top regardless.
- **Alternatives considered**:
  - *Make unmatched text invisible/transparent*: Hides the input, making debugging harder.
  - *Plain default text color*: Doesn't distinguish unmatched from matched at a glance.
- **Rationale**: Preserving the parent rule color gives context about which rule "owned" that position. Grey fallback ensures unmatched text is still readable but clearly secondary to matched regions.

### Decision 3: CSS `text-decoration: wavy underline` over SVG path
- **Chosen**: CSS `text-decoration: wavy underline` via a `<span style="...">` wrapper.
- **Alternatives considered**:
  - *SVG zigzag overlay*: Used for error markers, but unmatched regions may span many characters — CSS text-decoration handles this natively.
  - *`border-bottom` with dashed/ dotted*: Less visually clear than wavy.
- **Rationale**: CSS text-decoration wavy is declarative, performs well on long spans, and is supported in all modern browsers. The wavy underline is a standard visual convention for errors in editors.

### Decision 4: Compute unmatched ranges from leaf-level trace nodes
- **Chosen**: Use the deepest (leaf) trace nodes' positions to determine the matched character set. Gaps between these intervals are unmatched.
- **Alternatives considered**:
  - *Using top-level match only*: Would miss partial matches where some children succeed and others fail.
  - *Using all nodes regardless of depth*: Would create larger "matched" regions than actually consumed.
- **Rationale**: Leaf nodes represent the actual atomic matches. Their union gives the precise set of characters consumed by the grammar.

## Risks / Trade-offs

- **[Risk]** `text-decoration: wavy` render varies slightly across browsers (Chrome, Safari, Firefox) → **Mitigation**: Accept minor visual differences; the red color is the primary signal.
- **[Trade-off]** If the entire string is matched, no unmatched styling is applied — correct behavior, no performance cost.
- **[Trade-off]** Long unmatched spans at the end of the input get a single wavy underline — acceptable and expected.
