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
