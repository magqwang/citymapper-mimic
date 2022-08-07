import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Box mt="10%" display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" component="h2" color="white">
        Sorry, page is not found
      </Typography>
      <Link to="/" style={{ color: 'white', fontSize: '20px' }}>
        Back to the homepage
      </Link>
    </Box>
  )
}

export default NotFound
