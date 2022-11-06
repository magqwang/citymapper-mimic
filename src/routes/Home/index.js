import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DirectionsContext } from '../../contexts/directions.context'

const Home = () => {
  const { setDirections } = useContext(DirectionsContext)

  const clearDirections = () => {
    setDirections({
      origin: '',
      destination: '',
      origPlaceId: null,
      destPlaceId: null,
      travelMode: 'DRIVING',
      results: null,
    })
  }

  return (
    <Link
      to="/search"
      style={{
        color: 'white',
        fontSize: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1rem',
        marginTop: '15%',
      }}
      onClick={clearDirections}
    >
      Get me somewhere
    </Link>
  )
}

export default Home
