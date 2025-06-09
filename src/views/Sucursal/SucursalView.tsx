import { Grid, Typography } from '@mui/material'
import { Outlet } from 'react-router'

const SucursalView = () => {
    return (
        <Grid>
            <Typography variant='h5'>Sucursal</Typography>

            <Outlet />
        </Grid>
    )
}

export default SucursalView