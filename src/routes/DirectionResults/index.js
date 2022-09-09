import { useContext } from 'react'
import { DirectionsContext } from '../../contexts/directions.context'
import NonTransitResult from '../../components/NonTransitResult'
import TransitResult from '../../components/TransitResult'

const DirectionResults = () => {
  const { directions } = useContext(DirectionsContext)
  const travelMode = directions.results.request.travelMode

  return (
    <>
      {travelMode !== 'TRANSIT' ? (
        <NonTransitResult travelMode={travelMode} />
      ) : (
        <TransitResult />
      )}
    </>
  )
}

export default DirectionResults
