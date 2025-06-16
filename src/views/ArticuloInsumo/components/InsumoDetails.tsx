import { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useParams } from 'react-router'
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo'
import { getByIdArticuloInsumo } from '../../../Api/ArticuloInsumo'
import { useCartContext } from '../../../Context/cartContext';

const InsumoDetails = () => {
    const { id } = useParams()
    const { addItemToCart } = useCartContext()
    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="
    const [articulo, setArticulo] = useState<ArticuloInsumo | null>(null)

    useEffect(() => {
        const getArticuloInsumo = async () => {
            try {
                if (id !== undefined) {
                    const { data } = await getByIdArticuloInsumo(id);
                    setArticulo(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getArticuloInsumo();
    }, [])

    return (
        <Box sx={{ padding: 2, borderRadius: 2 }} className="textWhte">
            <Grid container >
                <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                    <Typography variant='h3'>Detalles del Artículo</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    {articulo?.pathImagen && articulo.pathImagen.length > 0 && articulo.pathImagen.map((imagen, index) => (
                        <img src={`${baseURL}${imagen}`} alt={`Imagen ${index + 1}`} key={index} style={{ height: '300px' }} />
                    ))}
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ padding: 2 }}>
                    <Typography variant='h6'><strong>Denominación:</strong> {articulo?.denominacion}</Typography>
                    <Typography variant='h6'><strong>Precio de Venta:</strong> ${articulo?.precioVenta?.toFixed(2)}</Typography>
                    <Typography variant='h6'><strong>Precio de Costo:</strong> ${articulo?.precioCompra?.toFixed(2)}</Typography>
                    <Typography variant='h6'><strong>Es para elaborar:</strong> {articulo?.esParaElaborar ? 'Sí' : 'No'}</Typography>
                    <Typography variant='h6'><strong>Unidad:</strong> {articulo?.unidadMedida}</Typography>
                    {articulo?.categoriaArticulo && articulo?.categoriaArticulo.map((categoria, index) => (
                        <Box key={index} >
                            <Typography><strong>Categoría:</strong> {categoria.denominacion}</Typography>
                            <Typography><strong>SubCategoria:</strong> {categoria.categoria?.denominacion}</Typography>
                        </Box>
                    ))}
                <Grid size={{ xs: 4 }} sx={{ paddingTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button variant="contained" color="primary" startIcon={<AddShoppingCartIcon />} sx={{ width: '100%' }} onClick={() => articulo && addItemToCart(articulo, null, null, 1)}>
                        <Typography variant='body2'>Agregar al Carrito</Typography>
                    </Button>
                </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}
export default InsumoDetails