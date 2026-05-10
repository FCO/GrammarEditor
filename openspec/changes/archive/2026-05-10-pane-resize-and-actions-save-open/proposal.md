## Why

The Actions panel currently lacks save/open buttons that the Grammar and String panels have, making it harder to persist and load actions class code. Additionally, none of the editor's panels are resizable — users cannot adjust the split between grammar/actions/string or trace/match/made to suit their workflow.

## What Changes

- Add save and open buttons to the Actions panel header (matching the Grammar/String pattern)
- Actions save downloads content as `.raku` files
- Actions open loads `.raku` files into the actions editor
- Add draggable resize handles between all adjacent panels:
  - Between left-half and right-half (vertical divider)
  - Between Grammar, Actions, and String panels (horizontal dividers)
  - Between Trace and Match panels (vertical divider)
  - Between right top row and Made panel (horizontal divider)
- Resize handles use a subtle visual style and show a resize cursor on hover
- Panel sizes persist during the session (reset on page reload)

## Capabilities

### New Capabilities
- `resizable-panels`: Draggable resize handles between all adjacent panels in the layout
- `actions-file-io`: Save and open functionality for the Actions editor panel

### Modified Capabilities
- (none — new capabilities only)

## Impact

- `index.html`: Add resize handle HTML elements, CSS for handles and cursor states, JS for drag interaction; add save/open buttons to Actions panel header; wire up save/open handlers for actions
- `js/editor.js`: Add exported save/open helper functions for actions if needed
- `openspec/specs/grammar-editor-ui/spec.md`: Will need ADDED requirements for save/open and resize features
