## ADDED Requirements

### Requirement: Made save button

The Made panel header SHALL include a save button that downloads the made value content as a `.txt` file. The save button SHALL use the same visual style as the Grammar, Actions, and String panel save buttons (💾 icon, same position, same hover behavior). If the Made panel is empty (no `.made` value from evaluation), the save button SHALL be disabled or hidden.

#### Scenario: Save made button downloads .txt file
- **WHEN** the user clicks the save button in the Made panel header and the Made panel has content
- **THEN** a file download is triggered with the made value content
- **AND** the file extension is `.txt`

#### Scenario: Save made button disabled when empty
- **WHEN** the Made panel is empty (no made value)
- **THEN** the save button is not visible or is disabled

#### Scenario: Save made button matches other save button styling
- **WHEN** the Made panel has content and is visible
- **THEN** the save button uses the same 💾 icon and `.panel-header-btn` class as grammar/actions/string save buttons
