## ADDED Requirements

### Requirement: Structured error response

The backend SHALL return structured error data when a grammar compilation, actions compilation, or runtime error occurs. The response SHALL include the existing `error` field with the human-readable message, plus `error_line` (integer), `error_col` (integer), and `error_source` (string, one of `"grammar"`, `"actions"`, or `"runtime"`) fields.

#### Scenario: Grammar compilation error with position

- **WHEN** the grammar code contains a syntax error at line 5, column 8
- **THEN** the response SHALL contain `{"error": "...compiler message...", "error_line": 5, "error_col": 8, "error_source": "grammar"}`

#### Scenario: Actions compilation error with position

- **WHEN** the actions code contains a syntax error at line 3, column 12
- **THEN** the response SHALL contain `{"error": "...compiler message...", "error_line": 3, "error_col": 12, "error_source": "actions"}`

#### Scenario: Runtime error without position

- **WHEN** an infinite loop or other runtime error occurs
- **THEN** the response SHALL contain `{"error": "...error message...", "error_line": 0, "error_col": 0, "error_source": "runtime"}`

#### Scenario: Successful parse (no error)

- **WHEN** the grammar compiles and the parse succeeds
- **THEN** the response SHALL NOT contain `error`, `error_line`, `error_col`, or `error_source` fields

#### Scenario: Line/column not extractable

- **WHEN** the error message does not contain detectable line/column information
- **THEN** the response SHALL contain `{"error": "...", "error_line": 0, "error_col": 0, "error_source": "runtime"}`

### Requirement: Error panel display

The UI SHALL display errors in a collapsible Error panel instead of the current fixed error bar. The Error panel SHALL be located in the right column, below the Made panel. It SHALL be hidden by default and SHALL only appear when there is an active error.

#### Scenario: Error panel hidden on load

- **WHEN** the page loads without any error
- **THEN** the Error panel is not visible

#### Scenario: Error panel shown on error

- **WHEN** the backend returns a response containing an `error` field
- **THEN** the Error panel becomes visible
- **AND** the panel displays the error message text

#### Scenario: Error panel hides on successful parse

- **WHEN** a subsequent successful parse response arrives (no `error` field)
- **THEN** the Error panel becomes hidden again

#### Scenario: Error panel toggle

- **WHEN** the user clicks the Error panel toggle in the toggles bar
- **THEN** the Error panel shows or hides accordingly
- **AND** the toggle reflects the current visibility state

### Requirement: Inline zigzag error markers

The UI SHALL render a red zigzag underline on the text in the affected editor at the position indicated by `error_line` and `error_col`. The zigzag SHALL extend to the end of the line or until the error span ends. The marker SHALL be rendered as an SVG overlay positioned on top of the editor container.

#### Scenario: Zigzag shown in grammar editor

- **WHEN** the backend returns an error with `error_source: "grammar"`, `error_line: 5`, and `error_col: 8`
- **THEN** a red zigzag underline appears on line 5 of the grammar editor starting at column 8

#### Scenario: Zigzag shown in actions editor

- **WHEN** the backend returns an error with `error_source: "actions"`, `error_line: 3`, and `error_col: 12`
- **THEN** a red zigzag underline appears on line 3 of the actions editor starting at column 12

#### Scenario: No zigzag for runtime errors

- **WHEN** the backend returns an error with `error_source: "runtime"` (line=0, col=0)
- **THEN** no zigzag marker is shown in any editor
- **AND** the error message is shown only in the Error panel

#### Scenario: Zigzag clears on successful parse

- **WHEN** a subsequent successful parse response arrives
- **THEN** all zigzag markers are removed

### Requirement: Error tooltip on hover

Hovering over the zigzag marker SHALL display a tooltip containing the full error message text. The tooltip SHALL be positioned near the marker and SHALL disappear when the cursor leaves the marker area.

#### Scenario: Tooltip shown on hover

- **WHEN** the user hovers cursor over a zigzag marker
- **THEN** a tooltip appears with the error message text

#### Scenario: Tooltip hidden on leave

- **WHEN** the user moves the cursor away from the zigzag marker
- **THEN** the tooltip disappears
