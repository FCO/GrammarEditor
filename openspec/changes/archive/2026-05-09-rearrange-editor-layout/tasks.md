## 1. HTML Restructure

- [x] 1.1 Wrap the left panels (grammar, string) in a container div with `id="left-half"`
- [x] 1.2 Wrap the right panels (trace, match) in a container div with `id="right-half"`
- [x] 1.3 Set the panel order: grammar, string (in left-half) and trace, match (in right-half)

## 2. CSS Layout Update

- [x] 2.1 Change `#app` grid from `grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr` to `grid-template-columns: 1fr 1fr` (two halves)
- [x] 2.2 Style `#left-half` as a column flex container: grammar (top), string (bottom)
- [x] 2.3 Style `#right-half` as a row flex container: trace (left), match (right)
- [x] 2.4 Ensure trace and match panels in right-half have equal width and full height
- [x] 2.5 Verify the error bar and status bar remain visible at the bottom

## 3. Verify

- [x] 3.1 Open index.html and confirm the 4 panels render in the new layout
- [x] 3.2 Confirm grammar editor and input string still fill the left half (top/bottom)
- [x] 3.3 Confirm trace and match appear side-by-side in the right half, full height
