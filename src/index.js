import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline } from '@mui/material'

import { DirectionsProvider } from './contexts/directions.context'

import App from './routes/App'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    <CssBaseline />
    <DirectionsProvider>
      <App />
    </DirectionsProvider>
  </>
)
