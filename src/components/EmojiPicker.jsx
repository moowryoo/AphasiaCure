import { motion } from 'framer-motion'

const emojis = [
  '🍕', '🍔', '🌮', '🍰', '🍩', '🧁', '🍿', '🥤', '🧃', '🍵',
  '🐶', '🐱', '🐰', '🐻', '🐼', '🦁', '🐸', '🐦', '🦋', '🐠',
  '⚽', '🏀', '🎾', '🎮', '🎨', '🎵', '🎪', '🎭', '🧩', '🪁',
  '🚗', '🚌', '✈️', '🚲', '🛴', '🏍️', '🚂', '⛵', '🚀', '🛸',
  '🏠', '🏫', '🏥', '⛪', '🏪', '🌳', '🌻', '⭐', '🌈', '☀️',
]

export default function EmojiPicker({ onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-2">
      {emojis.map((emoji) => (
        <motion.button
          key={emoji}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(emoji)}
          className="text-4xl p-2 rounded-xl hover:bg-sand/80 transition-colors"
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  )
}
