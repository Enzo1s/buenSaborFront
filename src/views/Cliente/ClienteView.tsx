import { Typography } from '@mui/material'
import { Outlet } from 'react-router'

const ClienteView = () => {
  return (
    <div>
        <Typography variant='h5' className="textWhte">Cliente</Typography>
        <Outlet />
    </div>
  )
}

export default ClienteView