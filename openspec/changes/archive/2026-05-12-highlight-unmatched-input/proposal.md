## Why

When a grammar only partially matches the input string, unmatched characters currently appear as plain unstyled text in the Input pane. This makes it hard to visually identify which parts of the input were not consumed by the grammar. A red squiggly underline on unmatched substrings provides immediate visual feedback about parse failures, improving the debugging experience.

## What Changes

- Render unmatched substrings in the Input pane with a red squiggly underline (CSS `text-decoration: wavy underline`)
- Unmatched characters retain the text color of the nearest enclosing matched rule if available; fall back to grey (`#6c7086`) if no rule context exists — this keeps the text visible and distinguishable
- The highlighting is based on the trace tree's `pos_start`/`pos_end` data already returned by the backend — no backend changes needed
- Unmatched regions are calculated as gaps between matched ranges in the trace tree
- The red squiggly matches the error color theme (`#f38ba8`)

## Capabilities

### New Capabilities
- `unmatched-input-highlight`: Visual marking of characters in the input string not matched by any grammar rule

### Modified Capabilities
- (none — the existing `grammar-editor-ui` spec already covers string coloring but this adds a new behavior as a new capability)

## Impact

- **Frontend** (`index.html`): Modify `renderStringColored()` to apply red squiggly styling to unmatched characters. Or add a new rendering pass/layer specifically for unmatched markers.
- **Backend**: No changes — the existing trace position data is sufficient to compute unmatched ranges.
- **Tests** (`t/frontend.test.js`): Add tests verifying unmatched substrings get the red squiggly style.
