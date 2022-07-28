import { useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { Stack, Typography } from '@mui/material'
import SearchDirection from '../SearchDirection'
import Map from '../Map'

const CityWrapper = () => {
  const [directions, setDirections] = useState(null)

  // To remove a warning
  const [libraries] = useState(['places'])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  if (!isLoaded) return <p>Loading...</p>

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          color: 'white',
          backgroundColor: 'rgb(46, 145, 39)',
          padding: '10px',
          fontWeight: '500',
        }}
      >
        Citymapper - Melbourne
      </Typography>
      <Stack flexDirection={'row'} bgcolor={'rgb(55, 171, 46)'}>
        <SearchDirection
          directions={directions}
          setDirections={(d) => setDirections(d)}
        />
        <Map isLoaded={isLoaded} directions={directions} />
      </Stack>
    </>
  )
}

export default CityWrapper
