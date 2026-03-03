import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cards } from '../data/cards'
import ProgressBar from '../components/ProgressBar'

const TOTAL_QUESTIONS = 10

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateQuestion() {
  const shuffled = shuffleArray(cards)
  const answer = shuffled[0]
  const options = shuffleArray(shuffled.slice(0, 4))
  return { answer, options }
}

export default function ExerciseScreen() {
  const { t, i18n } = useTranslation()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [question, setQuestion] = useState(() => generateQuestion())
  const [feedback, setFeedback] = useState(null)
  const [wrongId, setWrongId] = useState(null)
  const [completed, setCompleted] = useState(false)

  const nextQuestion = useCallback(() => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setCompleted(true)
    } else {
      setQuestionIndex((prev) => prev + 1)
      setQuestion(generateQuestion())
      setFeedback(null)
      setWrongId(null)
    }
  }, [questionIndex])

  const handleChoice = (card) => {
    if (feedback === 'correct') return

    if (card.id === question.answer.id) {
      setFeedback('correct')
      setWrongId(null)
      setTimeout(() => nextQuestion(), 1500)
    } else {
      setFeedback('wrong')
      setWrongId(card.id)
      setTimeout(() => {
        setWrongId(null)
        setFeedback(null)
      }, 800)
    }
  }

  const handlePlayAgain = () => {
    setQuestionIndex(0)
    setQuestion(generateQuestion())
    setFeedback(null)
    setWrongId(null)
    setCompleted(false)
  }

  const lang = i18n.language
  const promptLabel = question.answer[lang] || question.answer.en

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-8 px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-8xl mb-4">🎉</p>
        </motion.div>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl"
              initial={{
                top: -40,
                left: `${Math.random() * 90 + 5}%`,
                opacity: 1,
              }}
              animate={{
                top: '110%',
                opacity: 0,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'easeIn',
              }}
            >
              {['🎉', '🌟', '✨', '💪', '🌸'][i % 5]}
            </motion.span>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayAgain}
          className="bg-terracotta text-white text-5xl
                     w-24 h-24 rounded-full shadow-lg
                     flex items-center justify-center"
        >
          🔄
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <ProgressBar current={questionIndex + 1} total={TOTAL_QUESTIONS} />

      <div className="mx-4 mt-4 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-sand/60 rounded-2xl p-6 text-center
                       shadow-[inset_0_2px_4px_rgba(255,248,240,0.8)]"
          >
            <p className="text-sm text-bark/50 font-thai mb-1">
              {t('exercise.prompt')}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-bark font-thai">
              {question.answer.emoji} {promptLabel}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 flex-1 content-center">
        {question.options.map((card, i) => {
          const isCorrect = feedback === 'correct' && card.id === question.answer.id
          const isWrong = wrongId === card.id

          return (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                x: isWrong ? [0, -3, 3, -3, 3, 0] : 0,
              }}
              transition={{
                delay: i * 0.05,
                duration: 0.3,
                x: { duration: 0.3 },
              }}
              whileTap={{ scale: 1.05 }}
              onClick={() => handleChoice(card)}
              className={`rounded-2xl p-6 flex flex-col items-center gap-3
                         min-h-[180px] md:min-h-[220px] cursor-pointer
                         shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                         transition-colors border-2
                         ${
                           isCorrect
                             ? 'bg-sage/20 border-sage'
                             : isWrong
                             ? 'bg-soft-rose/20 border-soft-rose'
                             : 'bg-sand/60 border-transparent hover:border-terracotta/30'
                         }`}
            >
              <span className="text-[72px] md:text-[96px] leading-none">
                {card.emoji}
              </span>
              {isCorrect && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-2xl"
                >
                  ✅
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
