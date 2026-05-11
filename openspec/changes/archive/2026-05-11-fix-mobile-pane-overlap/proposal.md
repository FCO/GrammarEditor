## Why

On mobile (viewport ≤768px), the grammar and actions editor panes show only part of the text — an overlay or layout issue clips the visible area. Users on phones and small tablets can't read or edit grammar code properly.

## What Changes

- Fix editor-container height calculation on mobile so the textarea and syntax-highlight `<pre>` fill the available space
- Ensure the `<pre>` highlight overlay doesn't clip or misalign with the textarea on narrow viewports
- No changes to desktop layout (≥768px)
- No changes to functionality or behavior

## Capabilities

### New Capabilities
- (none — this is a bug fix, not a new capability)

### Modified Capabilities
- `grammar-editor-ui`: The responsive layout requirement at ≤768px SHALL render the grammar and actions editors with full text visibility (no clipping, no overlapping elements).

## Impact

- `index.html`: CSS changes within the `@media (max-width: 768px)` block — editor-container height rules, panel-body overflow handling, textarea/pre alignment
