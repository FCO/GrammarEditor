## 1. Add GET / Route

- [x] 1.1 Add `get -> '/'` route in the `route` block that reads `index.html` and returns it with `Content-Type: text/html`
- [x] 1.2 Resolve the file path relative to `$*PROGRAM.parent` so the server works from any working directory

## 2. Update Start-up Message

- [x] 2.1 Change the server start-up message to include `http://localhost:3001`
- [x] 2.2 Update `AGENTS.md` to reflect the simplified workflow (just `raku server.raku` then visit `http://localhost:3001`)
