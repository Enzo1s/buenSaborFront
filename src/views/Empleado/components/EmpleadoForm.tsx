import { useEffect, useState } from 'react'
import { Empleado } from '../../../interfaces/Empleado'
import { useNavigate, useParams } from 'react-router'
import { createEmpleado, getByIdEmpleado } from '../../../Api/EmpleadoAPI'
import {
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Formik } from 'formik'
import { createUser, updateUser } from '../../../Api/UsuarioAPI'
import { Usuario } from '../../../interfaces/Usuario'
import { Rol } from '../../../enums/Rol'
import { Cargo } from '../../../enums/Cargo'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EmpleadoForm = () => {
    const [empleado, setEmpleado] = useState<Empleado | null>(null)

    const { id } = useParams();
    const navigate = useNavigate()

    const getEmpleado = async () => {
        if (id) {
            const { data } = await getByIdEmpleado(id)
            setEmpleado(data)
        }
    }

    useEffect(() => {
        getEmpleado()
    }, [])

    return (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    borderRadius: '12px',
                    width: '90%',
                    maxWidth: '800px',
                    margin: 'auto',
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    color: '#e0e0e0',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Typography
                    variant='h4'
                    component='h1'
                    gutterBottom
                    align='center'
                    sx={{
                        mb: 3,
                        color: '#f0f0f0', // Título más claro
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' // Sombra de texto para el título
                    }}
                >
                    {id ? 'Editar Empleado' : 'Crear Empleado'}
                </Typography>
                <Formik
                    enableReinitialize
                        initialValues={{
                            id: empleado?.id || null,
                            nombre: empleado?.nombre || "",
                            apellido: empleado?.apellido || "",
                            telefono: empleado?.telefono || "",
                            email: empleado?.email || "",
                            usuario: empleado?.usuario || null,
                            perfil: empleado?.perfil || null,
                            username: empleado?.usuario?.username || "",
                            password: "",
                            alta: null,
                            baja: null,
                            modificacion: null,
                            cargo: empleado?.cargo || null
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const nuevoEmpleado: Empleado = {
                                id: values?.id || null,
                                nombre: values?.nombre,
                                apellido: values?.apellido,
                                telefono: values?.telefono,
                                email: values?.email,
                                usuario: values?.usuario,
                                perfil: values?.perfil?.toUpperCase() || 'EMPLEADO',
                                alta: null,
                                baja: null,
                                modificacion: null,
                                cargo: values.cargo
                            }
                            try {
                                if (empleado) {
                                    const { data } = await updateUser({ ...empleado.usuario, username: values.username, password: values.password } as Usuario)
                                    nuevoEmpleado.usuario = data
                                } else {
                                    const { data } = await createUser({
                                        username: values.username as string,
                                        password: values.password as string,
                                        rol: Object.keys(Rol).find(k => Rol[k as keyof typeof Rol] === 'Empleado'),
                                        alta: null,
                                        baja: null,
                                        modificacion: null
                                    } as Usuario)
                                    nuevoEmpleado.usuario = data
                                }
                                await createEmpleado(nuevoEmpleado)
                                setSubmitting(false);
                                navigate("/empleado")
                            } catch (error) {
                                alert(error);
                                setSubmitting(false);
                            }
                        }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        errors
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid size={{xs:12, sm:6}}> {/* Usar 'item' para los hijos de Grid container */}
                                    <TextField
                                        fullWidth
                                        id="nombre"
                                        name="nombre"
                                        label="Nombre"
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.nombre}
                                        error={touched.nombre && Boolean(errors.nombre)}
                                        helperText={touched.nombre && errors.nombre}
                                        InputLabelProps={{ style: { color: '#b0b0b0' } }} // Color del label
                                        InputProps={{
                                            style: { color: '#ffffff' }, // Color del texto ingresado
                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } } // Color del borde
                                        }}
                                        sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }} // Color del helper text
                                    />
                                </Grid>
                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="apellido"
                                        name="apellido"
                                        label="Apellido"
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.apellido}
                                        error={touched.apellido && Boolean(errors.apellido)}
                                        helperText={touched.apellido && errors.apellido}
                                        InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                        InputProps={{
                                            style: { color: '#ffffff' },
                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                        }}
                                        sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="telefono"
                                        name="telefono"
                                        label="Teléfono"
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.telefono}
                                        error={touched.telefono && Boolean(errors.telefono)}
                                        helperText={touched.telefono && errors.telefono}
                                        InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                        InputProps={{
                                            style: { color: '#ffffff' },
                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                        }}
                                        sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                        InputProps={{
                                            style: { color: '#ffffff' },
                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                        }}
                                        sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                    />
                                </Grid>

                                <Grid size={{xs:12, sm:6}}>
                                    <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                        <InputLabel id="cargo-label" style={{ color: '#b0b0b0' }}>Cargo</InputLabel>
                                        <Select
                                            labelId="cargo-label"
                                            id="cargo"
                                            name="cargo"
                                            value={values.cargo || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Cargo"
                                            style={{ color: '#ffffff' }}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9' }
                                            }}
                                        >
                                            <MenuItem value=""><em>Sin asignar</em></MenuItem>
                                            <MenuItem value="CAJERO">Cajero</MenuItem>
                                            <MenuItem value="COCINERO">Cocinero</MenuItem>
                                            <MenuItem value="DELIVERY">Delivery</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="username"
                                        name="username"
                                        label="Nombre de Usuario"
                                        variant="outlined"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        error={touched.username && Boolean(errors.username)}
                                        helperText={touched.username && errors.username}
                                        InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                        InputProps={{
                                            style: { color: '#ffffff' },
                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                        }}
                                        sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                    />
                                </Grid>

                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Contraseña"
                                        variant="outlined"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required={!id} // Contraseña requerida solo al crear un nuevo empleado
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                        InputProps={{
                                            style: { color: '#ffffff' },
                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                        }}
                                        sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                    />
                                </Grid>

                                <Grid size={12} sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        sx={{
                                            px: 5,
                                            py: 1.5,
                                            backgroundColor: '#4CAF50',
                                            '&:hover': {
                                                backgroundColor: '#388E3C',
                                            },
                                            color: '#ffffff'
                                        }}
                                    >
                                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (id ? 'Actualizar Empleado' : 'Crear Empleado')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate('/empleado')}
                                        disabled={isSubmitting}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{
                                            px: 5,
                                            py: 1.5,
                                            borderColor: '#90CAF9',
                                            color: '#90CAF9',
                                            '&:hover': {
                                                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                                borderColor: '#90CAF9',
                                            }
                                        }}
                                    >
                                        Volver al Listado
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    )
}

export default EmpleadoForm

