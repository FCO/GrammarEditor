## Why

Each call to `process-grammar` re-EVALs the grammar code and actions code, creating new Raku types every time — even when the code hasn't changed. Caching compiled grammars significantly reduces latency for repeated evaluations of the same code.

## What Changes

- Add `%grammar-cache` and `%action-cache` hashes to `GrammarEngine.rakumod`
- Cache compiled grammar and actions by source code string key
- Replace lexical `$count` with dynamic `$*PARSE-COUNT` so the infinite loop counter resets per parse call (existing caching attempt broke this)
- Remove incorrect `.AST.DEPARSE` / `.AST.EVAL` calls (strings don't have `.AST`)

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `grammar-engine-api`: Add caching behavior to `process-grammar`

## Impact

- `lib/GrammarEngine.rakumod` — add cache hashes, restructure function, use dynamic counter
- No new dependencies
- No API changes (function signature unchanged)
