import { motion } from 'framer-motion'
import { proxyImageUrl } from '../utils/customCardStore'

export default function DeleteConfirmDialog({ card, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bark/40"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-cream rounded-2xl p-8 flex flex-col items-center gap-6 shadow-xl min-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card preview with delete icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-sand/60 rounded-2xl flex items-center justify-center
                          shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]">
            {card.photoURL ? (
              <img src={proxyImageUrl(card.photoURL)} alt="" className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <span className="text-5xl">{card.emoji}</span>
            )}
          </div>
          <span className="absolute -top-2 -right-2 text-2xl">🗑️</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            className="w-16 h-16 rounded-full bg-sand/80 flex items-center justify-center text-3xl shadow-md"
          >
            ✕
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onConfirm}
            className="w-16 h-16 rounded-full bg-soft-rose flex items-center justify-center text-3xl shadow-md"
          >
            ✅
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
