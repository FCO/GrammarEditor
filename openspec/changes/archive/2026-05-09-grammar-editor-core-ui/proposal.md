## Why

Building a web-based Raku grammar editor to provide an interactive, visual way to write and debug Raku grammars — similar to regex101.com but purpose-built for Raku grammars. Currently no such tool exists, making grammar development tedious and opaque.

## What Changes

- Create a single-page web application with four panels: grammar code editor, input string, grammar trace, and match results
- Implement a Raku/Cro WebSocket backend that receives grammar code + input string and returns a structured trace tree + match result
- Add Rainbow-powered Raku syntax highlighting to the grammar code editor
- Add color-coded trace visualization showing matched/failed rules
- Add visual correlation between trace items, highlighted regions in the input string, and match result regions
- Add an error panel for grammar compilation/runtime errors

## Capabilities

### New Capabilities

- `grammar-editor-ui`: The HTML/CSS/JS frontend — four-panel layout, Rainbow syntax highlighting, WebSocket communication, trace rendering, string highlighting, match rendering
- `grammar-engine-api`: The Raku/Cro WebSocket backend — receives grammar code + string, compiles the grammar, runs parse with instrumentation, returns structured trace tree + match result

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- New frontend code in this repo (HTML, CSS, JS)
- New Raku/Cro backend code in this repo
- Dependency: Rainbow module for Raku syntax highlighting (JS library)
- Dependency: Cro for WebSocket server
- The backend engine logic is adapted from `selkie-ui-grammar-playground.raku` in the sibling Selkie-UI project
