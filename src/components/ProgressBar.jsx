import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
  const percent = (current / total) * 100

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="h-3 bg-sand rounded-full overflow-hidden">
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
