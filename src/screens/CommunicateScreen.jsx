import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cards } from '../data/cards'
import Card from '../components/Card'
import CategoryChips from '../components/CategoryChips'
import MessageBar from '../components/MessageBar'
import AddCardModal from '../components/AddCardModal'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import { speakCard } from '../utils/speak'
import useCustomCards from '../hooks/useCustomCards'

export default function CommunicateScreen() {
  const { i18n } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('food')
  const [selectedCards, setSelectedCards] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [cardToDelete, setCardToDelete] = useState(null)
  const { customCards, addCard, removeCard, loading } = useCustomCards()

  const filteredCards = activeCategory === 'custom'
    ? customCards
    : cards.filter((c) => c.category === activeCategory)

  const handleCardTap = (card) => {
    speakCard(card, i18n.language)
    setSelectedCards((prev) => [...prev, card])
  }

  const handleClear = () => {
    setSelectedCards([])
  }

  const handleAddCard = (cardData) => {
    addCard(cardData)
    setShowAddModal(false)
  }

  const handleDeleteConfirm = () => {
    if (cardToDelete) {
      removeCard(cardToDelete.id)
      setCardToDelete(null)
    }
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-sand-dark rounded-b-2xl pt-2 pb-3 px-4">
        <MessageBar
          selectedCards={selectedCards}
          onClear={handleClear}
          lang={i18n.language}
          onCardTap={(card) => speakCard(card, i18n.language)}
        />
        <div className="border-t border-bark/10 mx-2 my-2" />
        <CategoryChips
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="grid grid-cols-3 md:grid-cols-4 gap-3 px-3 pt-3"
        >
          {activeCategory === 'custom' && loading && customCards.length === 0 && (
            <div className="col-span-full flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
            </div>
          )}
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={handleCardTap}
              onLongPress={
                activeCategory === 'custom'
                  ? () => setCardToDelete(card)
                  : undefined
              }
            />
          ))}
          {activeCategory === 'custom' && (
            <motion.button
              whileTap={{ scale: 1.05 }}
              onClick={() => setShowAddModal(true)}
              className="bg-sand/60 rounded-2xl p-1 flex items-center justify-center
                         shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                         hover:border-terracotta/30 border-2 border-dashed border-bark/30
                         transition-colors cursor-pointer min-h-[140px] md:min-h-[160px]"
            >
              <span className="text-[48px] md:text-[64px] leading-none text-bark/40">+</span>
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      {showAddModal && (
        <AddCardModal
          onSave={handleAddCard}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <AnimatePresence>
        {cardToDelete && (
          <DeleteConfirmDialog
            card={cardToDelete}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setCardToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
