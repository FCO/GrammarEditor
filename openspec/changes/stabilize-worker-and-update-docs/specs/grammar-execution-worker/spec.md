## MODIFIED Requirements

### Requirement: HTTP evaluation endpoint

The worker SHALL expose an HTTP POST endpoint at `/eval` that accepts a JSON body with `grammar` and `string` fields. It SHALL evaluate the grammar by calling `process-grammar` from `GrammarEngine` on a thread pool thread via `Promise.start`, raced against a configurable timeout. If the evaluation exceeds the timeout, it SHALL return a timeout error.

#### Scenario: Successful evaluation
- **WHEN** the worker receives a POST to `/eval` with `{"grammar": "token TOP { \\<digit\\>+ }", "string": "123"}`
- **THEN** it returns a JSON response with `trace` and `match` fields matching the GrammarEngine output format

#### Scenario: Evaluation times out
- **WHEN** the grammar evaluation takes longer than the configured timeout
- **THEN** the worker returns `{"error": "Grammar execution timed out"}`

#### Scenario: Compilation error returned
- **WHEN** the worker receives invalid grammar code
- **THEN** it returns a JSON response with an `error` field containing the compilation error message
