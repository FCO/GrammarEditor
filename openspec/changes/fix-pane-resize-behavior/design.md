## Context

The `updateRightHalf()` function in `index.html` currently sets `leftHalf.style.flex = '3'` when exactly one of Trace/Match is visible, making the Grammar and String panes grow to 75% width. The desired behavior is to keep the 50/50 left/right split and let the single visible pane fill the right column.

## Goals / Non-Goals

**Goals:**
- When only Trace is visible, it fills the full right column
- When only Match is visible, it fills the full right column
- When both are visible, 50/50 split (unchanged)
- When both are hidden, Grammar+String fill the full width (unchanged)

**Non-Goals:**
- No changes to toggle controls, panel structure, or other layout logic
- No CSS changes — only the JS function needs modification

## Decisions

- **Remove `leftHalf` flex override in single-pane state**: The current code sets `leftHalf.style.flex = '3'` when one pane is visible. This is the only change needed — remove that line so `leftHalf` keeps its default `flex: 1` from CSS.
- **Keep all other logic as-is**: The `.single` class already makes the remaining panel fill the right column (`flex: 1`). The right-half `flex: 1` inline override is redundant but harmless.
- **No CSS changes required**: The existing CSS rules (`#right-half.single > .panel:not(.collapsed) { flex: 1; }`) already handle the single-pane fill behavior.

## Risks / Trade-offs

- **Minimal risk**: Single-line change in a well-understood function. CSS handles all layout behavior already.
