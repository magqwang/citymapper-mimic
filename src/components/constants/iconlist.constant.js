import {
  DirectionsBike,
  DirectionsBusFilledOutlined,
  DirectionsCar,
  DirectionsTransit,
  DirectionsWalk,
  TrainOutlined,
  TramOutlined,
} from '@mui/icons-material'

export const IconList = {
  DRIVING: <DirectionsCar />,
  WALKING: <DirectionsWalk />,
  BICYCLING: <DirectionsBike />,
  TRANSIT: <DirectionsTransit />,
  Bus: <DirectionsBusFilledOutlined color="warning" />,
  Train: <TrainOutlined color="info" />,
  Tram: <TramOutlined color="success" />,
}

export const ModeList = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT']
