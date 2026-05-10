## 1. Worker Stability

- [ ] 1.1 Rewrite `grammar-worker.raku`: replace Proc::Async with Promise.start + Promise.anyof timeout
- [ ] 1.2 Remove debug logging, keep only essential logs
- [ ] 1.3 Remove `eval-runner.raku` and update `Dockerfile.worker`

## 2. Documentation

- [ ] 2.1 Update `README.md` with two-container architecture, docker-compose usage, and new file listing
- [ ] 2.2 Update `AGENTS.md` with worker details and docker-compose commands

## 3. Tests

- [ ] 3.1 Add `t/worker.t` with tests for worker eval endpoint (standalone mode, health check, basic eval)
- [ ] 3.2 Verify existing `t/server.t` still passes (GrammarEngine unchanged)
- [ ] 3.3 Verify `t/frontend.test.js` still passes

## 4. Verify

- [ ] 4.1 Worker starts and responds to `/health`
- [ ] 4.2 Normal grammar evaluates correctly via worker
- [ ] 4.3 Invalid grammar returns error
- [ ] 4.4 Hanging grammar times out after configured timeout
- [ ] 4.5 No OOM crashes under repeated requests
