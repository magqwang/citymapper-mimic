import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useJsApiLoader } from '@react-google-maps/api'

import SearchPage from '.'

test('render component SearchPage', () => {
  render(
    <BrowserRouter>
      <SearchPage />
    </BrowserRouter>
  )
  const headingElement = screen.getByText('Loading...')
  expect(headingElement).toBeInTheDocument()
})

test('does not show text when map is loaded', () => {
  jest.mock('@react-google-maps/api', () => ({
    useJsApiLoader: jest.fn(() => ({
      isLoaded: true,
    })),
  }))
  render(
    <BrowserRouter>
      <SearchPage />
    </BrowserRouter>
  )
  expect(screen.queryByTestId('not-loaded-text')).toBeNull()
})
