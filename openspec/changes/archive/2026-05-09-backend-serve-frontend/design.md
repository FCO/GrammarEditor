## Context

The Cro server currently only exposes a WebSocket endpoint at `/ws`. Adding a `GET /` route to serve `index.html` is a straightforward addition using Cro's `static` helper or a simple `get` route that reads the file.

## Goals / Non-Goals

**Goals:**
- Visiting `http://localhost:3001` renders the grammar editor
- The WebSocket endpoint at `/ws` continues to work unchanged
- The server startup message includes the HTTP URL

**Non-Goals:**
- No caching, compression, or performance optimizations
- No support for other static files (CSS, JS — everything is inlined in `index.html`)

## Decisions

1. **Inline file read in a `get` route** — Use Cro's `content` response with `Cro::HTTP::Response` body set to the file content. No need for a static file middleware since there's only one file.
2. **Read file at request time** — Simple and works with file changes during development. Reading a small HTML file per request has negligible overhead.
3. **Set Content-Type header** — Explicitly set `Content-Type: text/html` to ensure the browser renders the page correctly.

## Risks / Trade-offs

- **File path assumption** — The server assumes `index.html` is in the current working directory. Mitigation: resolve the path relative to `$*PROGRAM.parent` to make it work when started from any directory.
