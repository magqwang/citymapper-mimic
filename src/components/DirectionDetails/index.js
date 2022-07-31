import { ArrowForward } from '@mui/icons-material'
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import Map from '../Map'

const DirectionDetails = ({ directions, setDirections, iconList }) => {
  const navigate = useNavigate()
  const params = useParams()
  const routeIndex = parseInt(params.routeIndex)
  const directionsSteps = directions.routes[routeIndex].legs[0].steps
  const duration = directions.routes[routeIndex].legs[0].duration.text
  const travelMode = directions.request.travelMode

  return (
    <Stack spacing={2} alignItems="center" mt="1em" height="150%">
      <Button
        onClick={() => {
          setDirections(null)
          navigate('/')
        }}
        sx={{ alignSelf: 'flex-start', color: 'white' }}
      >
        Back to homepage
      </Button>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {directions.request.origin.query}
        </Typography>
        <ArrowForward sx={{ color: 'success.dark' }} />
        <Typography variant="h5" color="white" mx="1em" textAlign="center">
          {directions.request.destination.query}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        sx={{
          width: '95%',
          backgroundColor: 'white',
          borderRadius: '10px',
          justifyContent: 'space-between',
          p: '10px',
        }}
      >
        <div style={{ margin: '10px', color: 'gray' }}>
          {iconList[travelMode]}
        </div>
        <Typography variant="h4" sx={{ color: 'rgb(55, 171, 46)' }}>
          {duration}
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          direction: 'row',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <TableContainer component={Paper} sx={{ width: '40%', margin: '20px' }}>
          <Table aria-label="directions steps table">
            <TableBody>
              {directionsSteps.map((step) => (
                <TableRow key={step.instructions}>
                  <TableCell>{iconList[step.travel_mode]}</TableCell>
                  <TableCell
                    dangerouslySetInnerHTML={{ __html: step.instructions }}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box width="50%" m="20px" position="relative">
          <Map directions={directions} routeIndex={routeIndex} />
        </Box>
      </Box>
    </Stack>
  )
}

export default DirectionDetails
