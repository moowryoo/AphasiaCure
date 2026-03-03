import { motion, AnimatePresence } from 'framer-motion'
import { speakCard } from '../utils/speak'

export default function MessageBar({ selectedCards, onClear, lang, onCardTap }) {
  const handleTap = (card) => {
    if (onCardTap) {
      onCardTap(card)
    } else {
      speakCard(card, lang)
    }
  }

  return (
    <div className="min-h-[64px] flex items-center gap-2">
      {selectedCards.length === 0 ? (
        <div className="flex-1" />
      ) : (
        <>
          <div className="flex-1 flex gap-2 flex-wrap py-2">
            <AnimatePresence>
              {selectedCards.map((card, i) => (
                <motion.span
                  key={`${card.id}-${i}`}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => handleTap(card)}
                  className="inline-flex items-center bg-terracotta text-white
                             px-3 py-1.5 rounded-full text-2xl cursor-pointer"
                >
                  {card.photoURL ? (
                    <img src={card.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    card.emoji
                  )}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={onClear}
            className="bg-soft-rose/80 hover:bg-soft-rose text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0 text-lg font-bold transition-colors"
          >
            ✕
          </button>
        </>
      )}
    </div>
  )
}
