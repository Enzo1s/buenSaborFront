import { Button, Grid, Popper, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router';
import { useAuth } from '../Context/authContext';
import { useCartContext } from '../Context/cartContext';
import { useState } from 'react';

const Header = () => {

  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth()
  const { pedidoVenta } = useCartContext()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  return (
    <Grid container sx={{backgroundColor: '#3f51b5', margin:0, padding:0}}>
      <Grid size={9} sx={{ padding: '5px'}} >
        <Typography variant='h2' color='white'>Buen Sabor</Typography>
      </Grid>
      <Grid size={3} sx={{ padding: '10px'}}  justifyContent={"flex-end"} display={"flex"}  >
        <Button variant="text" onClick={handleClick}><Typography variant='h6' color='white'><ShoppingCartIcon /></Typography>
        </Button>
        <Button variant="text" onClick={() => isAuthenticated ? logout() : navigate('/login')}><Typography variant='h6' color='white'>{isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}</Typography>
        </Button>
      </Grid>
        <Grid size={3} sx={{backgroundColor: '#3f51b5', padding: '20px'}}>
          <Button variant="text" onClick={() =>navigate('/')}><Typography color='white'>Inicio</Typography></Button>
          <Button variant="text" onClick={() =>navigate('/articulo-manufacturado')}><Typography color='white'> Articulos </Typography></Button>
          <Button variant="text" onClick={() =>navigate('/articulo-insumo')}><Typography color='white'>Insumos</Typography></Button>
        </Grid>
        <Grid size={3} sx={{backgroundColor: '#3f51b5', padding: '20px'}}>
        </Grid>
        <Grid size={3} sx={{backgroundColor: '#3f51b5', padding: '20px'}}>
        </Grid>
        <Grid size={3} sx={{backgroundColor: '#3f51b5', padding: '20px'}}>
        </Grid>
      
<Popper
  anchorEl={anchorEl}
  open={open}
  placement="bottom-end"
  disablePortal={false}
  modifiers={[
    {
      name: 'flip',
      enabled: true,
      options: {
        altBoundary: true,
        rootBoundary: 'document',
        padding: 8,
      },
    },
    {
      name: 'preventOverflow',
      enabled: true,
      options: {
        altAxis: true,
        altBoundary: true,
        tether: true,
        rootBoundary: 'document',
        padding: 8,
      },
    },
  ]}
 >
  <Grid container sx={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
    <Grid size={12}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Carrito de Compras
      </Typography>
    </Grid>
    <Grid sx={{ marginTop: '10px' }} size={12}>
      <Typography variant="body1">Productos en el carrito:</Typography>
      {pedidoVenta && pedidoVenta.pedidoVentaDetalle.length > 0 ? (
        pedidoVenta.pedidoVentaDetalle.map((item, index) => (
          <Typography key={index} variant="body2">
            {item.articuloInsumo?.denominacion || item.articuloManufacturado?.denominacion} - Cantidad: {item.cantidad} - Precio: ${item.subTotal.toFixed(2)}
          </Typography>
        ))
      ) : (
        <Typography variant="body2">No hay productos en el carrito.</Typography>
      )}
    </Grid>
    <Grid sx={{ marginTop: '10px' }} size={12}>
      <Typography variant="body1">Total:</Typography></Grid>
      <Grid sx={{ marginTop: '10px' }} size={6}>
      <Button variant="contained" color="primary">
        Comprar
      </Button>
      </Grid>
      <Grid sx={{ marginTop: '10px' }} size={6}>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Cerrar
      </Button>
      </Grid>
      </Grid>
  </Popper>
  
      
    </Grid>
  );
};

export default Header;