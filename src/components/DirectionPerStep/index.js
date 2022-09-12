import { useContext, useState } from 'react'
import { DirectionsContext } from '../../contexts/directions.context'

import {
  Avatar,
  Box,
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
import { visuallyHidden } from '@mui/utils'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

import { IconList } from '../../constants/iconlist.constant'
import usePTV from '../../hooks/usePTV'

const DirectionsPerStep = ({ routeIndex, handleZoom }) => {
  const { directions } = useContext(DirectionsContext)
  const directionsSteps = directions.results.routes[routeIndex].legs[0].steps
  const [stepShowStops, setStepShowStops] = useState(
    directionsSteps.map(() => false)
  )
  const [stepStops, setStepStops] = useState(directionsSteps.map(() => null))

  const [getStops] = usePTV()

  const handleClick = async (event, index) => {
    event.stopPropagation()
    if (!stepShowStops[index]) {
      const stopList = await getStops(directionsSteps[index])
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

  return (
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
                  {IconList[step.transit.line.vehicle.name]}
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
                      {IconList[step.transit.line.vehicle.name]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={step.transit.departure_stop.name} />
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
                      {IconList[step.transit.line.vehicle.name]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={step.transit.arrival_stop.name} />
                </ListItem>
              </List>
            </Stack>
          ) : (
            // Step summary of non-TRANSIT mode
            <>
              {IconList[step.travel_mode]}
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
  )
}

export default DirectionsPerStep
