import { useEffect, useState } from 'react'
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
    Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEmpleado, getEmpleados } from '../../../Api/EmpleadoAPI'
import { Empleado } from '../../../interfaces/Empleado';
import { useNavigate } from 'react-router';
import Modal from '../../../components/Modal';

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
        <Box sx={{ p: 3 }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" component="h1">
                    Listado de Empleados
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/empleado/crear')}
                >
                    Crear Empleado
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ ml: 2 }}>Cargando empleados...</Typography>
                </Box>
            ) : empleados && empleados.length > 0 ? (
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px' }}>
                    <Table aria-label="tabla de empleados">
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre y Apellido</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Telefono</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Perfil</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '150px' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {empleados.map((empleado) => (
                                <TableRow
                                    key={empleado?.id?.toString() || `temp-${empleado.nombre}`}
                                    sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                                >
                                    <TableCell>{`${empleado.nombre} ${empleado.apellido}`}</TableCell>
                                    <TableCell>
                                        {empleado.telefono || 'No disponible'}
                                    </TableCell>
                                    <TableCell>
                                        {empleado.email || 'No disponible'}
                                    </TableCell>
                                    <TableCell>
                                        {empleado.perfil ? empleado.perfil?.charAt(0).toUpperCase() + empleado.perfil?.slice(1).toLowerCase() : 'No disponible'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => navigate(`/empleado/ver/${empleado.id}`)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => navigate(`/empleado/editar/${empleado.id}`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => setOpenDelete({ open: true, id: empleado?.id })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">
                        No hay empleados registrads. ¡Crea el primero!
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/empleado/crear')}
                        sx={{ mt: 3 }}
                    >
                        Añadir Nuevo empleado
                    </Button>
                </Paper>
            )}
            <Modal open={openDelete.open} onClose={() => setOpenDelete({open:false, id: null})} title="Crear Categoria">
                        <Grid container spacing={2} sx={{ padding: 2 }}>
                          <Grid size={12}>
                            <Typography variant="h5">¿Desea eliminar el empleado?</Typography>
                          </Grid>
                          <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="error" onClick={() => handleDelete(openDelete.id ?? "")}>Eliminar</Button>
                          </Grid>
                        </Grid>
                        </Modal>
        </Box>
    )
}

export default EmpleadoTable