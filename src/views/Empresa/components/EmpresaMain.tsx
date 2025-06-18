import {
    Grid,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Typography,
    Modal as MuiModal, // Renombramos Modal de MUI para evitar conflicto con tu 'Modal' personalizado
    Box, // Necesario para envolver el contenido del Modal de MUI
    Paper // Para dar un fondo al contenido del Modal
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Key, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Empresa } from '../../../interfaces/Empresa'
import { deleteEmpresa, getEmpresas } from '../../../Api/EmpresaAPI'
import Modal from '../../../components/Modal';

const EmpresaMain = () => {

    const navigate = useNavigate()

    const [companies, setCompanies] = useState<Empresa[] | null>([])
    const [openDelete, setOpenDelete] = useState<{ open: boolean, id: String | null }>({ open: false, id: null })

    const getCompanies = async () => {
        const { data } = await getEmpresas()
        setCompanies(data)
    }

    const handleDelete = async (id: String) => {
        try {
            await deleteEmpresa(id as string);
            setOpenDelete({ open: false, id: null })
        } catch (error) {
            console.error("Error eliminando empresa:", error);
        }
    }

    useEffect(() => {
        getCompanies()
    }, [])

    return (
        <Grid
            container
            sx={{
                // Fondo oscuro (asegúrate de que esta imagen de fondo se defina en un nivel superior
                // o que este componente la reciba como prop/contexto para el fondo de la página completa).
                // Si solo quieres un color oscuro para esta sección, usa backgroundColor.
                // backgroundColor: '#2c2c2c', // Ejemplo de color de fondo oscuro
                // minHeight: '100vh', // Para que el fondo oscuro ocupe toda la altura de la vista
                color: '#e0e0e0', // Color de texto por defecto para todo el contenido (gris claro)
                padding: { xs: 2, md: 4 }, // Espaciado responsivo
            }}
        >
            {/* Botón para crear empresa */}
            <Grid size={12} sx={{ mb: 3 }}> {/* Margen inferior para separar del contenido de la tabla */}
                <Button
                    variant='contained'
                    color='primary' // Usará el color primario de tu tema MUI (azul por defecto)
                    onClick={() => navigate('/empresa/crear')}
                    sx={{
                        // Puedes personalizar aún más el botón si el primario no contrasta lo suficiente
                        // backgroundColor: '#4CAF50', // Ejemplo de verde vibrante
                        // '&:hover': { backgroundColor: '#45a049' },
                    }}
                >
                    Crear Empresa
                </Button>
            </Grid>

            {/* Tabla de empresas */}
            {companies && companies.length > 0 ? ( // Asegúrate de que 'companies' no sea nulo y tenga elementos
                <Grid size={12}>
                    <Table
                        sx={{
                            minWidth: 650, // Ancho mínimo para tablas grandes
                            backgroundColor: 'rgba(50, 50, 50, 0.9)', // Fondo más oscuro para la tabla con transparencia
                            borderRadius: '8px', // Bordes redondeados para la tabla
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', // Sombra para profundidad
                            overflow: 'hidden', // Asegura que los bordes redondeados se apliquen bien
                        }}
                    >
                        {/* Cabecera de la tabla */}
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(70, 70, 70, 0.95)' }}> {/* Un poco más oscuro para la cabecera */}
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nombre</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Razón Social</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>CUIT</TableCell>
                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>

                        {/* Cuerpo de la tabla */}
                        <TableBody>
                            {companies.map((company) => (
                                <TableRow
                                    key={company.id as Key} // Siempre usa un ID único como key
                                    sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: 'rgba(60, 60, 60, 0.8)', // Rayas para mejor legibilidad
                                        },
                                        '&:nth-of-type(even)': {
                                            backgroundColor: 'rgba(55, 55, 55, 0.8)',
                                        },
                                        '&:hover': {
                                            backgroundColor: 'rgba(80, 80, 80, 0.9)', // Efecto hover
                                        },
                                    }}
                                >
                                    <TableCell sx={{ color: '#e0e0e0' }}>{company.nombre}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{company.razonSocial}</TableCell>
                                    <TableCell sx={{ color: '#e0e0e0' }}>{company.cuil.toString()}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => navigate(`/empresa/ver/${company.id}`)}
                                            sx={{ '&:hover': { color: '#64B5F6' } }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => navigate(`/empresa/editar/${company.id}`)}
                                            sx={{ '&:hover': { color: '#BA68C8' } }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error" // Usará el color de error de tu tema (rojo por defecto)
                                            onClick={() => setOpenDelete({ open: true, id: company?.id })}
                                            sx={{ '&:hover': { color: '#EF5350' } }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
            ) : (
                <Grid size={12} sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" sx={{ color: '#a0a0a0' }}>
                        No hay empresas para mostrar.
                    </Typography>
                </Grid>
            )}

            {/* Modal de eliminación */}
            <MuiModal open={openDelete.open} onClose={() => setOpenDelete({ open: false, id: null })}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 400 }, // Ancho responsivo
                        bgcolor: 'background.paper', // Usa el color de fondo de papel del tema (blanco/claro por defecto)
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        backgroundColor: '#424242', // Fondo oscuro para el modal
                        color: '#e0e0e0', // Texto claro en el modal
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <Typography variant="h5" sx={{ mb: 1, color: '#fff' }}>¿Desea eliminar la empresa?</Typography>
                            <Typography variant="body1" sx={{ color: '#a0a0a0' }}>
                                Se perderán todos los datos asociados a la empresa, como sucursales, clientes, empleados y usuarios.
                            </Typography>
                        </Grid>
                        <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="outlined" // Botón de cancelar con contorno
                                color="inherit" // Usa el color de texto del padre (claro)
                                onClick={() => setOpenDelete({ open: false, id: null })}
                                sx={{ mr: 2, borderColor: '#a0a0a0', color: '#a0a0a0', '&:hover': { borderColor: '#fff', color: '#fff' } }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="error" // Botón de eliminar rojo
                                onClick={() => handleDelete(openDelete.id ?? "")}
                            >
                                Eliminar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </MuiModal>
        </Grid>
    )
}

export default EmpresaMain