import { motion } from 'framer-motion'
import { proxyImageUrl } from '../utils/customCardStore'

export default function Card({ card, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 1.05 }}
      onClick={() => onClick(card)}
      className="bg-sand/60 rounded-2xl p-4 flex items-center justify-center
                 shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                 hover:border-terracotta/30 border-2 border-transparent
                 transition-colors cursor-pointer min-h-[120px] md:min-h-[140px]
                 active:shadow-[inset_0_2px_4px_rgba(212,132,90,0.2),0_4px_16px_rgba(212,132,90,0.15)]"
    >
      {card.photoURL ? (
        <img src={proxyImageUrl(card.photoURL)} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover" />
      ) : (
        <span className="text-[48px] md:text-[64px] leading-none">{card.emoji}</span>
      )}
    </motion.button>
  )
}
