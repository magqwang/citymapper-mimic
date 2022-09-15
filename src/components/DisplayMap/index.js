import { Button } from '@mui/material'
import { Close, MapTwoTone } from '@mui/icons-material'

import PropTypes from 'prop-types'

const DisplayMap = ({ showMap, setShowMap }) => {
  return (
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
  )
}

DisplayMap.propTypes = {
  showMap: PropTypes.bool.isRequired,
  setShowMap: PropTypes.func.isRequired,
}

export default DisplayMap
