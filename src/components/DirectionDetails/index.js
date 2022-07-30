import { ArrowForward } from '@mui/icons-material'
import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Map from '../Map'

const DirectionDetails = ({ directions, modeList }) => {
  const navigate = useNavigate()
  const params = useParams()
  const routeIndex = parseInt(params.routeIndex)
  const directionsSteps = directions.routes[routeIndex].legs[0].steps
  const distance = directions.routes[routeIndex].legs[0].distance.text
  const duration = directions.routes[routeIndex].legs[0].duration.text
  const travelMode = directions.request.travelMode
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    const mode = modeList.find((mode) => mode.value === travelMode)
    setIcon(mode.label)
  }, [modeList, travelMode, setIcon])

  return (
    <Box>
      <Stack direction="row" justifyContent="center">
        <Typography variant="h5" color="white" m="1em">
          {directions.request.origin.query}
        </Typography>
        <Box m="2em">
          <ArrowForward sx={{ color: 'success.dark' }} />
        </Box>
        <Typography variant="h5" color="white" m="1em">
          {directions.request.destination.query}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{
          width: '90%',
          backgroundColor: 'white',
          borderRadius: '10px',
          color: 'gray',
          justifyContent: 'space-between',
          margin: '0 auto',
          p: '10px',
        }}
      >
        <div style={{ margin: '10px' }}>{icon}</div>
        {/* <div>{travelMode}</div> */}
        <Typography variant="h4" sx={{ color: 'rgb(55, 171, 46)' }}>
          {duration}
        </Typography>
      </Stack>
      <Stack>
        <Stack spacing={2} sx={{ width: '40%', margin: '20px' }}>
          {directionsSteps.map((step, index) => (
            <Box key={step.instructions} background="white">
              <div
                key={step.instructions}
                dangerouslySetInnerHTML={{ __html: step.instructions }}
              />
            </Box>
          ))}
        </Stack>
        <Box width="50%" height="100%" m="20px" position="relative">
          <Map directions={directions} routeIndex={routeIndex} />
        </Box>
      </Stack>
      <Button onClick={() => navigate('/')}>Back to homepage</Button>
    </Box>
  )
}

export default DirectionDetails
