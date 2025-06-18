import { Grid, Typography } from '@mui/material'
import { Outlet } from 'react-router'

const ArticuloManufacturadoView = () => {
  return (
    <Grid>
      <Typography variant="h5" className="textWhte">Articulo Manufacturado</Typography>
      <Outlet />
    </Grid>
  )
}

export default ArticuloManufacturadoView