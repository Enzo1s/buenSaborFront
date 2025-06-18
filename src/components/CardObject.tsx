import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { CardProps } from './Interfaces/CardProps';
import { useNavigate } from 'react-router';

const CardObject = (CardProps: CardProps) => {
    const { itemCard } = CardProps;
    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="
    
    const navigate = useNavigate();
    return (
        <Card
            sx={{
                maxWidth: 500,
                width: '400px',
                borderRadius: '12px',
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                color: '#e0e0e0',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.6)',
                },
            }}
            onClick={() => navigate(`${itemCard.esInsumo ? '/articulo-insumo' : '/articulo-manufacturado'}/ver/${itemCard.id}`)}
        >
            <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Box sx={{
                            width: '100%',
                            height: '200px',
                            backgroundColor: '#444',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}>
                            {itemCard.imagen ? (
                                <img
                                    src={`${baseURL}${itemCard.imagen}`}
                                    alt={itemCard.titulo || 'Imagen de producto'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                />
                            ) : (
                                <Typography variant="caption" sx={{ color: '#aaa' }}>
                                    Imagen no disponible
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid size={12}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{
                                color: '#f0f0f0',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                mt: 1,
                            }}
                        >
                            {itemCard.titulo}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#90CAF9',
                                fontWeight: 'bold',
                                mt: 1,                            }}
                        >
                            ${itemCard.precioVenta?.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default CardObject