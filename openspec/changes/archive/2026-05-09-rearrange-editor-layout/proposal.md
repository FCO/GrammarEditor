## Why

The current 2x2 grid layout places the grammar trace and match panels on top of each other (right column). This wastes horizontal space and makes the trace panel narrow vertically, limiting visibility of the trace tree. Placing trace and match side-by-side gives both panels more usable space and creates a clearer visual flow: grammar input → string input → trace → match results.

## What Changes

- **MODIFIED**: Change the layout from a 2x2 grid (two columns × two rows) to a left-half/right-half split. The left half is split top/bottom (grammar code on top, input string on bottom). The right half is split left/right (trace on left, match on right), with both trace and match spanning the full height of the right half.

## Capabilities

### New Capabilities

<!-- No new capabilities -->

### Modified Capabilities

- `grammar-editor-ui`: The four-panel layout requirement changes from a 2x2 grid to a new arrangement: grammar (top-left), string (bottom-left), trace (top-right), match (bottom-right). Specifically, trace and match switch from stacked (top/bottom) to side-by-side (left/right).

## Impact

- Only `index.html` CSS (grid layout) and HTML (panel ordering) need changes
- No backend changes
- No new dependencies
