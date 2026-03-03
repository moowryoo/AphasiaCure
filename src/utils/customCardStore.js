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
