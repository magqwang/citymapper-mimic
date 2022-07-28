import { Button, ButtonGroup, Typography } from '@mui/material'

const DirectionResults = ({ directions, icon }) => {
  return (
    <ButtonGroup orientation="vertical" sx={{ bgcolor: 'white', mt: '20px' }}>
      {directions.routes.map((route) => (
        <Button
          key={route.summary}
          startIcon={icon}
          sx={{
            color: 'gray',
            textTransform: 'none',
            textAlign: 'left',
          }}
        >
          via {route.summary}
          <Typography
            variant="body-1"
            component="div"
            color="black"
            ml="auto"
            sx={{ textAlign: 'center' }}
          >
            {route.legs[0].duration.text}
          </Typography>
        </Button>
      ))}
    </ButtonGroup>
  )
}

export default DirectionResults
