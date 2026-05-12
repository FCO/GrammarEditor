## ADDED Requirements

### Requirement: Application loads with default grammar and input

The system SHALL display the default grammar (`unit grammar MyGrammar; token TOP { <letter>+ } ...`) and default input string (`hello`) when first loaded fresh (no snapshot id in URL).

#### Scenario: Default content on fresh load
- **WHEN** the page loads without a snapshot id
- **THEN** the grammar textarea contains the default grammar
- **THEN** the input textarea contains the default string

### Requirement: Grammar syntax highlighting via Shiki

The system SHALL highlight Raku grammar code in the grammar textarea using Shiki with the selected theme.

#### Scenario: Grammar code is highlighted on page load
- **WHEN** the page loads with default grammar
- **THEN** the highlight output pre/code element contains `<span>` elements with color styles

#### Scenario: Grammar highlight updates on input
- **WHEN** the user types new grammar code into the textarea
- **THEN** the highlight output updates with colored spans for the new code

#### Scenario: Empty grammar shows no highlight
- **WHEN** the grammar textarea is cleared
- **THEN** the highlight output is empty

### Requirement: Input string sends grammar to backend for evaluation

The system SHALL send the grammar code and input string to the backend via WebSocket and display results (trace tree, match tree, string coloring, made output).

#### Scenario: Valid grammar and string produce trace and match
- **WHEN** the default grammar and string are loaded and the WebSocket connects
- **THEN** the trace panel shows a tree with MATCH badges
- **THEN** the match panel shows parsed match data
- **THEN** the string input area shows colored output spans
- **THEN** the error panel is collapsed

#### Scenario: Grammar parse error shows error panel
- **WHEN** the user types invalid grammar code
- **THEN** the error panel appears with the error message
- **THEN** the trace and match panels are cleared
- **THEN** a zigzag error marker appears over the offending position

#### Scenario: Ctrl+Enter (Cmd+Enter) forces immediate re-parse
- **WHEN** the user presses Ctrl+Enter (or Cmd+Enter on macOS) in the grammar textarea
- **THEN** the grammar is re-evaluated immediately without debounce delay

### Requirement: Trace tree rendering

The trace panel SHALL render a collapsible tree of grammar rule attempts with match/fail badges, rule names, position data, and color dots.

#### Scenario: Trace tree shows MATCH and FAIL badges
- **WHEN** grammar evaluation returns a trace tree
- **THEN** the trace tree displays MATCH badges (green) for successful rules
- **THEN** the trace tree displays FAIL badges (red) for failed rules

#### Scenario: Trace nodes can be expanded/collapsed
- **WHEN** the user clicks the expand toggle on a collapsed trace node
- **THEN** the node's children become visible and the toggle arrow points down
- **WHEN** the user clicks again
- **THEN** the children are hidden and the toggle points right

#### Scenario: Top-level nodes are expanded by default
- **WHEN** the trace tree is rendered
- **THEN** nodes at depth 0 and 1 are expanded (children visible)

#### Scenario: Hovering a trace node highlights the string region
- **WHEN** the user hovers over a trace node
- **THEN** colored highlight divs appear over the corresponding characters in the input string

#### Scenario: Hovering a trace node highlights the corresponding match node
- **WHEN** the user hovers over a trace node
- **THEN** the matching match panel node gets a colored outline

### Requirement: Match tree rendering

The match panel SHALL render a flat tree of successful match results with rule names and their captured data.

#### Scenario: Match tree shows matched rules with data
- **WHEN** grammar evaluation succeeds
- **THEN** the match panel shows the matched rule names and their string data

#### Scenario: Match node hover highlights string and trace
- **WHEN** the user hovers a match node
- **THEN** the corresponding string region is highlighted
- **THEN** the corresponding trace node is highlighted

### Requirement: Made output display

The made panel SHALL display the `.made` value from grammar evaluation when actions are provided.

#### Scenario: Made output shows when actions are present
- **WHEN** grammar evaluation returns a made value
- **THEN** the made panel shows the made value in green monospace text

### Requirement: String coloring by rule

The input string SHALL be colored character-by-character based on the deepest matched rule, with italic for leaf rules and wavy underline for unmatched characters.

#### Scenario: Matched characters are colored by rule
- **WHEN** grammar evaluation succeeds
- **THEN** the string display shows colored `<span>` elements per matched rule

#### Scenario: Unmatched characters have wavy underline
- **WHEN** grammar evaluation partially matches
- **THEN** unmatched characters have the `unmatched-char` class with wavy underline

### Requirement: Panel visibility toggles

Each panel SHALL have a toggle checkbox in the toolbar that shows/hides the panel.

#### Scenario: Toggle hides and shows trace panel
- **WHEN** the user unchecks the Trace toggle
- **THEN** the trace panel is hidden (collapsed)
- **WHEN** the user rechecks the Trace toggle
- **THEN** the trace panel is visible again

#### Scenario: Toggling the last visible right panel hides the right half
- **WHEN** the user hides all right-side panels (trace, match, made, error)
- **THEN** the right half of the layout is hidden

### Requirement: DSL and PRO view modes

The system SHALL provide DSL and PRO mode buttons that configure panel visibility in predefined layouts.

#### Scenario: DSL mode shows only Input and Made
- **WHEN** user clicks the DSL button
- **THEN** only the Input and Made panels are visible
- **THEN** the DSL button shows as disabled

#### Scenario: PRO mode shows all panels
- **WHEN** user clicks the PRO button
- **THEN** all panels are visible
- **THEN** the PRO button shows as disabled

### Requirement: Theme selection

The system SHALL provide a dropdown to select a color theme for both Shiki highlighting and string coloring.

#### Scenario: Changing theme updates highlight colors
- **WHEN** user selects a new theme from the dropdown
- **THEN** the grammar highlight output shows different colored spans
- **THEN** the string coloring palette changes

#### Scenario: Theme dropdown is populated
- **WHEN** the page loads
- **THEN** the theme select element contains at least 12 theme options

### Requirement: Panel resize handles

The system SHALL provide draggable resize handles between panels for adjusting panel sizes.

#### Scenario: Resize handles exist between adjacent panels
- **WHEN** the page loads with multiple visible panels
- **THEN** resize handles are present between left and right halves, between grammar/actions/string panels, and between trace/match panels

### Requirement: File save and open

The system SHALL allow saving grammar, actions, and string content to files, and opening files into the editors.

#### Scenario: Save grammar triggers file download
- **WHEN** user clicks the grammar save button
- **THEN** a file download is initiated with the grammar code

#### Scenario: Open grammar loads file content
- **WHEN** user clicks the grammar open button and selects a file
- **THEN** the grammar textarea is populated with the file content and evaluated

### Requirement: URL snapshot sharing

The system SHALL support creating a shareable URL that encodes the current grammar, string, actions, and panel state.

#### Scenario: Share button copies a URL
- **WHEN** user clicks the Share button
- **THEN** a snapshot is created via POST /_store
- **THEN** a URL is copied to clipboard

#### Scenario: Loading a snapshot URL restores state
- **WHEN** user navigates to a `/ <sha1>` URL
- **THEN** the grammar, string, and actions are restored from the snapshot
- **THEN** grammar evaluation is triggered

### Requirement: WebSocket connection lifecycle

The system SHALL connect to the backend via WebSocket on page load and display connection status.

#### Scenario: Status bar shows Connected
- **WHEN** the WebSocket successfully connects
- **THEN** the status bar shows "Connected" with green styling

#### Scenario: Status bar shows Disconnected on server stop
- **WHEN** the backend server stops
- **THEN** the status bar shows "Reconnecting..." with yellow styling

### Requirement: Actions editor panel

The system SHALL provide an actions code editor (initially hidden) where users can write Raku action classes.

#### Scenario: Actions panel can be toggled on
- **WHEN** user checks the Actions toggle
- **THEN** the actions panel becomes visible with its own syntax-highlighted textarea

#### Scenario: Custom actions affect made output
- **WHEN** user writes a valid actions class and the grammar matches
- **THEN** the made panel shows the result of action methods

### Requirement: Tab and shortcut handling

The editor textareas SHALL insert a tab character on Tab key press and force re-parse on Ctrl+Enter / Cmd+Enter.

#### Scenario: Tab inserts tab character
- **WHEN** user presses Tab in the grammar textarea
- **THEN** a tab character is inserted at the cursor position

### Requirement: Error tooltip

The system SHALL show a tooltip with error details when hovering over an error zigzag marker.

#### Scenario: Error tooltip appears on zigzag hover
- **WHEN** user hovers over a zigzag error marker
- **THEN** a tooltip appears near the cursor with the error message

### Requirement: Responsive layout

On screens narrower than 768px, the layout SHALL stack panels vertically.

#### Scenario: Narrow viewport stacks panels
- **WHEN** the viewport is set to 375px width
- **THEN** panels stack vertically (not side-by-side)

### Requirement: Grammar input hide/show

The grammar panel SHALL have a toggle that hides/shows the grammar section, separate from the panel visibility toggles.

#### Scenario: Grammar panel header toggle works
- **WHEN** the grammar panel is collapsed via its header or toggle
- **THEN** the grammar editor is hidden from view
