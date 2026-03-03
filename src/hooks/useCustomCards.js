import { useState, useEffect } from 'react'
import { getCustomCards, saveCustomCard, deleteCustomCard, deleteImage } from '../utils/customCardStore'

export default function useCustomCards() {
  const [customCards, setCustomCards] = useState([])

  useEffect(() => {
    setCustomCards(getCustomCards())
  }, [])

  const addCard = (cardData) => {
    const card = {
      ...cardData,
      id: 'custom-' + Date.now(),
      category: 'custom',
    }
    saveCustomCard(card)
    setCustomCards((prev) => [...prev, card])
  }

  const removeCard = (id) => {
    const card = customCards.find((c) => c.id === id)
    if (card?.photoURL) deleteImage(card.photoURL)
    deleteCustomCard(id)
    setCustomCards((prev) => prev.filter((c) => c.id !== id))
  }

  return { customCards, addCard, removeCard }
}
