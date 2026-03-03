import { categories } from '../data/cards'

const colorMap = {
  terracotta: {
    active: 'bg-terracotta text-white',
    inactive: 'bg-terracotta/25 border-terracotta/40',
  },
  'soft-rose': {
    active: 'bg-soft-rose text-white',
    inactive: 'bg-soft-rose/25 border-soft-rose/40',
  },
  sky: {
    active: 'bg-sky text-white',
    inactive: 'bg-sky/25 border-sky/40',
  },
  sage: {
    active: 'bg-sage text-white',
    inactive: 'bg-sage/25 border-sage/40',
  },
}

export default function CategoryChips({ activeCategory, onCategoryChange }) {
  return (
    <div className="mx-4 my-3 p-3 bg-sand rounded-2xl">
      <div className="flex gap-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id
          const colors = colorMap[cat.color]

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex-1 flex items-center justify-center py-3 rounded-xl
                         text-2xl transition-all border-2
                         ${isActive
                           ? `${colors.active} shadow-md border-transparent`
                           : `${colors.inactive}`
                         }`}
            >
              {cat.emoji}
            </button>
          )
        })}
      </div>
    </div>
  )
}
