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
import { useEffect, useState } from 'react'
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'
import { deleteArticuloManufacturadoById, getAllArticuloManufacturado } from '../../../Api/ArticuloManufacturadoAPI'
import { useNavigate } from 'react-router'

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
    <Grid
            container
            sx={{
                color: '#e0e0e0',
                padding: { xs: 2, md: 4 },
            }}
        >
            {/* Título de la Vista */}
            <Grid size={12} sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Listado de Artículos Manufacturados
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
                        '& .MuiInputBase-input': { color: '#e0e0e0' },
                        '& .MuiInputLabel-root': {
                            color: '#a0a0a0',
                            '&.Mui-focused': { color: '#fff' },
                            '&.MuiFormLabel-filled': { color: '#fff' },
                        },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9', borderWidth: '2px' },
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/articulo-manufacturado/crear")}
                    sx={{
                        minWidth: { xs: '100%', sm: 'auto' },
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                    }}
                >
                    Crear Artículo Manufacturado
                </Button>
            </Grid>

            {/* Tabla de Artículos Manufacturados */}
            {aManufacturados && aManufacturados.length > 0 ? (
                <Grid size={12}>
                    <Table
                        sx={{
                            minWidth: 1000,
                            backgroundColor: 'rgba(50, 50, 50, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                            overflow: 'hidden',
                        }}
                    >
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(70, 70, 70, 0.95)' }}>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Denominación</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Precio Costo</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Precio Venta</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tiempo Est. (min)</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Descripción</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Insumos</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Categoría</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Estado (Baja)</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aManufacturados.map((aManufacturado) => (
                                <TableRow
                                    key={aManufacturado.id}
                                    sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(60, 60, 60, 0.8)' },
                                        '&:nth-of-type(even)': { backgroundColor: 'rgba(55, 55, 55, 0.8)' },
                                        '&:hover': { backgroundColor: 'rgba(80, 80, 80, 0.9)' },
                                        opacity: aManufacturado.baja ? 0.6 : 1,
                                        fontStyle: aManufacturado.baja ? 'italic' : 'normal',
                                    }}
                                >
                                    <TableCell sx={{ color: '#e0e0e0' }}>{aManufacturado.denominacion}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{`$${aManufacturado.precioCosto.toFixed(2)}`}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{`$${aManufacturado.precioVenta.toFixed(2)}`}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{aManufacturado.tiempoEstimado.toFixed(2)} Minutos</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {aManufacturado.descripcion}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {aManufacturado.articuloManufacturadoDetalle.map((detalle) => detalle.articuloInsumo?.denominacion).join(', ') || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{aManufacturado.categoriaArticuloManufacturado?.denominacion || 'N/A'}</TableCell>
                                    <TableCell sx={{ color: aManufacturado.baja ? '#EF9A9A' : '#A5D6A7' }}>
                                        {aManufacturado.baja ? 'Dada de Baja' : 'Activo'}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/articulo-manufacturado/ver/${aManufacturado.id}`)}
                                            sx={{ '&:hover': { color: '#64B5F6' } }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => navigate(`/articulo-manufacturado/editar/${aManufacturado.id}`)}
                                            sx={{ '&:hover': { color: '#BA68C8' } }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => setOpenDelete({ open: true, id: aManufacturado?.id })}
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
                <Grid size={12} sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" sx={{ color: '#a0a0a0' }}>
                        No hay artículos manufacturados para mostrar.
                    </Typography>
                </Grid>
            )}

            {/* Modal de Eliminación */}
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
                            <Typography variant="h5" sx={{ mb: 1, color: '#fff' }}>¿Desea eliminar el artículo manufacturado?</Typography>
                            <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
                                Esta acción lo marcará como dado de baja en el sistema.
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
  )
}

export default ManufacturadoTable