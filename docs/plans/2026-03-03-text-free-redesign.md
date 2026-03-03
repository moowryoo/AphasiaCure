# Text-Free Redesign for AphasiaCure

Patients with aphasia cannot read text. This redesign removes all visible text from the UI, keeping only icons/emojis. The one exception is the Exercise prompt word, kept for caretakers to read aloud.

## Global Changes

### Remove all text labels
- Tab bar: emoji only (💬 🧠 ⚙️), no text
- Category chips: emoji only (🍽️ 😊 🏠 👋), no text
- Card grid: emoji only, no text labels
- Message bar: no placeholder text, selected cards show emoji-only chips
- Settings: flags only, no text titles or labels
- Exercise completion: emoji only, replay button uses 🔄 icon instead of text
- Progress bar: remove "3/10" text, keep visual bar (thicker at h-3)

### Bigger UI for accessibility
- All interactive elements sized for imprecise tapping
- Emoji sizes increased throughout

## Communicate Screen

### Category Chips — Distinct colored section
Each category gets a unique color to visually separate from the card grid:
- 🍽️ Food: terracotta (#D4845A)
- 😊 Emotions: soft-rose (#E8A0A0)
- 🏠 Daily: sky (#A8C8E8)
- 👋 Greetings: sage (#8BAA7C)

Chips are larger (rounded square buttons, not small pills). Sit on a slightly darker background strip (sand/80) to separate from cards below. Active chip gets full category color fill with white emoji. Inactive chips get a lighter tint of their color.

### Card Grid
- 4 columns on tablet, 3 columns on mobile
- Emoji only, centered, no text
- Emoji size: ~48px mobile, ~64px tablet
- Card min-height: ~120-140px

### Message Bar
- No placeholder text when empty
- Selected cards show emoji-only chips (no text next to emoji)
- Trash clear button stays

## Exercise Screen

### Progress Bar
- Remove "3/10" text label
- Keep visual bar, thicker (h-3 instead of h-2)

### Question Prompt
- KEEP text — this is for caretaker to read aloud to patient
- Keep instruction text and emoji + word display

### Answer Option Cards
- 2x2 grid fills available screen width (not centered with wasted space)
- Emoji size: ~72px mobile, ~96px tablet
- Card min-height: ~200px on tablet
- Same correct/wrong feedback animations

### Completion Screen
- Remove text ("เก่งมาก!")
- Keep 🎉 emoji, make bigger
- Replace text "Play Again" button with big 🔄 icon button
- Keep confetti animations

## Settings Screen
- Remove screen title
- Two large flag buttons: 🇹🇭 and 🇬🇧
- Flags at ~80px, easy to tap
- Active language gets terracotta border and background tint
- No text labels

## New Food & Fruit Cards (+10)

Added to both communicate and exercise:

| ID | Emoji | Thai | English | Category |
|----|-------|------|---------|----------|
| chicken | 🍗 | ไก่ | Chicken | food |
| fish | 🐟 | ปลา | Fish | food |
| shrimp | 🦐 | กุ้ง | Shrimp | food |
| pork | 🥩 | หมู | Pork | food |
| mango | 🥭 | มะม่วง | Mango | food |
| watermelon | 🍉 | แตงโม | Watermelon | food |
| orange | 🍊 | ส้ม | Orange | food |
| grape | 🍇 | องุ่น | Grape | food |
| soup | 🍲 | ซุป | Soup | food |
| icecream | 🍦 | ไอศกรีม | Ice cream | food |

Thai/English labels kept in card data for caretaker reference and exercise prompts — just not displayed on communicate cards.
