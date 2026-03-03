import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'communicate', emoji: '💬' },
  { id: 'exercise', emoji: '🧠' },
  { id: 'settings', emoji: '⚙️' },
]

export default function TabBar({ activeTab, onTabChange }) {
  const { t } = useTranslation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream/80 backdrop-blur-xl border-t border-sand z-50">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 px-6 py-2 relative"
          >
            <span className="text-2xl">{tab.emoji}</span>
            <span
              className={`text-xs font-semibold font-thai transition-colors ${
                activeTab === tab.id ? 'text-terracotta' : 'text-bark/50'
              }`}
            >
              {t(`tabs.${tab.id}`)}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-0 w-1.5 h-1.5 rounded-full bg-terracotta"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
