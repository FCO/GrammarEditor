## ADDED Requirements

### Requirement: Execution timeout

The backend SHALL enforce a configurable timeout (default 10 seconds) for grammar evaluation. If the worker does not respond within the timeout, the backend SHALL return a timeout error to the client.

#### Scenario: Grammar execution times out
- **WHEN** a grammar takes longer than the configured timeout to evaluate
- **THEN** the server returns `{"error": "Grammar execution timed out"}`

#### Scenario: Worker unavailable
- **WHEN** the server cannot connect to the grammar worker
- **THEN** the server returns `{"error": "Grammar worker unavailable"}`
