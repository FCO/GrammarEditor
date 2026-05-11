## 1. Fix mobile editor container height

- [x] 1.1 In `index.html`, add to the `@media (max-width: 768px)` block: `.editor-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: auto; }` so the editor fills the panel-body regardless of flex height computation
- [x] 1.2 Add `.panel-body { min-height: 0; overflow: hidden; }` on mobile to prevent flex minimum size issues and clip absolute children to panel bounds

## 2. Verify

- [ ] 2.1 Open the app on a ≤768px viewport (mobile device or Chrome DevTools device mode)
- [ ] 2.2 Verify grammar editor shows full default text without clipping
- [ ] 2.3 Type additional text in the grammar editor — verify all content is visible and scrollable
- [ ] 2.4 Open the Actions panel toggle — verify actions editor shows full text without clipping
- [ ] 2.5 Verify desktop layout (≥768px) is unchanged — panels still show full text
- [ ] 2.6 Verify syntax highlighting is still visible and correctly positioned on mobile
