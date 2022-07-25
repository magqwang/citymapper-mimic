// import { useCallback, useState } from "react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Typography } from "@mui/material";
import Direction from "../Direction";
// import Map from "../Map";

// const center = {
//   lat: -37.8136276,
//   lng: 144.9630576,
// };

const CityWrapper = () => {
  //   const [map, setMap] = useState(/**@type google.maps.Map */ (null));

  //   const { isLoaded } = useJsApiLoader({
  //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   });

  //   const onLoad = useCallback((map) => {
  //     const bounds = new window.google.maps.LatLngBounds(center);
  //     map.fitBounds(bounds);
  //     setMap(map);
  //   }, []);

  //   const onUnmount = useCallback(() => {
  //     setMap(null);
  //   }, []);

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        sx={{ color: "white", backgroundColor: "rgb(46, 145, 39)" }}
      >
        Melbourne
      </Typography>
      <Direction />
      {/* <Map
        onLoad={onLoad}
        onUnmount={onUnmount}
        isLoaded={isLoaded}
        center={center}
      /> */}
    </>
  );
};

export default CityWrapper;
