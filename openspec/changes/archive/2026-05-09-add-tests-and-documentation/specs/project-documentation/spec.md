## ADDED Requirements

### Requirement: README covers setup and usage

The project SHALL include a README.md that guides users through setup, running, and using the grammar editor.

#### Scenario: README contains prerequisites
- **WHEN** a user reads README.md
- **THEN** it SHALL list Rakudo and Cro as prerequisites with installation instructions

#### Scenario: README contains setup and run commands
- **WHEN** a user reads README.md
- **THEN** it SHALL contain the command to start the server (`raku server.raku`)
- **AND** it SHALL state the URL to open (`http://localhost:3001`)

#### Scenario: README describes editor usage
- **WHEN** a user reads README.md
- **THEN** it SHALL describe the four-panel layout (grammar editor, string input, trace, match)
- **AND** it SHALL mention Ctrl+Enter / Cmd+Enter for forced re-parse

### Requirement: CONTRIBUTING covers development workflow

The project SHALL include a CONTRIBUTING.md that guides developers through project architecture, testing, and contribution workflow.

#### Scenario: CONTRIBUTING describes project structure
- **WHEN** a developer reads CONTRIBUTING.md
- **THEN** it SHALL describe the project structure (`server.raku`, `index.html`)
- **AND** it SHALL explain the architecture (Raku/Cro backend, vanilla JS frontend, WebSocket communication)

#### Scenario: CONTRIBUTING contains test commands
- **WHEN** a developer reads CONTRIBUTING.md
- **THEN** it SHALL contain the command to run Raku tests (`raku -I. t/server.t`)
- **AND** it SHALL contain the command to run JS tests (`npx vitest run`)
