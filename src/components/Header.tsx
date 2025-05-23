import { Button, Grid, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router';

const Header = () => {

  const navigate = useNavigate()

  return (
    <Grid container sx={{backgroundColor: '#3f51b5', margin:0, padding:0}}>
      <Grid size={9} sx={{ padding: '5px'}} >
        <Typography variant='h2' color='white'>Buen Sabor</Typography>
      </Grid>
      <Grid size={3} sx={{ padding: '10px'}}  justifyContent={"flex-end"} display={"flex"}  >
        <Button variant="text"><Typography variant='h6' color='white'><ShoppingCartIcon /></Typography>
        </Button>
        <Button variant="text"><Typography variant='h6' color='white'>Iniciar Sesión</Typography>
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
      
      
    </Grid>
  );
};

export default Header;