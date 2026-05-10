## ADDED Requirements

### Requirement: Resize handles between panels

The layout SHALL include draggable resize handles between all adjacent panels in the editor. Resize handles SHALL be thin (4px) visual dividers. They SHALL change the cursor to indicate the resize direction on hover.

#### Scenario: Resize handle appears between left and right halves
- **WHEN** the page loads
- **THEN** a vertical resize handle is present between `#left-half` and `#right-half`
- **AND** the cursor changes to `col-resize` on hover

#### Scenario: Resize handle between Grammar, Actions, and String panels
- **WHEN** the Actions panel is visible
- **THEN** horizontal resize handles appear between Grammar/Actions and Actions/String panels
- **AND** the cursor changes to `row-resize` on hover

#### Scenario: Resize handle between Actions and String panels
- **WHEN** the Actions panel is visible
- **THEN** a horizontal resize handle appears between the Actions and String panels

#### Scenario: Resize handle between Trace and Match panels
- **WHEN** both Trace and Match panels are visible
- **THEN** a vertical resize handle appears between Trace and Match panels

#### Scenario: Resize handle between right top row and Made panel
- **WHEN** the Made panel is visible
- **THEN** a horizontal resize handle appears between the right top row and the Made panel

#### Scenario: Resize handles hidden when adjacent panel is collapsed
- **WHEN** a panel is collapsed via its toggle
- **THEN** the resize handle(s) adjacent to the collapsed panel are hidden

### Requirement: Drag to resize

Dragging a resize handle SHALL adjust the relative sizes of the two adjacent panels. The mouse cursor SHALL show as a resize cursor during the drag.

#### Scenario: Vertical resize adjusts left/right halves
- **WHEN** the user drags the vertical handle between left and right halves
- **THEN** the left and right halves adjust their widths proportionally
- **AND** both halves remain fully visible

#### Scenario: Horizontal resize adjusts panel heights
- **WHEN** the user drags a horizontal handle between stacked panels (Grammar/Actions/String)
- **THEN** the adjacent panels adjust their heights proportionally

#### Scenario: Trace/Match drag adjusts column widths
- **WHEN** the user drags the vertical handle between Trace and Match panels
- **THEN** the Trace and Match panels adjust their widths proportionally

#### Scenario: Made panel drag adjusts row heights
- **WHEN** the user drags the horizontal handle between the top row and Made panel
- **THEN** the top row and Made panel adjust their heights proportionally

### Requirement: Resize handle creation

The resize handles SHALL be created dynamically by JavaScript. The handle creation SHALL respond to panel visibility changes (e.g., when a panel is toggled, adjacent handles are shown/hidden).

#### Scenario: Handles created on load
- **WHEN** the page loads
- **THEN** resize handles are created for all currently visible adjacent panels

#### Scenario: Handles update on panel toggle
- **WHEN** a panel is shown or hidden via toggle
- **THEN** the adjacent resize handles are shown or hidden accordingly
