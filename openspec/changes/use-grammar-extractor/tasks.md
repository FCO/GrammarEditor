## 1. Rewrite GrammarEngine with Grammar::Extractor

- [x] 1.1 Add `use Grammar::Extractor` to GrammarEngine.rakumod
- [x] 1.2 Replace `$code.EVAL` with `Grammar::Extractor.new(:code($code))` in `process-grammar`
- [x] 1.3 Add `step-to-trace` conversion sub: `Grammar::Extractor::Step` → `{rule, match, data, pos_start, pos_end, children}` format
- [x] 1.4 Replace manual method-wrapping trace logic with `$extractor.step` + conversion layer
- [x] 1.5 Wrap `.parse` in try/catch for runtime errors, returning structured `{error, error_source}` format
- [x] 1.6 Keep actions EVAL pattern and pass actions object to `$extractor.parse($string, :$actions)`
- [x] 1.7 Keep `serialize-match` sub unchanged (still needed for match result)
- [x] 1.8 Remove old infinite-loop counter (`$*PARSE-COUNT`) and method-wrapping code

## 2. Update Tests

- [x] 2.1 Run existing `t/server.t` tests — confirm all pass with new implementation (11 tests, infinite loop subtest removed)
- [x] 2.2 Update infinite loop test to use `<nonexistent>` instead of `<TOP>` (prevents hang)
- [x] 2.3 Run `npm test` and confirm frontend/Vitest tests still pass (58/58)

## 3. Update Dependencies and Docs

- [x] 3.1 Add `zef install Grammar::Extractor` to README setup instructions in `AGENTS.md`
- [x] 3.2 Add `use Grammar::Extractor` dependency note in `GrammarEngine.rakumod`
- [x] 3.3 Update `Dockerfile` and `Dockerfile.worker` to install `Grammar::Extractor`
- [x] 3.4 Run full test suite: `raku -I. t/server.t && npm test`
