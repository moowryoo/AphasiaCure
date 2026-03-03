# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AphasiaCure is a tablet-first React webapp for people with aphasia to communicate via image/card selection and practice word-to-image matching exercises. It supports Thai (default) and English via i18next.

## Commands

```bash
npm run dev       # Start dev server (Vite, localhost:5173)
npm run build     # Production build to /dist
npm run preview   # Preview production build
```

No test runner, linter, or type checker is configured.

## Architecture

**Single-page app with tab-based navigation** — no routing library. `App.jsx` holds an `activeTab` state string and conditionally renders one of three screens.

### Key Directories

- `src/screens/` — Three full-screen tab views: CommunicateScreen, ExerciseScreen, SettingsScreen
- `src/components/` — Reusable UI: TabBar, Card, MessageBar, CategoryChips, ProgressBar
- `src/data/cards.js` — Static card data (36 items across 4 categories: food, emotions, daily, greetings)
- `src/utils/speak.js` — `speakCard(card, lang)` TTS utility using Web Speech API
- `src/i18n/` — i18next setup with `th.json` and `en.json` translation files
- `docs/plans/` — Original design spec and implementation plan

### Data Flow

Each screen manages its own local state via React hooks. No global state management. Cards data is imported directly from `src/data/cards.js`. Translations use `useTranslation()` hook from react-i18next. Thai is the default language (`lng: 'th'`).

### Screen Responsibilities

- **CommunicateScreen** — Card grid filtered by category chips, selected cards build a sentence in the MessageBar. Tapping a card speaks its label via TTS.
- **ExerciseScreen** — Word-to-image matching game (10 questions per round), tracks correct/wrong with animations, completion screen with replay. Tapping an answer card speaks its label via TTS.
- **SettingsScreen** — Language toggle between Thai and English via `i18n.changeLanguage()`

## Tech Stack

- React 19, Vite 6, Tailwind CSS v4 (with `@tailwindcss/vite` plugin), Framer Motion, i18next + react-i18next
- Web Speech API (`speechSynthesis`) for text-to-speech — no external TTS dependency
- Vanilla JavaScript (no TypeScript)
- ES modules (`"type": "module"` in package.json)

## Design System ("Soft Bloom")

Custom Tailwind theme colors defined in `src/index.css` via `@theme`:
- `cream` (#FFF8F0) — background
- `sand` (#F5E6D3) — card surfaces
- `terracotta` (#D4845A) — primary action/highlight
- `sage` (#8BAA7C) — success states
- `soft-rose` (#E8A0A0) — error states
- `bark` (#5C4033) — text
- `sky` (#A8C8E8) — secondary accent

Fonts: Nunito (display/English), Noto Sans Thai (Thai text). Both loaded via Google Fonts in `index.html`.

Body has a noise texture overlay and radial gradient background defined in `src/index.css`.

## Conventions

- Card data shape: `{ id, emoji, th, en, category }` — bilingual labels on every card
- Category data shape: `{ id, emoji, labelKey }` — labelKey maps to i18n translation key
- Animations use Framer Motion with spring physics throughout
- All interactive elements use `rounded-2xl` with soft shadows

## Deployment

Hosted on Vercel. Deploy with:

```bash
vercel --prod
```

Production URL: https://aphasia-cure.vercel.app
