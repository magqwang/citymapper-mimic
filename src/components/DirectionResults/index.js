import {
  DirectionsBike,
  DirectionsCar,
  DirectionsTransit,
  DirectionsWalk,
} from '@mui/icons-material'
import { Button, ButtonGroup, Typography } from '@mui/material'
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

const DirectionResults = ({ directions }) => {
  const navigate = useNavigate()
  return (
    <ButtonGroup orientation="vertical" sx={{ bgcolor: 'white', mt: '20px' }}>
      {directions.routes.map((route, index) => (
        <Button
          key={route.summary}
          // startIcon={icon}
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
  )
}

export default DirectionResults
