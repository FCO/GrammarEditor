## Why

Grammar execution currently runs in-process via `EVAL`. A hung or crashed grammar takes down the entire Cro server. Isolating execution in a Docker container with a TTL prevents server-wide failures and adds proper timeout handling.

## What Changes

- Create a new `grammar-worker.raku` script that runs grammar evaluation (imports `GrammarEngine` module)
- Create a `Dockerfile` for the worker image
- Modify `server.raku` to delegate grammar execution to the worker container via HTTP, with a configurable timeout
- Add a TTL mechanism — if the worker doesn't respond within the timeout, the server returns a timeout error
- Add `docker-compose.yml` to orchestrate both server and worker containers

## Capabilities

### New Capabilities
- `grammar-execution-worker`: A Docker container that receives grammar + string via HTTP, runs the parse, and returns trace/match results. Supports resource limits and TTL via Docker.

### Modified Capabilities
- `grammar-engine-api`: The WebSocket endpoint now delegates to the worker instead of in-process EVAL. Adds timeout error scenario. The compilation and parse requirement is split — the server sends to the worker, worker does the actual EVAL.

## Impact

- New files: `grammar-worker.raku`, `Dockerfile`, `docker-compose.yml`
- Modified: `server.raku` (replace direct `process-grammar` call with HTTP request to worker)
- New dependency: `Cro::HTTP::Client` on the server side
- New dependency: Docker (for production deployment)
- The worker can also be run standalone for testing without Docker
