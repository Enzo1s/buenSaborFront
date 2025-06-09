import { Grid, Typography } from '@mui/material'
import { Outlet } from 'react-router';

const EmpresaView = () => {

    return (
        <Grid>
            <Typography variant='h5'>Empresa</Typography>
            
            <Outlet />
        </Grid>
    )
}

export default EmpresaView