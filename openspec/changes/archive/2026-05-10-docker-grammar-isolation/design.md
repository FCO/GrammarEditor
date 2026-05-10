## Context

Grammar execution currently runs in-process via `EVAL` inside `GrammarEngine.rakumod`. The `process-grammar` function is called directly from the WebSocket handler in `server.raku`. A grammar that hangs (infinite loop that bypasses the 1000-call limit) or crashes (segfault from native code) takes down the entire Cro server. There is no timeout mechanism — a slow grammar blocks the server indefinitely.

## Goals / Non-Goals

**Goals:**
- Move grammar execution into a separate Docker container
- Add a configurable timeout (TTL) for grammar evaluation
- The Cro server stays responsive even if the worker crashes or hangs
- Both server and worker can be orchestrated via docker-compose
- Worker can be run standalone for development/testing without Docker

**Non-Goals:**
- No multi-tenant isolation (only one user at a time)
- No horizontal scaling of workers
- No persistent storage or job queues
- No changes to the frontend

## Decisions

1. **Worker as HTTP server, not stdin/stdout** — A lightweight Cro::HTTP server inside the worker container. The main server sends an HTTP POST with the grammar + string. HTTP was chosen over stdin/stdout (docker run per request) because it avoids container startup latency and over WebSocket because it's simpler for a request-response pattern.

2. **Server-side timeout** — The main server uses `Cro::HTTP::Client` with a `timeout` of 10 seconds (configurable via env var `GRAMMAR_TIMEOUT`). If the worker doesn't respond in time, the server returns `{"error": "Grammar execution timed out"}` to the client. This is the TTL mechanism.

3. **Docker resource limits** — The worker container has memory limits (e.g., 256MB) and CPU limits via Docker Compose `deploy.resources`. This prevents runaway grammars from consuming host resources.

4. **Shared `lib/` volume** — Both server and worker use the same `GrammarEngine.rakumod` module. In Docker, the module is copied into both images. For development, a bind mount can be used.

5. **Worker URL configurable via env var** — The server reads `GRAMMAR_WORKER_URL` (default `http://localhost:9000`) to locate the worker. This makes it easy to run without Docker (start worker manually) or in different environments.

6. **Separate Dockerfile for worker** — `Dockerfile.worker` is a minimal image with just Raku + Cro + GrammarEngine. The main server uses the existing `Dockerfile` (or one focused on server).

## Architecture

```
┌──────────────┐   WebSocket   ┌──────────────┐   HTTP POST    ┌──────────────────┐
│   Browser    │ ◀──────────▶  │  Cro Server  │ ────────────▶  │ Grammar Worker   │
│  (index.html)│               │  server.raku │ ◀────────────  │ grammar-worker   │
│              │               │  port 3001   │   response     │ .raku port 9000  │
└──────────────┘               └──────────────┘                └──────────────────┘
                                                                  ┌──────────────┐
                                                                  │ GrammarEngine │
                                                                  │ .rakumod     │
                                                                  └──────────────┘
```

## Risks / Trade-offs

- **Worker startup latency** — The worker container starts once (not per request), so latency is low. Docker Compose `depends_on` ensures the worker is running before the server accepts connections.
- **Network overhead** — HTTP introduces some latency vs in-process EVAL. Typically <1ms on the same Docker network, negligible vs grammar parse time.
- **Worker crash recovery** — If the worker crashes, the server gets a connection error. Docker Compose `restart: always` restarts the worker. The server retries on the next request.
- **Timeout too short** — Complex grammars might need >10s. Mitigation: make timeout configurable via env var.
