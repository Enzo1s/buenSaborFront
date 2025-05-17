import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo"
import { getListArticuloInsumo } from "../../../Api/ArticuloInsumo"
import { useNavigate } from "react-router"

const InsumosTable = () => {
    const navigate = useNavigate();
    const [articuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([])

    useEffect(() => {
        const getInsumos = async () => {
            const {data} = await getListArticuloInsumo();
            setArticuloInsumos(data);
        }
        getInsumos();
    }, [])
    
  return (
    <Grid container>
        <Grid container size={12} sx={{ padding: '20px' }} >
            <Grid size={10}>
            <Typography variant="h4">Listado articulo Insumo</Typography>
            </Grid>
            <Grid size={2}>
            <Button variant="contained" color="primary" onClick={() => navigate("/articulo-insumo/crear")}>
                Crear Articulo Insumo
            </Button>
            </Grid>
        </Grid>
    
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Denominación</TableCell>
                <TableCell>Precio de Compra</TableCell>
                <TableCell>Precio de Venta</TableCell>
                <TableCell>Para Elaborar</TableCell>
                <TableCell>Unidad de Medida</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {articuloInsumos ? articuloInsumos.map((articuloInsumo, index) => (
                <TableRow key={(articuloInsumo?.id ?? `no-id-${index}`).toString()}>
                    <TableCell>{articuloInsumo.denominacion}</TableCell>
                    <TableCell>{articuloInsumo.precioCompra.toString()}</TableCell>
                    <TableCell>{articuloInsumo.precioVenta.toString()}</TableCell>
                    <TableCell>{articuloInsumo.esParaElaborar ? "Si" : "No"}</TableCell>
                    <TableCell>{articuloInsumo.unidadMedida}</TableCell>
                    <TableCell>{articuloInsumo.categoriaArticulo?.map((categoriaArticulo) => categoriaArticulo.denominacion).join(", ")}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            )): (<TableRow>No se encontraron insumos</TableRow>)}
        </TableBody>
    </Table>
    </Grid>
  )
}

export default InsumosTable