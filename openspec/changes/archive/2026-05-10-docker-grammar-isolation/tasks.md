## 1. Worker Script

- [x] 1.1 Create `grammar-worker.raku` with Cro::HTTP server, POST `/eval` endpoint that calls `process-grammar` from GrammarEngine
- [x] 1.2 Add GET `/health` endpoint returning `{"status": "ok"}`
- [x] 1.3 Support `--port` argument for configurable port (default 9000)

## 2. Server Changes

- [x] 2.1 Add `Cro::HTTP::Client` to server dependencies
- [x] 2.2 Replace direct `process-grammar` call in `server.raku` with HTTP POST to worker
- [x] 2.3 Implement configurable timeout (env var `GRAMMAR_TIMEOUT`, default 10s)
- [x] 2.4 Handle timeout and connection errors, return appropriate JSON error responses
- [x] 2.5 Read worker URL from env var `GRAMMAR_WORKER_URL` (default `http://localhost:9000`)

## 3. Docker

- [x] 3.1 Create `Dockerfile.worker` with Raku + Cro + GrammarEngine module
- [x] 3.2 Create `docker-compose.yml` with server and worker services, worker resource limits
- [x] 3.3 Create `.dockerignore` excluding unnecessary files

## 4. Verify

- [x] 4.1 Worker runs standalone, `/eval` returns correct trace/match
- [x] 4.2 Server delegates to worker and returns correct response to browser
- [x] 4.3 Timeout error returned when worker is slow/unreachable
- [x] 4.4 `docker-compose up` starts both services and editor works end-to-end
