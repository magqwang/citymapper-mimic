import { useContext } from 'react'
import { DirectionsContext } from '../../contexts/directions.context'

import PropTypes from 'prop-types'

import { Box, Stack, Typography } from '@mui/material'

import { IconList } from '../../constants/iconlist.constant'
import { visuallyHidden } from '@mui/utils'

const RouteSummary = ({ routeIndex }) => {
  const { directions } = useContext(DirectionsContext)

  const directionsSteps = directions.results.routes[routeIndex].legs[0].steps
  const duration = directions.results.routes[routeIndex].legs[0].duration.text
  const travelMode = directions.results.request.travelMode

  return (
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
                      {IconList[step.transit.line.vehicle.name]}
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
                    {IconList[step.travel_mode]}
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
            {IconList[travelMode]}
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
  )
}

RouteSummary.propTypes = {
  routeIndex: PropTypes.number.isRequired,
}

export default RouteSummary
