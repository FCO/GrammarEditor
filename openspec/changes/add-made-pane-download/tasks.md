## 1. HTML Changes

- [x] 1.1 Add save button to Made panel header with `data-action="save-made"` attribute and 💾 icon
- [x] 2.1 Add `saveMade()` function that reads made body content and triggers download via `saveFileAs`
- [x] 2.2 Wire the `save-made` button click to `saveMade()` (add to the `data-action` handler block)
- [x] 2.3 Add disabled/hidden class logic for the Made save button when the Made panel is empty

## 3. Verification

- [x] 3.1 Start the app and open the Made panel, verify save button is visible
- [x] 3.2 Click the save button and verify a `.txt` file is downloaded with the made content
- [x] 3.3 Verify the save button style matches grammar/actions/string save buttons
- [x] 3.4 Run `npm run test:e2e` and confirm existing tests still pass (65/65)
- [x] 3.5 Run `npm test` and confirm existing Vitest tests still pass (58/58)
