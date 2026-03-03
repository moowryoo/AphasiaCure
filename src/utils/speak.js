const LANG_MAP = {
  th: 'th-TH',
  en: 'en-US',
}

export function speakCard(card, lang) {
  if (!window.speechSynthesis) return

  speechSynthesis.cancel()

  const text = card[lang] || card.en
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_MAP[lang] || 'en-US'
  utterance.rate = 0.85

  speechSynthesis.speak(utterance)
}
