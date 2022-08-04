import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowForward, ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { HmacSHA1 } from 'crypto-js'
import Map from '../Map'

const PTV_API_KEY = process.env.REACT_APP_PTV_API_KEY
const PTV_DEV_ID = process.env.REACT_APP_PTV_DEV_ID

const DirectionDetails = ({ directions, setDirections, iconList }) => {
  const navigate = useNavigate()
  const params = useParams()
  const routeIndex = parseInt(params.routeIndex)
  const [stepIndex, setStepIndex] = useState(null)
  const [zoomIn, setZoomIn] = useState(true)

  const directionsSteps = directions.routes[routeIndex].legs[0].steps
  const [stepShowStops, setStepShowStops] = useState(
    directionsSteps.map(() => false)
  )
  const [stepStops, setStepStops] = useState([])

  const duration = directions.routes[routeIndex].legs[0].duration.text
  const travelMode = directions.request.travelMode

  const prevIndex = useRef()
  const handleZoom = (index) => {
    prevIndex.value = stepIndex
    setStepIndex(index)
    // If the same step is clicked again, toggle zoomIn, otherwise set to true
    if (index === prevIndex.value) setZoomIn((prevZoomIn) => !prevZoomIn)
    else setZoomIn(true)
  }

  const handleClick = (index) => {
    const newShowStops = stepShowStops.map((showStop, i) => {
      if (i === index) return !showStop
      else return showStop
    })
    setStepShowStops(newShowStops)
  }

  const calculatePTVSignature = (request) => {
    const signature = HmacSHA1(request, PTV_API_KEY)
    return signature.toString().toUpperCase()
  }

  const fetchPTV = async (request, signature) => {
    const url = `http://timetableapi.ptv.vic.gov.au${request}&signature=${signature}`
    const response = await fetch(url)
    if (response.ok) {
      return await response.json()
    } else {
      console.log('error', response.status)
    }
  }

  useEffect(() => {
    const getStops = async () => {
      const allStops = []
      for (let step of directionsSteps) {
        if (step.travel_mode === 'TRANSIT') {
          const routeNumber = step.transit.line.short_name
          const headSign = step.transit.headsign
          const departureStop = step.transit.departure_stop.name
          const numStops = step.transit.num_stops
          // fetch route_id and route_type
          let api_request = `/v3/routes?route_name=${routeNumber}&devid=${PTV_DEV_ID}`
          let signature = calculatePTVSignature(api_request)
          let data = await fetchPTV(api_request, signature)
          const routeId = data.routes[0].route_id
          const routeType = data.routes[0].route_type

          // fetch directionId
          api_request = `/v3/directions/route/${routeId}?devid=${PTV_DEV_ID}`
          signature = calculatePTVSignature(api_request)
          data = await fetchPTV(api_request, signature)
          const directionId = data.directions.find(
            (direction) => direction.direction_name === headSign
          ).direction_id

          // fetch all stops for the route/direction and get the stops between departure and arrival stops
          api_request = `/v3/stops/route/${routeId}/route_type/${routeType}?direction_id=${directionId}&devid=${PTV_DEV_ID}`
          signature = calculatePTVSignature(api_request)
          data = await fetchPTV(api_request, signature)
          const firstStop = data.stops.find(
            (stop) => stop.stop_name === departureStop
          )
          const stopList = []
          for (let i = 1; i < numStops; i++) {
            const stop = data.stops.find(
              (stop) => stop.stop_sequence === firstStop.stop_sequence + i
            )
            stopList.push(stop.stop_name)
          }
          allStops.push(stopList)
        } else {
          allStops.push({})
        }
      }
      setStepStops(allStops)
    }
    getStops()
  }, [directionsSteps])

  return (
    <Stack spacing={2} alignItems="center" mt="1em" width="100%">
      {/* Link to homepage */}
      <Button
        onClick={() => {
          setDirections(null)
          navigate('/')
        }}
        sx={{ alignSelf: 'flex-start', color: 'white' }}
      >
        Back to homepage
      </Button>
      {/* Show Origin and Destination */}
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {directions.request.origin.query}
        </Typography>
        <ArrowForward sx={{ color: 'success.dark' }} />
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {directions.request.destination.query}
        </Typography>
      </Stack>
      {/* Route summary */}
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
      {/* Direction per step */}
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <List
          sx={{
            bgcolor: 'background.paper',
            width: '40%',
            m: '1em',
          }}
          component="nav"
        >
          {directionsSteps.map((step, index) => (
            <ListItemButton
              key={step.instructions}
              disableRipple
              sx={{
                color: 'rgb(74, 74, 74)',
                cursor: 'zoom-in',
                borderColor: 'lightgray',
              }}
              onClick={() => handleZoom(index)}
            >
              {/* step summary for TRANSIT mode */}
              {step.travel_mode === 'TRANSIT' ? (
                <Stack width="100%">
                  <Stack direction="row" alignItems="center">
                    <ListItemIcon>
                      {iconList[step.transit.line.vehicle.name]}
                    </ListItemIcon>
                    <ListItemText
                      primary={step.transit.line.short_name}
                      secondary={step.transit.line.name}
                    />
                    {/* <Typography
                    variant="body-2"
                    color="gray"
                    bgcolor="rgb(249, 251, 202)"
                    alignSelf="start"
                    ml="auto"
                    px="10px"
                    borderRadius="10px"
                  >
                    Next: {step.transit.departure_time.text}
                  </Typography> */}
                  </Stack>
                  <Divider variant="inset" component="li" />
                  <List>
                    <ListItem>
                      <ListItemAvatar>
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
                      </ListItemAvatar>
                      <ListItemText
                        primary={step.transit.departure_stop.name}
                      />
                    </ListItem>
                    <ListItem>
                      <List>
                        <ListItemButton onClick={() => handleClick(index)}>
                          <Box
                            width="4px"
                            height="130%"
                            bgcolor="warning"
                            borderRadius="8px"
                          />
                          {/* show/hide stops */}
                          <ListItemIcon>
                            {stepShowStops[index] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={`${step.transit.num_stops} stops`}
                          />
                          <Box ml="140px">{step.duration.text}</Box>
                        </ListItemButton>
                        <Collapse
                          in={stepShowStops[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List>
                            {stepStops[index]?.map((stop) => (
                              <ListItem key={stop}>
                                <ListItemText inset primary={stop} />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </List>
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
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
                      </ListItemAvatar>
                      <ListItemText primary={step.transit.arrival_stop.name} />
                    </ListItem>
                  </List>
                </Stack>
              ) : (
                // Step summary of non-TRANSIT mode
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
            </ListItemButton>
          ))}
        </List>
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
