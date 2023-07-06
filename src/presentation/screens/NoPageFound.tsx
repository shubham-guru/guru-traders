import { Box, Typography } from '@mui/material'
import noData from '../assest/images/noData.jpg'

const NoPageFound = () => {

    const styles = {
        container: {
          backgroundImage: `url(${noData})`,
          backgroundRepeat: "no-repeat",
          height: '80vh',
          backgroundPosition: 'center',
          backgroundSize: '70% 100%'
        }
    }
  return (
    <Box>
        <Box sx={styles.container}></Box>
        <Typography sx={{fontFamily: 'EB Garamond, serif'}}>The page you are looking for is not found !</Typography>
    </Box>
  )
}

export default NoPageFound