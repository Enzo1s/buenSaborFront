import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Grid } from '@mui/material';
import { Promocion } from '../../../interfaces/Promocion';

interface CardArticulosProps {
    imagen: string,
    titulo: string,
    descripcion: string,
    promocion: Promocion | null
}

const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="

 const CardArticulos = (props: CardArticulosProps) => {
    const { imagen, titulo, descripcion, promocion } = props;

  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardActionArea>
        {/* <CardMedia
          component="img"
          height="140"
          image={imagen ?`${baseURL}${imagen}`: ''}
          alt="green iguana"
        /> */}
        <Grid size={{ xs: 12 }}>
                        <img src={imagen ? `${baseURL}${imagen}`: ''} alt="" style={{ width: '100%', height:'140px' }} />
                    </Grid>
        <CardContent>
          <Typography color='text.primary' gutterBottom variant="h5" component="div">
            {titulo}
          </Typography>
          {promocion && 
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' , backgroundColor: 'red'  }}>
              {`${promocion.denominacion} - descuento: ${promocion.descuento}%`}
            </Typography>
          }
          <Typography variant="body1" sx={{ color: 'text.primary' }}>
            {descripcion}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CardArticulos;
