import { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router'
import { getArticuloManufacturadoById } from '../../../Api/ArticuloManufacturadoAPI'
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'


const ManufacturadoDetails = () => {

    const { id } = useParams()
    console.log(id)
    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="
    const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null)

    useEffect(() => {
        const getArticuloManufacturado = async () => {
            try {
                if (id !== undefined) {
                    const { data } = await getArticuloManufacturadoById(id);
                    setArticulo(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        getArticuloManufacturado();
    }, [])

    return (
        <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            <Grid container >
                <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                    <Typography variant='h3'>Detalles del Artículo</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                    {articulo?.pathImagen && articulo.pathImagen.length > 0 && articulo.pathImagen.map((imagen, index) => (
                        <img src={`${baseURL}${imagen}`} alt={`Imagen ${index + 1}`} key={index} style={{  height: '300px' }} />
                    ))}
                </Grid>
                <Grid size={{ xs: 6 }} sx={{ padding: 2 }}>
                    <Typography variant='body1'><strong>Denominación:</strong> {articulo?.denominacion}</Typography>
                    <Typography variant='body1'><strong>Descripción:</strong> {articulo?.descripcion}</Typography>
                    <Typography variant='body1'><strong>Precio de Venta:</strong> ${articulo?.precioVenta?.toFixed(2)}</Typography>
                    <Typography variant='body1'><strong>Precio de Costo:</strong> ${articulo?.precioCosto?.toFixed(2)}</Typography>
                    <Typography variant='body1'><strong>Tiempo de Estimación:</strong> {articulo?.tiempoEstimado?.toString()}</Typography>
                    <Typography variant='body1'><strong>Categoría:</strong> {articulo?.categoriaArticuloManufacturado?.denominacion}</Typography>
                    {articulo?.articuloManufacturadoDetalle && articulo?.articuloManufacturadoDetalle.map((detalle, index) => (
                        <Box key={index} >
                            <Typography variant='h5' >Detalle</Typography>
                            <Typography><strong>Articulo Insumo:</strong> {detalle.articuloInsumo?.denominacion}</Typography>
                            <Typography><strong>Cantidad:</strong> {detalle.cantidad.toString()}</Typography>
                        </Box>
                    ))}
                </Grid>
                </Grid>
        </Box>
    )
}

export default ManufacturadoDetails