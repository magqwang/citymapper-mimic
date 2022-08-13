import { useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material'
import { Radio, RadioGroup, Sheet, radioClasses } from '@mui/joy'
import { Clear } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import Map from '../Map'
import './index.css'
import { visuallyHidden } from '@mui/utils'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const SearchPage = ({
  cityBounds,
  origin,
  setOrigin,
  destination,
  setDestination,
  directions,
  setDirections,
  modeList,
  iconList,
}) => {
  const [travelMode, setTravelMode] = useState('DRIVING')
  // To remove a warning
  const [libraries] = useState(['places'])

  let originRef = useRef()
  let destinationRef = useRef()

  let navigate = useNavigate()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: libraries,
  })

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

  const calculateRoute = async () => {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }

    // console.log(origin, destination)

    setOrigin(originRef.current.value)
    setDestination(destinationRef.current.value)

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService()

    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode[travelMode],
      provideRouteAlternatives: true,
    })

    if (results.status === 'OK') {
      // console.log(results)
      setDirections(results)
      navigate(
        `/search/origin=${originRef.current.value}&desitination=${destinationRef.current.value}&travelmode=${travelMode}`
      )
    } else console.log(`Directions request failed due to ${results.status}`)
  }

  const clearRoute = () => {
    setDirections(null)
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  const handleTravelMode = (event) => {
    const value = event.target.value
    setTravelMode(value)
    // setDirections(null)
  }

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
          // margin: '20px',
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: '100%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <FormControl>
            <InputLabel htmlFor="start" sx={visuallyHidden}>
              Start address
            </InputLabel>
            <Autocomplete bounds={cityBounds} options={{ strictBounds: true }}>
              <input
                className="search-input"
                type="text"
                name="start"
                id="start"
                placeholder="Start"
                aria-label="start-address"
                defaultValue={origin}
                ref={originRef}
              />
            </Autocomplete>
            <InputLabel htmlFor="end" sx={visuallyHidden}>
              End address
            </InputLabel>
            <Autocomplete bounds={cityBounds} options={{ strictBounds: true }}>
              <input
                className="search-input"
                type="text"
                name="end"
                id="end"
                placeholder="End"
                aria-label="end-address"
                defaultValue={destination}
                ref={destinationRef}
              />
            </Autocomplete>

            <FormLabel id="travelmode-radio-buttons-label" sx={visuallyHidden}>
              Select Travel Mode
            </FormLabel>
            <RadioGroup
              row
              sx={{ gap: 2, mb: 1 }}
              aria-labelledby="travelmode-radio-buttons-label"
              name="travelmode-radio-buttons-group"
              defaultValue="DRIVING"
              value={travelMode}
              onChange={handleTravelMode}
            >
              {modeList.map((mode) => (
                <Sheet
                  key={mode}
                  sx={{
                    position: 'relative',
                    width: 40,
                    height: 40,
                    flexShrink: 1,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    [`& .${radioClasses.checked}`]: {
                      [`& .${radioClasses.label}`]: {
                        color: 'rgb(46, 145, 39)',
                      },
                      [`& .${radioClasses.action}`]: {
                        '--variant-borderWidth': '2px',
                        borderColor: 'rgb(46, 145, 39)',
                      },
                    },
                    [`& .${radioClasses.action}.${radioClasses.focusVisible}`]:
                      {
                        outlineWidth: '2px',
                      },
                  }}
                >
                  <Radio
                    sx={{ color: grey[500] }}
                    overlay
                    disableIcon
                    value={mode}
                    label={iconList[mode]}
                    name={mode}
                    componentsProps={{ input: { 'aria-label': { mode } } }}
                  />
                </Sheet>
              ))}
            </RadioGroup>
            <ButtonGroup>
              <Button
                variant="contained"
                color="success"
                type="submit"
                onClick={calculateRoute}
              >
                Calculate Route
              </Button>
              <Button
                variant="contained"
                color="success"
                endIcon={<Clear />}
                onClick={clearRoute}
              >
                Clear Route
              </Button>
            </ButtonGroup>
          </FormControl>
        </Stack>
        <Outlet />
      </Box>
      <Box width="100%" position="relative">
        <Map
          cityBounds={cityBounds}
          directions={directions}
          routeIndex={null}
          stepIndex={null}
          zoomin={null}
        />
      </Box>
    </Stack>
  )
}

export default SearchPage
