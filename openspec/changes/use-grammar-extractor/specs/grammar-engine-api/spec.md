## MODIFIED Requirements

### Requirement: Infinite loop protection

The backend SHALL enforce an execution timeout (default 10 seconds) for grammar evaluation to prevent infinite loops from hanging the server. If the timeout is exceeded, it SHALL return an error response.

#### Scenario: Infinite loop caught by timeout
- **WHEN** a grammar causes an infinite recursive parse
- **THEN** the parse eventually hangs
- **AND** the execution timeout is reached
- **THEN** the server returns `{error: "Grammar execution timed out"}`

### Requirement: Execution timeout

The backend SHALL enforce a configurable timeout (default 10 seconds) for grammar evaluation. If the worker does not respond within the timeout, the backend SHALL return a timeout error to the client.

#### Scenario: Grammar execution times out
- **WHEN** a grammar takes longer than the configured timeout to evaluate
- **THEN** the server returns `{"error": "Grammar execution timed out"}`

#### Scenario: Worker unavailable
- **WHEN** the server cannot connect to the grammar worker
- **THEN** the server returns `{"error": "Grammar worker unavailable"}`
