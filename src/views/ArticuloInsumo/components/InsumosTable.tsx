import {
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal as MuiModal,
  Box,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Key, useEffect, useState } from "react"
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo"
import { deleteArticuloInsumo, getListArticuloInsumo } from "../../../Api/ArticuloInsumo"
import { useNavigate } from "react-router"

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
    <Grid
      container
      sx={{
        color: '#e0e0e0',
        padding: { xs: 2, md: 4 },
      }}
    >
      <Grid size={12} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#fff', fontWeight: 'bold' }}>
          Listado de Artículos Insumo
        </Typography>
      </Grid>

      {/* Sección de Búsqueda y Botón de Creación */}
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Buscar por Denominación"
          variant="outlined"
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            flexGrow: 1,
            mr: { xs: 0, sm: 2 },
            minWidth: { xs: '100%', sm: 'auto' },
            backgroundColor: 'rgba(70, 70, 70, 0.7)',
            borderRadius: '4px',
            '& .MuiInputBase-input': {
              color: '#e0e0e0',
            },
            '& .MuiInputLabel-root': {
              color: '#a0a0a0',
              '&.Mui-focused': {
                color: '#fff',
              },
              '&.MuiFormLabel-filled': {
                color: '#fff',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#757575',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#90CAF9',
              borderWidth: '2px',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/articulo-insumo/crear")}
          sx={{
            minWidth: { xs: '100%', sm: 'auto' },
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
          }}
        >
          Crear Artículo Insumo
        </Button>
      </Grid>

      {/* Tabla de Artículos Insumo */}
      {articuloInsumos && articuloInsumos.length > 0 ? (
        <Grid size={12}>
          <Table
            sx={{
              minWidth: 900,
              backgroundColor: 'rgba(50, 50, 50, 0.9)',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden',
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(70, 70, 70, 0.95)' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Denominación</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Precio Compra</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Precio Venta</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Para Elaborar</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Unidad de Medida</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Categoría</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estado (Baja)</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articuloInsumos.map((articuloInsumo) => (
                <TableRow
                  key={articuloInsumo.id as Key}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(60, 60, 60, 0.8)',
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: 'rgba(55, 55, 55, 0.8)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(80, 80, 80, 0.9)',
                    },
                    opacity: articuloInsumo.baja ? 0.6 : 1,
                    fontStyle: articuloInsumo.baja ? 'italic' : 'normal',
                  }}
                >
                  <TableCell sx={{ color: '#e0e0e0' }}>{articuloInsumo.denominacion}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{`$${articuloInsumo.precioCompra.toFixed(2)}`}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{`$${articuloInsumo.precioVenta.toFixed(2)}`}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{articuloInsumo.esParaElaborar ? "Sí" : "No"}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>{articuloInsumo.unidadMedida}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0' }}>
                    {articuloInsumo.categoriaArticulo?.map((cat) => cat.denominacion).join(", ") || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: articuloInsumo.baja ? '#EF9A9A' : '#A5D6A7' }}>
                    {articuloInsumo.baja ? 'Dada de Baja' : 'Activo'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/articulo-insumo/ver/${articuloInsumo.id}`)}
                      sx={{ '&:hover': { color: '#64B5F6' } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => navigate(`/articulo-insumo/editar/${articuloInsumo.id}`)}
                      sx={{ '&:hover': { color: '#BA68C8' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setOpenDelete({ open: true, id: articuloInsumo?.id })}
                      sx={{ '&:hover': { color: '#EF5350' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      ) : (
        <Grid size={12} sx={{ textAlign: 'center', mt: 4 }} display={'flex'} justifyContent={'center'}>
          <Typography variant="h6" className='textWhte' sx={{ borderRadius: '10px', width:'400px'}}>
            No hay artículos insumo para mostrar.
          </Typography>
        </Grid>
      )}

      {/* Modal de eliminación */}
      <MuiModal open={openDelete.open} onClose={() => setOpenDelete({ open: false, id: null })}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
            backgroundColor: '#424242',
            color: '#e0e0e0',
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1, color: '#fff' }}>¿Desea eliminar el artículo insumo?</Typography>
              <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
                Esta acción es irreversible y el artículo quedará marcado como dado de baja.
              </Typography>
            </Grid>
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpenDelete({ open: false, id: null })}
                sx={{ mr: 2, borderColor: '#a0a0a0', color: '#a0a0a0', '&:hover': { borderColor: '#fff', color: '#fff' } }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(openDelete.id ?? "")}
              >
                Eliminar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </MuiModal>
    </Grid>
  );
}

export default InsumosTable