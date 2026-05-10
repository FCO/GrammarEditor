## Context

The editor currently has a flex-based layout where all panel sizes are determined by CSS flex rules. The Grammar and String panels have save/open buttons in their headers, but the Actions panel (added recently) lacks these. Users must manually copy/paste actions code to save it. Additionally, none of the panels have draggable resize handles, so users cannot adjust the layout to prioritize certain panels.

## Goals / Non-Goals

**Goals:**
- Add save/open buttons to the Actions panel header (reuse existing save/open pattern)
- Add draggable resize handles between all adjacent panels: left/right halves, grammar/actions/string, trace/match, top-row/made
- Resize handles are visually subtle (thin line, hover cursor) and follow the editor's dark theme
- Panel sizes persist within a session (until page reload)

**Non-Goals:**
- No persistence of panel sizes across sessions (no localStorage)
- No changes to the Made panel's display behavior
- No changes to the backend

## Decisions

### Reuse existing save/open pattern for Actions

The Grammar and String panels already use `data-action="save-grammar"` and `data-action="open-grammar"` buttons with event handlers. The Actions panel will follow the same pattern: `data-action="save-actions"` and `data-action="open-actions"`. Save uses `saveFileAs()` with a `.rakumod` extension. Open uses `pickAndReadFile()`.

### Generic resize handle with pointer events

A single `makeResizeHandle(handleEl, prevEl, nextEl, direction)` function handles all resize cases:
- `handleEl`: the resize handle div
- `prevEl`: the element before the handle
- `nextEl`: the element after the handle  
- `direction`: `'horizontal'` for up/down, `'vertical'` for left/right

On mousedown, it captures the mouse position, then on mousemove it calculates the delta and adjusts the `flex` (flex-grow) of the adjacent panels proportionally. It uses `pointer-events` to avoid issues with text selection during drag.

### Resize handles as sibling divs in the flex flow

Each handle is a thin `<div class="resize-handle" data-dir="row|col">` placed between the two flex items it separates. The handle itself has `flex: 0 0 4px` (thin) and a CSS `cursor: row-resize` or `cursor: col-resize`.

## Risks / Trade-offs

- **Actions panel collapsed by default**: The save/open buttons are only visible when the Actions panel is toggled on. This is acceptable since it matches the existing pattern (collapsed panels don't show their header buttons).
- **Resize with collapsed panels**: When a panel is collapsed (e.g., Actions or Made), its adjacent resize handles should also hide. Each handle tracks its panel visibility to avoid orphaned dividers.
- **Minimum panel sizes**: No minimum size enforcement — users could collapse a panel by dragging too far. Mitigation: the design is simple, and Ctrl+Enter or panel toggle resets flex values.
