import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function ProgressBar({ current, total }) {
  const { t } = useTranslation()
  const percent = (current / total) * 100

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-bark/60 font-thai">
          {t('exercise.progress', { current, total })}
        </span>
      </div>
      <div className="h-2 bg-sand rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-terracotta rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
