import { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import {
  NearMe,
  Clear,
  DirectionsCar,
  DirectionsWalk,
  DirectionsBike,
  DirectionsTransit,
} from "@mui/icons-material";
import "./index.css";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "10px",
};

const center = {
  lat: -37.8136276,
  lng: 144.9630576,
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

const Direction = () => {
  const [map, setMap] = useState(null);
  const [driveDirections, setDriveDirections] = useState(null);
  const [driveDistance, setDriveDistance] = useState("");
  const [driveDuration, setDriveDuration] = useState("");
  const [walkDirections, setWalkDirections] = useState(null);
  const [walkDistance, setWalkDistance] = useState("");
  const [walkDuration, setWalkDuration] = useState("");
  const [bicycleDirections, setBicycleDirections] = useState(null);
  const [bicycleDistance, setBicycleDistance] = useState("");
  const [bicycleDuration, setBicycleDuration] = useState("");
  const [transitDirections, setTransitDirections] = useState(null);
  const [transitDistance, setTransitDistance] = useState("");
  const [transitDuration, setTransitDuration] = useState("");
  // To remove a warning
  const [libraries] = useState(["places"]);

  /** @type React.mutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.mutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

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

  const calculateRoute = async () => {
    console.log(originRef.current.value);
    console.log(destinationRef.current.value);
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();

    const driveResults = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });

    // console.log(driveResults);
    setDriveDirections(driveResults);
    setDriveDistance(driveResults.routes[0].legs[0].distance.text);
    setDriveDuration(driveResults.routes[0].legs[0].duration.text);

    const walkResults = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING,
    });

    // console.log(walkResults);
    setWalkDirections(walkResults);
    setWalkDistance(walkResults.routes[0].legs[0].distance.text);
    setWalkDuration(walkResults.routes[0].legs[0].duration.text);

    const bicycleResults = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.BICYCLING,
    });

    // console.log(bicycleResults);
    setBicycleDirections(bicycleResults);
    setBicycleDistance(bicycleResults.routes[0].legs[0].distance.text);
    setBicycleDuration(bicycleResults.routes[0].legs[0].duration.text);

    const transitResults = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives: true,
    });

    console.log(transitResults);
    setTransitDirections(transitResults);
    setTransitDistance(transitResults.routes[0].legs[0].distance.text);
    setTransitDuration(transitResults.routes[0].legs[0].duration.text);
  };

  const clearRoute = () => {
    setDriveDirections(null);
    setDriveDistance("");
    setDriveDuration("");
    setWalkDirections(null);
    setWalkDistance("");
    setWalkDuration("");
    setBicycleDirections(null);
    setBicycleDistance("");
    setBicycleDuration("");
    setTransitDirections(null);
    setTransitDistance("");
    setTransitDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  const centerMap = () => {
    map.panTo(center);
  };

  return (
    <div className="wrapper">
      <div className="direction">
        <Stack
          spacing={2}
          sx={{
            width: "100%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Autocomplete>
            <input type="text" placeholder="Start" ref={originRef} />
          </Autocomplete>
          <Autocomplete>
            <input type="text" placeholder="End" ref={destinationRef} />
          </Autocomplete>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateRoute}
            >
              Calculate Route
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="clear"
              endIcon={<Clear />}
              onClick={clearRoute}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              aria-label="center back"
              endIcon={<NearMe />}
              onClick={centerMap}
            >
              Home
            </Button>
          </ButtonGroup>
        </Stack>
        {(driveDirections || walkDirections || bicycleDirections) && (
          <ButtonGroup
            variant="outlined"
            sx={{
              marginTop: "20px",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#f3f3f3",
              },
            }}
          >
            {driveDirections && (
              <Button
                startIcon={<DirectionsCar sx={{ color: "grey.500" }} />}
                sx={{
                  flexDirection: "column",
                  width: "33.33%",
                }}
              >
                <Typography variant="body-1" component="p" fontWeight={"bold"}>
                  {driveDistance}
                </Typography>
                <Typography variant="body-1" component="p" fontWeight={"bold"}>
                  {driveDuration}
                </Typography>
              </Button>
            )}
            {walkDirections && (
              <Button
                sx={{
                  flexDirection: "column",
                  width: "33.33%",
                }}
              >
                <DirectionsWalk sx={{ color: "grey.500" }} />
                <Typography variant="body-1" component="p" fontWeight={"bold"}>
                  {walkDistance}
                </Typography>
                <Typography variant="body-1" component="p" fontWeight={"bold"}>
                  {walkDuration}
                </Typography>
              </Button>
            )}
            {bicycleDirections && (
              <Button
                sx={{
                  flexDirection: "column",
                  width: "33.33%",
                }}
              >
                <DirectionsBike sx={{ color: "grey.500" }} />
                <Typography variant="body-1" component="p" fontWeight={"bold"}>
                  {bicycleDistance}
                </Typography>
                <Typography variant="body-1" component="p" fontWeight={"bold"}>
                  {bicycleDuration}
                </Typography>
              </Button>
            )}
          </ButtonGroup>
        )}
        {transitDirections && (
          <Button
            variant="outlined"
            sx={{
              marginTop: "20px",
              backgroundColor: "white",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#f3f3f3",
              },
            }}
          >
            <DirectionsTransit sx={{ color: "grey.500" }} />
            <Typography variant="body-1" component="p" fontWeight={"bold"}>
              {transitDistance}
            </Typography>
            <Typography variant="body-1" component="p" fontWeight={"bold"}>
              {transitDuration}
            </Typography>
          </Button>
        )}
      </div>
      <div className="map">
        {isLoaded ? (
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
            {/* {driveDirections && (
              <DirectionsRenderer
                directions={driveDirections}
                options={{ polylineOptions: { strokeColor: "black" } }}
              />
            )}
            {walkDirections && (
              <DirectionsRenderer
                directions={walkDirections}
                options={{ polylineOptions: { strokeColor: "gray" } }}
              />
            )}
            {bicycleDirections && (
              <DirectionsRenderer
                directions={bicycleDirections}
                options={{ polylineOptions: { strokeColor: "green" } }}
              />
            )} */}
            {transitDirections && (
              <DirectionsRenderer
                directions={transitDirections}
                options={{ polylineOptions: { strokeColor: "orange" } }}
              />
            )}
          </GoogleMap>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Direction;
