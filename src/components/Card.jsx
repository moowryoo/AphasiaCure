import { motion } from 'framer-motion'

export default function Card({ card, onClick, index = 0, showBothLanguages = true }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileTap={{ scale: 1.05 }}
      onClick={() => onClick(card)}
      className="bg-sand/60 rounded-2xl p-4 flex flex-col items-center gap-2
                 shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                 hover:border-terracotta/30 border-2 border-transparent
                 transition-colors cursor-pointer min-h-[120px] md:min-h-[140px]
                 active:shadow-[inset_0_2px_4px_rgba(212,132,90,0.2),0_4px_16px_rgba(212,132,90,0.15)]"
    >
      <span className="text-[40px] md:text-[56px] leading-none">{card.emoji}</span>
      <div className="text-center">
        <p className="text-sm md:text-base font-semibold text-bark font-thai">
          {card.th}
        </p>
        {showBothLanguages && (
          <p className="text-xs md:text-sm text-bark/60">{card.en}</p>
        )}
      </div>
    </motion.button>
  )
}
