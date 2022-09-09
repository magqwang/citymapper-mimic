import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import App from '.'

test('render citymapper home page by default', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
  expect(screen.getByText('Citymapper - Melbourne')).toBeInTheDocument()
})
