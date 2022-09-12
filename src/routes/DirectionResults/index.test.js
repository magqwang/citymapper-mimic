import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import DirectionResults from '.'
import { DirectionsContext } from '../../contexts/directions.context'

test('shows result when given directions', () => {
  const directions = {
    results: {
      request: {
        origin: { placeId: 'mock origPlaceId' },
        destination: { placeId: 'mock destPlaceId' },
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
    },
  }

  render(
    <BrowserRouter>
      <DirectionsContext.Provider value={{ directions }}>
        <DirectionResults />
      </DirectionsContext.Provider>
    </BrowserRouter>
  )
  const btnElement = screen.getByTestId('direction-result')
  expect(btnElement).toHaveTextContent('via mock road')
  const textElement = screen.getByTestId('route-duration')
  expect(textElement).toHaveTextContent('5 mins')
})
