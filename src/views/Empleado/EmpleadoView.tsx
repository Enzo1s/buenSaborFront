import { Typography } from '@mui/material'
import { Outlet } from 'react-router'

const EmpleadoView = () => {
  return (
    <div>
        <Typography variant='h5'>Empleado</Typography>
        <Outlet />
    </div>
  )
}

export default EmpleadoView