import { useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import NearMeIcon from "@mui/icons-material/NearMe";
import ClearIcon from "@mui/icons-material/Clear";
import "./index.css";

const containerStyle = {
  width: "100%",
  height: "500px",
  margin: "0 auto",
};

const center = {
  lat: -37.8136276,
  lng: 144.9630576,
};

const libraries = ["places"];

const Direction = () => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.mutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.mutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <p>Loading...</p>;

  const calculateRoute = async () => {
    console.log(originRef.current.value);
    console.log(destinationRef.current.value);
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();

    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    console.log(results);
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  return (
    <>
      <Box className="direction">
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid item xs={4}>
            <Autocomplete>
              <input type="text" placeholder="origin" ref={originRef} />
              {/* <TextField
                id="outlined-basic"
                label="Origin"
                variant="outlined"
                size="small"
              /> */}
            </Autocomplete>
          </Grid>
          <Grid item xs={4}>
            <Autocomplete>
              <input
                type="text"
                placeholder="destination"
                ref={destinationRef}
              />
              {/* <TextField
                id="outlined-basic"
                label="Destination"
                variant="outlined"
                size="small"
              /> */}
            </Autocomplete>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
          </Grid>
          <Grid item xs={1}>
            <IconButton color="primary" aria-label="clear" onClick={clearRoute}>
              <ClearIcon />
            </IconButton>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h5" component="p">
              Distance: {distance}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h5" component="p">
              Duration: {duration}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              color="primary"
              aria-label="center back"
              onClick={() => map.panTo(center)}
            >
              <NearMeIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={() => setMap(map)}
          onUnmount={() => setMap(null)}
          options={{
            // zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Direction;

// const onLoad = useCallback((map) => {
//   const bounds = new window.google.maps.LatLngBounds(center);
//   map.fitBounds(bounds);
//   setMap(map);
// }, []);

// const onUnmount = useCallback(() => {
//   setMap(null);
// }, []);
