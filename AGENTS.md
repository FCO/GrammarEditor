# Grammar-Editor

Browser-only Raku grammar editor. No backend needed — runs Raku grammars entirely in the browser via MemoizedDOM's `perl6.js` compiled Raku runtime.

## Architecture

- **Frontend**: `index.html` — single-file HTML/CSS/JS app.
- **Highlighting**: Uses [Shiki](https://shiki.style) with its built-in Raku TextMate grammar (`@shikijs/langs/raku`). Highlighted via `js/highlight.js` which imports Shiki from CDN (esm.sh) or node_modules in tests.
- **Raku runtime**: `perl6.js` (74MB) + `webperl.js` — compiled Raku runtime that runs in the browser. Loads on page init, executes grammar compilation and matching in-browser.
- **Grammar engine**: Ported from `lib/GrammarEngine.rakumod` to a `<script type="text/perl6">` block in `index.html`. Compiled and run by `webperl.js` on page load.

## Run

Open `index.html` directly in any modern browser:

```bash
open index.html
```

For local testing with a simple HTTP server (better for loading `perl6.js`):

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

The 74MB `perl6.js` runtime takes a few seconds to load on first visit.

## Usage

- Edit grammar code in the top-left panel (Raku syntax highlighted live)
- Edit the input string in the top-right panel
- Trace and Match panels update automatically (debounced 300ms)
- Hover trace items to see highlighted regions in the string panel
- Ctrl+Enter (or Cmd+Enter) to force re-parse
- Errors appear in a bar at the bottom

## Tests

```bash
npm test
```

## Convention

- Frontend: vanilla HTML/CSS/JS in `index.html`
- Grammar engine: `<script type="text/perl6">` block inside `index.html`
- Core logic extracted to `js/editor.js`, `js/highlight.js` for testing
- Raku runtime assets: `perl6.js`, `webperl.js` (from [MemoizedDOM](https://github.com/FCO/MemoizedDOM))
- Tests in `t/` directory
- Changes tracked in `openspec/changes/<name>/`


