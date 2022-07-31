import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { CssBaseline, Typography } from '@mui/material'
import HomePage from '../HomePage'
import SearchPage from '../SearchPage'
import DirectionResults from '../DirectionResults'
import DirectionDetails from '../DirectionDetails'
import { useState } from 'react'
import {
  DirectionsBike,
  DirectionsBusFilledOutlined,
  DirectionsCar,
  DirectionsTransit,
  DirectionsWalk,
  TrainOutlined,
  TramOutlined,
} from '@mui/icons-material'

const travelModeList = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT']

const iconList = {
  DRIVING: <DirectionsCar />,
  WALKING: <DirectionsWalk />,
  BICYCLING: <DirectionsBike />,
  TRANSIT: <DirectionsTransit />,
  Bus: <DirectionsBusFilledOutlined color="warning" />,
  Train: <TrainOutlined color="info" />,
  Tram: <TramOutlined color="success" />,
}

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
                    mt: '25%',
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
                iconList={iconList}
              />
            }
          >
            <Route
              path="/search/:addresses"
              element={
                directions && (
                  <DirectionResults
                    directions={directions}
                    iconList={iconList}
                  />
                )
              }
            />
          </Route>
          <Route
            path="/route/:routeIndex"
            element={
              <DirectionDetails
                directions={directions}
                setDirections={(d) => setDirections(d)}
                iconList={iconList}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
