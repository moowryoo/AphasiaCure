import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { proxyImageUrl } from '../utils/customCardStore'

export default function Card({ card, onClick, onLongPress }) {
  const timerRef = useRef(null)
  const firedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handlePointerDown = useCallback(() => {
    if (!onLongPress) return
    firedRef.current = false
    timerRef.current = setTimeout(() => {
      firedRef.current = true
      onLongPress()
    }, 3000)
  }, [onLongPress])

  const handlePointerUp = useCallback(() => {
    clearTimer()
  }, [clearTimer])

  const handleClick = useCallback(() => {
    if (firedRef.current) {
      firedRef.current = false
      return
    }
    onClick(card)
  }, [onClick, card])

  return (
    <motion.button
      whileTap={onLongPress ? undefined : { scale: 1.05 }}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={clearTimer}
      onPointerCancel={clearTimer}
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      className={`bg-sand/60 rounded-2xl p-1 flex items-center justify-center
                 shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                 hover:border-terracotta/30 border-2 border-transparent
                 transition-colors cursor-pointer min-h-[140px] md:min-h-[160px]
                 active:shadow-[inset_0_2px_4px_rgba(212,132,90,0.2),0_4px_16px_rgba(212,132,90,0.15)]
                 ${onLongPress ? 'active:animate-border-fill' : ''}`}
    >
      {card.photoURL ? (
        <img
          src={proxyImageUrl(card.photoURL)}
          alt=""
          draggable={false}
          style={{ WebkitTouchCallout: 'none' }}
          className="w-full h-full rounded-xl object-contain"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <span className="text-[48px] md:text-[64px] leading-none">{card.emoji}</span>
      )}
    </motion.button>
  )
}
