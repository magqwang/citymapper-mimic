import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import DirectionResults from '.'

test('shows result when given directions', () => {
  const mockDirections = {
    request: {
      origin: { query: 'mock origin' },
      destination: { query: 'mock destination' },
      travelMode: 'DRIVING',
    },
    routes: [
      {
        legs: [
          {
            distance: {
              text: '2km',
              value: 2000,
            },
            duration: {
              text: '5 mins',
              value: 300,
            },
          },
        ],
        summary: 'mock road',
      },
    ],
    status: 'OK',
  }

  const mockIconList = {
    DRIVING: 'mock icon',
  }

  render(
    <BrowserRouter>
      <DirectionResults directions={mockDirections} iconList={mockIconList} />
    </BrowserRouter>
  )
  const btnElement = screen.getByTestId('direction-result')
  expect(btnElement).toHaveTextContent('via mock road')
  const textElement = screen.getByTestId('route-duration')
  expect(textElement).toHaveTextContent('5 mins')
})
