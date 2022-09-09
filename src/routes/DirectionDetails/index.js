import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Stack } from '@mui/material'

import OriginDestination from '../../components/OriginDestination'
import RouteSummary from '../../components/RouteSummary'
import DirectionPerStep from '../../components/DirectionPerStep'
import DisplayMap from '../../components/DisplayMap'

const DirectionDetails = () => {
  const params = useParams()
  const routeIndex = parseInt(params.routeIndex)
  const [stepIndex, setStepIndex] = useState(null)
  const [zoomIn, setZoomIn] = useState(true)

  const prevIndex = useRef()
  const handleZoom = (index) => {
    prevIndex.value = stepIndex
    setStepIndex(index)
    // If the same step is clicked again, toggle zoomIn, otherwise set to true
    if (index === prevIndex.value) setZoomIn((prevZoomIn) => !prevZoomIn)
    else setZoomIn(true)
  }

  return (
    <Stack spacing={2} alignItems="center" mt="1em" width="100%">
      <OriginDestination routeIndex={routeIndex} />
      <RouteSummary routeIndex={routeIndex} />
      <Stack
        direction={{ xs: 'column-reverse', sm: 'row' }}
        width="95%"
        spacing={2}
      >
        <DirectionPerStep routeIndex={routeIndex} handleZoom={handleZoom} />
        <DisplayMap
          routeIndex={routeIndex}
          stepIndex={stepIndex}
          zoomIn={zoomIn}
        />
      </Stack>
    </Stack>
  )
}

export default DirectionDetails
