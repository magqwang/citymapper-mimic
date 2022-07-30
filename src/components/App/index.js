import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Box, CssBaseline, Typography } from '@mui/material'
import HomePage from '../HomePage'
import SearchPage from '../SearchPage'
import DirectionResults from '../DirectionResults'
import DirectionDetails from '../DirectionDetails'
import { useState } from 'react'
import {
  DirectionsBike,
  DirectionsCar,
  DirectionsTransit,
  DirectionsWalk,
} from '@mui/icons-material'

const travelModeList = [
  {
    value: 'DRIVING',
    label: <DirectionsCar />,
  },
  {
    value: 'WALKING',
    label: <DirectionsWalk />,
  },
  {
    value: 'BICYCLING',
    label: <DirectionsBike />,
  },
  {
    value: 'TRANSIT',
    label: <DirectionsTransit />,
  },
]

function App() {
  const [directions, setDirections] = useState(null)

  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route
            index
            element={
              <Link to="/search">
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    textTransform: 'uppercase',
                    textDecorationColor: 'white',
                    textDecorationLine: 'underline',
                    marginTop: '25%',
                  }}
                >
                  Let's Explore The City
                </Typography>
              </Link>
            }
          />
          <Route
            path="/search"
            element={
              <SearchPage
                directions={directions}
                setDirections={(d) => setDirections(d)}
                modeList={travelModeList}
              />
            }
          >
            <Route
              path="/search/:addresses"
              element={
                directions && <DirectionResults directions={directions} />
              }
            />
          </Route>
          <Route
            path="/route/:routeIndex"
            element={
              <DirectionDetails
                directions={directions}
                modeList={travelModeList}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
