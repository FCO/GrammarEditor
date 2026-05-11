## MODIFIED Requirements

### Requirement: Four-panel layout

The UI SHALL display four panels. On screens wider than 768px, the layout SHALL be a left-half/right-half layout with the grammar editor and input string on the left (top/bottom) and trace and match on the right (left/right). On screens 768px or narrower, the panels SHALL stack vertically in a single column in this order: grammar editor, input string, trace, match. Each panel SHALL have a minimum height of 200px on narrow screens. The grammar and actions editor panels SHALL render their full text content without clipping — the textarea and syntax-highlight `<pre>` SHALL fill the available panel body height on all viewport sizes.

#### Scenario: Layout renders correctly on load

- **WHEN** the page loads on a screen wider than 768px
- **THEN** four panels are visible in the left-half/right-half layout
- **AND** the grammar editor and input string panels share the left half equally (top/bottom)
- **AND** the trace and match panels share the right half equally (left/right)
- **AND** the trace and match panels have the same height

#### Scenario: Layout stacks on narrow screens

- **WHEN** the page loads on a screen 768px or narrower
- **THEN** the four panels stack vertically in a single column
- **AND** each panel has a minimum height of 200px
- **AND** the page is vertically scrollable

#### Scenario: Grammar editor shows full text on mobile

- **WHEN** the grammar editor contains code and the viewport is 768px or narrower
- **THEN** the full text of the grammar code is visible in the editor
- **AND** no part of the text is clipped or obscured by overlapping elements

#### Scenario: Actions editor shows full text on mobile

- **WHEN** the actions editor contains code and the viewport is 768px or narrower
- **THEN** the full text of the actions code is visible in the editor
- **AND** no part of the text is clipped or obscured by overlapping elements

### Requirement: Rainbow syntax highlighting

The grammar editor textarea SHALL use the Rainbow JS library to apply Raku syntax highlighting in real time. Highlighting SHALL update as the user types.

#### Scenario: Grammar code is highlighted

- **WHEN** the user types valid Raku grammar code into the editor
- **THEN** tokens (keywords, regex atoms, rule names) are rendered in distinct colors via Rainbow
