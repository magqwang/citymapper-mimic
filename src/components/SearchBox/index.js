import { useContext, useRef, useState } from 'react'
import { DirectionsContext } from '../../contexts/directions.context'
import { Clear } from '@mui/icons-material'
import { IconButton, InputLabel, Stack } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { Autocomplete } from '@react-google-maps/api'
import { MelbourneBounds } from '../../constants/map.constant'

import './index.css'

const SearchBox = ({ mode }) => {
  const [autoComplete, setAutoComplete] = useState(null)
  const { directions, setDirections } = useContext(DirectionsContext)

  const ref = useRef()

  const handlePlaceChanged = (autoComplete, mode) => {
    const place = autoComplete.getPlace()
    if (!place.place_id) return

    if (mode === 'start') {
      setDirections({
        ...directions,
        origPlaceId: place.place_id,
        origin: ref.current.value,
        results: null,
      })
    } else {
      setDirections({
        ...directions,
        destPlaceId: place.place_id,
        destination: ref.current.value,
        results: null,
      })
    }
  }

  const clearAddress = (mode) => {
    if (mode === 'start') {
      ref.current.value = ''
      setDirections({
        ...directions,
        origin: '',
        origPlaceId: null,
        results: null,
      })
    } else {
      ref.current.value = ''
      setDirections({
        ...directions,
        destination: '',
        destPlaceId: null,
        results: null,
      })
    }
  }

  return (
    <Stack position="relative">
      <InputLabel htmlFor={mode} sx={visuallyHidden}>
        {mode} address
      </InputLabel>
      <Autocomplete
        bounds={MelbourneBounds}
        fields={['place_id']}
        onLoad={(autoComplete) => {
          setAutoComplete(autoComplete)
        }}
        onPlaceChanged={() => handlePlaceChanged(autoComplete, mode)}
        options={{ strictBounds: true }}
      >
        <input
          className="search-input"
          type="text"
          name={mode}
          id={mode}
          placeholder={mode}
          aria-label={mode}
          required
          defaultValue={
            mode === 'start' ? directions.origin : directions.destination
          }
          ref={ref}
        />
      </Autocomplete>
      <IconButton
        disableRipple
        sx={{
          position: 'absolute',
          right: '2px',
          top: '4px',
          bgcolor: 'white',
          ':hover': { color: 'black' },
        }}
        onClick={() => clearAddress(mode)}
      >
        <Clear />
      </IconButton>
    </Stack>
  )
}

export default SearchBox
