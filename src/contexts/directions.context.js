import { useState } from 'react'
import { createContext } from 'react'

export const DirectionsContext = createContext({
  origin: '',
  destination: '',
  origPlaceId: null,
  destPlaceId: null,
  travelMode: '',
  results: null,
})

export const DirectionsProvider = ({ children }) => {
  const [directions, setDirections] = useState({
    origin: '',
    destination: '',
    origPlaceId: null,
    destPlaceId: null,
    travelMode: 'DRIVING',
    results: null,
  })

  const value = { directions, setDirections }
  return (
    <DirectionsContext.Provider value={value}>
      {children}
    </DirectionsContext.Provider>
  )
}
