## ADDED Requirements

### Requirement: Unmatched substring highlighting

The UI SHALL render characters in the input string that are not matched by any grammar rule with a red squiggly underline. The highlight SHALL use a wavy underline style in red (`#f38ba8`). The highlight SHALL be applied in the same render pass as the existing matched-rule coloring. The highlight SHALL update automatically whenever a new parse result arrives.

Unmatched characters SHALL retain the text color of the nearest enclosing matched rule. If no enclosing rule exists (no match at all), SHALL use grey (`#6c7086`) for the text color. This keeps all characters visible while distinguishing matched from unmatched regions.

#### Scenario: Partial match shows unmatched tail

- **WHEN** the grammar matches `"abc"` from input `"abcdef"`
- **THEN** characters `abc` are colored by their matched rule
- **AND** characters `def` have a red squiggly underline
- **AND** unmatched characters retain the nearest matched rule's text color (or grey if none)

#### Scenario: Partial match shows unmatched middle

- **WHEN** the grammar matches `"ace"` from input `"abcde"`
- **THEN** characters `a`, `c`, `e` are colored by their matched rule
- **AND** characters `b` and `d` have a red squiggly underline
- **AND** unmatched characters retain the nearest matched rule's text color (or grey if none)

#### Scenario: Full match shows no squiggly

- **WHEN** the grammar matches the entire input string
- **THEN** all characters are colored by their matched rules
- **AND** no red squiggly underlines appear

#### Scenario: No match shows all squiggly

- **WHEN** the grammar fails to match any character
- **THEN** all characters in the input have a red squiggly underline

#### Scenario: Empty input shows no squiggly

- **WHEN** the input string is empty
- **THEN** no red squiggly underlines appear
