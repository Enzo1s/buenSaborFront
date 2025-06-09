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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react'
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa'
import { getSucursales } from '../../../Api/SucursalAPI'
import { useNavigate } from 'react-router';

const SucursalMain = () => {

    const [sucursales, setSucursales] = useState<SucursalEmpresa[] | null> ([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const listadoSucursales = async () => {
        setLoading(true)
        const { data } = await getSucursales()
        setSucursales(data)
        setLoading(false)
    }

    useEffect(() => {
      listadoSucursales()
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
          Listado de Sucursales
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/sucursal/crear')}
        >
          Crear Sucursal
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Cargando sucursales...</Typography>
        </Box>
      ) : sucursales && sucursales.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px' }}>
          <Table aria-label="tabla de sucursales">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dirección</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Horarios</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '150px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sucursales.map((sucursal) => (
                <TableRow
                  key={sucursal?.id?.toString() || `temp-${sucursal.nombre}`} 
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }} 
                >
                  <TableCell>{sucursal.nombre}</TableCell>
                  <TableCell>
                    {sucursal.domicilio ?
                      `${sucursal.domicilio.calle || ''} ${sucursal.domicilio.numero || ''}, ` +
                      `${sucursal.domicilio.localidad?.nombre || ''} (${sucursal.domicilio.cp || ''})`
                      : 'Sin dirección'
                    }
                  </TableCell>
                  <TableCell>
                    {`Desde: ${sucursal.horarioApertura || 'N/A'} - Hasta: ${sucursal.horarioCierre || 'N/A'}`}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => sucursal.id && navigate(`/sucursal/ver/${sucursal.id}`)}
                      disabled={!sucursal.id} 
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            No hay sucursales registradas. ¡Crea la primera!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/sucursal/crear')}
            sx={{ mt: 3 }}
          >
            Añadir Nueva Sucursal
          </Button>
        </Paper>
      )}
    </Box>
  );
}

export default SucursalMain