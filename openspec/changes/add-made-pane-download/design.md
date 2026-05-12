## Context

The Made panel header currently has no buttons. The grammar, actions, and string panels all have save buttons (💾) in their headers that trigger file downloads via `saveFileAs`. The Made panel displays the `.made` value from grammar evaluation as read-only text in a `<pre>` block.

The existing save pattern uses `data-action` attributes and `saveFileAs(content, suggestedName)` which falls back from `showSaveFilePicker` to creating a download link. The Made value is already available as `textContent` of `#made-body pre`.

## Goals / Non-Goals

**Goals:**
- Add a save button to the Made panel header
- Download the made value content as a `.txt` file
- Match the visual style and behavior of existing save buttons

**Non-Goals:**
- No load/open functionality (Made is read-only output)
- No format conversion of the made value
- No changes to the backend

## Decisions

1. **Reuse `saveFileAs`** – The existing `saveFileAs` utility handles both the File System Access API and the download link fallback. Identical approach to grammar/string/actions saves.

2. **`.txt` extension** – The made value is a `.raku` representation string. Using `.txt` is simpler and more universal than `.raku` since it's not always valid Raku source. The string save also uses `.txt`.

3. **Button in panel header** – Same position (right side of the header) and same icon (💾) as other save buttons, using `data-action="save-made"` attribute.

## Risks / Trade-offs

- None significant — this is a pure UI addition with no cross-cutting concerns.
