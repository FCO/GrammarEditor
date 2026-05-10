## Why

When the Trace or Match pane is hidden, the remaining visible pane should expand to fill the right column. Currently, hiding one pane causes the Grammar and String panes to grow instead, wasting vertical space and making the remaining Trace/Match pane too small to be useful.

## What Changes

- Fix `updateRightHalf()` in `index.html` so that when only one of Trace/Match is hidden, the visible pane grows to fill the right column while the Grammar and String panes retain their original width
- Only grow Grammar and String panes when **both** Trace and Match are hidden
- Remove the `left-half` flex override (`flex: 3`) from the single-pane-visible state

## Capabilities

### New Capabilities
- (none — this is a fix to existing behavior)

### Modified Capabilities
- (none — no spec-level requirement changes; pure implementation fix)

## Impact

- `index.html`: single function change in `updateRightHalf()`
