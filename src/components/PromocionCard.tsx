import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Promocion } from '../interfaces/Promocion';
import { useNavigate } from 'react-router';

interface PromocionCardProps {
    promocion: Promocion;
}

const PromocionCard = ({ promocion }: PromocionCardProps) => {
    const navigate = useNavigate();
    const baseURL = "http://localhost:8080/api/imagenes/";

    // Helper function to extract filename from full path
    const getFilename = (path: string) => path.split(/[\\/]/).pop() || path;

    // Function to get the promotion image
    const getImageUrl = () => {
        if (promocion.pathImagen && promocion.pathImagen.length > 0) {
            return `${baseURL}${getFilename(promocion.pathImagen[0])}`;
        }
        return null;
    };

    const imageUrl = getImageUrl();

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
            onClick={() => navigate(`/promocion/ver/${promocion.id}`)} // Assuming a route for viewing promotion details
        >
            <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
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
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={promocion.denominacion?.toString() || 'Imagen de promoción'}
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

                    <Grid item xs={12}>
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
                            {promocion.denominacion}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#90CAF9',
                                fontWeight: 'bold',
                                mt: 1,
                            }}
                        >
                            Descuento: {promocion.descuento}%
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#a0a0a0',
                            }}
                        >
                            Desde: {new Date(promocion.fechaDesde).toLocaleDateString()}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#a0a0a0',
                            }}
                        >
                            Hasta: {new Date(promocion.fechaHasta).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PromocionCard;
