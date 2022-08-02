import { ArrowForward, KeyboardArrowDown } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Stack,
  Typography,
} from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Map from '../Map'

const DirectionDetails = ({ directions, setDirections, iconList }) => {
  const navigate = useNavigate()
  const params = useParams()
  const routeIndex = parseInt(params.routeIndex)
  const [stepIndex, setStepIndex] = useState(null)
  const [zoomIn, setZoomIn] = useState(true)
  const prevIndex = useRef()

  const directionsSteps = directions.routes[routeIndex].legs[0].steps
  const duration = directions.routes[routeIndex].legs[0].duration.text
  const travelMode = directions.request.travelMode

  const handleZoom = (index) => {
    prevIndex.value = stepIndex
    setStepIndex(index)
    // If the same step is clicked again, toggle zoomIn, otherwise set to true
    if (index === prevIndex.value) setZoomIn((prevZoomIn) => !prevZoomIn)
    else setZoomIn(true)
  }

  return (
    <Stack spacing={2} alignItems="center" mt="1em">
      <Button
        onClick={() => {
          setDirections(null)
          navigate('/')
        }}
        sx={{ alignSelf: 'flex-start', color: 'white' }}
      >
        Back to homepage
      </Button>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {directions.request.origin.query}
        </Typography>
        <ArrowForward sx={{ color: 'success.dark' }} />
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {directions.request.destination.query}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{
          width: '95%',
          backgroundColor: 'white',
          borderRadius: '10px',
          justifyContent: 'space-between',
          p: '10px',
        }}
      >
        <Box sx={{ margin: '10px', color: 'gray', display: 'flex' }}>
          {travelMode === 'TRANSIT' ? (
            <>
              {directionsSteps.map((step, i) => {
                if (step.travel_mode === 'TRANSIT') {
                  return (
                    <Box
                      key={step.instructions}
                      display="flex"
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          border: '1px solid lightgray',
                          display: 'flex',
                          mx: '5px',
                        }}
                      >
                        {iconList[step.transit.line.vehicle.name]}
                        <span>{step.transit.line.short_name}</span>
                      </Box>
                      <span>·</span>
                    </Box>
                  )
                } else {
                  return (
                    <Box
                      key={step.instructions}
                      display="flex"
                      alignItems="center"
                    >
                      {iconList[step.travel_mode]}
                      {i < directionsSteps.length - 1 && <span>·</span>}
                    </Box>
                  )
                }
              })}
            </>
          ) : (
            iconList[travelMode]
          )}
        </Box>
        <Typography variant="h4" sx={{ color: 'rgb(55, 171, 46)' }}>
          {duration}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <ButtonGroup
          orientation="vertical"
          sx={{
            bgcolor: 'white',
            width: '40%',
            m: '1em',
          }}
        >
          {directionsSteps.map((step, index) => (
            <Button
              key={step.instructions}
              disableRipple
              sx={{
                color: 'black',
                textTransform: 'none',
                textAlign: 'left',
                cursor: 'zoom-in',
                borderColor: 'lightgray',
                pl: '10px',
              }}
              onClick={() => handleZoom(index)}
            >
              {step.travel_mode === 'TRANSIT' ? (
                <Stack width="100%">
                  <Stack direction="row" alignItems="center">
                    {iconList[step.transit.line.vehicle.name]}
                    <Stack ml="8px">
                      <Typography variant="body-1">
                        {step.transit.line.short_name}
                      </Typography>
                      <Typography variant="body-1" fontWeight="400">
                        {step.transit.line.name}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body-2"
                      color="gray"
                      bgcolor="rgb(249, 251, 202)"
                      alignSelf="start"
                      ml="auto"
                      px="10px"
                      borderRadius="10px"
                    >
                      Next: {step.transit.departure_time.text}
                    </Typography>
                  </Stack>
                  <hr
                    style={{
                      height: '0.5px',
                      width: '85%',
                      borderWidth: 0,
                      color: 'lightgray',
                      backgroundColor: 'lightgray',
                    }}
                  />
                  <Stack>
                    <Stack direction="row" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: 'transparent',
                          border: '1px solid #ed6c02',
                          width: '30px',
                          height: '30px',
                        }}
                      >
                        {iconList[step.transit.line.vehicle.name]}
                      </Avatar>
                      <Typography variant="body-1" ml="8px" fontWeight="400">
                        {step.transit.departure_stop.name}
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      borderLeft="3px solid #ed6c02"
                      ml="14px"
                      pl="16px"
                    >
                      <KeyboardArrowDown sx={{ color: 'gray' }} />
                      <Typography variant="body-2" color="gray">
                        {step.transit.num_stops} stops
                      </Typography>
                      <Typography
                        variant="body-1"
                        ml="auto"
                        sx={{ textAlign: 'center' }}
                      >
                        {step.duration.text}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: 'transparent',
                          border: '1px solid #ed6c02',
                          width: '30px',
                          height: '30px',
                        }}
                      >
                        {iconList[step.transit.line.vehicle.name]}
                      </Avatar>
                      <Typography variant="body-1" ml="8px" fontWeight="400">
                        {step.transit.arrival_stop.name}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              ) : (
                <>
                  {iconList[step.travel_mode]}
                  <Typography
                    variant="body-1"
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                    ml="10px"
                  />
                  <Typography
                    variant="body-1"
                    ml="auto"
                    sx={{ textAlign: 'center' }}
                  >
                    {step.duration.text}
                  </Typography>
                </>
              )}
            </Button>
          ))}
        </ButtonGroup>
        <Box width="50%" m="1em" position="relative">
          <Map
            directions={directions}
            routeIndex={routeIndex}
            stepIndex={stepIndex}
            zoomIn={zoomIn}
          />
        </Box>
      </Box>
    </Stack>
  )
}

export default DirectionDetails
