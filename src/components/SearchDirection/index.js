import { useRef, useState } from 'react'
import { Autocomplete } from '@react-google-maps/api'
import { Button, ButtonGroup, Stack } from '@mui/material'
import { Radio, RadioGroup, Sheet, radioClasses } from '@mui/joy'
import {
  Clear,
  DirectionsCar,
  DirectionsWalk,
  DirectionsBike,
  DirectionsTransit,
} from '@mui/icons-material'
import { grey } from '@mui/material/colors'
import DirectionResults from '../DirectionResults'
import './index.css'
import { useNavigate } from 'react-router-dom'

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

const SearchDirection = ({ directions, setDirections }) => {
  const [travelMode, setTravelMode] = useState('DRIVING')
  const [travelIcon, setTravelIcon] = useState(<DirectionsCar />)

  /** @type React.mutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.mutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()

  let navigate = useNavigate()

  const calculateRoute = async () => {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService()

    const Results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode[travelMode],
      provideRouteAlternatives: true,
    })

    console.log(Results)
    setDirections(Results)
    navigate(
      `/directions/origin=${originRef.current.value}&desitination=${destinationRef.current.value}&travelmode=${travelMode}`
    )
  }

  const clearRoute = () => {
    setDirections(null)
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  const handleTravelMode = (event) => {
    const value = event.target.value
    setTravelMode(value)
    const travelMode = travelModeList.find((mode) => mode.value === value)
    setTravelIcon(travelMode.label)
    setDirections(null)
  }

  return (
    <div className="direction">
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <Autocomplete>
          <input type="text" placeholder="Start" ref={originRef} />
        </Autocomplete>
        <Autocomplete>
          <input type="text" placeholder="End" ref={destinationRef} />
        </Autocomplete>
        <RadioGroup
          row
          sx={{ gap: 2 }}
          aria-labelledby="travelmode-radio-buttons-label"
          defaultValue="DRIVING"
          name="travelmode-radio-buttons-group"
          value={travelMode}
          onChange={handleTravelMode}
        >
          {travelModeList.map((mode) => (
            <Sheet
              key={mode.value}
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
                [`& .${radioClasses.action}.${radioClasses.focusVisible}`]: {
                  outlineWidth: '2px',
                },
              }}
            >
              <Radio
                sx={{ color: grey[500] }}
                overlay
                disableIcon
                value={mode.value}
                label={mode.label}
              />
            </Sheet>
          ))}
        </RadioGroup>
        <ButtonGroup>
          <Button variant="contained" color="success" onClick={calculateRoute}>
            Calculate Route
          </Button>
          <Button
            variant="contained"
            color="success"
            aria-label="clear"
            endIcon={<Clear />}
            onClick={clearRoute}
          >
            Clear
          </Button>
        </ButtonGroup>
      </Stack>
      {directions && (
        <DirectionResults directions={directions} icon={travelIcon} />
      )}
    </div>
  )
}

export default SearchDirection
