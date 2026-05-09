## ADDED Requirements

### Requirement: Raku test suite for server.raku

The test suite SHALL validate server.raku's grammar compilation, parsing, trace tree output, match serialization, and error handling without starting a real server. Tests SHALL import and call `process-grammar` and `serialize-match` directly.

#### Scenario: Valid grammar compiles and parses
- **WHEN** `process-grammar` is called with a valid grammar like `token TOP { <digit>+ }` and string `"123"`
- **THEN** the result SHALL contain a `trace` field with a nested tree structure
- **AND** the result SHALL contain a `match` field with the nested match structure

#### Scenario: Compilation error returns error
- **WHEN** `process-grammar` is called with invalid grammar code (e.g., `token TOP { <unclosed`)
- **THEN** the result SHALL contain an `error` field with a non-empty string

#### Scenario: Infinite loop protection
- **WHEN** `process-grammar` is called with a grammar that causes repeated rule invocation (e.g., left-recursive grammar)
- **THEN** the result SHALL contain an `error` field with "Infinite loop"

#### Scenario: Trace node contains position data
- **WHEN** `process-grammar` returns a trace tree
- **THEN** every trace node SHALL have `pos_start` and `pos_end` integer fields

#### Scenario: Match serialization is correct
- **WHEN** a parse succeeds
- **THEN** the `match` field SHALL mirror the grammar's match tree with `rule` and `data` fields and nested `children`

#### Scenario: Empty grammar compiles and returns trace
- **WHEN** `process-grammar` is called with empty grammar string
- **THEN** the result SHALL contain a trace (may be a failed parse)

### Requirement: JS test suite for index.html

The test suite SHALL validate the frontend's syntax highlighting, WebSocket message handling, trace rendering, match rendering, string highlighting on hover, error display, and reconnection behavior. Tests SHALL run in a DOM-like environment using Vitest + happy-dom.

#### Scenario: Syntax highlighting produces colored spans
- **WHEN** `highlightRaku` is called with Raku grammar code containing keywords like `token`, `grammar`, strings, and comments
- **THEN** the output SHALL contain `<span>` elements with CSS classes `hl-keyword`, `hl-string`, `hl-comment`, `hl-rule-name`, etc. as appropriate

#### Scenario: WebSocket sends grammar and string on change
- **WHEN** the grammar or string textarea value changes
- **THEN** a WebSocket message with `{grammar, string}` SHALL be sent after a debounce delay

#### Scenario: Ctrl+Enter forces immediate send
- **WHEN** the user presses Ctrl+Enter (or Cmd+Enter) in the grammar editor
- **THEN** a WebSocket message SHALL be sent immediately (without debounce)

#### Scenario: Trace tree renders match and fail badges
- **WHEN** `renderTrace` is called with a trace tree containing matched and failed nodes
- **THEN** the DOM SHALL contain elements with classes `tree-badge match` and `tree-badge fail` as appropriate

#### Scenario: Trace node contains rule name and data
- **WHEN** a trace node is rendered
- **THEN** the DOM SHALL contain the rule name text
- **AND** if the node has `data`, it SHALL be displayed in a `.tree-data` element

#### Scenario: Hover on trace node highlights string region
- **WHEN** the user hovers over a rendered trace node with `pos_start`/`pos_end`
- **THEN** a `.string-highlight` element SHALL appear in the highlights container with the correct position and color

#### Scenario: Match tree renders nested structure
- **WHEN** `renderMatch` is called with a match tree containing nested `children`
- **THEN** the DOM SHALL contain `.match-node` elements with `.match-rule-name` and `.match-data` spans in a nested `.match-children` structure

#### Scenario: Error message shown in error bar
- **WHEN** the backend returns a response with an `error` field
- **THEN** the error bar element SHALL be visible with the error text

#### Scenario: WebSocket reconnection on disconnect
- **WHEN** the WebSocket connection closes
- **THEN** the client SHALL attempt to reconnect with exponential backoff starting at 1 second
- **AND** the status bar SHALL display "Reconnecting..."

#### Scenario: Tab key inserts tab character
- **WHEN** the user presses Tab in the grammar editor
- **THEN** a tab character SHALL be inserted at the cursor position
- **AND** the default browser focus-change behavior SHALL be prevented

