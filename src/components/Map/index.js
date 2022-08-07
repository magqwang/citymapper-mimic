import { Adjust } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '10px',
}

const center = {
  lat: -37.8136,
  lng: 144.9631,
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

const Map = ({ directions, routeIndex, stepIndex, zoomIn }) => {
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

  useEffect(() => {
    if (map && directions && routeIndex !== null && stepIndex !== null) {
      if (zoomIn) {
        const latLngs =
          directions.routes[routeIndex].legs[0].steps[stepIndex].lat_lngs
        // eslint-disable-next-line no-undef
        const newBounds = new google.maps.LatLngBounds()
        latLngs.forEach((latLng) => {
          newBounds.extend({ lat: latLng.lat(), lng: latLng.lng() })
        })
        map.fitBounds(newBounds)
        map.panToBounds(newBounds)
      } else {
        const routeBounds = directions.routes[routeIndex].bounds
        map.fitBounds(routeBounds)
        map.panToBounds(routeBounds)
      }
    }
  }, [directions, routeIndex, stepIndex, zoomIn, map])

  const centerMap = () => {
    map.panTo(center)
  }

  return (
    <Box position="sticky" top="5rem">
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
        aria-label="center map"
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
        <Marker position={center} title={'Melbourne'} />
        {directions && (
          <DirectionsRenderer
            directions={directions}
            routeIndex={routeIndex ? routeIndex : 0}
            options={{ markerOptions: { title: 'Start/End Marker' } }}
          />
        )}
      </GoogleMap>
    </Box>
  )
}

export default Map
