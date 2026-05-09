## 1. Fix Node Path Uniqueness

- [x] 1.1 Update `renderTraceNode` path generation to include child index (e.g., `/0-digit` instead of `/digit`)
- [x] 1.2 Update `renderMatchNode` path generation to include child index
- [x] 1.3 Update inline `renderTraceNode` in index.html with the same path fix
- [x] 1.4 Update inline `renderMatchNode` in index.html with the same path fix

## 2. Reduce Highlight Opacity

- [x] 2.1 Change opacity in `highlightMatchNode` (editor.js) from `0.15` to `0.05`
- [x] 2.2 Change opacity in inline `highlightMatchNode` (index.html) from `0.15` to `0.05`

## 3. Add Match-to-Trace Highlighting

- [x] 3.1 Add `highlightTraceNode` function to editor.js that highlights a trace node by path
- [x] 3.2 Add `clearTraceHighlights` function to editor.js
- [x] 3.3 Add `highlightTraceNode` function to inline script (index.html)
- [x] 3.4 Add `clearTraceHighlights` function to inline script (index.html)
- [x] 3.5 Add `highlightStringRegion` call to `renderTraceNode`'s mouseenter (already exists — verify)
- [x] 3.6 Add mouseenter/mouseleave handlers to `renderMatchNode` (editor.js) that highlight trace node, string region, and itself
- [x] 3.7 Add same mouseenter/mouseleave handlers to inline `renderMatchNode` (index.html)

## 4. Position-Based Cross-Panel Lookup

- [x] 4.1 Add `pos_start`/`pos_end` to `serialize-match` in GrammarEngine.rakumod
- [x] 4.2 Add `tracePosMap` (position→element) alongside `traceNodeMap` (path→element)
- [x] 4.3 Add `matchPosMap` (position→element) alongside `matchNodeMap` (path→element)
- [x] 4.4 Change trace node hover to find match via position key instead of path
- [x] 4.5 Change match node hover to find trace via position key instead of path
- [x] 4.6 Apply same position-based approach to inline code (index.html)

## 5. Update Tests

- [x] 5.1 Update tests for `highlightTraceNodeByPath` rename
- [x] 5.2 Update tests for new opacity value (0.05)
- [x] 5.3 Add tests for `clearTraceHighlights`
- [x] 5.4 Update Raku tests for new match node position fields
