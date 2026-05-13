## Context

`process-grammar` in `GrammarEngine.rakumod` EVALs grammar/actions code on every invocation. The module-level cache stores compiled types by source string key. Method wrapping (for trace/infinite-loop protection) is done once at cache time. The infinite-loop counter uses a dynamic variable `$*PARSE-COUNT` set per-call so it resets correctly.

## Goals / Non-Goals

**Goals:**
- Cache compiled grammar and actions types by source code
- Maintain correct infinite-loop protection across cached calls
- Keep the function signature and return format unchanged

**Non-Goals:**
- LRU eviction (cache grows unbounded; acceptable for an editor session)
- Thread safety (single-threaded Cro server)

## Decisions

1. **String key caching** — Use `$code` (the source string) directly as hash key. No hashing needed; Raku's `Str` keys are hash-consed.
2. **Dynamic variable for counter** — `my $*PARSE-COUNT = 0` before each parse call, mirrored on the existing `@*CHILDREN` pattern. The wrapped methods resolve `$*PARSE-COUNT` at runtime through the call stack.
3. **Cache-then-use pattern** — Wrap methods only once during cache miss. On cache hit, just set `$*PARSE-COUNT` and use the cached grammar.
4. **Actions cached as instantiated objects** — `$actions.EVAL.new` cached by source string. Actions objects are assumed stateless (idiomatic Raku grammar actions).

## Risks / Trade-offs

- [Cache never evicted] → Acceptable for single-user editor sessions; a restart clears it.
- [Actions with state would accumulate] → Idiomatic Raku actions avoid state; if needed, a `clone` could be added.
