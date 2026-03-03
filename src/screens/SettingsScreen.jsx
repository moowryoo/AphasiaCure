import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const languages = [
  { code: 'th', flag: '🇹🇭' },
  { code: 'en', flag: '🇬🇧' },
]

export default function SettingsScreen() {
  const { i18n } = useTranslation()

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
    </div>
  )
}
