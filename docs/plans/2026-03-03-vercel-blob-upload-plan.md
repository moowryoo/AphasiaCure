# Vercel Blob Image Upload — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace localStorage base64 image storage with Vercel Blob CDN uploads for higher quality (800px) and unlimited storage.

**Architecture:** Client resizes images to 800px max via Canvas, uploads the Blob to a Vercel serverless function at `/api/upload`, which stores it in Vercel Blob Storage (public + random suffix). localStorage keeps only card metadata with a short CDN URL instead of a large base64 string.

**Tech Stack:** @vercel/blob, Vercel Serverless Functions (Node.js), Canvas API, React

**Design doc:** `docs/plans/2026-03-03-vercel-blob-upload.md`

**No test runner is configured** — verification is manual via `npm run dev` and `npm run build`.

---

### Task 1: Project Setup

**Files:**
- Modify: `.gitignore`

**Step 1: Install @vercel/blob**

Run:
```bash
npm install @vercel/blob
```
Expected: Package added to `package.json` dependencies.

**Step 2: Add `.env.local` to `.gitignore`**

In `.gitignore`, add a line:
```
.env.local
```

This prevents the `BLOB_READ_WRITE_TOKEN` from being committed.

**Step 3: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add @vercel/blob dependency and gitignore .env.local"
```

---

### Task 2: API Route — Upload & Delete

**Files:**
- Create: `api/upload.js`

**Context:** Vercel auto-detects files in a top-level `/api` directory as serverless functions. This is NOT inside `src/` — it sits at the project root. The file uses Node.js runtime (not Vite/browser).

**Step 1: Create the `api/` directory**

```bash
mkdir -p api
```

**Step 2: Write `api/upload.js`**

```js
import { put, del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleUpload(req, res);
  }
  if (req.method === 'DELETE') {
    return handleDelete(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleUpload(req, res) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large (max 5MB)' });
  }

  const filename = req.headers['x-filename'] || 'photo.jpg';

  const blob = await put(`cards/${filename}`, req, {
    access: 'public',
    addRandomSuffix: true,
    contentType,
  });

  return res.status(200).json({ url: blob.url });
}

async function handleDelete(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing url' });
  }

  await del(url);
  return res.status(200).json({ success: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
```

**Key details for the implementer:**
- `bodyParser: false` is required so we can stream the raw image body directly to `put()`.
- The POST endpoint receives the raw image as the request body (NOT multipart FormData). The client sets `Content-Type: image/jpeg` and sends the blob directly. This avoids needing a multipart parser.
- `x-filename` custom header carries the filename.
- `BLOB_READ_WRITE_TOKEN` is auto-detected from environment by `@vercel/blob` on Vercel.

**Step 3: Verify build still works**

Run:
```bash
npm run build
```
Expected: Build succeeds. The `api/` directory is separate from Vite's build.

**Step 4: Commit**

```bash
git add api/upload.js
git commit -m "feat: add /api/upload serverless function for Vercel Blob"
```

---

### Task 3: Update `customCardStore.js` — Resize & Upload Utilities

**Files:**
- Modify: `src/utils/customCardStore.js`

**Step 1: Rewrite the file**

Replace the entire contents of `src/utils/customCardStore.js` with:

```js
const STORAGE_KEY = 'customCards'

export function getCustomCards() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCustomCard(card) {
  const cards = getCustomCards()
  cards.push(card)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export function deleteCustomCard(id) {
  const cards = getCustomCards().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export function resizeImage(file, maxSize = 800) {
  return new Promise((resolve) => {
    const img = new Image()
    const reader = new FileReader()
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > height) {
          if (width > maxSize) { height *= maxSize / width; width = maxSize }
        } else {
          if (height > maxSize) { width *= maxSize / height; height = maxSize }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(blob) {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
      'x-filename': `photo-${Date.now()}.jpg`,
    },
    body: blob,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Upload failed')
  }
  const data = await res.json()
  return data.url
}

export async function deleteImage(url) {
  if (!url) return
  await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  }).catch(() => {})
}
```

**Changes from the original:**
- `resizeImage()` now returns a `Blob` via `canvas.toBlob()` instead of a DataURL via `canvas.toDataURL()`. Max size changed from 200 to 800.
- Added `uploadImage(blob)` — sends raw image body to `/api/upload`, returns the CDN URL.
- Added `deleteImage(url)` — sends DELETE to `/api/upload`. Silently catches errors (best-effort cleanup).

**Step 2: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/utils/customCardStore.js
git commit -m "feat: update customCardStore to upload images to Vercel Blob"
```

---

### Task 4: Update `Card.jsx` — Use `photoURL`

**Files:**
- Modify: `src/components/Card.jsx`

**Step 1: Change `photoDataURL` to `photoURL`**

In `src/components/Card.jsx`, change line 14:

```jsx
// Before:
{card.photoDataURL ? (
  <img src={card.photoDataURL} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />

// After:
{card.photoURL ? (
  <img src={card.photoURL} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />
```

That's the only change in this file.

**Step 2: Commit**

```bash
git add src/components/Card.jsx
git commit -m "feat: Card uses photoURL from Vercel Blob instead of photoDataURL"
```

---

### Task 5: Update `AddCardModal.jsx` — Async Upload with Loading State

**Files:**
- Modify: `src/components/AddCardModal.jsx`

**Step 1: Update imports**

Change the import on line 4:

```jsx
// Before:
import { resizeImage } from '../utils/customCardStore'

// After:
import { resizeImage, uploadImage } from '../utils/customCardStore'
```

**Step 2: Add `photoURL` and `isUploading` state**

Add these state variables alongside the existing ones (near line 9):

```jsx
const [photoURL, setPhotoURL] = useState(null)
const [isUploading, setIsUploading] = useState(false)
const [uploadError, setUploadError] = useState(null)
```

**Step 3: Update `handleFileSelect`**

Replace the existing `handleFileSelect` function (lines 18-25) with:

```jsx
const handleFileSelect = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  setIsUploading(true)
  setUploadError(null)
  try {
    const blob = await resizeImage(file)
    const url = await uploadImage(blob)
    setPhotoURL(url)
    setEmoji(null)
    setStep(2)
  } catch {
    setUploadError(true)
  } finally {
    setIsUploading(false)
  }
}
```

**Step 4: Update `handleEmojiSelect`**

Change line 29 from `setPhotoDataURL(null)` to `setPhotoURL(null)`:

```jsx
const handleEmojiSelect = (selectedEmoji) => {
  setEmoji(selectedEmoji)
  setPhotoURL(null)
  setShowEmojiPicker(false)
  setStep(2)
}
```

**Step 5: Update `handleSave`**

Change `photoDataURL` to `photoURL`:

```jsx
const handleSave = () => {
  onSave({ emoji, photoURL, audioDataURL })
}
```

**Step 6: Replace all `photoDataURL` references in JSX with `photoURL`**

In the JSX template, replace every occurrence of `photoDataURL` with `photoURL`. There are 3 occurrences:
- Step 2 preview (line 180): `{photoURL ? (`
- Step 2 img src (line 181): `<img src={photoURL} ...`
- Step 3 preview (line 239): `{photoURL ? (`
- Step 3 img src (line 240): `<img src={photoURL} ...`

**Step 7: Add loading/error UI to Step 1**

After the emoji picker button (around line 155), before the closing `</motion.div>`, add:

```jsx
{isUploading && (
  <div className="flex items-center justify-center py-4">
    <div className="w-10 h-10 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
  </div>
)}

{uploadError && (
  <div className="text-center text-soft-rose text-lg py-2">
    ⚠️
  </div>
)}
```

**Step 8: Remove the old `photoDataURL` state variable**

Delete this line (line 9 in original):
```jsx
const [photoDataURL, setPhotoDataURL] = useState(null)
```

**Step 9: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds with no errors.

**Step 10: Commit**

```bash
git add src/components/AddCardModal.jsx
git commit -m "feat: AddCardModal uploads images to Vercel Blob with loading state"
```

---

### Task 6: Update `useCustomCards.js` — Delete Blob on Card Removal

**Files:**
- Modify: `src/hooks/useCustomCards.js`

**Step 1: Add `deleteImage` import**

```jsx
// Before:
import { getCustomCards, saveCustomCard, deleteCustomCard } from '../utils/customCardStore'

// After:
import { getCustomCards, saveCustomCard, deleteCustomCard, deleteImage } from '../utils/customCardStore'
```

**Step 2: Update `removeCard` to delete the blob**

```jsx
// Before:
const removeCard = (id) => {
  deleteCustomCard(id)
  setCustomCards((prev) => prev.filter((c) => c.id !== id))
}

// After:
const removeCard = (id) => {
  const card = customCards.find((c) => c.id === id)
  if (card?.photoURL) deleteImage(card.photoURL)
  deleteCustomCard(id)
  setCustomCards((prev) => prev.filter((c) => c.id !== id))
}
```

**Step 3: Commit**

```bash
git add src/hooks/useCustomCards.js
git commit -m "feat: delete Vercel Blob image when removing custom card"
```

---

### Task 7: Manual Testing & Final Verification

**Step 1: Start dev server**

Run:
```bash
npm run dev
```

**Step 2: Test the full flow**

1. Open http://localhost:5173
2. Go to Communicate tab → select "custom" category
3. Tap the "+" add card button
4. Take a photo or pick a file — verify loading spinner appears
5. Record audio label → save the card
6. Verify the card appears in the grid with the photo (loaded from CDN URL)
7. Delete the card → verify it disappears

**Note:** Upload to Vercel Blob will NOT work on localhost unless you run with `vercel dev` instead of `npm run dev`. For local testing:
- Run `vercel dev` (requires Vercel CLI: `npm i -g vercel`)
- This spins up both the Vite dev server and the serverless functions locally

**Step 3: Verify production build**

```bash
npm run build
```
Expected: Clean build, no errors.

**Step 4: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: final cleanup for Vercel Blob upload feature"
```

---

### Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install dep + gitignore | `package.json`, `.gitignore` |
| 2 | API route | `api/upload.js` (new) |
| 3 | Store utilities | `src/utils/customCardStore.js` |
| 4 | Card component | `src/components/Card.jsx` |
| 5 | AddCardModal | `src/components/AddCardModal.jsx` |
| 6 | useCustomCards hook | `src/hooks/useCustomCards.js` |
| 7 | Manual testing | — |
