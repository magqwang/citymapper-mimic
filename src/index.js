import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'

import { DirectionsProvider } from './contexts/directions.context'

import App from './components/App'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <CssBaseline />
    <DirectionsProvider>
      <App />
    </DirectionsProvider>
  </BrowserRouter>
)
