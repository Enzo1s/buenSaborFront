import { useEffect, useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    Button,
    Paper, // Usaremos Paper para un efecto de tarjeta
    Divider, // Para separar secciones
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useParams } from 'react-router'
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo'
import { getByIdArticuloInsumo, getByIdArticuloInsumoAndIdSucursal } from '../../../Api/ArticuloInsumo'
import { useCartContext } from '../../../Context/cartContext';
import { useAuth } from '../../../Context/authContext';

const InsumoDetails = () => {
    const { id } = useParams()
    const { addItemToCart, setShouldOpenCart } = useCartContext()
    const { user } = useAuth()
    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="
    const [articulo, setArticulo] = useState<ArticuloInsumo | null>(null)
    const [mainImage, setMainImage] = useState<string | null>(null)
    const [galleryImages, setGalleryImages] = useState<string[]>([])
    const [stock, setStock] = useState(0)

    const agregarACarrito = () => {
        if (articulo && stock > 0) {
            addItemToCart(articulo, null, null, 1);
            setShouldOpenCart(true);
        } else if(stock === 0) {
            alert("No hay stock disponible para este artículo.");
        }
    }

    useEffect(() => {
        const getArticuloInsumo = async () => {
            try {
                if (id !== undefined) {
                    const { data } = await getByIdArticuloInsumo(id);
                    setArticulo(data);
                    const image = data.pathImagen && data.pathImagen.length > 0 ? `${baseURL}${data.pathImagen[0]}` : null;
                    setMainImage(image);
                   const images = data.pathImagen ? data.pathImagen.slice(1) : [];
                   setGalleryImages(images);
                   const {data: stockData} = await getByIdArticuloInsumoAndIdSucursal(id, user?.sucursalEmpresa?.id as string);
                   setStock(stockData.stock);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getArticuloInsumo();
    }, [])


    return (
        <Box
            sx={{
                padding: { xs: 2, md: 4 },
                color: '#e0e0e0', // Texto claro por defecto para toda la sección
                minHeight: '80vh', // Asegura un mínimo de altura
            }}
        >
            <Paper
                elevation={8} // Mayor elevación para que la tarjeta de detalle resalte
                sx={{
                    p: { xs: 3, md: 5 }, // Más padding para un look espacioso
                    borderRadius: '16px', // Bordes más redondeados
                    backgroundColor: 'rgba(35, 35, 35, 0.98)', // Fondo oscuro para la tarjeta
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)', // Sombra más pronunciada
                    border: '1px solid rgba(70, 70, 70, 0.6)', // Borde sutil
                }}
            >
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start"> {/* Espaciado general aumentado */}
                    {/* Título Principal del Artículo */}
                    <Grid size={12}>
                        <Typography
                            variant='h3'
                            component='h1'
                            gutterBottom
                            sx={{
                                color: '#90CAF9', // Color primario
                                fontWeight: 'bold',
                                textAlign: { xs: 'center', md: 'left' }, // Centrado en móvil, izquierda en desktop
                                mb: { xs: 3, md: 4 }
                            }}
                        >
                            Detalles del Artículo
                        </Typography>
                        <Divider sx={{ borderColor: 'rgba(100, 100, 100, 0.5)', mb: { xs: 3, md: 4 } }} />
                    </Grid>

                    {/* Sección de Imagen Principal */}
                    <Grid size={{xs:12, md:6}}> {/* Ocupa la mitad del ancho en desktop, completo en móvil */}
                        {mainImage ? (
                            <Paper
                                elevation={6}
                                sx={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(60, 60, 60, 0.9)',
                                    minHeight: { xs: 250, sm: 350, md: 450 }, // Altura responsiva
                                    maxHeight: 500,
                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                                }}
                            >
                                <img
                                    src={mainImage}
                                    alt={articulo?.denominacion as string}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain', // Contiene la imagen dentro del Paper
                                        display: 'block', // Elimina espacio extra bajo la imagen
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
                                                boxShadow: '0 0 0 2px #90CAF9', // Resaltar al hover
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
                    <Grid size={{xs:12, md:6}}>
                        <Box sx={{ p: { xs: 0, sm: 2 } }}>
                            <Typography variant='h4' component='h2' gutterBottom sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                {articulo?.denominacion}
                            </Typography>
                            <Divider sx={{ borderColor: 'rgba(100, 100, 100, 0.3)', mb: 3 }} />

                            <Grid container spacing={2}> {/* Grid para las propiedades */}
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Precio de Venta:</Typography> ${articulo?.precioVenta.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Precio de Costo:</Typography> ${articulo?.precioCompra.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Es para elaborar:</Typography> {articulo?.esParaElaborar ? 'Sí' : 'No'}
                                    </Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Unidad de Medida:</Typography> {articulo?.unidadMedida}
                                    </Typography>
                                </Grid>
                                 <Grid size={12}>
                                    <Typography variant='h6' sx={{ color: '#a0a0a0' }}>
                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Stock:</Typography> {stock > 0 ? stock : 'Sin Stock'}
                                    </Typography>
                                </Grid>

                                {articulo?.categoriaArticulo && articulo?.categoriaArticulo.length > 0 && (
                                    <Grid size={12}>
                                        <Typography variant='h6' sx={{ mt: 2, mb: 1, color: '#fff', fontWeight: 'bold' }}>Categorías:</Typography>
                                        <Box sx={{ pl: 2 }}> {/* Indentación para las categorías */}
                                            {articulo?.categoriaArticulo.map((categoria, index) => (
                                                <Box key={index} sx={{ mb: 1 }}>
                                                    <Typography variant='body1' sx={{ color: '#b0b0b0' }}>
                                                        <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Principal:</Typography> {categoria.denominacion}
                                                    </Typography>
                                                    {categoria.categoria?.denominacion && (
                                                        <Typography variant='body2' sx={{ color: '#c0c0c0', ml: 2 }}>
                                                            <Typography component="span" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>Subcategoría:</Typography> {categoria.categoria.denominacion}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>

                            {/* Botón de Agregar al Carrito */}
                            <Grid size={12} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddShoppingCartIcon />}
                                    sx={{
                                        width: { xs: '100%', sm: 'auto' }, // Ancho completo en móvil, auto en desktop
                                        px: 6, // Mayor padding horizontal
                                        py: 1.8, // Mayor padding vertical
                                        fontSize: '1.1rem', // Fuente un poco más grande
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', // Sombra para el botón
                                        '&:hover': {
                                            backgroundColor: '#64B5F6', // Tono más claro al hover
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)',
                                        },
                                    }}
                                    disabled={stock <= 0} // Deshabilitar si no hay stock
                                    onClick={() => agregarACarrito()}
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
export default InsumoDetails