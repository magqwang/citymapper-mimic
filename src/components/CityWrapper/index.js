import { useCallback, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Stack, Typography } from "@mui/material";
import SearchDirection from "../SearchDirection";
import Map from "../Map";

const center = {
  lat: -37.8136276,
  lng: 144.9630576,
};

const CityWrapper = () => {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  // To remove a warning
  const [libraries] = useState(["places"]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const onLoad = useCallback((map) => {
    // eslint-disable-next-line no-undef
    const bounds = new google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        sx={{
          color: "white",
          backgroundColor: "rgb(46, 145, 39)",
          padding: "10px",
          fontWeight: "500",
        }}
      >
        Citymapper - Melbourne
      </Typography>
      <Stack flexDirection={"row"} bgcolor={"rgb(55, 171, 46)"}>
        <SearchDirection
          directions={directions}
          setDirections={setDirections}
        />
        {isLoaded ? (
          <Map
            onLoad={onLoad}
            onUnmount={onUnmount}
            center={center}
            map={map}
            directions={directions}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Stack>
    </>
  );
};

export default CityWrapper;
