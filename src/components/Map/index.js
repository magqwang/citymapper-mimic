import { Adjust } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
};

const noPoi = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    stylers: [{ visibility: "on" }],
  },
];

const Map = ({ onLoad, onUnmount, center, map, directions }) => {
  const centerMap = () => {
    map.panTo(center);
  };

  return (
    <Box width="60%" m="20px" position="relative">
      <IconButton
        onClick={centerMap}
        disableRipple
        sx={{
          position: "absolute",
          right: "10px",
          bottom: "110px",
          zIndex: "1",
          backgroundColor: "white",
          color: "green",
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
            options={{ polylineOptions: { strokeColor: "black" } }}
          />
        )}
      </GoogleMap>
    </Box>
  );
};

export default Map;
