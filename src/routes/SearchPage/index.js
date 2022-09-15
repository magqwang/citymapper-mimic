import { useCallback, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useJsApiLoader } from '@react-google-maps/api'

import { Box, FormControl, Stack, Typography } from '@mui/material'

import Map from '../../components/Map'
import { DirectionsContext } from '../../contexts/directions.context'

import SearchBox from '../../components/SearchBox'
import SelectTravelMode from '../../components/SelectTravelMode'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const SearchPage = () => {
  const { directions, setDirections } = useContext(DirectionsContext)
  // To remove a warning
  const [libraries] = useState(['places'])

  let navigate = useNavigate()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: libraries,
  })

  const calculateRoute = useCallback(async () => {
    if (!directions.origPlaceId || !directions.destPlaceId) {
      return
    }

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService()

    const results = await directionService.route({
      origin: { placeId: directions.origPlaceId },
      destination: { placeId: directions.destPlaceId },
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode[directions.travelMode],
      provideRouteAlternatives: true,
    })

    if (results.status === 'OK') {
      setDirections({ ...directions, results: results })
      navigate(
        `/search/origin=${directions.origPlaceId}&desitination=${directions.destPlaceId}&travelmode=${directions.travelMode}`
      )
    } else console.log(`Directions request failed due to ${results.status}`)
  }, [navigate, directions, setDirections])

  useEffect(() => {
    if (isLoaded && !directions.results) {
      calculateRoute()
    }
  }, [calculateRoute, isLoaded, directions])

  if (!isLoaded)
    return (
      <Typography
        variant="h3"
        component="h2"
        color="white"
        mt="10%"
        test-dataid="not-loaded-text"
      >
        Loading...
      </Typography>
    )

  return (
    <Stack
      direction={{ xs: 'column-reverse', sm: 'row' }}
      spacing={2}
      mt={3}
      width="95%"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: '100%',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <FormControl>
            <SearchBox mode="start" />
            <SearchBox mode="end" />
            <SelectTravelMode />
          </FormControl>
        </Stack>
        <Outlet />
      </Box>
      <Box width="100%" position="relative">
        <Map />
      </Box>
    </Stack>
  )
}

export default SearchPage
