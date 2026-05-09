## Context

The current editor uses a CSS grid with 2 columns and 2 rows: grammar (top-left), string (top-right), trace (bottom-left), match (bottom-right). This gives the trace and match panels reduced vertical space. The new layout keeps the left column (grammar, string) unchanged but places trace and match side-by-side in the right column, giving both full-height visibility.

## Goals / Non-Goals

**Goals:**
- Left half of the screen: grammar editor (top), input string (bottom)
- Right half of the screen: trace (left), match (right), both full height
- Trace and match panels have equal width within the right half

**Non-Goals:**
- No changes to panel content, backend, or WebSocket protocol
- No breakpoints or responsive behavior (desktop-only)

## Decisions

1. **CSS Grid with 3 columns + nested flex** — Use `grid-template-columns: 1fr 1fr` for the outer two halves. Left half uses `flex-direction: column`, right half uses `flex-direction: row`. This keeps the structure readable and avoids complex grid spans.
2. **Minimal HTML changes** — Only reorder the panel divs in the HTML; no new elements or classes needed beyond the wrapping containers.
3. **No JavaScript changes** — The panels are identified by their `id` attributes, which stay the same. Only CSS and HTML structure change.

## Risks / Trade-offs

- **Nested flex containers** adds one extra DOM level, but has no performance impact
- **Trace/match panel height** stays consistent since both now span the full right-half height, which is an improvement
