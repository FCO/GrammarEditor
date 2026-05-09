## 1. Raku Backend Tests

- [x] 1.1 Create `t/` directory and `t/server.t` with the Raku `Test` module
- [x] 1.2 Write test for valid grammar compilation and parse (trace + match present)
- [x] 1.3 Write test for compilation error handling (error field returned)
- [x] 1.4 Write test for infinite loop protection
- [x] 1.5 Write test that every trace node contains `pos_start` and `pos_end`
- [x] 1.6 Write test for match serialization correctness (nested structure with rule/data)
- [x] 1.7 Write test for empty grammar returning a trace

## 2. JS Frontend Tests

- [x] 2.1 Initialize Vitest project with happy-dom (package.json, vitest.config.js)
- [x] 2.2 Write test for `highlightRaku` producing correct span classes (keywords, strings, comments, rule names)
- [x] 2.3 Write test for `escapeHtml` utility function
- [x] 2.4 Write test for `debounce` utility function
- [x] 2.5 Write test for WebSocket message sending on grammar/string change
- [x] 2.6 Write test for Ctrl+Enter/Cmd+Enter forcing immediate send
- [x] 2.7 Write test for `renderTrace` producing match and fail badges
- [x] 2.8 Write test for trace node rendering rule name and data
- [x] 2.9 Write test for hover on trace node creating string highlight elements
- [x] 2.10 Write test for `renderMatch` producing nested match nodes with rule/data
- [x] 2.11 Write test for error display in error bar
- [x] 2.12 Write test for WebSocket reconnection behavior on disconnect
- [x] 2.13 Write test for Tab key inserting tab character in grammar editor

## 3. Project Documentation

- [x] 3.1 Create `README.md` with prerequisites, setup commands, server startup, usage guide
- [x] 3.2 Create `CONTRIBUTING.md` with project structure, architecture overview, test commands
- [x] 3.3 Update `AGENTS.md` to reference new test commands and documentation
