import { Card, CardContent, Grid, Typography } from '@mui/material'
import { CardProps } from './Interfaces/CardProps';
import { useNavigate } from 'react-router';

const CardObject = (CardProps: CardProps) => {
    const { itemCard } = CardProps;
    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="
    
    const navigate = useNavigate();
    return (
        <Card sx={{ maxWidth: 500, width: '400px' }} onClick={() => navigate(`${itemCard.esInsumo ? '/articulo-insumo' : '/articulo-manufacturado'}/ver/${itemCard.id}`)}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <img src={itemCard.imagen ? `${baseURL}${itemCard.imagen}`: ''} alt="" style={{ width: '100%', height:'200px' }} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {itemCard.titulo}
                        </Typography>
                        <Typography variant="body2" >
                            ${itemCard.precioVenta?.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card >
    )
}

export default CardObject