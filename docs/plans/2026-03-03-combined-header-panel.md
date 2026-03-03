# Combined Header Panel Design

## Goal

Merge MessageBar and CategoryChips into a single sticky header panel with a darker warm background, visually separating the "controls" zone from the card grid below.

## Design

### Combined Panel Container
- **Position**: Sticky top, full-width flush to top and sides
- **Bottom edge**: `rounded-b-2xl` for a shelf effect
- **Background**: New color `sand-dark` (#E8D5BE) — warmer/darker than cream
- **Padding**: `pt-2 pb-3 px-4`

### Internal Layout
1. **MessageBar area** (top) — transparent, no own background/border/margins
2. **Subtle divider** — `border-t border-bark/10 mx-2 my-2`
3. **CategoryChips area** (bottom) — transparent, no own background/margins/rounded container

### Component Changes

**`src/index.css`**
- Add `--color-sand-dark: #E8D5BE` to `@theme`

**`src/screens/CommunicateScreen.jsx`**
- Replace sticky wrapper with combined panel: `sticky top-0 z-10 bg-sand-dark rounded-b-2xl pb-3 pt-2 px-4`
- Add divider `<div>` between MessageBar and CategoryChips
- Card grid gets `pt-4` for spacing

**`src/components/MessageBar.jsx`**
- Remove outer `mx-4 mb-3 rounded-2xl bg-sand/50 border border-sand` wrapper
- Keep inner flex layout and content as-is

**`src/components/CategoryChips.jsx`**
- Remove outer `mx-4 my-3 p-3 bg-sand rounded-2xl` wrapper
- Keep inner flex row of buttons as-is
