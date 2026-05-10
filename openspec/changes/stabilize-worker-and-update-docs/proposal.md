## Why

The Proc::Async subprocess approach for grammar evaluation spawns a full `raku` process per request, causing OOM crashes under load (exit code 137). The worker becomes unstable and returns "connection refused" to the server. A lighter in-process approach using `Promise.start` avoids the memory overhead while still providing timeout detection.

Documentation and tests also need updating to reflect the current two-container architecture (server + worker).

## What Changes

- Replace `Proc::Async` + `eval-runner.raku` subprocess in `grammar-worker.raku` with in-process `Promise.start` + `Promise.anyof` timeout
- Remove `eval-runner.raku` (no longer needed)
- Update `README.md` with architecture diagram (server + worker), setup steps, and docker-compose usage
- Update `AGENTS.md` with new file structure and commands
- Update `t/server.t` for the new worker delegation pattern
- Add `t/worker.t` with tests for the grammar worker endpoint

## Capabilities

### New Capabilities
- `<none>`

### Modified Capabilities
- `grammar-execution-worker`: Worker changes from subprocess to in-process Promise-based evaluation with timeout

## Impact

- `grammar-worker.raku` — rewritten to use `Promise.start` instead of `Proc::Async`
- `eval-runner.raku` — deleted
- `Dockerfile.worker` — remove eval-runner.raku copy
- `README.md` — updated for new architecture
- `AGENTS.md` — updated
- `t/server.t` — updated for delegation pattern
- `t/worker.t` — new test file
