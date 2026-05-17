## Why

The current `GrammarEngine.rakumod` implements custom grammar compilation via `EVAL` and manual regex method wrapping for trace tree construction. This logic has been extracted into a dedicated module — `Grammar::Extractor` — which provides the same capabilities in a reusable, tested package. Replacing the inline code with this dependency reduces maintenance burden, eliminates duplicated logic, and leverages richer introspection APIs (visit, grep, map, Seq, etc.) without custom code.

## What Changes

- Replace `$code.EVAL` grammar compilation with `Grammar::Extractor.new(:code($code))`
- Replace manual regex method wrapping (for trace/infinite-loop detection) with `Grammar::Extractor`'s built-in Step tree
- Add a trace-format conversion layer to map `Grammar::Extractor::Step` nodes to the existing `{rule, match, data, pos_start, pos_end, children}` JSON format
- Keep `serialize-match` unchanged — `Grammar::Extractor` does not provide match-result serialization
- Add `Grammar::Extractor` as a zef dependency
- Remove `extract-error` and infinite-loop counter — replaced by `Grammar::Extractor`'s error propagation or simplified wrapper

## Capabilities

### New Capabilities

- (none — this is a pure implementation replacement)

### Modified Capabilities

- `grammar-engine-api`: Internal implementation changes — the external API (`process-grammar` signature and return shape) remains unchanged

## Impact

- `lib/GrammarEngine.rakumod` — rewrite `process-grammar` to use `Grammar::Extractor`, add trace-format converter, remove manual wrapping
- `t/server.t` — existing tests should pass as-is (return format unchanged); may add/remove a few tests for new error semantics
- Add `zef install Grammar::Extractor` to README / setup instructions
- No frontend changes required — the trace and match JSON shapes are preserved
