import { Button, ButtonGroup, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const DirectionResults = ({ directions, iconList }) => {
  const navigate = useNavigate()
  const travelMode = directions.request.travelMode

  return (
    <>
      {travelMode !== 'TRANSIT' ? ( //Not TRANSIT
        <ButtonGroup
          orientation="vertical"
          sx={{ bgcolor: 'white', mt: '20px' }}
        >
          {directions.routes.map((route, index) => (
            <Button
              key={route.summary}
              startIcon={iconList[travelMode]}
              sx={{
                color: 'gray',
                textTransform: 'none',
                textAlign: 'left',
              }}
              onClick={() => navigate(`/route/${index}`)}
            >
              via {route.summary}
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
      ) : (
        //TRANSIT
        <ButtonGroup
          orientation="vertical"
          sx={{ bgcolor: 'white', mt: '20px' }}
        >
          {directions.routes.map((route, index) => (
            <Button
              key={route.legs[0].distance.value + index}
              sx={{
                color: 'gray',
                textTransform: 'none',
                textAlign: 'left',
              }}
              onClick={() => navigate(`/route/${index}`)}
            >
              {route.legs[0].steps.map((step, i) => {
                if (step.travel_mode === 'TRANSIT') {
                  return (
                    <>
                      {iconList[step.transit.line.vehicle.name]}
                      <span>{step.transit.line.short_name}</span>
                      <span>·</span>
                    </>
                  )
                } else {
                  return (
                    <>
                      {iconList[step.travel_mode]}
                      {i < route.legs[0].steps.length - 1 && <span>·</span>}
                    </>
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
      )}
    </>
  )
}

export default DirectionResults
