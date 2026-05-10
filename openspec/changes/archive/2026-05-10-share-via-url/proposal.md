## Why

No way to share a grammar + input combination with someone else. Users who want to collaborate or show a bug must manually copy code and string. Adding URL-based sharing lets anyone share their exact editor state via a single link.

## What Changes

- Read base64-encoded `g` (grammar) and `s` (string) query parameters on page load and populate the editors
- Add a "Share" button that generates a URL with the current grammar and string encoded as base64 query parameters
- The share URL copies to clipboard or opens a dialog with the shareable link

## Capabilities

### New Capabilities
- `grammar-editor-ui`: Add URL parameter decoding and share button to the existing grammar editor UI capability

### Modified Capabilities

- `grammar-editor-ui`: Modified to support base64 URL param loading and share URL generation

## Impact

- Only `index.html` (CSS + JS) needs changes
- No backend or dependency changes
- New URL pattern: `?g=<base64>&s=<base64>`
