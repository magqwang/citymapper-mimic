import { useContext } from 'react'
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

import Navigation from '../Navigation'
import Home from '../Home'
import SearchPage from '../SearchPage'
import DirectionResults from '../DirectionResults'
import DirectionDetails from '../DirectionDetails'
import NotFound from '../NotFound'

import { DirectionsContext } from '../../contexts/directions.context'

function App() {
  const { directions } = useContext(DirectionsContext)
  console.log(directions)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Navigation />}>
        <Route path="*" element={<NotFound />} />
        <Route index element={<Home />} />
        <Route path="/search" element={<SearchPage />}>
          <Route
            path="/search/:addresses"
            element={directions.results && <DirectionResults />}
          />
        </Route>
        <Route
          path="/route/:routeIndex"
          element={directions.results && <DirectionDetails />}
        />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App
