## Why

Currently users must run the backend server and separately open the HTML file in a browser. Adding a `GET /` route that serves `index.html` makes the editor a single-command experience — just start the server and visit `http://localhost:3001`.

## What Changes

- Add a `GET /` route to the Cro server that reads and serves `index.html`
- Update the startup message to point at `http://localhost:3001` instead of just the WS endpoint
- No changes to the frontend code itself

## Capabilities

### New Capabilities

- `server-served-frontend`: The Cro server serves the editor HTML page at the root URL, making the editor accessible via `http://localhost:3001` with a single `raku server.raku` command

### Modified Capabilities

<!-- No existing specs modified -->

## Impact

- Only `server.raku` needs changes (add route, update log message)
- No new dependencies
