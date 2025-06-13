import { Typography } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'

const PedidoVentaView = () => {
  return (
    <div>
        <Typography variant='h3'>Pedido Venta</Typography>
        <Outlet />
    </div>
  )
}

export default PedidoVentaView