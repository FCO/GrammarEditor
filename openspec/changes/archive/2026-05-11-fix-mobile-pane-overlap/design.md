## Context

The grammar and actions editors use a textarea-over-pre layout: a transparent textarea (z-index: 2) overlays a `<pre>` with syntax-highlighted text (z-index: 1). Both are absolutely positioned within an `.editor-container` (position: relative, height: 100%). On mobile (≤768px), the layout stacks panels vertically and the app switches to `height: auto`. This breaks the `height: 100%` chain for `.editor-container`, causing the textarea and pre to collapse to 0 height or miscalculate, resulting in clipped or invisible text.

## Goals / Non-Goals

**Goals:**
- Grammar and actions editors show full text on mobile (≤768px)
- Ensure `.editor-container` has a defined height on mobile so the textarea and pre fill the panel correctly
- Preserve the syntax-highlighting overlay behavior (textarea on top, pre behind)
- Keep desktop layout unchanged

**Non-Goals:**
- No changes to the WebSocket, backend, or grammar evaluation
- No changes to the trace, match, or string panels (string panel uses a different highlight mechanism)
- No responsive adaptation beyond the existing 768px breakpoint

## Decisions

- **Use `height: 100%` with proper flex parent**: On mobile, the `#app` has `height: auto; min-height: 100vh`. The `.editor-container { height: 100% }` needs its parent `.panel-body` to have a defined height. Adding `height: 100%` to `.panel-body` within the mobile media query ensures the height chain is complete.
- **Override `overflow` on `.panel-body` on mobile**: Ensure `.panel-body` doesn't clip its absolutely-positioned children. `overflow: hidden` instead of `overflow: auto` prevents scrollbar interference on mobile.
- **Keep textarea `overflow: auto`**: The textarea itself still scrolls independently; the `<pre>` scroll position is synced via JS. On mobile this sync works the same as desktop.
- **No JS changes**: The fix is purely CSS within the existing `@media (max-width: 768px)` block.

## Risks / Trade-offs

- [Scroll sync might be slightly off if panel-body overflow changes] → Test on real mobile devices. The JS scroll sync fires on textarea scroll and updates the pre's scrollTop/scrollLeft, so it should stay aligned.
- [Setting panel-body height: 100% might conflict with flex] → In modern browsers, `height: 100%` on a flex child resolves correctly when the parent has a definite height. The panel gets its height from the stacked flex layout on mobile (panel with min-height: 200px), so panel-body's `height: 100%` resolves to the available space after the header.
