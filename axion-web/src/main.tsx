import { createRoot } from 'react-dom/client'
import './index.global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />,
)
