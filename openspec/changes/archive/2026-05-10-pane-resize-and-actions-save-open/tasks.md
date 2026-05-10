## 1. Actions panel save/open buttons

- [x] 1.1 Add save and open buttons to the Actions panel header with `data-action="save-actions"` and `data-action="open-actions"` attributes
- [x] 1.2 Implement `saveActions()` handler that saves actions code as `.rakumod` file using `saveFileAs()`
- [x] 1.3 Implement `openActions()` handler that opens `.rakumod` files using `pickAndReadFile()` and loads content into the actions editor
- [x] 1.4 Wire up the save/open button click handlers in the event setup section

## 2. Resize handle CSS and HTML

- [x] 2.1 Add CSS for `.resize-handle` class: 4px width/height, dark background, cursor styles (`col-resize`/`row-resize`), hover effects
- [x] 2.2 Create a `setupResizeHandles()` function that inserts resize handle divs between all adjacent panels in the flex layout
- [x] 2.3 Handle special cases: no handle when Actions panel is collapsed, no handle when Made panel is collapsed, etc.

## 3. Resize drag interaction

- [x] 3.1 Implement a `makeResizeHandle(handleEl, prevEl, nextEl, direction)` function that handles mousedown/mousemove/mouseup to adjust flex ratios
- [x] 3.2 On mousedown: capture start position, add mousemove/mouseup listeners on document
- [x] 3.3 On mousemove: calculate delta, convert to flex ratio change, apply to adjacent panels
- [x] 3.4 On mouseup: remove document listeners, snap to final position
- [x] 3.5 Prevent text selection during drag by setting `user-select: none` on the body

## 4. Integration

- [x] 4.1 Call `setupResizeHandles()` on DOMContentLoaded
- [x] 4.2 Update `updateRightHalf()` to also update resize handles adjacent to toggled panels
- [x] 4.3 Update Actions panel toggle to also trigger handle updates (handled by updateRightHalf being called on toggle)

## 5. Tests and verification

- [ ] 5.1 Manual verification: Actions save/open buttons download and load files correctly
- [ ] 5.2 Manual verification: resize handles appear between all adjacent panels
- [ ] 5.3 Manual verification: dragging resize handles adjusts panel sizes
- [ ] 5.4 Manual verification: handles hide when adjacent panels are collapsed
