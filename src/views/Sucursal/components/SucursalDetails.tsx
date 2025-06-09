import {
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { format } from 'date-fns';
import { getByIdSucursal } from '../../../Api/SucursalAPI';
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa';
import { SucursalInsumo } from '../../../interfaces/SucursalInsumo';
import { deleteSucursalInsumo, getSucursalInsumosByIdSucursal } from '../../../Api/SucursalInsumoAPI';
import Modal from '../../../components/Modal';

const SucursalDetails = () => {
  const [sucursal, setSucursal] = useState<SucursalEmpresa | null>(null)
  const [insumos, setInsumos] = useState<SucursalInsumo[] | null>([])
  const [loadingSucursal, setLoadingSucursal] = useState(false)
  const [loadingInsumos, setLoadingInsumos] = useState(false)
  const [openDelete, setOpenDelete] = useState<{ open: boolean, id: String | null }>({ open: false, id: null })

  const navigate = useNavigate()

  const { id } = useParams();

  const handleDelete = async (id: String) => {
    try {
      await deleteSucursalInsumo(id);
      setOpenDelete({ open: false, id: null })
      const newInsumos = insumos?.map(insumo => insumo.id === id ? { ...insumo, baja: new Date() } : insumo)
      setInsumos(newInsumos ?? []);
    } catch (error) {
      console.error("Error deleting articulo manufacturado:", error);
    }
  }

  const getsucursal = async () => {
    if (id) {
      try {
        setLoadingSucursal(true)
        const { data } = await getByIdSucursal(id);
        setSucursal(data);
        setLoadingSucursal(false)
        setLoadingInsumos(true)
        const { data: insumos } = await getSucursalInsumosByIdSucursal(id);
        setInsumos(insumos);
        setLoadingInsumos(false)
      } catch (error) {
        console.log(error)
        setLoadingSucursal(false)
        setLoadingInsumos(false)
      }
    }
  }
  useEffect(() => {
    getsucursal();
  }, [])

  if (loadingSucursal) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando detalles de la sucursal...</Typography>
      </Box>
    );
  }

  if (!sucursal) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Sucursal no encontrada o no disponible.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/sucursales')}>
          Volver a Sucursales
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '10px' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <StoreIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0, fontWeight: 'medium' }}>
                {sucursal.nombre}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemIcon>
                  <LocationOnIcon color="action" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" color="text.secondary">
                    Dirección: <Typography component="span" variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                      {`${sucursal.domicilio?.calle || 'N/A'} ${sucursal.domicilio?.numero || ''}`
                        + (sucursal.domicilio?.localidad ? `, ${sucursal.domicilio.localidad.nombre}` : '')
                        + (sucursal.domicilio?.cp ? ` (${sucursal.domicilio.cp})` : '')}
                    </Typography>
                  </Typography>
                } />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ScheduleIcon color="action" />
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" color="text.secondary">
                    Horarios: <Typography component="span" variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
                      {`Desde: ${sucursal.horarioApertura || 'N/A'} - Hasta: ${sucursal.horarioCierre || 'N/A'}`}
                    </Typography>
                  </Typography>
                } />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center">
              <Inventory2Icon color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0, fontWeight: 'medium' }}>
                Insumos
              </Typography>
            </Box>
            {insumos && insumos.length > 0 &&
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/sucursal-insumo/crear/${sucursal.id}`)}
              >
                Agregar Insumo
              </Button>
            }
          </Box>

          {loadingInsumos ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={24} />
              <Typography variant="body1" sx={{ ml: 2 }}>Cargando insumos...</Typography>
            </Box>
          ) : insumos && insumos.length > 0 ? (
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: '8px' }}>
              <Table aria-label="tabla de insumos">
                <TableHead sx={{ bgcolor: 'grey.200' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Denominación</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Stock Actual</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Stock Mínimo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Stock Máximo</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Baja</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {insumos.map((insumo) => (
                    <TableRow key={insumo?.id?.toString() || insumo?.articuloInsumo?.id?.toString()}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {insumo?.articuloInsumo?.denominacion}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" color={insumo.stockActual <= insumo.stockMinimo ? 'error' : 'text.primary'}>
                          {insumo.stockActual.toString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{insumo.stockMinimo.toString()}</TableCell>
                      <TableCell align="right">{insumo.stockMaximo.toString()}</TableCell>
                       <TableCell component="th" scope="row" sx={{color: insumo?.baja ? 'error.light' : 'inherit',
                      }} align="center"
                      >{insumo?.baja ? format(insumo?.baja, 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                      <TableCell align="center">

                        <IconButton color="secondary" onClick={() => navigate(`/sucursal-insumo/editar/${insumo.id}`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setOpenDelete({ open: true, id: insumo?.id })}>
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
              <Typography variant="h6" color="text.secondary">
                No hay insumos registrados para esta sucursal.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/sucursal-insumo/crear/${sucursal.id}`)}
                sx={{ mt: 3 }}
              >
                Añadir Nuevo Insumo
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      <Modal open={openDelete.open} onClose={() => setOpenDelete({ open: false, id: null })} title="Eliminar Insumo">
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid size={12}>
            <Typography variant="h5">¿Desea eliminar el insumo de la sucursal?</Typography>
          </Grid>
          <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="error" onClick={() => handleDelete(openDelete.id ?? "")}>Eliminar</Button>
          </Grid>
        </Grid>
      </Modal>
    </Box>
  );
}

export default SucursalDetails