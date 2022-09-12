import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import App from '.'
import { DirectionsProvider } from '../../contexts/directions.context'

test('render citymapper home page by default', () => {
  render(
    <BrowserRouter>
      <DirectionsProvider>
        <App />
      </DirectionsProvider>
    </BrowserRouter>
  )
  expect(screen.getByText('Citymapper - Melbourne')).toBeInTheDocument()
})
