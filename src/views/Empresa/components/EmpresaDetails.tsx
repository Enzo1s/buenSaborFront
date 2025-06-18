import { Key, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Empresa } from '../../../interfaces/Empresa'
import { getByIdEmpresa } from '../../../Api/EmpresaAPI'
import {
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; 
import FingerprintIcon from '@mui/icons-material/Fingerprint'; 

const EmpresaDetails = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [empresa, setEmpresa] = useState<Empresa | null>(null)

    const getCompany = async () => {
      if(id) {
        const { data } = await getByIdEmpresa(id)
        setEmpresa(data)
      }
    }

    useEffect(() => {
        getCompany()
    }, [])
    

  return (
    <Box
            sx={{
                flexGrow: 1,
                p: { xs: 2, md: 4 },
                color: '#e0e0e0',
                minHeight: '100vh',
            }}
        >
            <Grid container spacing={4}>
                {/* Sección de Detalles de la Empresa */}
                <Grid size={12}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: '12px',
                            backgroundColor: 'rgba(35, 35, 35, 0.95)', // Fondo oscuro para la tarjeta
                            color: '#e0e0e0', // Texto claro
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)', // Sombra más pronunciada
                            border: '1px solid rgba(70, 70, 70, 0.5)' // Borde sutil
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={2}>
                            <BusinessIcon color="primary" sx={{ mr: 2, fontSize: { xs: 32, md: 48 } }} /> {/* Icono más grande y responsivo */}
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{ mb: 0, color: '#90CAF9', fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }} // Color primario para el título, responsivo
                            >
                                {empresa?.nombre}
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3, borderColor: 'rgba(100, 100, 100, 0.5)' }} /> {/* Separador más notorio */}

                        <Grid container spacing={3}> {/* Aumentado el spacing */}
                            <Grid size={{xs:12, sm:6}}>
                                <Box display="flex" alignItems="center">
                                    <AccountBalanceIcon color="info" sx={{ mr: 1.5, fontSize: 24 }} /> {/* Color info para un contraste azul */}
                                    <Typography variant="h6" sx={{ color: '#a0a0a0' }}> {/* Texto secundario más tenue */}
                                        Razón Social:{' '}
                                        <Typography component="span" variant="h6" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>
                                            {empresa?.razonSocial}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid size={{xs:12, sm:6}}>
                                <Box display="flex" alignItems="center">
                                    <FingerprintIcon color="info" sx={{ mr: 1.5, fontSize: 24 }} />
                                    <Typography variant="h6" sx={{ color: '#a0a0a0' }}>
                                        CUIL:{' '}
                                        <Typography component="span" variant="h6" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>
                                            {empresa?.cuil.toString()}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Sección de Sucursales */}
                <Grid size={12}>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            mt: { xs: 3, md: 4 },
                            mb: 3,
                            fontWeight: 'medium',
                            color: '#fff',
                            borderBottom: '2px solid #90CAF9',
                            pb: 1
                        }}
                    >
                        Sucursales
                    </Typography>
                    <Grid container spacing={3}> {/* Espaciado consistente */}
                        {empresa?.sucursalEmpresa && empresa?.sucursalEmpresa.length > 0 ? (
                            empresa?.sucursalEmpresa.map((sucursal) => (
                                <Grid size={{xs:12, sm:6, md:4}} key={sucursal.id as Key}> {/* Grids responsivos para 2 o 3 columnas */}
                                    <Card
                                        elevation={4} // Elevación para la tarjeta
                                        sx={{
                                            borderRadius: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            backgroundColor: 'rgba(50, 50, 50, 0.9)', // Fondo oscuro para la tarjeta de sucursal
                                            color: '#e0e0e0', // Texto claro
                                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-5px)', // Efecto de elevación al hover
                                                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)', // Sombra más grande al hover
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Box display="flex" alignItems="center" mb={1.5}>
                                                <LocationOnIcon color="secondary" sx={{ mr: 1.5, fontSize: 28 }} /> {/* Icono más grande */}
                                                <Typography variant="h5" component="h3" gutterBottom sx={{ color: '#CE93D8', fontWeight: 'bold' }}> {/* Color secundario para el nombre de sucursal */}
                                                    {sucursal.nombre}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{ mb: 1, color: '#a0a0a0' }}>
                                                <Box display="flex" alignItems="flex-start" mt={1}>
                                                    <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.5, color: '#b0b0b0' }} /> {/* Icono de dirección un poco más oscuro */}
                                                    <span>
                                                        {`${sucursal.domicilio?.calle || ''} ${sucursal.domicilio?.numero || ''}, `}
                                                        {`${sucursal.domicilio?.localidad?.nombre || ''}, `}
                                                        {`${sucursal.domicilio?.localidad?.provincia?.nombre || ''}, `}
                                                        {`${sucursal.domicilio?.localidad?.provincia?.pais?.nombre || ''}`}
                                                        {` (${sucursal.domicilio?.cp || ''})`}
                                                    </span>
                                                </Box>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}> {/* Texto horario un poco más tenue */}
                                                <Box display="flex" alignItems="center">
                                                    <ScheduleIcon fontSize="small" sx={{ mr: 1, color: '#b0b0b0' }} />
                                                    {`Horario: ${sucursal.horarioApertura || 'N/A'} - ${sucursal.horarioCierre || 'N/A'}`}
                                                </Box>
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end', p: 2, borderTop: '1px solid rgba(80, 80, 80, 0.5)' }}> {/* Separador en footer de card */}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => sucursal.id && navigate(`/sucursal/ver/${sucursal.id}`)}
                                                disabled={!sucursal.id}
                                                sx={{
                                                    px: 3, // Padding horizontal
                                                    py: 1, // Padding vertical
                                                    fontWeight: 'bold',
                                                    '&:hover': {
                                                        backgroundColor: '#64B5F6', // Tono más claro al hover
                                                    },
                                                }}
                                            >
                                                Ver Sucursal
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid size={12}>
                                <Paper
                                    elevation={2} // Mayor elevación para el mensaje de no sucursales
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(50, 50, 50, 0.9)',
                                        color: '#a0a0a0',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <Typography variant="h6">
                                        No hay sucursales registradas para esta empresa.
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
  )
}

export default EmpresaDetails