import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const languages = [
  { code: 'th', flag: '🇹🇭', label: 'ไทย' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

export default function SettingsScreen() {
  const { t, i18n } = useTranslation()

  return (
    <div className="px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-bark font-thai mb-8">
        ⚙️ {t('settings.title')}
      </h1>

      <div className="mb-6">
        <p className="text-sm font-semibold text-bark/60 font-thai mb-3">
          🌐 {t('settings.language')}
        </p>
        <div className="flex gap-4">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileTap={{ scale: 0.95 }}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-2xl
                         text-lg font-semibold transition-all border-2
                         shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                         ${
                           i18n.language === lang.code
                             ? 'bg-terracotta/10 border-terracotta text-bark'
                             : 'bg-sand/60 border-transparent text-bark/50 hover:border-terracotta/30'
                         }`}
            >
              <span className="text-4xl">{lang.flag}</span>
              <span className="font-thai">{lang.label}</span>
              {i18n.language === lang.code && (
                <motion.div
                  layoutId="langIndicator"
                  className="w-2 h-2 rounded-full bg-terracotta"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
