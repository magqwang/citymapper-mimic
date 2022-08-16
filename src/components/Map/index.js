import { Adjust } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '5px',
}

const melbourneCenter = {
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

const Map = ({ cityBounds, results, routeIndex, stepIndex, zoomIn }) => {
  const [map, setMap] = useState(null)

  const onLoad = useCallback((map) => {
    // eslint-disable-next-line no-undef
    const center = new google.maps.LatLng(melbourneCenter)
    map.setCenter(center)
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (map && results && routeIndex !== null && stepIndex !== null) {
      if (zoomIn) {
        const latLngs =
          results.routes[routeIndex].legs[0].steps[stepIndex].lat_lngs
        // eslint-disable-next-line no-undef
        const newBounds = new google.maps.LatLngBounds()
        latLngs.forEach((latLng) => {
          newBounds.extend({ lat: latLng.lat(), lng: latLng.lng() })
        })
        map.fitBounds(newBounds)
        map.panToBounds(newBounds)
      } else {
        const routeBounds = results.routes[routeIndex].bounds
        map.fitBounds(routeBounds)
        map.panToBounds(routeBounds)
      }
    }
  }, [results, routeIndex, stepIndex, zoomIn, map])

  const centerMap = () => {
    map.panTo(melbourneCenter)
  }

  return (
    <Box position="sticky" top="5rem" right="0">
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
        center={melbourneCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          // zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: noPoi,
          restriction: {
            latLngBounds: cityBounds,
            strictBounds: true,
          },
        }}
      >
        <Marker position={melbourneCenter} title={'Melbourne'} />
        {results && (
          <DirectionsRenderer
            directions={results}
            routeIndex={routeIndex ? routeIndex : 0}
            options={{ markerOptions: { title: 'Start/End Marker' } }}
          />
        )}
      </GoogleMap>
    </Box>
  )
}

export default Map
