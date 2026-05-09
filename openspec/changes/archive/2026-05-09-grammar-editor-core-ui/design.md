## Context

This project aims to build a web-based Raku grammar editor. The current state is a blank repo with an AGENTS.md describing the intended architecture. The backend logic exists in a sibling Raku project (`selkie-ui-grammar-playground.raku`) which uses a TUI (terminal UI) framework. We need to extract the grammar instrumentation logic and expose it via WebSocket, and build a web frontend inspired by regex101.com.

## Goals / Non-Goals

**Goals:**
- Single-page web app with four equal-height panels: grammar editor, input string, trace, match results
- Raku/Cro WebSocket backend that compiles and runs grammars with instrumented tracing
- Rainbow-based syntax highlighting in the grammar editor
- Color-coded trace tree showing matched (green) and failed (red) rules
- Visual correlation: hovering/selecting a trace item highlights the corresponding substring in the input string and the match result
- Error display for grammar compilation and runtime errors

**Non-Goals:**
- User authentication or saved sessions
- Collaborative editing
- Mobile-optimized layout (desktop-first)
- Full Raku IDE features (autocomplete, linting)

## Decisions

1. **Plain HTML/CSS/JS (no framework)** — keeps dependencies minimal. The app is a single page with four panels; no routing, state management library, or build step needed.
2. **Rainbow JS library** for syntax highlighting — already identified in AGENTS.md. Renders Raku tokens with CSS color spans.
3. **Cro WebSocket** — Cro is the standard Raku web framework, has built-in WebSocket support, and aligns with the Raku ecosystem.
4. **JSON messages over WebSocket** — simple request/response protocol: client sends `{grammar, string}`, server replies with `{trace, match, error}`.
5. **Same-color correlation via trace indices** — each trace node includes the matched substring's start/end position. The frontend uses these positions to highlight the corresponding region in the string panel and match panel, reusing the trace item's assigned color.
6. **Debounced auto-parse** — the frontend debounces input changes (300ms) and sends updated grammar/string to the backend, avoiding unnecessary round trips.
7. **Single HTML file for frontend** — during development, keep everything in one file; split into separate files only if complexity warrants it.

## Risks / Trade-offs

- **Grammar eval safety**: `EVAL`ing user-supplied Raku code is inherently dangerous. Mitigation: this is a local dev tool, not a public service. Add an infinite-loop guard (copied from the existing backend) and a recursion limit.
- **WebSocket reconnection**: If the Cro server restarts, the client needs to reconnect automatically. Mitigation: add a simple reconnection loop with exponential backoff.
- **Performance on complex grammars**: Deeply nested trace trees could be expensive to render. Mitigation: limit trace depth and/or virtualize the trace list if needed.
