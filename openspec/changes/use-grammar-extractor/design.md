## Context

`GrammarEngine.rakumod` currently compiles grammar code via `$code.EVAL`, wraps every regex method at runtime with tracing/infinite-loop-protection logic, and serializes Match objects for the response. `Grammar::Extractor` (authored by the same person) provides this exact functionality as a reusable module: it accepts grammar code as a string via `:code`, wraps rules at construction time, and exposes a `.step` tree with `Grammar::Extractor::Step` nodes. The module is already published to the Raku ecosystem and is the natural replacement for the inline code.

## Goals / Non-Goals

**Goals:**
- Replace inline grammar compilation (`$code.EVAL`) with `Grammar::Extractor.new(:code($code))`
- Replace manual regex method wrapping for trace construction with `Grammar::Extractor`'s Step tree
- Preserve the exact JSON response format: `{trace, match, made, error, error_line, error_col, error_source}` so the frontend needs no changes
- Preserve `serialize-match` for the `match` field (not provided by `Grammar::Extractor`)
- Add a thin trace-format conversion layer to map Step nodes to the existing `{rule, match, data, pos_start, pos_end, children}` format
- Keep `process-grammar` function signature unchanged: `(Str $code, Str $string, Str $actions?) returns Hash`

**Non-Goals:**
- Full adoption of every `Grammar::Extractor` API (.visit, .grep, .map, .dump, etc.) — only `.step` and `:code/:grammar` constructors are needed
- Changing the frontend trace/match display logic
- Overhauling the worker-based delegation in `server.raku`
- Adding new capabilities beyond what exists today

## Decisions

1. **Use `:code` constructor exclusively** — The frontend always sends grammar as source code text. `Grammar::Extractor.new(:code($code))` handles compilation internally. If actions code is provided, we keep the current actions-EVAL pattern and pass the actions object to `$extractor.parse($string, :$actions)`.

2. **Trace conversion layer in GrammarEngine** — Add a `step-to-trace(Step $step)` sub that converts `Grammar::Extractor::Step` nodes to the existing `{rule, match, data, pos_start, pos_end, children}` format. Mapping:
   - `$step.name` → `rule`
   - `$step.Bool` → `match`
   - `$step.str-or-missing` → `data`
   - `$step.result.from` → `pos_start`
   - `$step.result.to` → `pos_end`
   - `$step.children.map(&step-to-trace)` → `children`

3. **Infinite loop protection** — `Grammar::Extractor` does not implement an internal recursion limit. We wrap `.parse` in a `Promise` with a timeout (as before via the worker in `server.raku`). The infinite-loop counter is no longer needed since `Grammar::Extractor`'s wrapping strategy avoids the recursion counting issue; but we keep the execution timeout at the server level.

4. **Keep actions EVAL** — `Grammar::Extractor.parse` accepts `:$actions` natively. We continue to EVAL actions code and instantiate the class, then pass the object. No change needed.

5. **Keep serialize-match** — `Grammar::Extractor` does not expose a serialized match tree. The existing `serialize-match` sub is independent and works on `Grammar::Extractor`'s `.result` Match objects, so it stays.

6. **Error handling** — `Grammar::Extractor.new(:code(...))` throws on compilation errors. We catch the exception and return the structured error format. Runtime parse errors are caught and returned similarly.

## Risks / Trade-offs

- **New external dependency** → Mitigated: `Grammar::Extractor` is maintained by the same person, co-located in the Raku ecosystem, and has zero transitive dependencies.
- **Trace format mismatch** → Mitigated by the thin conversion layer; the frontend never sees Step objects directly.
- **Grammar::Extractor bug affects parse tracing** → Mitigated: tests in `t/server.t` cover the trace format assertions. If the module changes behavior, tests catch it.
- **Infinite loop detection removed** → The recursive-method wrapping in `Grammar::Extractor` uses a different mechanism; if infinite loops become possible, we can add a `$*MAX-STEPS` dynamic variable in a later iteration. For now, the Cro-level timeout via the worker provides safety.
