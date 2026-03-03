import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EmojiPicker from './EmojiPicker'
import { resizeImage, uploadImage, proxyImageUrl } from '../utils/customCardStore'

export default function AddCardModal({ onSave, onClose }) {
  const [step, setStep] = useState(1)
  const [emoji, setEmoji] = useState(null)
  const [photoURL, setPhotoURL] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [audioDataURL, setAudioDataURL] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setUploadError(null)
    try {
      const blob = await resizeImage(file)
      const url = await uploadImage(blob)
      setPhotoURL(url)
      setEmoji(null)
      setStep(2)
    } catch {
      setUploadError(true)
    } finally {
      setIsUploading(false)
    }
  }

  const handleEmojiSelect = (selectedEmoji) => {
    setEmoji(selectedEmoji)
    setPhotoURL(null)
    setShowEmojiPicker(false)
    setStep(2)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((t) => t.stop())
        const reader = new FileReader()
        reader.onloadend = () => {
          setAudioDataURL(reader.result)
        }
        reader.readAsDataURL(blob)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      // Microphone permission denied
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const playAudio = () => {
    if (audioDataURL) new Audio(audioDataURL).play()
  }

  const handleSave = () => {
    onSave({ emoji, photoURL, audioDataURL })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cream flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-bark/10">
        <button
          onClick={step === 1 ? onClose : () => setStep(step - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-sand/60 text-bark text-xl"
        >
          {step === 1 ? '✕' : '←'}
        </button>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s <= step ? 'bg-terracotta' : 'bg-bark/20'
              }`}
            />
          ))}
        </div>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-8 bg-sand/60 rounded-2xl text-center border-2 border-transparent
                           hover:border-terracotta/30 transition-colors
                           shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]"
              >
                <span className="text-5xl block mb-2">📷</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 bg-sand/60 rounded-2xl text-center border-2 border-transparent
                           hover:border-terracotta/30 transition-colors
                           shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]"
              >
                <span className="text-5xl block mb-2">🖼️</span>
              </button>

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full py-8 bg-sand/60 rounded-2xl text-center border-2 border-transparent
                           hover:border-terracotta/30 transition-colors
                           shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]"
              >
                <span className="text-5xl block mb-2">😀</span>
              </button>

              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white rounded-2xl shadow-lg p-3"
                >
                  <EmojiPicker onSelect={handleEmojiSelect} />
                </motion.div>
              )}

              {isUploading && (
                <div className="flex items-center justify-center py-4">
                  <div className="w-10 h-10 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin" />
                </div>
              )}

              {uploadError && (
                <div className="text-center text-soft-rose text-lg py-2">
                  ⚠️
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Preview of chosen image/emoji */}
              <div className="w-28 h-28 bg-sand/60 rounded-2xl flex items-center justify-center
                              shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]">
                {photoURL ? (
                  <img src={proxyImageUrl(photoURL)} alt="" className="w-20 h-20 rounded-xl object-cover" />
                ) : (
                  <span className="text-6xl">{emoji}</span>
                )}
              </div>

              {/* Record button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl
                           shadow-lg transition-colors ${
                             isRecording
                               ? 'bg-soft-rose animate-pulse'
                               : audioDataURL
                                 ? 'bg-sage'
                                 : 'bg-terracotta'
                           }`}
              >
                {isRecording ? '⏹️' : '🎙️'}
              </motion.button>

              {/* Playback + next */}
              {audioDataURL && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={playAudio}
                    className="w-14 h-14 rounded-full bg-sky flex items-center justify-center text-2xl shadow-md"
                  >
                    ▶️
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-14 h-14 rounded-full bg-sage flex items-center justify-center text-2xl shadow-md text-white"
                  >
                    →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Card preview */}
              <div className="bg-sand/60 rounded-2xl p-6 flex flex-col items-center gap-4
                              shadow-[inset_0_2px_4px_rgba(255,248,240,0.8),0_2px_8px_rgba(92,64,51,0.08)]
                              min-w-[160px]">
                {photoURL ? (
                  <img src={proxyImageUrl(photoURL)} alt="" className="w-24 h-24 rounded-xl object-cover" />
                ) : (
                  <span className="text-7xl">{emoji}</span>
                )}
                <button
                  onClick={playAudio}
                  className="w-10 h-10 rounded-full bg-sky/80 flex items-center justify-center text-lg shadow"
                >
                  ▶️
                </button>
              </div>

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="w-full max-w-[200px] py-4 bg-sage text-white rounded-2xl text-3xl shadow-lg"
              >
                ✅
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
