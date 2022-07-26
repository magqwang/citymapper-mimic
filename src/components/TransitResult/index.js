import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { DirectionsContext } from '../../contexts/directions.context'

import { Button, ButtonGroup, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { IconList } from '../../constants/iconlist.constant'

const TransitResult = () => {
  const { directions } = useContext(DirectionsContext)

  const navigate = useNavigate()

  return (
    <ButtonGroup orientation="vertical" sx={{ bgcolor: 'white', mt: '20px' }}>
      {directions.results.routes.map((route, index) => (
        <Button
          key={
            route.legs[0].distance.value +
            route.legs[0].duration.value +
            Math.floor(Math.random() * 10000)
          }
          sx={{
            color: 'gray',
            textTransform: 'none',
            textAlign: 'left',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
          disableRipple
          onClick={() => navigate(`/route/${index}`)}
        >
          {route.legs[0].steps.map((step, i) => {
            if (step.travel_mode === 'TRANSIT') {
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
                    <span>{step.transit.line.short_name}</span>
                  </Box>
                  {i < route.legs[0].steps.length - 1 && <span>·</span>}
                </Box>
              )
            } else {
              return (
                <Box key={step.instructions} display="flex" alignItems="center">
                  {IconList[step.travel_mode]}
                  {i < route.legs[0].steps.length - 1 && <span>·</span>}
                </Box>
              )
            }
          })}
          <Typography
            variant="body-1"
            component="div"
            color="black"
            ml="auto"
            sx={{ textAlign: 'center' }}
          >
            {route.legs[0].duration.text}
          </Typography>
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default TransitResult
