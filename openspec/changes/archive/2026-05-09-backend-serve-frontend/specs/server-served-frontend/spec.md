## ADDED Requirements

### Requirement: Serve editor at root URL

The Cro server SHALL respond to `GET /` requests by serving the `index.html` file. The response SHALL have `Content-Type: text/html`.

#### Scenario: Root URL returns editor page

- **WHEN** a browser requests `GET /` from the server
- **THEN** the server responds with HTTP 200
- **AND** `Content-Type` is `text/html`
- **AND** the response body contains the full grammar editor HTML

### Requirement: Start-up message includes HTTP URL

The server SHALL log the HTTP URL (`http://localhost:3001`) on start-up in addition to the WebSocket URL.

#### Scenario: Server logs HTTP URL

- **WHEN** the server starts
- **THEN** the console output includes `http://localhost:3001`
