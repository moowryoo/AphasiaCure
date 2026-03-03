import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import useCustomCards from '../hooks/useCustomCards'

const languages = [
  { code: 'th', flag: '🇹🇭' },
  { code: 'en', flag: '🇬🇧' },
]

export default function SettingsScreen() {
  const { i18n } = useTranslation()
  const { customCards, removeCard } = useCustomCards()
  const [editMode, setEditMode] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleDelete = (id) => {
    if (confirmDeleteId === id) {
      removeCard(id)
      setConfirmDeleteId(null)
    } else {
      setConfirmDeleteId(id)
    }
  }

  return (
    <div className="px-4 pt-8 max-w-lg mx-auto">
      <div className="flex gap-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            whileTap={{ scale: 0.95 }}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`flex-1 flex flex-col items-center gap-3 py-8 rounded-2xl
                       transition-all border-2
                       shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                       ${
                         i18n.language === lang.code
                           ? 'bg-terracotta/10 border-terracotta'
                           : 'bg-sand/60 border-transparent hover:border-terracotta/30'
                       }`}
          >
            <span className="text-7xl">{lang.flag}</span>
            {i18n.language === lang.code && (
              <motion.div
                layoutId="langIndicator"
                className="w-3 h-3 rounded-full bg-terracotta"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Custom Cards Management */}
      {customCards.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">⭐</span>
            <button
              onClick={() => { setEditMode(!editMode); setConfirmDeleteId(null) }}
              className="w-10 h-10 rounded-full bg-sand/60 flex items-center justify-center text-xl
                         shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]"
            >
              {editMode ? '✅' : '✏️'}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {customCards.map((card) => (
                <motion.div
                  key={card.id}
                  layout
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <div className="bg-sand/60 rounded-2xl p-3 flex items-center justify-center
                                  shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                                  min-h-[100px]">
                    {card.photoURL ? (
                      <img src={card.photoURL} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <span className="text-4xl">{card.emoji}</span>
                    )}
                  </div>
                  {editMode && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => handleDelete(card.id)}
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center
                                  text-white text-sm font-bold shadow-md ${
                                    confirmDeleteId === card.id ? 'bg-soft-rose' : 'bg-bark/60'
                                  }`}
                    >
                      {confirmDeleteId === card.id ? '🗑️' : '✕'}
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
