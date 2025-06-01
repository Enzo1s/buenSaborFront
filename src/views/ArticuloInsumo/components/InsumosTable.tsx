import { Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react"
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo"
import { deleteArticuloInsumo, getListArticuloInsumo } from "../../../Api/ArticuloInsumo"
import { useNavigate } from "react-router"
import Modal from "../../../components/Modal";

const InsumosTable = () => {
  const navigate = useNavigate();
  const [articuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([])
  const [articuloInsumosBefore, setArticuloInsumosBefore] = useState<ArticuloInsumo[]>([])
  const [openDelete, setOpenDelete] = useState<{ open: boolean, id: String | null }>({ open: false, id: null })

  const handleDelete = async (id: String) => {
    try {
      await deleteArticuloInsumo(id);
      setOpenDelete({ open: false, id: null })
    } catch (error) {
      console.error("Error deleting articulo manufacturado:", error);
    }
  }

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setArticuloInsumos(articuloInsumosBefore);
    } else {
      const filtered = articuloInsumos.filter((articuloInsumo) =>
        articuloInsumo.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        articuloInsumo.categoriaArticulo?.some(categoria => categoria?.denominacion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setArticuloInsumos(filtered);
    }
  }

  useEffect(() => {
    const getInsumos = async () => {
      const { data } = await getListArticuloInsumo();
      setArticuloInsumos(data);
      setArticuloInsumosBefore(data)
    }
    getInsumos();
  }, [])

  return (
    <Grid container>
      <Grid container size={12} sx={{ padding: '20px' }} >
        <Grid size={10}>
          <Typography variant="h4">Listado articulo Insumo</Typography>
        </Grid>
        <Grid size={12} sx={{ padding: '20px' }} justifyContent={"space-between"} display={"flex"} >
          <TextField
            label="Buscar"
            variant="outlined"
            onChange={(e) => handleSearch(e.target.value)}
          />
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
            <TableCell>Baja</TableCell>
            <TableCell>acciones</TableCell>
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
                <TableCell>{articuloInsumo.baja?.toString() || '-'}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => navigate(`/articulo-insumo/ver/${articuloInsumo.id}`)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => navigate(`/articulo-insumo/editar/${articuloInsumo.id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => setOpenDelete({ open: true, id: articuloInsumo?.id })}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )) : (<TableRow>No se encontraron insumos</TableRow>)}
        </TableBody>
      </Table>
      <Modal open={openDelete.open} onClose={() => setOpenDelete({ open: false, id: null })} title="Crear Categoria">
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid size={12}>
            <Typography variant="h5">¿Desea eliminar el articulo insumo?</Typography>
          </Grid>
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="error" onClick={() => handleDelete(openDelete.id ?? "")}>Eliminar</Button>
          </Grid>
        </Grid>
      </Modal>
    </Grid>
  )
}

export default InsumosTable