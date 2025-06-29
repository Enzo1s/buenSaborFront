import { Typography } from '@mui/material'
import { Outlet } from 'react-router'

const PedidoVentaView = () => {
  return (
    <div>
        <Typography variant='h5' className='textWhte'>Pedido Venta</Typography>
        <Outlet />
    </div>
  )
}

export default PedidoVentaView