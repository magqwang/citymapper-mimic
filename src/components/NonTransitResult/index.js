import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import { DirectionsContext } from '../../contexts/directions.context'

import { Button, ButtonGroup, Typography } from '@mui/material'

import { IconList } from '../../constants/iconlist.constant'

const NonTransitResult = ({ travelMode }) => {
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
          startIcon={IconList[travelMode]}
          disableRipple
          sx={{
            color: 'gray',
            textTransform: 'none',
            textAlign: 'left',
            borderColor: 'lightgray',
          }}
          onClick={() => navigate(`/route/${index}`)}
          data-testid="direction-result"
        >
          via {route.summary}
          <Typography
            variant="body-1"
            color="black"
            ml="auto"
            sx={{ textAlign: 'center' }}
            data-testid="route-duration"
          >
            {route.legs[0].duration.text}
          </Typography>
        </Button>
      ))}
    </ButtonGroup>
  )
}

NonTransitResult.propTypes = {
  travelMode: PropTypes.string.isRequired,
}

export default NonTransitResult
