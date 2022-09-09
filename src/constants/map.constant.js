export const ContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '5px',
}

export const MelbourneCenter = {
  lat: -37.8136,
  lng: 144.9631,
}

export const NoPoi = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'on' }],
  },
]

export const MelbourneBounds = {
  south: -39.31678751348631,
  west: 143.27120546875,
  north: -36.27917280830617,
  east: 146.65499453125,
}
