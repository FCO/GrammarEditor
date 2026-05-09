## 1. Backend: Raku/Cro WebSocket Server

- [x] 1.1 Create `server.raku` — Cro route accepting WebSocket connections at `/ws`
- [x] 1.2 Implement the grammar compiler: wrap incoming grammar code in `my grammar MyGrammar { ... }` and `EVAL`
- [x] 1.3 Implement the instrumented parser: wrap each rule method to capture trace (rule name, match, data, pos_start, pos_end, children)
- [x] 1.4 Implement infinite-loop guard (max 1000 wrapped invocations)
- [x] 1.5 Implement error handling: catch compilation failures and runtime errors, return as JSON `{error: "..."}`
- [x] 1.6 Implement the match result serialization to JSON (nested match tree with rule names and matched substrings)
- [x] 1.7 Test the server manually with a WebSocket client

## 2. Frontend: HTML/CSS Structure

- [x] 2.1 Create `index.html` with the 2x2 grid layout (grammar editor, input string, trace, match panels)
- [x] 2.2 Add error display area
- [x] 2.3 Style panels with CSS (borders, equal-width top panels, scrollable trace/match areas)
- [x] 2.4 Add Rainbow JS library for Raku syntax highlighting in the grammar editor

## 3. Frontend: WebSocket Client

- [x] 3.1 Implement WebSocket connection to `ws://localhost:<port>/ws` on page load
- [x] 3.2 Add debounced (300ms) message sending on grammar code or input string change
- [x] 3.3 Add auto-reconnection with exponential backoff (1s, 2s, 4s, max 30s)
- [x] 3.4 Handle incoming JSON messages and dispatch to trace/match/error renderers

## 4. Frontend: Trace Panel

- [x] 4.1 Render the trace tree as a nested collapsible list
- [x] 4.2 Show matched nodes with green indicator, failed nodes with red indicator
- [x] 4.3 Assign a unique color per trace node for cross-panel correlation

## 5. Frontend: String Highlighting & Match Panel

- [x] 5.1 On hover over a trace node, highlight the corresponding substring (pos_start..pos_end) in the input string panel using the node's assigned color
- [x] 5.2 Render the match result as a nested tree in the match panel
- [x] 5.3 Apply the same color correlation to match tree nodes

## 6. Polish & Integration

- [x] 6.1 Wire everything together end-to-end (edit grammar → WebSocket → render trace + match + highlights)
- [x] 6.2 Add default grammar example and input string on page load
- [x] 6.3 Verify error display works for both compilation and runtime errors
- [x] 6.4 Update `AGENTS.md` with setup/run commands for the project
