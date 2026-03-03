import { Key, useEffect, useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper, // Usaremos Paper para un efecto de tarjeta
    Divider, // Para separar secciones
    List, // Para listar los detalles de insumos
    ListItem,
    ListItemText,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router'
import { getArticuloManufacturadoById } from '../../../Api/ArticuloManufacturadoAPI'
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'
import { useCartContext } from '../../../Context/cartContext';


const ManufacturadoDetails = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const { addItemToCart, setShouldOpenCart } = useCartContext()
    const baseURL = "http://localhost:8080/api/imagenes/"
    
    // Helper function to extract filename from full path
    const getFilename = (path: string) => path.split(/[\\/]/).pop() || path;
    
    const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null)
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [galleryImages, setGalleryImages] = useState<string[]>([])

    useEffect(() => {
        const getArticuloManufacturado = async () => {
            try {
                if (id !== undefined) {
                    const { data } = await getArticuloManufacturadoById(id);
                    setArticulo(data);
                    const image = data.pathImagen && data.pathImagen.length > 0 ? `${baseURL}${getFilename(data.pathImagen[0])}` : null;
                    setMainImage(image)
                    const images = data.pathImagen ? data.pathImagen.slice(1).map(getFilename) : [];
                    setGalleryImages(images);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getArticuloManufacturado();
    }, [])

    return (
        <Box
            sx={{
                padding: { xs: 2, md: 4 },
                color: '#e0e0e0',
            }}
        >
            <Paper
                elevation={8}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: '16px',
                    backgroundColor: 'rgba(35, 35, 35, 0.98)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(70, 70, 70, 0.6)',
                    maxWidth: '1200px',
                    margin: 'auto',
                }}
            >
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
                    {/* Título Principal de la Vista */}
                    <Grid size={12}>
                        <Typography
                            variant='h3'
                            component='h1'
                            gutterBottom
                            sx={{
                                color: '#90CAF9',
                                fontWeight: 'bold',
                                textAlign: { xs: 'center', md: 'left' },
                                mb: { xs: 3, md: 4 }
                            }}
                        >
                            Detalles del Artículo Manufacturado
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(100, 100, 100, 0.5)', mb: { xs: 3, md: 4 } }} />
                    </Grid>

                    {/* Sección de Imagen Principal */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {mainImage ? (
                            <Paper
                                elevation={6}
                                sx={{
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(60, 60, 60, 0.9)',
                                    minHeight: { xs: 250, sm: 350, md: 450 },
                                    maxHeight: { xs: '300px', sm: '400px', md: '500px' },
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                                }}
                            >
                                <img
                                    src={mainImage}
                                    alt={articulo?.denominacion}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </Paper>
                        ) : (
                            <Paper
                                elevation={3}
                                sx={{
                                    borderRadius: '12px',
                                    p: 3,
                                    backgroundColor: 'rgba(60, 60, 60, 0.8)',
                                    textAlign: 'center',
                                    minHeight: { xs: 250, sm: 350, md: 450 },
                                    maxHeight: { xs: '300px', sm: '400px', md: '500px' },
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
                                    No hay imagen disponible para este artículo.
                                </Typography>
                            </Paper>
                        )}

                        {/* Galería de Imágenes Adicionales (opcional) */}
                        {galleryImages.length > 0 && (
                            <Box sx={{ mt: 3, display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                                {galleryImages.map((imagen, index) => (
                                    <Paper
                                        key={index}
                                        elevation={3}
                                        sx={{
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            minWidth: 100,
                                            height: 100,
                                            backgroundColor: 'rgba(70, 70, 70, 0.9)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                boxShadow: '0 0 0 2px #90CAF9',
                                            },
                                        }}
                                    >
                                        <img
                                            src={`${baseURL}${imagen}`}
                                            alt={`Galería ${index + 1}`}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </Paper>
                                ))}
                            </Box>
                        )}
                    </Grid>

                    {/* Sección de Detalles del Artículo */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ p: { xs: 0, sm: 2 } }}>
                            <Typography variant='h4' component='h2' gutterBottom sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                {articulo?.denominacion}
                            </Typography>
                            <Divider sx={{ borderColor: 'rgba(100, 100, 100, 0.3)', mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Descripción:</Typography> {articulo?.descripcion}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Precio de Venta:</Typography> ${articulo?.precioVenta.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Precio de Costo:</Typography> ${articulo?.precioCosto.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Tiempo de Elaboración:</Typography> {articulo?.tiempoEstimado.toFixed(2)} minutos
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Categoría:</Typography> {articulo?.categoriaArticuloManufacturado?.denominacion || 'N/A'}
                                    </Typography>
                                </Grid>

                                {articulo?.articuloManufacturadoDetalle && articulo?.articuloManufacturadoDetalle.length > 0 && (
                                    <Grid size={12}>
                                        <Typography variant='h6' sx={{ mt: 3, mb: 1, color: '#fff', fontWeight: 'bold' }}>Insumos Necesarios:</Typography>
                                        <List sx={{ bgcolor: 'rgba(50, 50, 50, 0.8)', borderRadius: '8px', border: '1px solid rgba(80, 80, 80, 0.7)', maxHeight: '200px', overflow: 'auto' }}>
                                            {articulo?.articuloManufacturadoDetalle.map((detalle, index) => (
                                                <ListItem key={detalle.id as Key || index} sx={{ borderBottom: index < articulo?.articuloManufacturadoDetalle.length - 1 ? '1px dashed rgba(100, 100, 100, 0.4)' : 'none' }}>
                                                    <ListItemText
                                                        primary={
                                                            <Typography sx={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                                                                {detalle.articuloInsumo?.denominacion || 'Insumo Desconocido'}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography sx={{ color: '#a0a0a0' }}>
                                                                Cantidad: {detalle.cantidad.toString()} {detalle.articuloInsumo?.unidadMedida || ''}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Botón de Agregar al Carrito y Volver */}
                            <Grid size={12} sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<ArrowBackIcon />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        px: 6,
                                        py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                                        '&:hover': {
                                            backgroundColor: '#64B5F6',
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)',
                                        },
                                    }}
                                    onClick={() => navigate('/')}
                                >
                                    Volver
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddShoppingCartIcon />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        px: 6,
                                        py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                                        '&:hover': {
                                            backgroundColor: '#64B5F6',
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)',
                                        },
                                    }}
                                    onClick={() => {
                                        if (articulo) {
                                            addItemToCart(null, articulo, null, 1);
                                            setShouldOpenCart(true);
                                        }
                                    }}
                                >
                                    Agregar al Carrito
                                </Button>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default ManufacturadoDetails