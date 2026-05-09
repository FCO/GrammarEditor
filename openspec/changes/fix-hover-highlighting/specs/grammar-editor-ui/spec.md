## MODIFIED Requirements

### Requirement: Color-coded trace display

The trace panel SHALL render the grammar trace as a nested tree. Each trace node SHALL show the rule name and whether it matched or failed. Matched nodes SHALL have a green indicator; failed nodes SHALL have a red indicator. Each node SHALL be assigned a unique color that is used consistently across trace, string highlight, and match highlight. Node identities SHALL be unique per rendering to ensure sibling nodes with the same rule name receive distinct colors.

#### Scenario: Matched rule shown in green
- **WHEN** the backend returns a trace with a matched rule
- **THEN** that trace node displays a green badge or border

#### Scenario: Failed rule shown in red
- **WHEN** the backend returns a trace with a failed rule
- **THEN** that trace node displays a red badge or border

#### Scenario: Sibling rules with same name have distinct colors
- **WHEN** a trace tree contains multiple sibling nodes with the same rule name (e.g., repeated `<digit>`)
- **THEN** each sibling node SHALL have a different color assigned

### Requirement: String region highlighting on hover

Hovering over a trace node or match node SHALL highlight the corresponding substring in the input string panel, using the same color assigned to that node. The highlight overlay SHALL have an opacity of 0.08 to keep the underlying text readable.

#### Scenario: Trace hover highlights string region
- **WHEN** the user hovers over a trace node
- **THEN** the substring that the rule attempted to match is highlighted with the node's color in the string panel

#### Scenario: Match hover highlights string region
- **WHEN** the user hovers over a match node
- **THEN** the substring that the rule matched is highlighted with the node's color in the string panel

## ADDED Requirements

### Requirement: Cross-panel highlighting on hover

Hovering over a match node SHALL highlight the corresponding trace node in the trace panel. Hovering over a trace node SHALL highlight the corresponding match node in the match panel. The highlight uses the same node color at 0.08 opacity. Hovering over either a trace or match node SHALL also highlight the corresponding string region.

#### Scenario: Match hover highlights corresponding trace node
- **WHEN** the user hovers over a match node
- **THEN** the corresponding trace node is highlighted in the trace panel using the same color
- **AND** the corresponding string region is highlighted

#### Scenario: Trace hover highlights corresponding match node
- **WHEN** the user hovers over a trace node
- **THEN** the corresponding match node is highlighted in the match panel using the same color
- **AND** the corresponding string region is highlighted

#### Scenario: Leaving hover clears all highlights
- **WHEN** the user stops hovering over a trace or match node
- **THEN** all highlights in trace, match, and string panels are cleared
