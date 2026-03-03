# AphasiaCure — Aphasia Communication & Exercise Webapp

## Overview

A tablet-first, responsive webapp for people with aphasia to communicate with caregivers via image selection and practice word-image matching exercises. Built with React, multi-language (Thai/English), warm therapeutic aesthetic.

## Users

- **Primary:** Person with aphasia — taps images to communicate and practice
- **Secondary:** Caregiver — reads the message bar, assists with exercises

## App Structure

3 screens via bottom tab bar:

1. **💬 Communicate** — image communication board
2. **🧠 Exercise** — word-to-image matching
3. **⚙️ Settings** — language toggle

### Navigation
- Bottom tab bar with large icons + labels (always visible)
- No deep nesting — every feature is 1 tap away
- No login/auth — works immediately on open
- No audio — visual only

---

## Screen 1: Communicate

### Layout
- **Tablet:** 4-column grid of large image cards
- **Mobile:** 2-column grid
- Warm cream background

### Category Chips (horizontal scroll at top)
- 🍽️ Food & Drink
- 😊 Emotions
- 🏠 Daily Needs
- 👋 Greetings & Responses

### Message Bar (top of screen)
- Selected items appear as a sentence builder
- Patient taps multiple cards: e.g., 😢 + 💊 = "I'm in pain, need medicine"
- Clear button (🗑️) to reset
- New items slide in from below with spring physics

### Card Behavior
- Tap → card highlights with soft animated glow
- Scale to 1.05 + warm glow shadow on press
- Selected state in message bar: terracotta background with white text

---

## Screen 2: Exercise

### Layout
- Top: **Prompt card** showing target word in large text (e.g., "น้ำ / Water 💧")
- Below: **4 image cards** in 2×2 grid
- Progress bar at top (e.g., 3/10)

### Exercise Flow
1. App shows a word prompt
2. Patient taps one of 4 image cards
3. **Correct** → card glows sage green ✅, soft checkmark fade-in, auto-advance after 1.5s
4. **Wrong** → gentle horizontal shake + soft rose tint, stays on same question
5. Exercises pull randomly from all categories
6. Fixed 4 choices, no difficulty progression

### Completion
- After 10 questions: "🎉 เก่งมาก! / Great job!" completion card
- Gentle emoji rain (🎉🌟) drifts down
- "Play Again" button to restart
- No scoring/stats — stress-free and encouraging

---

## Screen 3: Settings

- **🌐 Language toggle** — big flag buttons (🇹🇭 / 🇬🇧) side by side, selected one highlighted
- Switching updates all labels, prompts, and card text instantly

---

## Multi-language Approach

- **react-i18next** with JSON translation files per language
- Communicate screen: cards show **both languages** (ข้าว / Rice)
- Exercise prompts: show **selected language only**
- UI labels: switch with selected language

---

## Card Data

~36 preset items across 4 categories:

### 🍽️ Food & Drink (10)
| Emoji | Thai | English |
|-------|------|---------|
| 🍚 | ข้าว | Rice |
| 💧 | น้ำ | Water |
| 🍌 | กล้วย | Banana |
| 🍎 | แอปเปิ้ล | Apple |
| 🥚 | ไข่ | Egg |
| 🍜 | ก๋วยเตี๋ยว | Noodles |
| ☕ | กาแฟ | Coffee |
| 🥛 | นม | Milk |
| 🍞 | ขนมปัง | Bread |
| 💊 | ยา | Medicine |

### 😊 Emotions (8)
| Emoji | Thai | English |
|-------|------|---------|
| 😊 | ดีใจ | Happy |
| 😢 | เสียใจ | Sad |
| 😠 | โกรธ | Angry |
| 😰 | กลัว | Scared |
| 😴 | เหนื่อย | Tired |
| 🤒 | เจ็บ | Pain |
| 🥰 | รัก | Love |
| 😐 | เฉยๆ | Neutral |

### 🏠 Daily Needs (10)
| Emoji | Thai | English |
|-------|------|---------|
| 🚽 | ห้องน้ำ | Bathroom |
| 🛏️ | นอน | Sleep |
| 🪑 | นั่ง | Sit |
| 🚶 | เดิน | Walk |
| 🆘 | ช่วยด้วย | Help |
| 👕 | เสื้อผ้า | Clothes |
| 🚿 | อาบน้ำ | Shower |
| 📺 | ทีวี | TV |
| 📱 | โทรศัพท์ | Phone |
| 🔑 | กุญแจ | Key |

### 👋 Greetings & Responses (8)
| Emoji | Thai | English |
|-------|------|---------|
| 👋 | สวัสดี | Hello |
| 🙏 | ขอบคุณ | Thank you |
| ✅ | ใช่ | Yes |
| ❌ | ไม่ | No |
| 🙏 | ได้โปรด | Please |
| 👋 | ลาก่อน | Goodbye |
| 👍 | ดี | Good |
| 🤝 | ขอโทษ | Sorry |

---

## Visual Design: "Soft Bloom" 🌿

### Concept
Warm, nature-inspired therapeutic space. Like a sunlit room with wooden tiles — not a sterile clinical app.

### Typography
- **Display/Headers:** Nunito — rounded, friendly, highly legible
- **Thai Body:** Noto Sans Thai — clean Thai script rendering
- Rounded geometry shared across both = visual harmony

### Color Palette
```css
--cream:        #FFF8F0    /* warm background */
--sand:         #F5E6D3    /* card backgrounds */
--terracotta:   #D4845A    /* primary accent */
--sage:         #8BAA7C    /* correct/success */
--soft-rose:    #E8A0A0    /* wrong/gentle error */
--bark:         #5C4033    /* text color (not black) */
--sky:          #A8C8E8    /* secondary accent */
```

### Card Style
- Soft cream cards with subtle inner shadow (feels raised like wooden tiles)
- 4px rounded corners, faint terracotta border on hover
- Emoji at 56px (tablet) / 40px (mobile)
- Label in --bark color

### Touch Targets
- Minimum 64px touch targets
- Large cards, generous spacing

### Micro-animations (Framer Motion)
- Page enter: cards stagger in from bottom (50ms delay each)
- Correct: pulse sage green + checkmark fade-in
- Wrong: gentle horizontal shake (3px, 300ms) + rose tint
- Message bar: spring physics slide-in
- Completion: gentle emoji rain drift

### Backgrounds & Texture
- Subtle noise texture at 3% opacity on cream background
- Faint radial gradient (warm peach → transparent) top-right corner
- Category chips with soft gradient (cream → sand)

### Bottom Tab Bar
- Frosted glass effect (backdrop-filter: blur)
- 28px icons with dot indicator for active tab

---

## Tech Stack

- **React** with Vite
- **react-i18next** for i18n
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **No backend** — fully client-side, works offline

---

## Responsive Breakpoints

- **Tablet (primary):** ≥768px — 4-column grids, generous spacing
- **Mobile:** <768px — 2-column grids, slightly smaller cards/emoji
