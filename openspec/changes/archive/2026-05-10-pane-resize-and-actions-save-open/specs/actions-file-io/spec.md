## ADDED Requirements

### Requirement: Actions save button

The Actions panel header SHALL include a save button that downloads the actions class code as a `.rakumod` file. The save button SHALL use the same visual style as the Grammar and String panel save buttons.

#### Scenario: Save actions button downloads .rakumod file
- **WHEN** the user clicks the save button in the Actions panel header
- **THEN** a file download is triggered with the actions code content
- **AND** the file extension is `.rakumod`

### Requirement: Actions open button

The Actions panel header SHALL include an open button that opens a file picker for `.rakumod` files and loads the content into the actions editor.

#### Scenario: Open actions loads .rakumod file
- **WHEN** the user clicks the open button in the Actions panel header and selects a `.rakumod` file
- **THEN** the file content replaces the actions editor content
- **AND** syntax highlighting is applied to the loaded content
- **AND** the grammar is re-evaluated with the new actions code
