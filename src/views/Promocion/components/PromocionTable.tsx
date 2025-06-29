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
    <Box sx={{ p: 3, color: '#e0e0e0'}}> 
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" sx={{ color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
          Listado de Promociones
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/promocion/crear')}
           sx={{
            backgroundColor: '#4CAF50', // Verde vibrante
            '&:hover': {
              backgroundColor: '#388E3C', // Verde más oscuro al pasar el ratón
            },
            color: '#ffffff', // Texto blanco para contraste
            px: 3, // Padding horizontal
            py: 1.2, // Padding vertical
            borderRadius: '8px', // Bordes redondeados
          }}
        >
          Crear Promoción
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#90CAF9' }} />
          <Typography variant="h6" sx={{ ml: 2, mt: 2, color: '#b0b0b0' }}>Cargando promociones...</Typography>
        </Box>
      ) : promociones && promociones.length > 0 ? (
        <TableContainer
                            component={Paper}
                            elevation={6}
                            sx={{
            borderRadius: '12px', // Bordes más redondeados
            backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fondo semi-transparente oscuro
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)', // Sombra profunda
            backdropFilter: 'blur(5px)', // Efecto de desenfoque
            border: '1px solid rgba(255, 255, 255, 0.1)', // Borde sutil
            overflow: 'hidden', // Asegura que el border radius se aplique a todo el contenido
          }}
                        >
          <Table aria-label="tabla de promociones">
            <TableHead sx={{ backgroundColor: 'rgba(50, 50, 50, 0.9)' }}>
              <TableRow>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444'  }}>Nombre</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444'  }}>fechaDesde</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444'  }}>fechaHasta</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444'  }}>Descuento</TableCell>
                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' , width: '150px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promociones.map((promocion) => (
                <TableRow
                  key={promocion?.id?.toString() || `temp-${promocion.denominacion}`} 
                  sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(40, 40, 40, 0.8)' },
                                        '&:nth-of-type(even)': { backgroundColor: 'rgba(35, 35, 35, 0.8)' },
                                        '&:hover': { backgroundColor: 'rgba(60, 60, 60, 0.9) !important' },
                                        transition: 'background-color 0.3s ease',
                                    }}
                >
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>{promocion.denominacion}</TableCell>
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                    {promocion.fechaDesde ? format(promocion.fechaDesde, 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                    {promocion.fechaHasta ? format(promocion.fechaHasta, 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                    {promocion.descuento ? `${promocion.descuento}%` : 'N/A'}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #333' }}>
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
        <Paper elevation={2} sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            color: '#e0e0e0',
            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
          <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 2 }}>
            No hay promociones registradas. ¡Crea la primera!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/promocion/crear')}
            sx={{
              mt: 3,
              backgroundColor: '#FFA726', // Un naranja vibrante
              '&:hover': {
                backgroundColor: '#FB8C00', // Naranja más oscuro al pasar el ratón
              },
              color: '#ffffff',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
            }}
          >
            Añadir Nueva Promoción
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default PromocionTable