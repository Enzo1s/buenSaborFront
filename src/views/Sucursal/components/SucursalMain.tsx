import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Modal as MuiModal,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react'
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa'
import { deleteSucursal, getSucursales } from '../../../Api/SucursalAPI'
import { useNavigate } from 'react-router';

const SucursalMain = () => {

    const [sucursales, setSucursales] = useState<SucursalEmpresa[] | null> ([])
    const [loading, setLoading] = useState(false)
    const [openDelete, setOpenDelete] = useState<{ open: boolean, id: string | null }>({ open: false, id: null })

    const navigate = useNavigate()

    const listadoSucursales = async () => {
        setLoading(true)
        const { data } = await getSucursales()
        setSucursales(data)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        try {
          await deleteSucursal(id);
          setOpenDelete({ open: false, id: null })
        } catch (error) {
          console.error("Error deleting sucursal:", error);
        }
      }

    useEffect(() => {
      listadoSucursales()
    }, [])
    
    
  return (
     <Box
            sx={{
                p: { xs: 2, md: 4 }, // Responsive padding
                minHeight: '100vh',
                color: '#e0e0e0', // Default text color for the page
                // Assuming the dark background image is applied to a parent component or body
            }}
        >
            {/* Header Section */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4} // Increased margin-bottom for spacing
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#90CAF9', // Light blue for prominent title
                        textShadow: '2px 2px 5px rgba(0,0,0,0.8)', // Stronger text shadow
                    }}
                >
                    Listado de Sucursales
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#4CAF50', // Green for create button
                        '&:hover': { backgroundColor: '#388E3C' },
                        color: '#ffffff',
                        px: 3,
                        py: 1.2,
                        borderRadius: '8px',
                        textTransform: 'none', // Keep original casing
                        fontSize: '1rem',
                    }}
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/sucursal/crear')}
                >
                    Crear Nueva Sucursal
                </Button>
            </Box>

            {/* Loading State */}
            {loading ? (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 6,
                    minHeight: '50vh', // Ensure it takes up enough space
                    backgroundColor: 'rgba(25, 25, 25, 0.8)', // Semi-transparent dark background
                    borderRadius: '12px',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                }}>
                    <CircularProgress sx={{ color: '#90CAF9', mb: 2 }} size={60} thickness={5} />
                    <Typography variant="h6" sx={{ ml: 2, color: '#f0f0f0' }}>Cargando sucursales...</Typography>
                </Box>
            ) : sucursales && sucursales.length > 0 ? (
                /* Data Table */
                <TableContainer
                    component={Paper}
                    elevation={8} // Increased elevation for table
                    sx={{
                        borderRadius: '12px', // More rounded corners
                        backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark background for the table
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)', // Deeper shadow
                        border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
                        overflow: 'hidden', // Ensures rounded corners apply to children
                    }}
                >
                    <Table aria-label="tabla de sucursales">
                        <TableHead sx={{ bgcolor: 'rgba(40, 40, 40, 0.95)' }}> {/* Slightly lighter dark for header */}
                            <TableRow>
                                <TableCell sx={{ color: '#90CAF9', fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Nombre</TableCell>
                                <TableCell sx={{ color: '#90CAF9', fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Dirección</TableCell>
                                <TableCell sx={{ color: '#90CAF9', fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Horarios</TableCell>
                                <TableCell sx={{ color: '#90CAF9', fontWeight: 'bold', fontSize: '1rem', width: '180px', borderBottom: '1px solid rgba(255,255,255,0.2)' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sucursales.map((sucursal) => (
                                <TableRow
                                    key={sucursal?.id?.toString() || `temp-${sucursal.nombre}`}
                                    sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(45, 45, 45, 0.8)' }, // Darker alternating rows
                                        '&:nth-of-type(even)': { backgroundColor: 'rgba(35, 35, 35, 0.8)' }, // Even darker alternating rows
                                        '&:hover': { backgroundColor: 'rgba(60, 60, 60, 0.9) !important' }, // Hover effect
                                        borderBottom: '1px solid rgba(255,255,255,0.05)', // Subtle row separator
                                    }}
                                >
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: 'none' }}>{sucursal.nombre}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: 'none' }}>
                                        {sucursal.domicilio ?
                                            `${sucursal.domicilio.calle || ''} ${sucursal.domicilio.numero || ''}, ` +
                                            `${sucursal.domicilio.localidad?.nombre || ''} (${sucursal.domicilio.cp || ''})`
                                            : <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#b0b0b0' }}>Sin dirección</Typography>
                                        }
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: 'none' }}>
                                        {`Desde: ${sucursal.horarioApertura || 'N/A'} - Hasta: ${sucursal.horarioCierre || 'N/A'}`}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <IconButton
                                                aria-label="ver"
                                                onClick={() => sucursal.id && navigate(`/sucursal/ver/${sucursal.id}`)}
                                                disabled={!sucursal.id}
                                                sx={{ color: '#90CAF9', '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' } }}
                                                title="Ver detalles"
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                aria-label="editar"
                                                onClick={() => sucursal.id && navigate(`/sucursal/editar/${sucursal.id}`)}
                                                disabled={!sucursal.id}
                                                sx={{ color: '#FFB74D', '&:hover': { backgroundColor: 'rgba(255, 183, 77, 0.1)' } }}
                                                title="Editar sucursal"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                aria-label="eliminar"
                                                onClick={() => sucursal.id && handleDelete(sucursal.id as string)}
                                                disabled={!sucursal.id}
                                                sx={{ color: '#EF5350', '&:hover': { backgroundColor: 'rgba(239, 83, 80, 0.1)' } }}
                                                title="Eliminar sucursal"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                /* No Data State */
                <Paper
                    elevation={6}
                    sx={{
                        p: 6, // Increased padding
                        textAlign: 'center',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(25, 25, 25, 0.9)', // Dark background for no data state
                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 2 }}>
                        No hay sucursales registradas.
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
                        ¡Parece que no se ha añadido ninguna sucursal aún!
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#2196F3', // Info blue for adding first item
                            '&:hover': { backgroundColor: '#1976D2' },
                            color: '#ffffff',
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontSize: '1rem',
                        }}
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/sucursal/crear')}
                    >
                        Añadir Nueva Sucursal
                    </Button>
                </Paper>
            )}
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
                          <Typography variant="h5" sx={{ mb: 1, color: '#fff' }}>¿Desea eliminar la sucursal?</Typography>
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
        </Box>
  );
}

export default SucursalMain