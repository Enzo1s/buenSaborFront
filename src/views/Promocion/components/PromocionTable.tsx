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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Promocion } from '../../../interfaces/Promocion'
import { getPromociones } from '../../../Api/PromocionAPI'
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

const PromocionTable = () => {

    const navigate = useNavigate()
    const [promociones, setPromociones] = useState<Promocion[] | null>([])
    const [loading, setLoading] = useState(false)

    const listadoPromociones = async () => {
        setLoading(true)
        const { data } = await getPromociones()
        setPromociones(data)
        setLoading(false)
    }

    useEffect(() => {
        listadoPromociones()
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
          Listado de Promociones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/promocion/crear')}
        >
          Crear Promoción
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Cargando promociones...</Typography>
        </Box>
      ) : promociones && promociones.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px' }}>
          <Table aria-label="tabla de promociones">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>fechaDesde</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>fechaHasta</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descuento</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '150px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promociones.map((promocion) => (
                <TableRow
                  key={promocion?.id?.toString() || `temp-${promocion.denominacion}`} 
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }} 
                >
                  <TableCell>{promocion.denominacion}</TableCell>
                  <TableCell>
                    {promocion.fechaDesde ? format(promocion.fechaDesde, 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {promocion.fechaHasta ? format(promocion.fechaHasta, 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {promocion.descuento ? `${promocion.descuento}%` : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => promocion.id && navigate(`/promocion/ver/${promocion.id}`)}
                      disabled={!promocion.id} 
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
            No hay promociones registradas. ¡Crea la primera!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/promocion/crear')}
            sx={{ mt: 3 }}
          >
            Añadir Nueva Promoción
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default PromocionTable