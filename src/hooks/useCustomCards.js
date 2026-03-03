import { useState, useEffect } from 'react'
import {
  deleteImage,
  fetchCardsFromAPI,
  addCardToAPI,
  deleteCardFromAPI,
} from '../utils/customCardStore'

export default function useCustomCards() {
  const [customCards, setCustomCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCardsFromAPI()
      .then((apiCards) => setCustomCards(apiCards))
      .catch((err) => setError(err.message || 'Failed to load cards'))
      .finally(() => setLoading(false))
  }, [])

  const addCard = (cardData) => {
    const card = {
      ...cardData,
      id: 'custom-' + Date.now(),
      category: 'custom',
    }
    setCustomCards((prev) => [...prev, card])
    addCardToAPI(card).catch(() => {
      setCustomCards((prev) => prev.filter((c) => c.id !== card.id))
    })
  }

  const removeCard = (id) => {
    const card = customCards.find((c) => c.id === id)
    setCustomCards((prev) => prev.filter((c) => c.id !== id))
    deleteCardFromAPI(id)
      .then(() => {
        if (card?.photoURL) deleteImage(card.photoURL)
      })
      .catch(() => {
        setCustomCards((prev) => [...prev, card])
      })
  }

  return { customCards, addCard, removeCard, loading, error }
}
