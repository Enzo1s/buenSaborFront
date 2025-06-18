import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton, // Import IconButton
  Modal,      // Import Modal (assuming you have a custom Modal component or MUI Dialog)
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEmpleado, getEmpleados } from '../../../Api/EmpleadoAPI'
import { Empleado } from '../../../interfaces/Empleado';
import { useNavigate } from 'react-router';

const EmpleadoTable = () => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [empleados, setEmpleados] = useState<Empleado[] | null>([])
    const [openDelete, setOpenDelete] = useState<{open: boolean, id: string | null}>({open: false, id: null})

    const listadoEmpleados = async () => {
        try {
            setLoading(true)
            const { data } = await getEmpleados()
            setEmpleados(data)
            setLoading(false)
        }
        catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

      const handleDelete = async (id: string) => {
        try {
          await deleteEmpleado(id);
          setOpenDelete({open: false, id: null})
        } catch (error) {
          console.error("Error deleting empleado:", error);
        }
      }

    useEffect(() => {
        listadoEmpleados()
    }, [])

    return (
        <Box sx={{ p: 3, color: '#e0e0e0' }}> {/* Establece un color de texto por defecto para todo el Box */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" sx={{ color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
          Listado de Empleados
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/empleado/crear')}
          sx={{
            backgroundColor: '#4CAF50', // Verde vibrante
            '&:hover': {
              backgroundColor: '#388E3C', // Verde más oscuro al pasar el ratón
            },
            color: '#ffffff', // Texto blanco para contraste
            px: 3,
            py: 1.2,
            borderRadius: '8px',
          }}
        >
          Crear Empleado
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#90CAF9' }} />
          <Typography variant="h6" sx={{ ml: 2, mt: 2, color: '#b0b0b0' }}>Cargando empleados...</Typography>
        </Box>
      ) : empleados && empleados.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={6}
          sx={{
            borderRadius: '12px',
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Table aria-label="tabla de empleados">
            <TableHead sx={{ backgroundColor: 'rgba(50, 50, 50, 0.9)' }}>
              <TableRow>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Nombre y Apellido</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Teléfono</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Email</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>usuario</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', width: '150px', borderBottom: '1px solid #444' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.map((empleado) => (
                <TableRow
                  key={empleado?.id?.toString() || `temp-${empleado.nombre}`}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'rgba(40, 40, 40, 0.8)' },
                    '&:nth-of-type(even)': { backgroundColor: 'rgba(35, 35, 35, 0.8)' },
                    '&:hover': { backgroundColor: 'rgba(60, 60, 60, 0.9) !important' },
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>{`${empleado.nombre} ${empleado.apellido}`}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                    {empleado.telefono || <Typography component="span" sx={{ fontStyle: 'italic', color: '#999' }}>No disponible</Typography>}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                    {empleado.email || <Typography component="span" sx={{ fontStyle: 'italic', color: '#999' }}>No disponible</Typography>}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                    {empleado.usuario ? empleado.usuario.username : <Typography component="span" sx={{ fontStyle: 'italic', color: '#999' }}>No disponible</Typography>}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #333' }}>
                    <IconButton
                      aria-label="ver"
                      onClick={() => navigate(`/empleado/ver/${empleado.id}`)}
                      sx={{ color: '#90CAF9', '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      aria-label="editar"
                      onClick={() => navigate(`/empleado/editar/${empleado.id}`)}
                      sx={{ color: '#FFC107', '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="eliminar"
                      onClick={() => setOpenDelete({ open: true, id: empleado?.id })}
                      sx={{ color: '#EF5350', '&:hover': { backgroundColor: 'rgba(239, 83, 80, 0.1)' } }} // Rojo para eliminar
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          elevation={6}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            color: '#e0e0e0',
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 2 }}>
            No hay empleados registrados. ¡Crea el primero!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/empleado/crear')}
            sx={{
              mt: 3,
              backgroundColor: '#FFA726',
              '&:hover': {
                backgroundColor: '#FB8C00',
              },
              color: '#ffffff',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
            }}
          >
            Añadir Nuevo Empleado
          </Button>
        </Paper>
      )}

      {/* Modal for Delete Confirmation */}
      <Modal
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, id: null })}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={10} // Mayor elevación para el modal
          sx={{
            p: 4,
            borderRadius: '12px',
            backgroundColor: 'rgba(40, 40, 40, 0.95)', // Fondo más oscuro para el modal
            color: '#e0e0e0',
            boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.6)', // Sombra más intensa
            backdropFilter: 'blur(8px)', // Más desenfoque
            border: '1px solid rgba(255, 255, 255, 0.15)',
            maxWidth: '400px', // Ancho máximo
            width: '90%', // Ancho responsivo
          }}
        >
          <Typography variant="h5" id="delete-modal-title" gutterBottom sx={{ color: '#f0f0f0', mb: 3 }}>
            ¿Desea eliminar el empleado?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDelete({ open: false, id: null })}
              sx={{
                borderColor: '#90CAF9',
                color: '#90CAF9',
                '&:hover': {
                  backgroundColor: 'rgba(144, 202, 249, 0.1)',
                  borderColor: '#90CAF9',
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(openDelete.id ?? '')}
              sx={{
                backgroundColor: '#EF5350', // Rojo para la acción peligrosa
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
                color: '#ffffff',
              }}
            >
              Eliminar
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
    )
}

export default EmpleadoTable