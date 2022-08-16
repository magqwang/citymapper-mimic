import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ArrowForward,
  Close,
  ExpandLess,
  ExpandMore,
  MapTwoTone,
} from '@mui/icons-material'
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
import Map from '../Map'
import { visuallyHidden } from '@mui/utils'
import usePTV from '../../hooks/usePTV'

const DirectionDetails = ({ cityBounds, results, iconList }) => {
  const params = useParams()
  const routeIndex = parseInt(params.routeIndex)
  const [stepIndex, setStepIndex] = useState(null)
  const [zoomIn, setZoomIn] = useState(true)
  const [showMap, setShowMap] = useState(true)

  const directionsSteps = results.routes[routeIndex].legs[0].steps
  const [stepShowStops, setStepShowStops] = useState(
    directionsSteps.map(() => false)
  )
  const [stepStops, setStepStops] = useState(directionsSteps.map(() => null))

  const [getStops] = usePTV()

  const startAddress = results.routes[routeIndex].legs[0].start_address
  const endAddress = results.routes[routeIndex].legs[0].end_address
  const duration = results.routes[routeIndex].legs[0].duration.text
  const travelMode = results.request.travelMode

  const prevIndex = useRef()
  const handleZoom = (index) => {
    prevIndex.value = stepIndex
    setStepIndex(index)
    // If the same step is clicked again, toggle zoomIn, otherwise set to true
    if (index === prevIndex.value) setZoomIn((prevZoomIn) => !prevZoomIn)
    else setZoomIn(true)
  }

  const handleClick = async (event, index) => {
    event.stopPropagation()
    if (!stepShowStops[index]) {
      const stopList = await getStops(directionsSteps[index])
      // console.log(stopList)
      const newStepStops = stepStops.map((stop, i) => {
        if (i === index) return stopList
        else return stop
      })
      setStepStops(newStepStops)
    }
    const newShowStops = stepShowStops.map((showStop, i) => {
      if (i === index) return !showStop
      else return showStop
    })
    setStepShowStops(newShowStops)
  }

  const mql = window.matchMedia('(min-width: 600px)')
  mql.onchange = (e) => {
    if (e.matches) setShowMap(true)
  }

  return (
    <Stack spacing={2} alignItems="center" mt="1em" width="100%">
      {/* Show Origin and Destination */}
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {startAddress}
        </Typography>
        <ArrowForward sx={{ color: 'success.dark' }} />
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {endAddress}
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
                  //TRANSIT Mode
                  return (
                    <Box
                      key={step.transit.line.name}
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
                        <Box component="span" sx={visuallyHidden}>
                          {step.transit.line.vehicle.name}
                        </Box>
                        <span>{step.transit.line.short_name}</span>
                      </Box>
                      <span>·</span>
                    </Box>
                  )
                } else {
                  //Non-TRANSIT Mode
                  return (
                    <Box
                      key={step.instructions}
                      display="flex"
                      alignItems="center"
                    >
                      {iconList[step.travel_mode]}
                      <Box component="span" sx={visuallyHidden}>
                        {step.travel_mode}
                      </Box>
                      {i < directionsSteps.length - 1 && <span>·</span>}
                    </Box>
                  )
                }
              })}
            </>
          ) : (
            <>
              {iconList[travelMode]}
              <Box component="span" sx={visuallyHidden}>
                {travelMode}
              </Box>
            </>
          )}
        </Box>
        <Typography variant="h4" sx={{ color: 'rgb(55, 171, 46)' }}>
          {duration}
        </Typography>
      </Stack>
      {/* Direction per step */}
      <Stack
        direction={{ xs: 'column-reverse', sm: 'row' }}
        width="95%"
        spacing={2}
      >
        <List
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '10px',
          }}
          component="nav"
          disablePadding
        >
          {directionsSteps.map((step, index) => (
            <ListItemButton
              key={
                step.travel_mode === 'TRANSIT'
                  ? step.transit.line.name
                  : step.distance.value +
                    step.duration.value +
                    Math.floor(Math.random() * 10000)
              }
              disableRipple
              sx={{
                color: 'rgb(74, 74, 74)',
                cursor: 'zoom-in',
                borderColor: 'lightgray',
                borderBottom: '1px solid lightgray',
              }}
              onClick={() => handleZoom(index)}
            >
              {/* step summary for TRANSIT mode */}
              {step.travel_mode === 'TRANSIT' ? (
                <Stack width="100%">
                  <Stack direction="row" alignItems="center">
                    <ListItemIcon>
                      {iconList[step.transit.line.vehicle.name]}
                      <Box component="span" sx={visuallyHidden}>
                        {step.transit.line.vehicle.name}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={step.transit.line.short_name}
                      secondary={step.transit.line.name}
                    />
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
                  <Divider variant="inset" component="li" />
                  <List>
                    <ListItem disablePadding>
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
                    {step.transit.num_stops > 1 ? (
                      <ListItem>
                        <List sx={{ width: '100%' }}>
                          <ListItemButton
                            disableRipple
                            sx={{ borderLeft: '3px solid #ed6c02' }}
                            onClick={(e) => handleClick(e, index)}
                          >
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
                            <Box>{step.duration.text}</Box>
                          </ListItemButton>
                          <Collapse
                            in={stepShowStops[index]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List dense disablePadding>
                              {stepStops[index] ? (
                                stepStops[index]?.map((stop) => (
                                  <ListItem
                                    key={stop}
                                    sx={{ borderLeft: '3px solid #ed6c02' }}
                                  >
                                    <ListItemText inset primary={stop} />
                                  </ListItem>
                                ))
                              ) : (
                                <ListItemText
                                  inset
                                  primary="Sorry, error retrieving stops information..."
                                />
                              )}
                            </List>
                          </Collapse>
                        </List>
                      </ListItem>
                    ) : (
                      <ListItem>
                        <ListItemText
                          inset
                          primary="non-stop"
                          sx={{ borderLeft: '3px solid #ed6c02' }}
                        />
                        <Box>{step.duration.text}</Box>
                      </ListItem>
                    )}

                    <ListItem disablePadding>
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
                  <Box component="span" sx={visuallyHidden}>
                    {step.travel_mode}
                  </Box>
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
        <Box minWidth="50%" position="relative">
          <Button
            fullWidth
            variant="contained"
            color="success"
            startIcon={showMap ? <Close /> : <MapTwoTone />}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              position: showMap && 'absolute',
              top: showMap && '0',
              zIndex: showMap && '1',
              opacity: showMap && '0.5',
              color: 'white',
            }}
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
          {showMap && (
            <Map
              cityBounds={cityBounds}
              results={results}
              routeIndex={routeIndex}
              stepIndex={stepIndex}
              zoomIn={zoomIn}
            />
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default DirectionDetails
