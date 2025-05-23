import { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { useParams } from 'react-router'
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo'
import { getByIdArticuloInsumo } from '../../../Api/ArticuloInsumo'

const InsumoDetails = () => {
    const { id } = useParams()
    console.log(id)
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
                    <Typography variant='body1'><strong>Precio de Venta:</strong> ${articulo?.precioVenta?.toFixed(2)}</Typography>
                    <Typography variant='body1'><strong>Precio de Costo:</strong> ${articulo?.precioCompra?.toFixed(2)}</Typography>
                    <Typography variant='body1'><strong>Es para elaborar:</strong> {articulo?.esParaElaborar ? 'Sí' : 'No'}</Typography>
                    <Typography variant='body1'><strong>Categoría:</strong> {articulo?.unidadMedida}</Typography>
                    {articulo?.categoriaArticulo && articulo?.categoriaArticulo.map((categoria, index) => (
                        <Box key={index} >
                            <Typography><strong>Articulo Insumo:</strong> {categoria.denominacion}</Typography>
                            <Typography><strong>SubCategoria:</strong> {categoria.categoria?.denominacion}</Typography>
                        </Box>
                    ))}
                </Grid>
                </Grid>
        </Box>
    )
}
export default InsumoDetails