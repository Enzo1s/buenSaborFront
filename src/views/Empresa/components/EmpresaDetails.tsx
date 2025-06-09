import { useEffect, useState } from 'react'
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
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={4}>
        <Grid size={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '10px' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <BusinessIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
                {empresa?.nombre}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{xs:12, sm: 6}} >
                <Box display="flex" alignItems="center">
                  <AccountBalanceIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    Razón Social: <Typography component="span" variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>{empresa?.razonSocial}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{xs:12, sm: 6}}>
                <Box display="flex" alignItems="center">
                  <FingerprintIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    CUIL: <Typography component="span" variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>{empresa?.cuil.toString()}</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 2, mb: 3, fontWeight: 'medium' }}>
            Sucursales
          </Typography>
          <Grid container spacing={3}>
            {empresa?.sucursalEmpresa && empresa?.sucursalEmpresa.length > 0 ? (
              empresa?.sucursalEmpresa.map((sucursal, index) => (
                <Grid size={{xs:12, sm: 6}} key={sucursal.id?.toString() || index}> 
                  <Card elevation={2} sx={{ borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOnIcon color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="h5" component="h3" gutterBottom>
                          {sucursal.nombre}
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        <Box display="flex" alignItems="flex-start" mt={1}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                            <span>
                                {`${sucursal.domicilio?.calle || ''} ${sucursal.domicilio?.numero || ''}, `}
                                {`${sucursal.domicilio?.localidad?.nombre || ''}, `}
                                {`${sucursal.domicilio?.localidad?.provincia?.nombre || ''}, `}
                                {`${sucursal.domicilio?.localidad?.provincia?.pais?.nombre || ''}`}
                                {` (${sucursal.domicilio?.cp || ''})`}
                            </span>
                        </Box>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Box display="flex" alignItems="center">
                            <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                            {`Horario: ${sucursal.horarioApertura || 'N/A'} - ${sucursal.horarioCierre || 'N/A'}`}
                        </Box>
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => sucursal.id && navigate(`/sucursal/ver/${sucursal.id}`)}
                        disabled={!sucursal.id}
                      >
                        Ver Sucursal
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
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