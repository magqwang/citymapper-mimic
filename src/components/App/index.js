import { Routes, Route, Link } from 'react-router-dom'
import HomePage from '../HomePage'
import SearchPage from '../SearchPage'
import DirectionResults from '../DirectionResults'
import DirectionDetails from '../DirectionDetails'
import NotFound from '../NotFound'
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
    <>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="*" element={<NotFound />} />
          <Route
            index
            element={
              <Link
                to="/search"
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1rem',
                  marginTop: '15%',
                }}
              >
                Get me somewhere
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
              directions && (
                <DirectionDetails
                  directions={directions}
                  setDirections={(d) => setDirections(d)}
                  iconList={iconList}
                />
              )
            }
          />
        </Route>
      </Routes>
    </>
  )
}

export default App
