import { Typography } from '@mui/material'
import { Outlet } from 'react-router'

const PromocionView = () => {
  return (
    <div>
        <Typography variant='h5' className='textWhte'>Promoción</Typography>
        <Outlet />
    </div>
  )
}

export default PromocionView