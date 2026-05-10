## Context

The editor currently has no way to share grammar + input combinations. Users must manually copy content from both panels. Adding URL-based sharing lets anyone encode their editor state into a shareable link.

## Goals / Non-Goals

**Goals:**
- Read base64-encoded `g` (grammar) and `s` (string) query parameters on page load and populate editors
- Add a "Share" button that generates a URL with current grammar and string encoded as base64
- Copy the shareable URL to clipboard on click with visual feedback
- Handle both present and absent parameters gracefully (no crash if params missing)

**Non-Goals:**
- No URL shortening (user can use a shortener externally)
- No backend changes
- No compression (URL may be long for large content — acceptable)
- No sharing history or saved links

## Decisions

1. **Base64 via `btoa()`/`atob()`** — Built-in browser APIs, no dependencies. For Unicode content, use `encodeURIComponent` + `btoa` two-step to handle non-ASCII characters.
2. **URLSearchParams API** — Read and construct query parameters cleanly without manual string parsing.
3. **Clipboard API (`navigator.clipboard.writeText`)** — Copy URL silently with fallback to `document.execCommand('copy')`.
4. **Share button placement** — Add a single share button in the top toolbar area (next to the panel toggles), since it applies to the whole editor state, not a single panel.
5. **Visual feedback** — Button briefly shows "Copied!" or checkmark after copying, then reverts.

## Risks / Trade-offs

- **URL length limits** — Browsers support ~2000 chars for `<a href>`, but clipboard-copied URLs work in the address bar where limits are typically much larger (~64KB in Chrome). Very large grammars could produce unwieldy URLs.
- **Unicode content** — Must encode to base64-safe format. Two-step `encodeURIComponent` → `btoa` handles this.
- **Clipboard API requires HTTPS** — Falls back gracefully on insecure contexts.
