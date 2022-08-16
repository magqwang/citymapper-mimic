import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material'
import { Radio, RadioGroup, Sheet, radioClasses } from '@mui/joy'
import { Clear } from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import { visuallyHidden } from '@mui/utils'
import Map from '../Map'
import './index.css'

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const SearchPage = ({
  directions,
  setDirections,
  cityBounds,
  modeList,
  iconList,
}) => {
  // To remove a warning
  const [libraries] = useState(['places'])
  const [origAutoComplete, setOrigAutoComplete] = useState(null)
  const [destAutoComplete, setDestAutoComplete] = useState(null)

  let originRef = useRef()
  let destinationRef = useRef()

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
      // console.log(results)
      setDirections({ ...directions, results: results })
      navigate(
        `/search/origin=${directions.origPlaceId}&desitination=${directions.destPlaceId}&travelmode=${directions.travelMode}`
      )
    } else console.log(`Directions request failed due to ${results.status}`)
  }, [navigate, directions, setDirections])

  useEffect(() => {
    if (isLoaded && !directions.results) {
      // console.log(directions)
      calculateRoute()
    }
  }, [calculateRoute, isLoaded, directions])

  const handleTravelMode = (event) => {
    const travelMode = event.target.value
    // console.log('handleTravelMode:', travelMode)
    setDirections({ ...directions, travelMode: travelMode, results: null })
  }

  const handlePlaceChanged = (autoComplete, mode) => {
    const place = autoComplete.getPlace()
    if (!place.place_id)
      // window.alert('Please select an option from the dropdown list.')
      return

    if (mode === 'ORIG') {
      // console.log('ORIG', place.place_id)
      setDirections({
        ...directions,
        origPlaceId: place.place_id,
        origin: originRef.current.value,
        results: null,
      })
    } else {
      // console.log('DEST', place.place_id)
      setDirections({
        ...directions,
        destPlaceId: place.place_id,
        destination: destinationRef.current.value,
        results: null,
      })
    }
  }

  const clearAddress = (mode) => {
    if (mode === 'ORIG') {
      originRef.current.value = ''
      setDirections({
        ...directions,
        origin: '',
        origPlaceId: null,
        results: null,
      })
    } else {
      destinationRef.current.value = ''
      setDirections({
        ...directions,
        destination: '',
        destPlaceId: null,
        results: null,
      })
    }
  }

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
            // width: '100%',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <FormControl>
            <Stack position="relative">
              <InputLabel htmlFor="start" sx={visuallyHidden}>
                Start address
              </InputLabel>
              <Autocomplete
                bounds={cityBounds}
                fields={['place_id']}
                onLoad={(autoComplete) => {
                  // console.log('orig', autoComplete)
                  setOrigAutoComplete(autoComplete)
                }}
                onPlaceChanged={() =>
                  handlePlaceChanged(origAutoComplete, 'ORIG')
                }
                options={{ strictBounds: true }}
              >
                <input
                  className="search-input"
                  type="text"
                  name="start"
                  id="start"
                  placeholder="Start"
                  aria-label="start-address"
                  required
                  defaultValue={directions.origin}
                  ref={originRef}
                />
              </Autocomplete>
              <IconButton
                disableRipple
                sx={{
                  position: 'absolute',
                  right: '2px',
                  top: '4px',
                  bgcolor: 'white',
                  ':hover': { color: 'black' },
                }}
                onClick={() => clearAddress('ORIG')}
              >
                <Clear />
              </IconButton>
            </Stack>
            <Stack position="relative">
              <InputLabel htmlFor="end" sx={visuallyHidden}>
                End address
              </InputLabel>
              <Autocomplete
                bounds={cityBounds}
                fields={['place_id']}
                onLoad={(autoComplete) => {
                  // console.log('dest', autoComplete)
                  setDestAutoComplete(autoComplete)
                }}
                onPlaceChanged={() =>
                  handlePlaceChanged(destAutoComplete, 'DEST')
                }
                options={{ strictBounds: true }}
              >
                <input
                  className="search-input"
                  type="text"
                  name="end"
                  id="end"
                  placeholder="End"
                  aria-label="end-address"
                  defaultValue={directions.destination}
                  ref={destinationRef}
                />
              </Autocomplete>
              <IconButton
                disableRipple
                sx={{
                  position: 'absolute',
                  right: '2px',
                  top: '4px',
                  bgcolor: 'white',
                  ':hover': { color: 'black' },
                }}
                onClick={() => clearAddress('DEST')}
              >
                <Clear />
              </IconButton>
            </Stack>
            <FormLabel id="travelmode-radio-buttons-label" sx={visuallyHidden}>
              Select Travel Mode
            </FormLabel>
            <RadioGroup
              row
              sx={{ gap: 2, mt: 1 }}
              aria-labelledby="travelmode-radio-buttons-label"
              name="travelmode-radio-buttons-group"
              defaultValue="DRIVING"
              value={directions.travelMode}
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
          </FormControl>
        </Stack>
        <Outlet />
      </Box>
      <Box width="100%" position="relative">
        <Map
          cityBounds={cityBounds}
          results={directions.results}
          routeIndex={null}
          stepIndex={null}
          zoomin={null}
        />
      </Box>
    </Stack>
  )
}

export default SearchPage
