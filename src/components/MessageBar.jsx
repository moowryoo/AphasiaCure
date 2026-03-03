import { motion, AnimatePresence } from 'framer-motion'

export default function MessageBar({ selectedCards, onClear }) {
  return (
    <div className="mx-4 mb-3 rounded-2xl bg-sand/50 border border-sand min-h-[64px] flex items-center px-4 gap-2">
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
                  className="inline-flex items-center bg-terracotta text-white
                             px-3 py-1.5 rounded-full text-2xl"
                >
                  {card.emoji}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={onClear}
            className="text-bark/40 hover:text-bark/70 text-xl shrink-0 p-2"
          >
            🗑️
          </button>
        </>
      )}
    </div>
  )
}
