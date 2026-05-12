## Why

The Made panel displays grammar evaluation output (the `.made` value) but has no way to download it. All other editable panels (grammar, actions, string) have save buttons. Adding a save button to the Made panel makes it consistent and lets users export generated output.

## What Changes

- Add a save button to the Made panel header that downloads the made value content as a `.raku` or `.txt` file
- The save button uses the same visual style as grammar/actions/string panel save buttons
- No load/open button (Made panel is read-only output, not an editor)

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `grammar-editor-ui`: Add save/download requirement to the Made panel requirements section

## Impact

- `index.html`: Add save button to Made panel header; add `data-action="save-made"` attribute
- `index.html` (script): Add `saveMade()` handler and wire up the button click
- No new dependencies
