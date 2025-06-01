import { Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react'
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'
import { deleteArticuloManufacturadoById, getAllArticuloManufacturado } from '../../../Api/ArticuloManufacturadoAPI'
import { useNavigate } from 'react-router'
import Modal from '../../../components/Modal';

const ManufacturadoTable = () => {
  const [aManufacturados, setAManufacturados] = useState<ArticuloManufacturado[]>([])
  const [aManufacturadosBefore, setAManufacturadosBefore] = useState<ArticuloManufacturado[]>([])
  const [openDelete, setOpenDelete] = useState<{open: boolean, id: string | null}>({open: false, id: null})

  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      await deleteArticuloManufacturadoById(id);
      setOpenDelete({open: false, id: null})
    } catch (error) {
      console.error("Error deleting articulo manufacturado:", error);
    }
  }

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setAManufacturados(aManufacturadosBefore);
    } else {
      const filtered = aManufacturados.filter((aManufacturado) =>
        aManufacturado.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) || 
        aManufacturado.categoriaArticuloManufacturado?.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aManufacturado.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aManufacturado.articuloManufacturadoDetalle.some(insumo => insumo.articuloInsumo?.denominacion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setAManufacturados(filtered);
    }
  }

  useEffect(() => {
    const getArticulos = async () => {
      const { data } = await getAllArticuloManufacturado();
      setAManufacturados(data);
      setAManufacturadosBefore(data);
    }
    getArticulos();

  }, [])
  
  return (
    <Grid container>
      <Grid size={9} sx={{ padding: '20px' }} >
        <Typography variant="h4">Listado articulo Manufacturado</Typography>
        </Grid>
        <Grid size={12} sx={{ padding: '20px' }} justifyContent={"space-between"} display={"flex"} >
          <TextField
            label="Buscar"
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => navigate("/articulo-manufacturado/crear")}>
            Crear Articulo Manufacturado
          </Button>
        </Grid>
        <Grid size={12} container spacing={2}>
          <Table>
        <TableHead>
            <TableRow>
                <TableCell>Denominación</TableCell>
                <TableCell>Precio de Compra</TableCell>
                <TableCell>Precio de Venta</TableCell>
                <TableCell>Tiempo estimado en min</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Insumos</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Baja</TableCell>
                <TableCell>Acciones</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {aManufacturados ? aManufacturados.map((aManufacturado, index) => (
                <TableRow key={(aManufacturado?.id ?? `no-id-${index}`).toString()}>
                    <TableCell>{aManufacturado.denominacion}</TableCell>
                    <TableCell>{aManufacturado.precioCosto.toString()}</TableCell>
                    <TableCell>{aManufacturado.precioVenta.toString()}</TableCell>
                    <TableCell>{aManufacturado.tiempoEstimado.toString()}</TableCell>
                    <TableCell>{aManufacturado.descripcion}</TableCell>
                    <TableCell>{aManufacturado.articuloManufacturadoDetalle.map((insumo) => insumo.articuloInsumo?.denominacion).join(', ')}</TableCell>
                    <TableCell>{aManufacturado.categoriaArticuloManufacturado?.denominacion}</TableCell>
                    <TableCell>{aManufacturado.baja?.toString() || '-'}</TableCell>
                    <TableCell>
                        <IconButton color="primary" onClick={() => navigate(`/articulo-manufacturado/ver/${aManufacturado.id}`)}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => navigate(`/articulo-manufacturado/editar/${aManufacturado.id}`)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setOpenDelete({open: true, id: aManufacturado?.id})}>
                            <DeleteIcon />
                        </IconButton>
                    </TableCell>
                </TableRow>
            )): (<TableRow>No se encontraron insumos</TableRow>)}
        </TableBody>
    </Table>
          </Grid>
          <Modal open={openDelete.open} onClose={() => setOpenDelete({open:false, id: null})} title="Crear Categoria">
            <Grid container spacing={2} sx={{ padding: 2 }}>
              <Grid size={12}>
                <Typography variant="h5">¿Desea eliminar el articulo manufacturado?</Typography>
              </Grid>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="error" onClick={() => handleDelete(openDelete.id ?? "")}>Eliminar</Button>
              </Grid>
            </Grid>
            </Modal>
    </Grid>
  )
}

export default ManufacturadoTable