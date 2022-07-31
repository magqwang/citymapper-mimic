import { Adjust } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api'
import { useCallback, useState } from 'react'

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px',
}

const center = {
  lat: -37.8136276,
  lng: 144.9630576,
}

const noPoi = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'on' }],
  },
]

const Map = ({ directions, routeIndex }) => {
  const [map, setMap] = useState(null)

  const onLoad = useCallback((map) => {
    // eslint-disable-next-line no-undef
    const bounds = new google.maps.LatLngBounds(center)
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // const zoomMap = useCallback(
  //   (map) => {
  // eslint-disable-next-line no-undef
  //     const bounds = new google.maps.LatLngBounds()
  //     bounds.extend(directions.routes[0].legs[0].start_location)
  //     bounds.extend(directions.routes[0].legs[0].end_location)
  //     map.fitBounds(bounds)
  //     setMap(map)
  //   },
  //   [directions.routes]
  // )

  const centerMap = () => {
    map.panTo(center)
  }

  return (
    <>
      <IconButton
        onClick={centerMap}
        disableRipple
        sx={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          zIndex: '1',
          backgroundColor: 'white',
          color: 'green',
        }}
      >
        <Adjust />
      </IconButton>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          // zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: noPoi,
        }}
      >
        <Marker position={center} />
        {directions && (
          <DirectionsRenderer
            directions={directions}
            routeIndex={routeIndex ? routeIndex : 0}
          />
        )}
      </GoogleMap>
    </>
  )
}

export default Map
