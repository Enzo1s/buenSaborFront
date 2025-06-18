import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router';
import { Cliente } from '../../../interfaces/Cliente';
import { getClienteById } from '../../../Api/ClienteAPI';

const ClienteDetails = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [cliente, setCliente] = useState<Cliente | null>(null)

    const getCliente = async () => {
        if (id) {
            const { data } = await getClienteById(id)
            setCliente(data)
        }
    }

    useEffect(() => {
        getCliente()
    }, [])
    if (!cliente) {
        return (
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
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    mt: 4
                }}
            >
                <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 2 }}>
                    Cliente no encontrado.
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/cliente')}
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
                    Volver al Listado
                </Button>
            </Paper>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3, color: '#e0e0e0' }}>
            <Grid container spacing={3} justifyContent="center">
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(30, 30, 30, 0.9)',
                            color: '#e0e0e0',
                            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <Typography
                                variant='h4'
                                component='h1'
                                sx={{ color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}
                            >
                                Detalle de Cliente
                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => navigate(`/cliente/editar/${cliente.id}`)}
                                    sx={{
                                        ml: 2,
                                        borderColor: '#FFC107',
                                        color: '#FFC107',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                            borderColor: '#FFC107',
                                        }
                                    }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => navigate('/cliente')}
                                    sx={{
                                        ml: 2,
                                        borderColor: '#90CAF9',
                                        color: '#90CAF9',
                                        '&:hover': {
                                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                            borderColor: '#90CAF9',
                                        }
                                    }}
                                >
                                    Volver
                                </Button>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Nombre y Apellido:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{cliente?.nombre} {cliente?.apellido}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Correo:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{cliente?.email}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Teléfono:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{cliente?.telefono}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Usuario:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{cliente?.usuario?.username || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Domicilio:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                    {cliente?.domicilio ?
                                        `${cliente?.domicilio.calle || ''} ${cliente?.domicilio.numero || ''}, ` +
                                        `${cliente?.domicilio.localidad?.nombre || ''} (${cliente?.domicilio.cp || ''}), ` +
                                        `${cliente?.domicilio.localidad?.provincia?.nombre || ''}, ` +
                                        `${cliente?.domicilio.localidad?.provincia?.pais?.nombre || ''}`
                                        : <Typography component="span" sx={{ fontStyle: 'italic', color: '#999' }}>Sin dirección</Typography>
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ClienteDetails