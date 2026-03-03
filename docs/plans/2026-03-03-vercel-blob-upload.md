# Vercel Blob Image Upload Design

**Date:** 2026-03-03
**Status:** Approved

## Problem

Custom card photos are stored as base64 DataURLs in localStorage. This causes:
- ~5-10MB localStorage limit — restricts number of custom cards
- 200px max image size — low quality on tablets
- Base64 encoding inflates storage by ~33%

## Solution

Upload resized images to **Vercel Blob Storage** (public access with random suffixes). Store only the blob URL in localStorage instead of the full base64 string.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Storage provider | Vercel Blob | Already deployed on Vercel, minimal setup |
| Image max size | 800px | Sharp on tablets, reasonable file size |
| Access mode | Public + random suffix | Unguessable URLs, no proxy needed, fast CDN loading |
| Migration | None (start fresh) | Simplicity; users can re-add cards |
| Audio storage | Unchanged (localStorage DataURL) | Audio blobs are small enough |

## Architecture

### Current Flow
```
Camera/File → Canvas resize (200px) → base64 DataURL → localStorage
```

### New Flow
```
Camera/File → Canvas resize (800px) → Blob → POST /api/upload → Vercel Blob CDN
                                                                      ↓
                                                              URL stored in localStorage
```

## Files Changed

| File | Change | Description |
|------|--------|-------------|
| `api/upload.js` | **NEW** | Serverless function: upload (POST) and delete (DELETE) |
| `src/utils/customCardStore.js` | MODIFIED | `resizeImage()` returns Blob; add `uploadImage()`, `deleteImage()` |
| `src/components/Card.jsx` | MODIFIED | Use `card.photoURL` instead of `card.photoDataURL` |
| `src/components/AddCardModal.jsx` | MODIFIED | Async upload with loading state |
| `src/hooks/useCustomCards.js` | MODIFIED | `removeCard()` calls blob delete; card shape uses `photoURL` |
| `.gitignore` | MODIFIED | Add `.env.local` |

## API Route: `api/upload.js`

### POST — Upload image
- Accepts: `multipart/form-data` with `file` field
- Validates: image/* type, ≤ 5MB size
- Calls: `put('cards/<name>.jpg', file, { access: 'public', addRandomSuffix: true })`
- Returns: `{ url: "https://...blob.vercel-storage.com/cards/photo-xK9mR2.jpg" }`

### DELETE — Remove image
- Accepts: JSON `{ url: "https://..." }`
- Calls: `del(url)`
- Returns: `{ success: true }`

## Card Data Shape Change

```
Before: { id, emoji, th, en, category, photoDataURL, audioDataURL }
After:  { id, emoji, th, en, category, photoURL, audioDataURL }
```

## Client-Side Changes

### `customCardStore.js`
- `resizeImage(file, maxSize=800)` — returns a `Blob` instead of DataURL
- `uploadImage(blob)` — POST FormData to `/api/upload`, returns URL
- `deleteImage(url)` — DELETE to `/api/upload`, removes blob

### `AddCardModal.jsx`
- `handleFileSelect` becomes async: resize → upload → set `photoURL`
- Add loading spinner during upload
- Show error message on upload failure with retry option

### `Card.jsx`
- `card.photoDataURL` → `card.photoURL`

### `useCustomCards.js`
- `removeCard()` calls `deleteImage(card.photoURL)` before removing from localStorage

## Setup

1. Create Blob store in Vercel dashboard (Storage tab)
2. Pull env vars: `vercel env pull .env.local`
3. Install: `npm install @vercel/blob`
4. Add `.env.local` to `.gitignore`

## Dependencies

- `@vercel/blob` (new)
