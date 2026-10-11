import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable context menu (right-click)
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Disable developer tools and view-source keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Disable F12
  if (e.key === 'F12') {
    e.preventDefault();
  }
  
  // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
  }
  
  // Disable Cmd+Option+I, Cmd+Option+J, Cmd+Option+C (Mac shortcuts)
  if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
  }
  
  // Disable Ctrl+U or Cmd+U (View Source)
  if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
