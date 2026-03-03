export function resizeImage(file, maxSize = 800, maxBytes = 2 * 1024 * 1024) {
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

        const tryQuality = (quality) => {
          canvas.toBlob((blob) => {
            if (blob.size <= maxBytes || quality <= 0.1) {
              resolve(blob)
            } else {
              tryQuality(Math.max(0.1, quality - 0.1))
            }
          }, 'image/jpeg', quality)
        }
        tryQuality(0.8)
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

export function proxyImageUrl(url) {
  if (!url) return null
  return `/api/image?url=${encodeURIComponent(url)}`
}

export async function deleteImage(url) {
  if (!url) return
  await fetch('/api/upload', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  }).catch(() => {})
}

export async function fetchCardsFromAPI() {
  const res = await fetch('/api/cards')
  if (!res.ok) throw new Error('Failed to fetch cards')
  const data = await res.json()
  return data.cards || []
}

export async function addCardToAPI(card) {
  const res = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
  if (!res.ok) throw new Error('Failed to add card')
}

export async function deleteCardFromAPI(id) {
  const res = await fetch(`/api/cards?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete card')
}
