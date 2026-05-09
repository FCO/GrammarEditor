## Context

The frontend renders trace and match trees from grammar parse results. Each node gets a path string used for color assignment and cross-panel highlighting. Currently paths are derived from rule names only (e.g., `/TOP/digit`), so sibling nodes with the same rule name share a path. This causes three bugs:

1. **Wrong match highlight** — `matchNodeMap` stores only the last element for each path; all trace hovers to that path point to the same match element
2. **No match→trace highlight** — only trace→match highlighting exists
3. **No string highlight on match hover** — only trace hovers light up the string panel

Additionally, the highlight opacity of 0.15 is too high, obscuring the underlying content.

## Goals / Non-Goals

**Goals:**
- Each trace and match node has a unique, addressable path
- Reducing opacity to 0.08 so highlighted content remains readable
- Adding mouseenter/mouseleave handlers on match nodes for trace highlighting
- Adding string region highlighting on match node hover
- Colors are consistent across trace, match, and string panels

**Non-Goals:**
- No changes to the backend trace/match data structures
- No changes to WebSocket or rendering logic beyond path generation and hover handlers

## Decisions

1. **Include child index in paths** — Change path generation in both `renderTraceNode` and `renderMatchNode` from `path + '/' + ruleName` to `path + '/' + index + '-' + ruleName`. This makes sibling nodes unique (e.g., `/0-TOP/0-digit`, `/0-TOP/1-digit`), fixing color assignment and highlight targeting.
2. **Opacity 0.08** — Reduced from 0.15. Tested to provide visual feedback without obscuring text.
3. **Match hover mirrors trace hover** — Add the same three effects on match-node mouseenter: highlight the trace node (by path), highlight the string region, and highlight itself. On mouseleave, clear all.
4. **Colors stay rule-based** — The color palette assignment uses the full path (which now includes the index), so sibling nodes get different colors. This is intentional — each invocation of a rule gets its own tracking color.

## Risks / Trade-offs

- **Path format change** — Existing saved/bookmarked states won't be affected (no persistence). The change is purely in-memory.
- **More DOM listeners** — Each match node now has hover handlers. For very large parse trees (1000s of nodes), this could impact performance. Mitigation: event delegation if it becomes an issue.
