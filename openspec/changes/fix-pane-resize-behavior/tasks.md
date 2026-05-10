## 1. Core Fix

- [x] 1.1 In `index.html`, modify `updateRightHalf()` to remove the `leftHalf.style.flex = '3'` line in the single-pane-visible branch, keeping `leftHalf` at its default `flex: 1`

## 2. Verify

- [ ] 2.1 Start the server with `raku server.raku` and open the app
- [ ] 2.2 Hide Trace — verify Match expands to fill the right column
- [ ] 2.3 Hide Match — verify Trace expands to fill the right column
- [ ] 2.4 Show both — verify 50/50 split (unchanged)
- [ ] 2.5 Hide both — verify Grammar+String fill the full width (unchanged)
