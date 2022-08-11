import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import { Home } from '@mui/icons-material'

const HomePage = () => {
  let navigate = useNavigate()

  return (
    <main>
      <AppBar position="sticky" sx={{ backgroundColor: 'rgb(46, 145, 39)' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
            onClick={() => {
              navigate('/')
            }}
          >
            <Home />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Citymapper - Melbourne
          </Typography>
        </Toolbar>
      </AppBar>
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
    </main>
  )
}

export default HomePage
