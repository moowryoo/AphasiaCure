# Text-Free Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all text from the UI (except exercise prompt for caretakers), add 10 new food cards, make category chips visually distinct with unique colors, and make exercise answer cards fill the screen.

**Architecture:** Edit existing components in-place. Add category color mapping to data layer. No new files needed — all changes are modifications to existing components and data.

**Tech Stack:** React 19, Tailwind CSS v4, Framer Motion (all already in use)

---

### Task 1: Add new food cards and category colors to data

**Files:**
- Modify: `src/data/cards.js`

**Step 1: Add category color mapping**

Add a `color` field to each category in the `categories` array:

```js
export const categories = [
  { id: 'food', emoji: '🍽️', labelKey: 'categories.food', color: 'terracotta' },
  { id: 'emotions', emoji: '😊', labelKey: 'categories.emotions', color: 'soft-rose' },
  { id: 'daily', emoji: '🏠', labelKey: 'categories.daily', color: 'sky' },
  { id: 'greetings', emoji: '👋', labelKey: 'categories.greetings', color: 'sage' },
]
```

**Step 2: Add 10 new food cards**

Add these after the existing `medicine` card (line 19), before the Emotions comment:

```js
  { id: 'chicken', emoji: '🍗', th: 'ไก่', en: 'Chicken', category: 'food' },
  { id: 'fish', emoji: '🐟', th: 'ปลา', en: 'Fish', category: 'food' },
  { id: 'shrimp', emoji: '🦐', th: 'กุ้ง', en: 'Shrimp', category: 'food' },
  { id: 'pork', emoji: '🥩', th: 'หมู', en: 'Pork', category: 'food' },
  { id: 'mango', emoji: '🥭', th: 'มะม่วง', en: 'Mango', category: 'food' },
  { id: 'watermelon', emoji: '🍉', th: 'แตงโม', en: 'Watermelon', category: 'food' },
  { id: 'orange', emoji: '🍊', th: 'ส้ม', en: 'Orange', category: 'food' },
  { id: 'grape', emoji: '🍇', th: 'องุ่น', en: 'Grape', category: 'food' },
  { id: 'soup', emoji: '🍲', th: 'ซุป', en: 'Soup', category: 'food' },
  { id: 'icecream', emoji: '🍦', th: 'ไอศกรีม', en: 'Ice cream', category: 'food' },
```

**Step 3: Verify**

Run: `npm run dev`
Check: App loads without errors, new food cards appear in Communicate screen under food category.

**Step 4: Commit**

```bash
git add src/data/cards.js
git commit -m "feat: add 10 new food cards and category color mapping"
```

---

### Task 2: Remove text from TabBar

**Files:**
- Modify: `src/components/TabBar.jsx`

**Step 1: Remove text label and i18n import**

Replace the full file content with:

```jsx
import { motion } from 'framer-motion'

const tabs = [
  { id: 'communicate', emoji: '💬' },
  { id: 'exercise', emoji: '🧠' },
  { id: 'settings', emoji: '⚙️' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream/80 backdrop-blur-xl border-t border-sand z-50">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 px-6 py-2 relative"
          >
            <span className={`text-3xl transition-all ${
              activeTab === tab.id ? 'scale-110' : 'opacity-50'
            }`}>{tab.emoji}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-0 w-1.5 h-1.5 rounded-full bg-terracotta"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
```

Key changes:
- Remove `useTranslation` import and usage
- Remove the `<span>` that renders `{t('tabs.${tab.id}')}`
- Bump emoji from `text-2xl` to `text-3xl`
- Add `scale-110` for active tab, `opacity-50` for inactive

**Step 2: Verify**

Run: `npm run dev`
Check: Tab bar shows only emoji icons, no text labels. Active tab is bigger, inactive tabs are dimmed.

**Step 3: Commit**

```bash
git add src/components/TabBar.jsx
git commit -m "feat: remove text from TabBar, emoji-only navigation"
```

---

### Task 3: Remove text from Card component

**Files:**
- Modify: `src/components/Card.jsx`

**Step 1: Remove text label and i18n**

Replace full file content with:

```jsx
import { motion } from 'framer-motion'

export default function Card({ card, onClick, index = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileTap={{ scale: 1.05 }}
      onClick={() => onClick(card)}
      className="bg-sand/60 rounded-2xl p-4 flex items-center justify-center
                 shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                 hover:border-terracotta/30 border-2 border-transparent
                 transition-colors cursor-pointer min-h-[120px] md:min-h-[140px]
                 active:shadow-[inset_0_2px_4px_rgba(212,132,90,0.2),0_4px_16px_rgba(212,132,90,0.15)]"
    >
      <span className="text-[48px] md:text-[64px] leading-none">{card.emoji}</span>
    </motion.button>
  )
}
```

Key changes:
- Remove `useTranslation` import and all i18n logic
- Remove the `<div className="text-center">` block with text label
- Change `flex-col items-center gap-2` to `items-center justify-center` (centered emoji only)
- Bump emoji from `text-[40px] md:text-[56px]` to `text-[48px] md:text-[64px]`

**Step 2: Verify**

Run: `npm run dev`
Check: Communicate cards show only emoji, no text. Emoji is bigger and centered.

**Step 3: Commit**

```bash
git add src/components/Card.jsx
git commit -m "feat: remove text from Card, emoji-only with bigger icons"
```

---

### Task 4: Redesign CategoryChips with unique colors and distinct section

**Files:**
- Modify: `src/components/CategoryChips.jsx`

**Step 1: Rewrite with colored chips**

Replace full file content with:

```jsx
import { categories } from '../data/cards'

const colorMap = {
  terracotta: {
    active: 'bg-terracotta text-white',
    inactive: 'bg-terracotta/10 border-terracotta/20',
  },
  'soft-rose': {
    active: 'bg-soft-rose text-white',
    inactive: 'bg-soft-rose/10 border-soft-rose/20',
  },
  sky: {
    active: 'bg-sky text-white',
    inactive: 'bg-sky/10 border-sky/20',
  },
  sage: {
    active: 'bg-sage text-white',
    inactive: 'bg-sage/10 border-sage/20',
  },
}

export default function CategoryChips({ activeCategory, onCategoryChange }) {
  return (
    <div className="mx-4 my-3 p-3 bg-sand/80 rounded-2xl">
      <div className="flex gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id
          const colors = colorMap[cat.color]

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-1 flex items-center justify-center py-3 rounded-xl
                         text-2xl transition-all border-2
                         ${isActive
                           ? `${colors.active} shadow-md border-transparent`
                           : `${colors.inactive}`
                         }`}
            >
              {cat.emoji}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

Key changes:
- Remove `useTranslation` import and all i18n logic
- Remove text labels — emoji only
- Each category has its own unique color (from `categories[].color`)
- Active chip: solid fill with white emoji
- Inactive chip: light tint of category color with matching border
- Chips are equal width (`flex-1`) square buttons, not small pills
- Wrapped in a `bg-sand/80 rounded-2xl` container for visual separation from cards
- Bigger emoji (`text-2xl`) and taller (`py-3`)

**Step 2: Verify**

Run: `npm run dev`
Check: Category chips show emoji only with unique colors per category. Sits on a sand-colored strip that visually separates from the card grid below.

**Step 3: Commit**

```bash
git add src/components/CategoryChips.jsx
git commit -m "feat: redesign CategoryChips with unique colors and no text"
```

---

### Task 5: Remove text from MessageBar

**Files:**
- Modify: `src/components/MessageBar.jsx`

**Step 1: Remove placeholder text and card text**

Replace full file content with:

```jsx
import { motion, AnimatePresence } from 'framer-motion'

export default function MessageBar({ selectedCards, onClear }) {
  return (
    <div className="mx-4 mb-3 rounded-2xl bg-sand/50 border border-sand min-h-[64px] flex items-center px-4 gap-2">
      {selectedCards.length === 0 ? (
        <div className="flex-1" />
      ) : (
        <>
          <div className="flex-1 flex gap-2 flex-wrap py-2">
            <AnimatePresence>
              {selectedCards.map((card, i) => (
                <motion.span
                  key={`${card.id}-${i}`}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-flex items-center bg-terracotta text-white
                             px-3 py-1.5 rounded-full text-2xl"
                >
                  {card.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={onClear}
            className="text-bark/40 hover:text-bark/70 text-xl shrink-0 p-2"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  )
}
```

Key changes:
- Remove `useTranslation` import and all i18n logic
- Empty state: no placeholder text, just empty space
- Selected cards: show emoji only (removed `{card[lang] || card.en}` text)
- Emoji chips bumped to `text-2xl` (from `text-sm`)
- Removed `gap-1` inside chips (no text to space from)

**Step 2: Verify**

Run: `npm run dev`
Check: Message bar is empty when no cards selected (no placeholder text). Tapping cards adds emoji-only chips.

**Step 3: Commit**

```bash
git add src/components/MessageBar.jsx
git commit -m "feat: remove text from MessageBar, emoji-only chips"
```

---

### Task 6: Update CommunicateScreen grid to 3/4 columns

**Files:**
- Modify: `src/screens/CommunicateScreen.jsx`

**Step 1: Change grid columns**

On line 28, change:
```
grid grid-cols-2 md:grid-cols-4
```
to:
```
grid grid-cols-3 md:grid-cols-4
```

**Step 2: Verify**

Run: `npm run dev`
Check: Card grid shows 3 columns on mobile, 4 on tablet.

**Step 3: Commit**

```bash
git add src/screens/CommunicateScreen.jsx
git commit -m "feat: update communicate grid to 3-col mobile, 4-col tablet"
```

---

### Task 7: Update ProgressBar — remove text, thicker bar

**Files:**
- Modify: `src/components/ProgressBar.jsx`

**Step 1: Remove text and thicken bar**

Replace full file content with:

```jsx
import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
  const percent = (current / total) * 100

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="h-3 bg-sand rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-terracotta rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
```

Key changes:
- Remove `useTranslation` import and progress text label
- Remove the `<div className="flex justify-between...">` wrapper with text
- Bar height from `h-2` to `h-3`

**Step 2: Verify**

Run: `npm run dev`
Check: Exercise progress bar shows only the visual bar, no "3/10" text. Bar is thicker.

**Step 3: Commit**

```bash
git add src/components/ProgressBar.jsx
git commit -m "feat: remove text from ProgressBar, thicker visual bar"
```

---

### Task 8: Redesign ExerciseScreen — bigger cards, text-free completion

**Files:**
- Modify: `src/screens/ExerciseScreen.jsx`

**Step 1: Update completion screen**

Replace the completion return block (lines 73-119) with:

```jsx
    if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-8 px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-8xl mb-4">🎉</p>
        </motion.div>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl"
              initial={{
                top: -40,
                left: `${Math.random() * 90 + 5}%`,
                opacity: 1,
              }}
              animate={{
                top: '110%',
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'easeIn',
              }}
            >
              {['🎉', '🌟', '✨', '💪', '🌸'][i % 5]}
            </motion.span>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAgain}
          className="bg-terracotta text-white text-5xl
                     w-24 h-24 rounded-full shadow-lg
                     flex items-center justify-center"
        >
          🔄
        </motion.button>
      </div>
    )
  }
```

Key changes:
- Remove `{t('exercise.complete')}` text ("เก่งมาก!")
- Make 🎉 emoji bigger (`text-8xl` from `text-6xl`)
- Replace text "Play Again" button with circular 🔄 icon button (`w-24 h-24 rounded-full`)
- More gap (`gap-8` from `gap-6`)

**Step 2: Update answer option cards**

Replace the answer grid (lines 146-194) with:

```jsx
      <div className="grid grid-cols-2 gap-4 px-4">
        {question.options.map((card, i) => {
          const isCorrect = feedback === 'correct' && card.id === question.answer.id
          const isWrong = wrongId === card.id

          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                x: isWrong ? [0, -3, 3, -3, 3, 0] : 0,
              }}
              transition={{
                delay: i * 0.05,
                duration: 0.3,
                x: { duration: 0.3 },
              }}
              whileTap={{ scale: 1.05 }}
              onClick={() => handleChoice(card)}
              className={`rounded-2xl p-6 flex flex-col items-center justify-center gap-3
                         min-h-[180px] md:min-h-[220px] cursor-pointer
                         shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                         transition-colors border-2
                         ${
                           isCorrect
                             ? 'bg-sage/20 border-sage'
                             : isWrong
                             ? 'bg-soft-rose/20 border-soft-rose'
                             : 'bg-sand/60 border-transparent hover:border-terracotta/30'
                         }`}
            >
              <span className="text-[72px] md:text-[96px] leading-none">
                {card.emoji}
              </span>
              {isCorrect && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl"
                >
                  ✅
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
```

Key changes:
- Remove `max-w-lg mx-auto` — cards now fill screen width
- Emoji from `text-[48px] md:text-[64px]` to `text-[72px] md:text-[96px]`
- Min height from `min-h-[140px] md:min-h-[180px]` to `min-h-[180px] md:min-h-[220px]`
- Add `justify-center` for vertical centering

**Step 3: Remove unused `t` from useTranslation destructure**

On line 26, the `useTranslation` call is: `const { t, i18n } = useTranslation()`

The prompt box still uses `t('exercise.prompt')` so `t` is still needed. Keep line 26 as-is.

**Step 4: Verify**

Run: `npm run dev`
Check:
- Exercise answer cards fill the width (no wasted space on sides)
- Emojis are much bigger (72px/96px)
- Completion screen shows big 🎉 and round 🔄 button (no text)
- Prompt box still shows word text for caretaker

**Step 5: Commit**

```bash
git add src/screens/ExerciseScreen.jsx
git commit -m "feat: bigger exercise cards, text-free completion screen"
```

---

### Task 9: Redesign SettingsScreen — flags only, no text

**Files:**
- Modify: `src/screens/SettingsScreen.jsx`

**Step 1: Replace with icon-only design**

Replace full file content with:

```jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const languages = [
  { code: 'th', flag: '🇹🇭' },
  { code: 'en', flag: '🇬🇧' },
]

export default function SettingsScreen() {
  const { i18n } = useTranslation()

  return (
    <div className="px-4 pt-8 max-w-lg mx-auto">
      <div className="flex gap-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileTap={{ scale: 0.95 }}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`flex-1 flex flex-col items-center gap-3 py-8 rounded-2xl
                       transition-all border-2
                       shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                       ${
                         i18n.language === lang.code
                           ? 'bg-terracotta/10 border-terracotta'
                           : 'bg-sand/60 border-transparent hover:border-terracotta/30'
                       }`}
          >
            <span className="text-7xl">{lang.flag}</span>
            {i18n.language === lang.code && (
              <motion.div
                layoutId="langIndicator"
                className="w-3 h-3 rounded-full bg-terracotta"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

Key changes:
- Remove screen title (`<h1>⚙️ {t('settings.title')}</h1>`)
- Remove section label (`🌐 {t('settings.language')}`)
- Remove text labels from language buttons (`ไทย`, `English`)
- Remove `t` from useTranslation (only `i18n` needed)
- Flags from `text-4xl` to `text-7xl` (much bigger)
- More padding (`py-8` from `py-6`)
- Indicator dot from `w-2 h-2` to `w-3 h-3`

**Step 2: Verify**

Run: `npm run dev`
Check: Settings shows just two big flag buttons. No text anywhere. Active flag has terracotta border and indicator dot.

**Step 3: Commit**

```bash
git add src/screens/SettingsScreen.jsx
git commit -m "feat: redesign Settings with flag-only language selection"
```

---

### Task 10: Final verification and cleanup

**Step 1: Run build to check for errors**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Visual verification checklist**

Open `npm run dev` and verify each screen:

- [ ] **Tab bar**: 3 emoji icons only, no text, active tab scaled up
- [ ] **Communicate**: Category chips have unique colors on sand strip, card grid is 3/4 columns with emoji only, message bar shows emoji-only chips
- [ ] **Exercise**: Prompt still shows text for caretaker, answer cards fill the width with big emoji, completion shows 🎉 and 🔄 button only
- [ ] **Settings**: Two big flag buttons, no text anywhere
- [ ] **All new food cards**: 10 new items appear in food category

**Step 3: Final commit if any tweaks needed**

```bash
git add -A
git commit -m "feat: complete text-free redesign for aphasia patients"
```
