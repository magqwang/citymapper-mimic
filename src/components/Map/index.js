import { Adjust } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api'
import { useCallback, useContext, useEffect, useState } from 'react'
import { DirectionsContext } from '../../contexts/directions.context'
import {
  ContainerStyle,
  MelbourneCenter,
  MelbourneBounds,
  NoPoi,
} from '../../constants/map.constant'

const Map = ({ routeIndex, stepIndex, zoomIn }) => {
  const [map, setMap] = useState(null)

  const { directions } = useContext(DirectionsContext)

  const onLoad = useCallback((map) => {
    // eslint-disable-next-line no-undef
    const center = new google.maps.LatLng(MelbourneCenter)
    map.setCenter(center)
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (
      map &&
      directions.results &&
      routeIndex !== null &&
      stepIndex !== null
    ) {
      if (zoomIn) {
        const latLngs =
          directions.results.routes[routeIndex].legs[0].steps[stepIndex]
            .lat_lngs
        // eslint-disable-next-line no-undef
        const newBounds = new google.maps.LatLngBounds()
        latLngs.forEach((latLng) => {
          newBounds.extend({ lat: latLng.lat(), lng: latLng.lng() })
        })
        map.fitBounds(newBounds)
        map.panToBounds(newBounds)
      } else {
        const routeBounds = directions.results.routes[routeIndex].bounds
        map.fitBounds(routeBounds)
        map.panToBounds(routeBounds)
      }
    }
  }, [directions.results, routeIndex, stepIndex, zoomIn, map])

  const centerMap = () => {
    map.panTo(MelbourneCenter)
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
        mapContainerStyle={ContainerStyle}
        center={MelbourneCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          // zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: NoPoi,
          restriction: {
            latLngBounds: MelbourneBounds,
            strictBounds: true,
          },
        }}
      >
        <Marker position={MelbourneCenter} title={'Melbourne'} />
        {directions.results && (
          <DirectionsRenderer
            directions={directions.results}
            routeIndex={routeIndex ? routeIndex : 0}
            options={{ markerOptions: { title: 'Start/End Marker' } }}
          />
        )}
      </GoogleMap>
    </Box>
  )
}

export default Map
