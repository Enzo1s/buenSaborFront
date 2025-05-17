import { Button, Grid, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router';

const colorWhite = red[50];

const Header = () => {

  const navigate = useNavigate()

  return (
    <Grid container sx={{backgroundColor: '#3f51b5', margin:0, padding:0}}>
      <Grid size={9} sx={{ padding: '10px'}} >
        <Typography variant='h2' color='white'>Buen Sabor</Typography>
      </Grid>
      <Grid size={1} sx={{ paddingTop: '45px'}} >
        <Button variant="text"><Typography variant='h6' color='white'><ShoppingCartIcon /></Typography>
        </Button>
      </Grid>
      <Grid size={2} sx={{ paddingTop: '10px'}} alignContent={'end'} alignItems={'end'} >
        <Button variant="text"><Typography variant='h6' color='white'>Iniciar Sesión</Typography>
        </Button>
      </Grid>
        <Grid size={3} sx={{backgroundColor: '#3f51b5', padding: '20px'}}>
          <Button variant="text" ><Typography color='white'>Inicio</Typography></Button>
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