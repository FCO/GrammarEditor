## Context

The grammar worker currently uses `Proc::Async` to spawn a `raku eval-runner.raku` subprocess for each grammar evaluation. In production, this causes OOM crashes (exit code 137) because each subprocess loads the full Raku runtime (~50-100MB). Under load, multiple concurrent subprocesses exceed the container's memory limit, the kernel sends SIGKILL, and the worker becomes unavailable ("connection refused").

## Goals / Non-Goals

**Goals:**
- Eliminate OOM crashes by removing the subprocess approach
- Keep timeout detection for hanging grammars
- Update docs (README, AGENTS.md) to reflect the two-container architecture
- Add/update tests for the worker and server delegation

**Non-Goals:**
- No changes to the server-side caching or timeout
- No changes to the frontend
- No changes to Docker Compose orchestration

## Decisions

1. **`Promise.start` instead of `Proc::Async`** — Run `process-grammar` on a thread pool thread via `Promise.start`. Race against `Promise.in(timeout)` using `Promise.anyof`. If timeout wins, return timeout error. The stuck thread is abandoned but Docker resource limits prevent abuse. No subprocess means no OOM.

2. **`$eval.status == Kept` check** — After `Promise.anyof`, check `$eval.status` directly (not `$timer ~~ Kept`) to determine which promise resolved first. This avoids the previous bug where `$timer ~~ Kept` was always True after the timeout.

3. **Remove `eval-runner.raku`** — No longer needed since we don't use subprocesses. Remove from `Dockerfile.worker` COPY.

4. **Remove debug logging** — Clean up the verbose log messages added during debugging. Keep only essential logs (received eval, timeout, errors).

## Architecture

```
Worker request flow (after change):

POST /eval
  │
  ├─ Promise.start({ process-grammar(...) })  ← thread pool
  ├─ Promise.in(timeout)                       ← timer
  │
  └─ Promise.anyof(eval, timer)
       │
       ├─ eval wins → content JSON result
       └─ timer wins → content timeout error
                        (eval thread abandoned)
```

## Risks / Trade-offs

- **Abandoned threads** — A hanging grammar thread is abandoned, not killed. Over time, accumulated threads could exhaust the thread pool. Mitigation: Docker memory limits eventually OOM-kill the container, orchestrator restarts it. Server-side caching prevents repeated hits on the same hanging grammar.
- **Thread pool exhaustion** — If many requests hang simultaneously, the Raku thread pool could run out of threads. Mitigation: Cro's thread pool has 16+ threads. Production load is single-user.
