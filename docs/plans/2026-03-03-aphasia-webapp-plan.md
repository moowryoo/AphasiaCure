# AphasiaCure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a tablet-first React webapp for aphasia patients to communicate via image cards and practice word-image matching exercises, with Thai/English support.

**Architecture:** Single-page React app with 3 tab screens (Communicate, Exercise, Settings). No routing library — simple state-based tab switching. All data is static JSON, no backend. i18n via react-i18next.

**Tech Stack:** React 18 + Vite, Tailwind CSS v4, Framer Motion, react-i18next

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`

**Step 1: Initialize Vite React project**

Run:
```bash
cd /Users/warunyoo/moo/AphasiaCure
npm create vite@latest . -- --template react
```

If prompted about non-empty directory, choose to continue (only docs/ exists).

**Step 2: Install dependencies**

Run:
```bash
npm install react-i18next i18next framer-motion
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Vite with Tailwind**

Replace `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 4: Set up Tailwind in CSS**

Replace `src/index.css`:
```css
@import "tailwindcss";

@theme {
  --color-cream: #FFF8F0;
  --color-sand: #F5E6D3;
  --color-terracotta: #D4845A;
  --color-sage: #8BAA7C;
  --color-soft-rose: #E8A0A0;
  --color-bark: #5C4033;
  --color-sky: #A8C8E8;
  --font-display: 'Nunito', sans-serif;
  --font-thai: 'Noto Sans Thai', sans-serif;
}
```

**Step 5: Set up index.html with fonts**

Replace `index.html`:
```html
<!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AphasiaCure</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Noto+Sans+Thai:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-cream font-display text-bark">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 6: Create placeholder App**

Replace `src/App.jsx`:
```jsx
function App() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <h1 className="text-3xl font-bold text-bark font-display">
        🧠 AphasiaCure
      </h1>
    </div>
  )
}

export default App
```

**Step 7: Verify it runs**

Run: `npm run dev`
Expected: Browser shows "🧠 AphasiaCure" centered on cream background with Nunito font.

**Step 8: Commit**

```bash
git init
echo "node_modules\ndist\n.DS_Store" > .gitignore
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind project with Soft Bloom theme"
```

---

### Task 2: Card Data & i18n Setup

**Files:**
- Create: `src/data/cards.js`
- Create: `src/i18n/index.js`
- Create: `src/i18n/en.json`
- Create: `src/i18n/th.json`

**Step 1: Create card data**

Create `src/data/cards.js`:
```js
export const categories = [
  { id: 'food', emoji: '🍽️', labelKey: 'categories.food' },
  { id: 'emotions', emoji: '😊', labelKey: 'categories.emotions' },
  { id: 'daily', emoji: '🏠', labelKey: 'categories.daily' },
  { id: 'greetings', emoji: '👋', labelKey: 'categories.greetings' },
]

export const cards = [
  // Food & Drink
  { id: 'rice', emoji: '🍚', th: 'ข้าว', en: 'Rice', category: 'food' },
  { id: 'water', emoji: '💧', th: 'น้ำ', en: 'Water', category: 'food' },
  { id: 'banana', emoji: '🍌', th: 'กล้วย', en: 'Banana', category: 'food' },
  { id: 'apple', emoji: '🍎', th: 'แอปเปิ้ล', en: 'Apple', category: 'food' },
  { id: 'egg', emoji: '🥚', th: 'ไข่', en: 'Egg', category: 'food' },
  { id: 'noodles', emoji: '🍜', th: 'ก๋วยเตี๋ยว', en: 'Noodles', category: 'food' },
  { id: 'coffee', emoji: '☕', th: 'กาแฟ', en: 'Coffee', category: 'food' },
  { id: 'milk', emoji: '🥛', th: 'นม', en: 'Milk', category: 'food' },
  { id: 'bread', emoji: '🍞', th: 'ขนมปัง', en: 'Bread', category: 'food' },
  { id: 'medicine', emoji: '💊', th: 'ยา', en: 'Medicine', category: 'food' },

  // Emotions
  { id: 'happy', emoji: '😊', th: 'ดีใจ', en: 'Happy', category: 'emotions' },
  { id: 'sad', emoji: '😢', th: 'เสียใจ', en: 'Sad', category: 'emotions' },
  { id: 'angry', emoji: '😠', th: 'โกรธ', en: 'Angry', category: 'emotions' },
  { id: 'scared', emoji: '😰', th: 'กลัว', en: 'Scared', category: 'emotions' },
  { id: 'tired', emoji: '😴', th: 'เหนื่อย', en: 'Tired', category: 'emotions' },
  { id: 'pain', emoji: '🤒', th: 'เจ็บ', en: 'Pain', category: 'emotions' },
  { id: 'love', emoji: '🥰', th: 'รัก', en: 'Love', category: 'emotions' },
  { id: 'neutral', emoji: '😐', th: 'เฉยๆ', en: 'Neutral', category: 'emotions' },

  // Daily Needs
  { id: 'bathroom', emoji: '🚽', th: 'ห้องน้ำ', en: 'Bathroom', category: 'daily' },
  { id: 'sleep', emoji: '🛏️', th: 'นอน', en: 'Sleep', category: 'daily' },
  { id: 'sit', emoji: '🪑', th: 'นั่ง', en: 'Sit', category: 'daily' },
  { id: 'walk', emoji: '🚶', th: 'เดิน', en: 'Walk', category: 'daily' },
  { id: 'help', emoji: '🆘', th: 'ช่วยด้วย', en: 'Help', category: 'daily' },
  { id: 'clothes', emoji: '👕', th: 'เสื้อผ้า', en: 'Clothes', category: 'daily' },
  { id: 'shower', emoji: '🚿', th: 'อาบน้ำ', en: 'Shower', category: 'daily' },
  { id: 'tv', emoji: '📺', th: 'ทีวี', en: 'TV', category: 'daily' },
  { id: 'phone', emoji: '📱', th: 'โทรศัพท์', en: 'Phone', category: 'daily' },
  { id: 'key', emoji: '🔑', th: 'กุญแจ', en: 'Key', category: 'daily' },

  // Greetings & Responses
  { id: 'hello', emoji: '👋', th: 'สวัสดี', en: 'Hello', category: 'greetings' },
  { id: 'thankyou', emoji: '🙏', th: 'ขอบคุณ', en: 'Thank you', category: 'greetings' },
  { id: 'yes', emoji: '✅', th: 'ใช่', en: 'Yes', category: 'greetings' },
  { id: 'no', emoji: '❌', th: 'ไม่', en: 'No', category: 'greetings' },
  { id: 'please', emoji: '🙏', th: 'ได้โปรด', en: 'Please', category: 'greetings' },
  { id: 'goodbye', emoji: '👋', th: 'ลาก่อน', en: 'Goodbye', category: 'greetings' },
  { id: 'good', emoji: '👍', th: 'ดี', en: 'Good', category: 'greetings' },
  { id: 'sorry', emoji: '🤝', th: 'ขอโทษ', en: 'Sorry', category: 'greetings' },
]
```

**Step 2: Create English translation**

Create `src/i18n/en.json`:
```json
{
  "tabs": {
    "communicate": "Communicate",
    "exercise": "Exercise",
    "settings": "Settings"
  },
  "categories": {
    "food": "Food & Drink",
    "emotions": "Emotions",
    "daily": "Daily Needs",
    "greetings": "Greetings"
  },
  "communicate": {
    "messagePlaceholder": "Tap cards to communicate...",
    "clear": "Clear"
  },
  "exercise": {
    "prompt": "Find the matching image",
    "correct": "Correct!",
    "tryAgain": "Try again",
    "complete": "Great job!",
    "playAgain": "Play Again",
    "progress": "{{current}} / {{total}}"
  },
  "settings": {
    "title": "Settings",
    "language": "Language"
  }
}
```

**Step 3: Create Thai translation**

Create `src/i18n/th.json`:
```json
{
  "tabs": {
    "communicate": "สื่อสาร",
    "exercise": "ฝึกฝน",
    "settings": "ตั้งค่า"
  },
  "categories": {
    "food": "อาหารและเครื่องดื่ม",
    "emotions": "อารมณ์",
    "daily": "กิจวัตรประจำวัน",
    "greetings": "ทักทาย"
  },
  "communicate": {
    "messagePlaceholder": "แตะการ์ดเพื่อสื่อสาร...",
    "clear": "ล้าง"
  },
  "exercise": {
    "prompt": "หารูปภาพที่ตรงกัน",
    "correct": "ถูกต้อง!",
    "tryAgain": "ลองอีกครั้ง",
    "complete": "เก่งมาก!",
    "playAgain": "เล่นอีกครั้ง",
    "progress": "{{current}} / {{total}}"
  },
  "settings": {
    "title": "ตั้งค่า",
    "language": "ภาษา"
  }
}
```

**Step 4: Configure i18next**

Create `src/i18n/index.js`:
```js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import th from './th.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    th: { translation: th },
  },
  lng: 'th',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
```

**Step 5: Import i18n in main.jsx**

Update `src/main.jsx` — add `import './i18n'` before the App import.

**Step 6: Verify i18n loads**

Temporarily add `useTranslation` to App.jsx to display a translated string. Verify in browser.

**Step 7: Commit**

```bash
git add src/data src/i18n
git commit -m "feat: add card data (36 items) and i18n setup (TH/EN)"
```

---

### Task 3: App Layout & Tab Navigation

**Files:**
- Create: `src/components/TabBar.jsx`
- Modify: `src/App.jsx`

**Step 1: Create TabBar component**

Create `src/components/TabBar.jsx`:
```jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'communicate', emoji: '💬' },
  { id: 'exercise', emoji: '🧠' },
  { id: 'settings', emoji: '⚙️' },
]

export default function TabBar({ activeTab, onTabChange }) {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream/80 backdrop-blur-xl border-t border-sand z-50">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 px-6 py-2 relative"
          >
            <span className="text-2xl">{tab.emoji}</span>
            <span
              className={`text-xs font-semibold font-thai transition-colors ${
                activeTab === tab.id ? 'text-terracotta' : 'text-bark/50'
              }`}
            >
              {t(`tabs.${tab.id}`)}
            </span>
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

**Step 2: Update App.jsx with tab navigation**

Replace `src/App.jsx`:
```jsx
import { useState } from 'react'
import TabBar from './components/TabBar'

function App() {
  const [activeTab, setActiveTab] = useState('communicate')

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Screen content placeholder */}
      <div className="flex items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-bold text-bark">
          {activeTab === 'communicate' && '💬 Communicate'}
          {activeTab === 'exercise' && '🧠 Exercise'}
          {activeTab === 'settings' && '⚙️ Settings'}
        </h1>
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
```

**Step 3: Verify tab switching**

Run: `npm run dev`
Expected: Bottom tab bar with frosted glass effect, dot indicator animates between tabs, tab label changes color.

**Step 4: Commit**

```bash
git add src/components/TabBar.jsx src/App.jsx
git commit -m "feat: add bottom tab bar with animated active indicator"
```

---

### Task 4: Card Component

**Files:**
- Create: `src/components/Card.jsx`

**Step 1: Create the reusable Card component**

Create `src/components/Card.jsx`:
```jsx
import { motion } from 'framer-motion'

export default function Card({ card, onClick, index = 0, showBothLanguages = true }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileTap={{ scale: 1.05 }}
      onClick={() => onClick(card)}
      className="bg-sand/60 rounded-2xl p-4 flex flex-col items-center gap-2
                 shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                 hover:border-terracotta/30 border-2 border-transparent
                 transition-colors cursor-pointer min-h-[120px] md:min-h-[140px]
                 active:shadow-[inset_0_2px_4px_rgba(212,132,90,0.2),0_4px_16px_rgba(212,132,90,0.15)]"
    >
      <span className="text-[40px] md:text-[56px] leading-none">{card.emoji}</span>
      <div className="text-center">
        <p className="text-sm md:text-base font-semibold text-bark font-thai">
          {card.th}
        </p>
        {showBothLanguages && (
          <p className="text-xs md:text-sm text-bark/60">{card.en}</p>
        )}
      </div>
    </motion.button>
  )
}
```

**Step 2: Verify card renders**

Temporarily render a Card in App.jsx with test data. Verify: cream card with inner shadow, emoji + bilingual label, scale animation on tap.

**Step 3: Commit**

```bash
git add src/components/Card.jsx
git commit -m "feat: add reusable Card component with wooden-tile style and animations"
```

---

### Task 5: Communicate Screen

**Files:**
- Create: `src/components/CategoryChips.jsx`
- Create: `src/components/MessageBar.jsx`
- Create: `src/screens/CommunicateScreen.jsx`
- Modify: `src/App.jsx`

**Step 1: Create CategoryChips component**

Create `src/components/CategoryChips.jsx`:
```jsx
import { useTranslation } from 'react-i18next'
import { categories } from '../data/cards'

export default function CategoryChips({ activeCategory, onCategoryChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                     text-sm font-semibold font-thai transition-all shrink-0
                     ${
                       activeCategory === cat.id
                         ? 'bg-terracotta text-white shadow-md'
                         : 'bg-gradient-to-b from-cream to-sand text-bark/70 hover:text-bark'
                     }`}
        >
          <span>{cat.emoji}</span>
          <span>{t(cat.labelKey)}</span>
        </button>
      ))}
    </div>
  )
}
```

**Step 2: Create MessageBar component**

Create `src/components/MessageBar.jsx`:
```jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function MessageBar({ selectedCards, onClear }) {
  const { t } = useTranslation()

  return (
    <div className="mx-4 mb-3 rounded-2xl bg-sand/50 border border-sand min-h-[64px] flex items-center px-4 gap-2">
      {selectedCards.length === 0 ? (
        <p className="text-bark/30 text-sm font-thai">
          {t('communicate.messagePlaceholder')}
        </p>
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
                  className="inline-flex items-center gap-1 bg-terracotta text-white
                             px-3 py-1.5 rounded-full text-sm font-semibold font-thai"
                >
                  <span>{card.emoji}</span>
                  <span>{card.th}</span>
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

**Step 3: Create CommunicateScreen**

Create `src/screens/CommunicateScreen.jsx`:
```jsx
import { useState } from 'react'
import { cards } from '../data/cards'
import Card from '../components/Card'
import CategoryChips from '../components/CategoryChips'
import MessageBar from '../components/MessageBar'

export default function CommunicateScreen() {
  const [activeCategory, setActiveCategory] = useState('food')
  const [selectedCards, setSelectedCards] = useState([])

  const filteredCards = cards.filter((c) => c.category === activeCategory)

  const handleCardTap = (card) => {
    setSelectedCards((prev) => [...prev, card])
  }

  const handleClear = () => {
    setSelectedCards([])
  }

  return (
    <div className="pt-2">
      <MessageBar selectedCards={selectedCards} onClear={handleClear} />
      <CategoryChips
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pt-3">
        {filteredCards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardTap}
            index={i}
            showBothLanguages={true}
          />
        ))}
      </div>
    </div>
  )
}
```

**Step 4: Wire CommunicateScreen into App.jsx**

Update `src/App.jsx`:
```jsx
import { useState } from 'react'
import TabBar from './components/TabBar'
import CommunicateScreen from './screens/CommunicateScreen'

function App() {
  const [activeTab, setActiveTab] = useState('communicate')

  return (
    <div className="min-h-screen bg-cream pb-24">
      {activeTab === 'communicate' && <CommunicateScreen />}
      {activeTab === 'exercise' && (
        <div className="flex items-center justify-center h-[80vh]">
          <h1 className="text-3xl font-bold text-bark">🧠 Exercise</h1>
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-[80vh]">
          <h1 className="text-3xl font-bold text-bark">⚙️ Settings</h1>
        </div>
      )}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
```

**Step 5: Verify Communicate screen**

Run: `npm run dev`
Expected:
- Message bar at top with placeholder text
- Category chips scrollable, terracotta active state
- 4-column card grid on tablet, 2-column on mobile
- Tapping card adds item to message bar with spring animation
- Clear button resets message bar

**Step 6: Commit**

```bash
git add src/components/CategoryChips.jsx src/components/MessageBar.jsx src/screens/CommunicateScreen.jsx src/App.jsx
git commit -m "feat: build Communicate screen with card grid, category chips, and message bar"
```

---

### Task 6: Exercise Screen

**Files:**
- Create: `src/screens/ExerciseScreen.jsx`
- Create: `src/components/ProgressBar.jsx`
- Modify: `src/App.jsx`

**Step 1: Create ProgressBar component**

Create `src/components/ProgressBar.jsx`:
```jsx
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ProgressBar({ current, total }) {
  const { t } = useTranslation()
  const percent = (current / total) * 100

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-bark/60 font-thai">
          {t('exercise.progress', { current, total })}
        </span>
      </div>
      <div className="h-2 bg-sand rounded-full overflow-hidden">
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

**Step 2: Create ExerciseScreen with game logic**

Create `src/screens/ExerciseScreen.jsx`:
```jsx
import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cards } from '../data/cards'
import ProgressBar from '../components/ProgressBar'

const TOTAL_QUESTIONS = 10

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateQuestion() {
  const shuffled = shuffleArray(cards)
  const answer = shuffled[0]
  const options = shuffleArray(shuffled.slice(0, 4))
  return { answer, options }
}

export default function ExerciseScreen() {
  const { t, i18n } = useTranslation()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [question, setQuestion] = useState(() => generateQuestion())
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [wrongId, setWrongId] = useState(null)
  const [completed, setCompleted] = useState(false)

  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setCompleted(true)
    } else {
      setQuestionIndex((prev) => prev + 1)
      setQuestion(generateQuestion())
      setFeedback(null)
      setWrongId(null)
    }
  }, [questionIndex])

  const handleChoice = (card) => {
    if (feedback === 'correct') return

    if (card.id === question.answer.id) {
      setFeedback('correct')
      setWrongId(null)
      setTimeout(() => nextQuestion(), 1500)
    } else {
      setFeedback('wrong')
      setWrongId(card.id)
      setTimeout(() => {
        setWrongId(null)
        setFeedback(null)
      }, 800)
    }
  }

  const handlePlayAgain = () => {
    setQuestionIndex(0)
    setQuestion(generateQuestion())
    setFeedback(null)
    setWrongId(null)
    setCompleted(false)
  }

  const lang = i18n.language
  const promptLabel = question.answer[lang] || question.answer.en

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-6 px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-6xl mb-4">🎉</p>
          <h2 className="text-3xl font-bold text-bark font-thai mb-2">
            {t('exercise.complete')}
          </h2>
        </motion.div>
        {/* Emoji rain */}
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
          className="bg-terracotta text-white font-bold font-thai text-lg
                     px-8 py-4 rounded-2xl shadow-lg"
        >
          {t('exercise.playAgain')}
        </motion.button>
      </div>
    )
  }

  return (
    <div>
      <ProgressBar current={questionIndex + 1} total={TOTAL_QUESTIONS} />

      {/* Prompt card */}
      <div className="mx-4 mt-4 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-sand/60 rounded-2xl p-6 text-center
                       shadow-[inset_0_2px_4px_rgba(255,248,240,0.8)]"
          >
            <p className="text-sm text-bark/50 font-thai mb-1">
              {t('exercise.prompt')}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-bark font-thai">
              {question.answer.emoji} {promptLabel}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4 choices in 2x2 grid */}
      <div className="grid grid-cols-2 gap-4 px-4 max-w-lg mx-auto">
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
              className={`rounded-2xl p-6 flex flex-col items-center gap-3
                         min-h-[140px] md:min-h-[180px] cursor-pointer
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
              <span className="text-[48px] md:text-[64px] leading-none">
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
    </div>
  )
}
```

**Step 3: Wire ExerciseScreen into App.jsx**

Update the exercise placeholder in `src/App.jsx`:
```jsx
import ExerciseScreen from './screens/ExerciseScreen'

// Replace the exercise placeholder with:
{activeTab === 'exercise' && <ExerciseScreen />}
```

**Step 4: Verify Exercise screen**

Run: `npm run dev`
Expected:
- Progress bar showing 1/10
- Prompt card with emoji + word in selected language
- 4 emoji cards in 2x2 grid
- Correct → green glow + checkmark + auto-advance
- Wrong → red tint + shake + resets
- After 10 questions → completion screen with emoji rain + play again button

**Step 5: Commit**

```bash
git add src/screens/ExerciseScreen.jsx src/components/ProgressBar.jsx src/App.jsx
git commit -m "feat: build Exercise screen with matching game, feedback animations, and completion"
```

---

### Task 7: Settings Screen

**Files:**
- Create: `src/screens/SettingsScreen.jsx`
- Modify: `src/App.jsx`

**Step 1: Create SettingsScreen**

Create `src/screens/SettingsScreen.jsx`:
```jsx
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const languages = [
  { code: 'th', flag: '🇹🇭', label: 'ไทย' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

export default function SettingsScreen() {
  const { t, i18n } = useTranslation()

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-bark font-thai mb-8">
        ⚙️ {t('settings.title')}
      </h1>

      <div className="mb-6">
        <p className="text-sm font-semibold text-bark/60 font-thai mb-3">
          🌐 {t('settings.language')}
        </p>
        <div className="flex gap-4">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileTap={{ scale: 0.95 }}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl
                         text-lg font-semibold transition-all border-2
                         shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                         ${
                           i18n.language === lang.code
                             ? 'bg-terracotta/10 border-terracotta text-bark'
                             : 'bg-sand/60 border-transparent text-bark/50 hover:border-terracotta/30'
                         }`}
            >
              <span className="text-4xl">{lang.flag}</span>
              <span className="font-thai">{lang.label}</span>
              {i18n.language === lang.code && (
                <motion.div
                  layoutId="langIndicator"
                  className="w-2 h-2 rounded-full bg-terracotta"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Wire SettingsScreen into App.jsx**

Update the settings placeholder in `src/App.jsx`:
```jsx
import SettingsScreen from './screens/SettingsScreen'

// Replace the settings placeholder with:
{activeTab === 'settings' && <SettingsScreen />}
```

**Step 3: Verify Settings screen**

Run: `npm run dev`
Expected:
- Two large flag buttons side by side
- Active language highlighted with terracotta border
- Switching language updates all tab labels, category names, and exercise prompts instantly

**Step 4: Commit**

```bash
git add src/screens/SettingsScreen.jsx src/App.jsx
git commit -m "feat: build Settings screen with language toggle (TH/EN)"
```

---

### Task 8: Visual Polish & Background Textures

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.jsx`

**Step 1: Add noise texture and gradient background to index.css**

Add to `src/index.css` (after the @theme block):
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

body::after {
  content: '';
  position: fixed;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(ellipse, rgba(212, 132, 90, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

#root {
  position: relative;
  z-index: 2;
}

/* Hide scrollbar on category chips */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

**Step 2: Verify visual polish**

Run: `npm run dev`
Expected:
- Subtle noise texture visible across the cream background
- Faint warm radial gradient in the top-right corner
- Category chips scroll without visible scrollbar
- Overall warm, nature-inspired feel

**Step 3: Commit**

```bash
git add src/index.css src/App.jsx
git commit -m "feat: add noise texture, radial gradient, and visual polish"
```

---

### Task 9: Final Integration & Responsive Testing

**Files:**
- Modify: `src/App.jsx` (final version)

**Step 1: Ensure final App.jsx is clean**

Verify `src/App.jsx` has all three screens wired correctly:
```jsx
import { useState } from 'react'
import TabBar from './components/TabBar'
import CommunicateScreen from './screens/CommunicateScreen'
import ExerciseScreen from './screens/ExerciseScreen'
import SettingsScreen from './screens/SettingsScreen'

function App() {
  const [activeTab, setActiveTab] = useState('communicate')

  return (
    <div className="min-h-screen bg-cream pb-24">
      {activeTab === 'communicate' && <CommunicateScreen />}
      {activeTab === 'exercise' && <ExerciseScreen />}
      {activeTab === 'settings' && <SettingsScreen />}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
```

**Step 2: Test responsive breakpoints**

Run: `npm run dev`
Test in browser DevTools:
- **Tablet (768px+):** 4-column card grid, large emojis (56px), generous spacing
- **Mobile (<768px):** 2-column card grid, smaller emojis (40px)
- **Bottom tab bar:** Visible and functional at all sizes
- **Message bar:** Wraps properly with multiple selected cards
- **Exercise:** 2x2 grid centered on both tablet and mobile

**Step 3: Test full user flow**

1. Open app → Communicate screen loads with Food category
2. Tap cards → items appear in message bar with spring animation
3. Tap clear → message bar resets
4. Switch categories → cards update with stagger animation
5. Switch to Exercise tab → matching game starts
6. Complete 10 questions → completion screen with emoji rain
7. Tap Play Again → game restarts
8. Switch to Settings → toggle language
9. Switch back to Communicate → labels updated in new language
10. Switch to Exercise → prompts in new language

**Step 4: Build production version**

Run: `npm run build`
Expected: Successful build with no errors.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: final integration, responsive layout verified"
```

---

## File Tree Summary

```
AphasiaCure/
├── docs/plans/
│   ├── 2026-03-03-aphasia-webapp-design.md
│   └── 2026-03-03-aphasia-webapp-plan.md
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── i18n/
│   │   ├── index.js
│   │   ├── en.json
│   │   └── th.json
│   ├── data/
│   │   └── cards.js
│   ├── components/
│   │   ├── TabBar.jsx
│   │   ├── Card.jsx
│   │   ├── CategoryChips.jsx
│   │   ├── MessageBar.jsx
│   │   └── ProgressBar.jsx
│   └── screens/
│       ├── CommunicateScreen.jsx
│       ├── ExerciseScreen.jsx
│       └── SettingsScreen.jsx
```

## Task Dependency Order

```
Task 1 (Scaffold)
  └─→ Task 2 (Data & i18n)
       └─→ Task 3 (Tab Navigation)
            └─→ Task 4 (Card Component)
                 └─→ Task 5 (Communicate Screen)
                 └─→ Task 6 (Exercise Screen)
                      └─→ Task 7 (Settings Screen)
                           └─→ Task 8 (Visual Polish)
                                └─→ Task 9 (Final Integration)
```

Tasks 5 and 6 can be parallelized (both depend on Task 4 but are independent of each other).
