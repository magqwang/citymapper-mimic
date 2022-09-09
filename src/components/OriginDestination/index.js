import { useContext } from 'react'

import { ArrowForward } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'

import { DirectionsContext } from '../../contexts/directions.context'

const OriginDestination = ({ routeIndex }) => {
  const { directions } = useContext(DirectionsContext)

  const startAddress =
    directions.results.routes[routeIndex].legs[0].start_address
  const endAddress = directions.results.routes[routeIndex].legs[0].end_address

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Typography variant="h5" color="white" mx="1em" textAlign="center">
        {startAddress}
      </Typography>
      <ArrowForward sx={{ color: 'success.dark' }} />
      <Typography variant="h5" color="white" mx="1em" textAlign="center">
        {endAddress}
      </Typography>
    </Stack>
  )
}

export default OriginDestination
