## ADDED Requirements

### Requirement: Grammar compilation caching

The backend SHALL cache compiled grammar types by source code string to avoid redundant EVAL calls. When the same grammar code is received again, the cached type SHALL be reused. The cache key SHALL be the grammar code string itself. Cached grammars SHALL retain their method wrappers (trace instrumentation and infinite-loop protection).

#### Scenario: Repeated grammar uses cached type
- **WHEN** the same grammar code is received twice in sequence
- **THEN** the second evaluation SHALL reuse the cached type instead of re-EVALing

#### Scenario: Different grammar code compiles fresh
- **WHEN** a different grammar code is received
- **THEN** the backend SHALL EVAL the new code and cache the result separately

### Requirement: Actions class caching

The backend SHALL cache compiled and instantiated actions objects by source code string. When the same actions code is received again, the cached instance SHALL be reused.

#### Scenario: Repeated actions code uses cached instance
- **WHEN** the same actions code is received twice
- **THEN** the second evaluation SHALL reuse the cached actions instance

#### Scenario: Grammar changes invalidate cached actions
- **WHEN** grammar code changes but actions code stays the same
- **THEN** the cached actions object SHALL still be valid and reusable

### Requirement: Infinite loop counter resets per call

The infinite-loop protection counter SHALL reset to zero for each call to `process-grammar`, even when the grammar type is reused from cache. This SHALL be implemented using a dynamic variable (`$*PARSE-COUNT`) set before each parse call.

#### Scenario: Counter resets between cached calls
- **WHEN** two separate calls use the same cached grammar
- **THEN** the infinite loop counter SHALL start from zero for each call
- **AND** SHALL NOT accumulate across calls
