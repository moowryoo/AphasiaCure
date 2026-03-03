import { useTranslation } from 'react-i18next'
import { categories } from '../data/cards'

export default function CategoryChips({ activeCategory, onCategoryChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                     text-sm font-semibold font-thai transition-all shrink-0
                     ${
                       activeCategory === cat.id
                         ? 'bg-terracotta text-white shadow-md'
                         : 'bg-gradient-to-b from-cream to-sand text-bark/70 hover:text-bark'
                     }`}
        >
          <span>{cat.emoji}</span>
          <span>{t(cat.labelKey)}</span>
        </button>
      ))}
    </div>
  )
}
