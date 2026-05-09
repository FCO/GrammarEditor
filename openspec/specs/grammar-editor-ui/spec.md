## ADDED Requirements

### Requirement: Four-panel layout

The UI SHALL display four panels in a left-half/right-half layout. The left half SHALL be split top/bottom with the grammar editor on top and the input string on the bottom, both occupying the full width of the left half. The right half SHALL be split left/right with the grammar trace on the left and the match results on the right, both occupying the full height of the right half.

#### Scenario: Layout renders correctly on load

- **WHEN** the page loads
- **THEN** four panels are visible in the left-half/right-half layout
- **AND** the grammar editor and input string panels share the left half equally (top/bottom)
- **AND** the trace and match panels share the right half equally (left/right)
- **AND** the trace and match panels have the same height

### Requirement: Rainbow syntax highlighting

The grammar editor textarea SHALL use the Rainbow JS library to apply Raku syntax highlighting in real time. Highlighting SHALL update as the user types.

#### Scenario: Grammar code is highlighted

- **WHEN** the user types valid Raku grammar code into the editor
- **THEN** tokens (keywords, regex atoms, rule names) are rendered in distinct colors via Rainbow

### Requirement: WebSocket communication

The UI SHALL establish a WebSocket connection to the backend on page load. It SHALL send the current grammar code and input string to the backend whenever either value changes (debounced by 300ms). It SHALL receive structured trace and match data and re-render the trace and match panels.

#### Scenario: Sends grammar and string on edit

- **WHEN** the user modifies the grammar code or input string
- **THEN** after a 300ms debounce, a WebSocket message with `{grammar, string}` is sent to the backend
- **AND** the frontend waits for a response to update the panels

#### Scenario: WebSocket reconnection

- **WHEN** the WebSocket connection is lost
- **THEN** the client retries connection with exponential backoff (1s, 2s, 4s, max 30s)
- **AND** displays a "Reconnecting..." indicator

### Requirement: Color-coded trace display

The trace panel SHALL render the grammar trace as a nested tree. Each trace node SHALL show the rule name and whether it matched or failed. Matched nodes SHALL have a green indicator; failed nodes SHALL have a red indicator. Each node SHALL be assigned a unique color that is used consistently across trace, string highlight, and match highlight.

#### Scenario: Matched rule shown in green

- **WHEN** the backend returns a trace with a matched rule
- **THEN** that trace node displays a green badge or border

#### Scenario: Failed rule shown in red

- **WHEN** the backend returns a trace with a failed rule
- **THEN** that trace node displays a red badge or border

### Requirement: String region highlighting on hover

Hovering over a trace node SHALL highlight the corresponding substring in the input string panel, using the same color assigned to that trace node.

#### Scenario: Hover highlights string region

- **WHEN** the user hovers over a trace node
- **THEN** the substring that the rule attempted to match is highlighted with the node's color in the string panel

### Requirement: Error display

The UI SHALL display grammar compilation errors and runtime errors in an error bar or overlay below the panels.

#### Scenario: Compilation error shown

- **WHEN** the user types invalid Raku grammar code
- **THEN** the error message from the backend is displayed in the error area
