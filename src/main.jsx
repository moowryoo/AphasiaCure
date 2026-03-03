import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Hide content until fonts are loaded to prevent font-swap CLS
document.fonts.ready.then(() => {
  root.style.visibility = 'visible'
})
