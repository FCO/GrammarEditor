## ADDED Requirements

### Requirement: HTTP evaluation endpoint

The worker SHALL expose an HTTP POST endpoint at `/eval` that accepts a JSON body with `grammar` and `string` fields. It SHALL call `process-grammar` from `GrammarEngine` and return the result as JSON.

#### Scenario: Successful evaluation
- **WHEN** the worker receives a POST to `/eval` with `{"grammar": "token TOP { \\<digit\\>+ }", "string": "123"}`
- **THEN** it returns a JSON response with `trace` and `match` fields matching the GrammarEngine output format

#### Scenario: Compilation error returned
- **WHEN** the worker receives invalid grammar code
- **THEN** it returns a JSON response with an `error` field containing the compilation error message

### Requirement: Health check endpoint

The worker SHALL expose a GET `/health` endpoint that returns `{"status": "ok"}` for Docker health checks and orchestration.

#### Scenario: Health check succeeds
- **WHEN** the worker receives a GET to `/health`
- **THEN** it returns `{"status": "ok"}`

### Requirement: Standalone mode

The worker SHALL be runnable outside Docker via `raku grammar-worker.raku` for development and testing. It SHALL accept an optional `--port` argument (default 9000).

#### Scenario: Starts on default port
- **WHEN** the worker is started with no arguments
- **THEN** it listens on port 9000

#### Scenario: Starts on custom port
- **WHEN** the worker is started with `--port 9001`
- **THEN** it listens on port 9001
