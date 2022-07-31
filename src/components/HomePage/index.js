import { Outlet } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'

const HomePage = () => {
  return (
    <>
      <Typography
        variant="h5"
        component="h1"
        sx={{
          color: 'white',
          backgroundColor: 'rgb(46, 145, 39)',
          padding: '10px',
          fontWeight: '500',
          height: '10vh',
          top: 0,
          position: 'sticky',
          zIndex: '2',
        }}
      >
        Citymapper - Melbourne
      </Typography>
      <Stack
        sx={{
          width: '100%',
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'rgb(55, 171, 46)',
        }}
      >
        <Outlet />
      </Stack>
    </>
  )
}

export default HomePage
