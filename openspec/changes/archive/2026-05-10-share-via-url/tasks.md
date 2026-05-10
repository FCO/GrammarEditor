## 1. CSS

- [x] 1.1 Add styles for share button in the toolbar area

## 2. HTML

- [x] 2.1 Add share button to the toolbar (next to panel toggles)

## 3. JS — URL Parameter Loading

- [x] 3.1 Implement base64 encode/decode helpers (handle Unicode via two-step encodeURIComponent)
- [x] 3.2 Read `g` and `s` query params on page load, decode and populate editors
- [x] 3.3 Trigger syntax highlighting and debounced send after loading from params

## 4. JS — Share URL Generation

- [x] 4.1 Implement share URL generation from current editor content
- [x] 4.2 Implement clipboard copy with visual feedback ("Copied!" state)
- [x] 4.3 Wire share button click handler

## 5. Verify

- [x] 5.1 Page loads with no params — default content shown
- [x] 5.2 Page loads with `g` param — grammar editor populated with decoded content
- [x] 5.3 Page loads with `s` param — string editor populated
- [x] 5.4 Page loads with both params — both editors populated, grammar evaluated
- [x] 5.5 Share button copies URL with current content encoded
- [x] 5.6 Copied URL loads correctly when pasted into browser
