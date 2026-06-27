import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import './i18n' // Initialize i18n
import App from './App.jsx'

// Explicitly register the service worker for PWABuilder
const updateSW = registerSW({
  onNeedRefresh() {
    // Prompt user to update if needed
  },
  onOfflineReady() {
    console.log('App is ready to work offline');
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
