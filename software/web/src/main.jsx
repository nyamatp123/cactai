import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import { initTheme } from "./theme";

initTheme();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
