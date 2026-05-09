# Contributing

## Architecture

The application consists of:

- **Backend** (`server.raku`): A Raku/Cro WebSocket server. Listens on `localhost:3001`, serves `index.html` at `/`, accepts grammar + input strings at `/ws`, compiles the grammar, parses the input, and returns a JSON trace tree and match result.
- **Frontend** (`index.html`): A single-file vanilla JS application with four panels (grammar editor, string input, trace, match). Connects to the backend via WebSocket. Uses a custom Raku syntax highlighter.
- **Shared modules**: `lib/GrammarEngine.rakumod` for the core processing logic, `js/editor.js` for the frontend rendering functions.

## Running Tests

### Raku Backend Tests

```bash
raku -I. t/server.t
```

### JS Frontend Tests

```bash
npm test
```

Or in watch mode:

```bash
npm run test:watch
```

## Code Style

- Raku code follows standard Raku conventions
- JS code uses vanilla JS (no frameworks), ES module syntax for shared modules
- Keep the single-file `index.html` approach — no build step

## Making Changes

1. Test-driven: write or update tests first
2. Run both test suites before committing
3. Update `AGENTS.md` with any new commands or workflows
