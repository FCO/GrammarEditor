## Why

Hovering over trace or match items is meant to provide visual feedback across panels, but the current implementation has several issues: it highlights the wrong match element (all siblings with the same rule name share the same path), the opacity is too high, match-to-trace reverse highlighting is missing, and match hover doesn't highlight the string region.

## What Changes

- Fix node path generation to include child indices, making each trace/match node uniquely addressable
- Reduce hover highlight opacity from 0.15 to a lower value
- Add hover handlers on match nodes that highlight the corresponding trace node
- Add string region highlighting when hovering over match nodes (currently only trace nodes do this)
- All highlighting uses the same color per rule path for consistency

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `grammar-editor-ui`: The "String region highlighting on hover" and "Color-coded trace display" requirements are updated to cover match-to-trace highlighting and reduced opacity

## Impact

- Only `index.html` (the inline script) and `js/editor.js` need changes
- No backend or spec changes
- No new dependencies
