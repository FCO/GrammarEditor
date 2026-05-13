## 1. Implementation

- [x] 1.1 Add `%grammar-cache` and `%action-cache` module-level hashes
- [x] 1.2 Replace `$count` with dynamic `$*PARSE-COUNT` in method wrappers
- [x] 1.3 Restructure `process-grammar` to cache-hit/miss pattern, removing `.AST.DEPARSE` / `.AST.EVAL`
- [x] 1.4 Set `my $*PARSE-COUNT = 0` before each parse call

## 2. Verification

- [x] 2.1 Run `raku -I. t/server.t` and confirm all backend tests pass (12/12)
- [x] 2.2 Run `npm run test:e2e` and confirm frontend tests still pass (101/101)
- [x] 2.3 Run `npm test` and confirm Vitest tests still pass (58/58)
