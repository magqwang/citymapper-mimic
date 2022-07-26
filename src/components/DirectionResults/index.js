import { Button, ButtonGroup } from "@mui/material";

const DirectionResults = ({ directions, icon }) => {
  return (
    <ButtonGroup orientation="vertical" sx={{ bgcolor: "white", mt: "20px" }}>
      {directions.routes.map((route) => (
        <Button
          key={route.summary}
          startIcon={icon}
          sx={{
            color: "gray",
            justifyContent: "flex-start",
            textTransform: "none",
          }}
        >
          via {route.summary}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default DirectionResults;
