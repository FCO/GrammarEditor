## ADDED Requirements

### Requirement: URL-based sharing of editor state

The UI SHALL support encoding the current grammar code and input string as base64 query parameters (`g` and `s`) in the page URL. On page load, if these parameters are present, the editors SHALL be populated with the decoded values. A share button SHALL generate and copy such a URL.

#### Scenario: Page loads with grammar parameter
- **WHEN** the page URL contains a `g` query parameter with a base64-encoded grammar
- **THEN** the grammar editor SHALL contain the decoded grammar code
- **AND** syntax highlighting SHALL be applied

#### Scenario: Page loads with string parameter
- **WHEN** the page URL contains an `s` query parameter with a base64-encoded string
- **THEN** the string editor SHALL contain the decoded string

#### Scenario: Page loads with both parameters
- **WHEN** the page URL contains both `g` and `s` query parameters with base64-encoded values
- **THEN** both editors SHALL be populated with the decoded content
- **AND** the grammar SHALL be sent to the backend for evaluation

#### Scenario: Page loads without parameters
- **WHEN** the page URL contains neither `g` nor `s` query parameters
- **THEN** the editors SHALL use their default values

### Requirement: Share button copies URL to clipboard

The UI SHALL have a share button in the toolbar area. When clicked, it SHALL generate a URL containing the current grammar and string as base64-encoded query parameters and copy it to the clipboard. The button SHALL provide brief visual feedback.

#### Scenario: Share button copies URL
- **WHEN** the user clicks the share button
- **THEN** a URL with base64-encoded `g` and `s` query parameters is copied to the clipboard
- **AND** the button briefly shows feedback (e.g., "Copied!")

#### Scenario: Share button with default content
- **WHEN** the user clicks the share button with the default grammar and string
- **THEN** the copied URL contains the default content encoded as base64

#### Scenario: Share button after editing
- **WHEN** the user edits the grammar or string and clicks the share button
- **THEN** the copied URL reflects the current editor content
