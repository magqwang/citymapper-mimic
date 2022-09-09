import { Radio, radioClasses, RadioGroup, Sheet } from '@mui/joy'
import { FormLabel } from '@mui/material'
import { grey } from '@mui/material/colors'
import { visuallyHidden } from '@mui/utils'
import { useContext } from 'react'
import { ModeList, IconList } from '../../constants/iconlist.constant'
import { DirectionsContext } from '../../contexts/directions.context'

const SelectTravelMode = () => {
  const { directions, setDirections } = useContext(DirectionsContext)

  const handleTravelMode = (event) => {
    const travelMode = event.target.value
    setDirections({ ...directions, travelMode: travelMode, results: null })
  }

  return (
    <>
      <FormLabel id="travelmode-radio-buttons-label" sx={visuallyHidden}>
        Select Travel Mode
      </FormLabel>
      <RadioGroup
        row
        sx={{ gap: 2, mt: 1 }}
        aria-labelledby="travelmode-radio-buttons-label"
        name="travelmode-radio-buttons-group"
        defaultValue="DRIVING"
        value={directions.travelMode}
        onChange={handleTravelMode}
      >
        {ModeList.map((mode) => (
          <Sheet
            key={mode}
            sx={{
              position: 'relative',
              width: 40,
              height: 40,
              flexShrink: 1,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              [`& .${radioClasses.checked}`]: {
                [`& .${radioClasses.label}`]: {
                  color: 'rgb(46, 145, 39)',
                },
                [`& .${radioClasses.action}`]: {
                  '--variant-borderWidth': '2px',
                  borderColor: 'rgb(46, 145, 39)',
                },
              },
              [`& .${radioClasses.action}.${radioClasses.focusVisible}`]: {
                outlineWidth: '2px',
              },
            }}
          >
            <Radio
              sx={{ color: grey[500] }}
              overlay
              disableIcon
              value={mode}
              label={IconList[mode]}
              name={mode}
              componentsProps={{ input: { 'aria-label': { mode } } }}
            />
          </Sheet>
        ))}
      </RadioGroup>
    </>
  )
}

export default SelectTravelMode
