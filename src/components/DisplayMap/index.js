import { Box, Button } from '@mui/material'
import { Close, MapTwoTone } from '@mui/icons-material'
import Map from '../Map'
import { useState } from 'react'

const DisplayMap = ({ routeIndex, stepIndex, zoomIn }) => {
  const [showMap, setShowMap] = useState(true)

  const mql = window.matchMedia('(min-width: 600px)')
  mql.onchange = (e) => {
    if (e.matches) setShowMap(true)
  }

  return (
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
        <Map routeIndex={routeIndex} stepIndex={stepIndex} zoomIn={zoomIn} />
      )}
    </Box>
  )
}

export default DisplayMap
