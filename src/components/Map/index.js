import { GoogleMap, Marker } from "@react-google-maps/api";
// import { Box } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "500px",
  margin: "0 auto",
};

const Map = ({ onLoad, onUnmount, isLoaded, center }) => {
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        // zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <p>Loading...</p>
  );
};

export default Map;
