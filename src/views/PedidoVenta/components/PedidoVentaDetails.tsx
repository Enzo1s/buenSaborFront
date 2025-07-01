import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { format } from 'date-fns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { PedidoVenta } from '../../../interfaces/PedidoVenta';
import { getPedidoVentaById } from '../../../Api/PedidoVentaApi';

const PedidoVentaDetails = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState<PedidoVenta | null>(null)

    const getPedido = async () => {
        try {
            const { data } = await getPedidoVentaById(id as string);
            setPedido(data);
        } catch (error) {
            console.error("Error fetching PedidoVenta details:", error);
        }
    }

    useEffect(() => {
      getPedido()
    }, [])
    
  return (
    <Box sx={{ flexGrow: 1, p: 3, color: '#e0e0e0' }}>
            <Grid container spacing={3} justifyContent="center">
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(30, 30, 30, 0.9)',
                            color: '#e0e0e0',
                            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <Typography
                                variant='h4'
                                component='h1'
                                sx={{ color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}
                            >
                                Pedido Venta
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate('/cliente')}
                                    sx={{
                                        ml: 2,
                                        borderColor: '#90CAF9',
                                        color: '#90CAF9',
                                        '&:hover': {
                                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                            borderColor: '#90CAF9',
                                        }
                                    }}
                                >
                                    Volver
                                </Button>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Fecha de pedido:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{pedido?.fechaPedido
                                                      ? format(pedido?.fechaPedido, "dd/MM/yyyy HH:mm")
                                                      : "N/A"}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Total:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{pedido?.total}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Total costo:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{pedido?.totalCosto}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Tipo de envío:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{pedido?.tipoEnvio}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Empleado:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{pedido?.empleado ? `${pedido.empleado.nombre} ${pedido.empleado.apellido}` : "N/A"}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Cliente:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{pedido?.cliente ? `${pedido.cliente.nombre} ${pedido.cliente.apellido}` : "N/A"}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Forma de pago:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                    {pedido?.formaPago}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <Typography
                                variant='h4'
                                component='h1'
                                sx={{ color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}
                            >
                                Detalle del Pedido
                            </Typography>
                            
                        </Box>
                        {pedido?.pedidoVentaDetalle && pedido?.pedidoVentaDetalle.length > 0 && pedido?.pedidoVentaDetalle.map( detalle =>
                            <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Cantidad:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{detalle.cantidad}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Articulo:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{detalle.articuloInsumo ? detalle.articuloInsumo.denominacion:detalle.articuloManufacturado?.denominacion}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Subtotal:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{detalle?.subTotal}</Typography>
                            </Grid>
                            
                        </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
  )
}

export default PedidoVentaDetails