import { Grid, Typography } from '@mui/material'
import { Outlet } from 'react-router'

const SucursalView = () => {
    return (
        <Grid>
            <Typography variant='h5' className='textWhte'>Sucursal</Typography>

            <Outlet />
        </Grid>
    )
}

export default SucursalView