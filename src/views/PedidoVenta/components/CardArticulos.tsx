import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, Grid } from '@mui/material';
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
    <Card
            sx={{
                maxWidth: 300,
                width: '100%',
                borderRadius: '12px',
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                color: '#e0e0e0',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)', // Efecto "lift" al pasar el ratón
                    boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.6)', // Sombra más intensa al pasar el ratón
                },
            }}
        >
            <CardActionArea  sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Grid size={12}>
                    <Box sx={{
                        width: '100%',
                        height: '140px', // Altura fija para la imagen
                        backgroundColor: '#444', // Color de fondo para cuando no hay imagen
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px', // Bordes redondeados para la imagen
                        overflow: 'hidden', // Asegura que la imagen se ajuste a los bordes redondeados
                    }}>
                        {imagen ? (
                            <img
                                src={`${baseURL}${imagen}`}
                                alt={titulo || 'Imagen de promoción'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover', // Asegura que la imagen cubra el área sin distorsionarse
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
                <CardContent sx={{ p: 2 }}> {/* Ajusta el padding interno de CardContent */}
                    <Typography
                        gutterBottom
                        variant="h6" // Un poco más pequeño que h5 para títulos de tarjeta
                        component="div"
                        sx={{
                            color: '#f0f0f0', // Título más claro
                            fontWeight: 'bold',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)', // Sombra de texto sutil
                            mb: 1, // Margen inferior para separar
                        }}
                    >
                        {titulo}
                    </Typography>
                    {promocion && (() => {
                        const currentDate = new Date();
                        const fechaDesde = new Date(promocion.fechaDesde);
                        const fechaHasta = new Date(promocion.fechaHasta);
                        const isPromotionActive = currentDate >= fechaDesde && currentDate <= fechaHasta;

                        return isPromotionActive && (
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#ffffff', // Texto blanco para el descuento
                                    fontWeight: 'bold',
                                    backgroundColor: '#E53935', // Rojo brillante para el fondo del descuento
                                    display: 'inline-block', // Para que el fondo se ajuste al texto
                                    px: 1.5, // Padding horizontal
                                    py: 0.5, // Padding vertical
                                    borderRadius: '4px', // Bordes redondeados para el tag de descuento
                                    mb: 1, // Margen inferior para separar
                                }}
                            >
                                {`${promocion.denominacion} - ${promocion.descuento}% OFF`} {/* Texto más descriptivo */}
                            </Typography>
                        );
                    })()}
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}> {/* Color más suave para la descripción */}
                        {descripcion}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
  );
}

export default CardArticulos;
