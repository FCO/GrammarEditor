## MODIFIED Requirements

### Requirement: Four-panel layout

The UI SHALL display four panels in a left-half/right-half layout. The left half SHALL be split top/bottom with the grammar editor on top and the input string on the bottom, both occupying the full width of the left half. The right half SHALL be split left/right with the grammar trace on the left and the match results on the right, both occupying the full height of the right half.

#### Scenario: Layout renders correctly on load

- **WHEN** the page loads
- **THEN** four panels are visible in the left-half/right-half layout
- **AND** the grammar editor and input string panels share the left half equally (top/bottom)
- **AND** the trace and match panels share the right half equally (left/right)
- **AND** the trace and match panels have the same height
