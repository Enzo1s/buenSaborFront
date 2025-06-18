import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Typography,
    Autocomplete,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { Formik } from 'formik'
import { useAuth } from '../../Context/authContext'
import { useNavigate } from 'react-router'
import { Rol } from '../../enums/Rol'
import { Usuario } from '../../interfaces/Usuario'
import { useEffect, useState } from 'react'
import { SucursalEmpresa } from '../../interfaces/SucursalEmpresa'
import { getSucursales } from '../../Api/SucursalAPI'
import { Domicilio } from '../../interfaces/Domicilio'
import { Localidad } from '../../interfaces/Localidad'
import { Provincia } from '../../interfaces/Provincia'
import { Pais } from '../../interfaces/Pais'
import { Empleado } from '../../interfaces/Empleado'
import { createEmpleado } from '../../Api/EmpleadoAPI'
import { Cliente } from '../../interfaces/Cliente'
import { createCliente } from '../../Api/ClienteAPI'

const RegisterView = () => {
    const { register, isAuthenticated, user, setEmpleado, setCliente } = useAuth()
    const navigate = useNavigate()

    const [sucursales, setSucursales] = useState<SucursalEmpresa[]>([])

    useEffect(() => {
        const getAllSucursales = async () => {
            const { data } = await getSucursales();
            setSucursales(data);
        };
        getAllSucursales();
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated])


    return (
        <Grid container spacing={2} justifyContent="center" sx={{ minHeight: '100vh', py: 4 }}>
            <Grid size={{xs:12, sm:8, md:6, lg:4}}>
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
                    }}
                >
                    <Typography
                        variant='h4'
                        component='h1'
                        align='center'
                        gutterBottom
                        sx={{
                            mb: 3,
                            color: '#f0f0f0', // Título más claro
                            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)' // Sombra de texto para el título
                        }}
                    >
                        Registro
                    </Typography>
                    <Formik
                        initialValues={{
                        username: '',
                        password: '',
                        rol: Rol.CLIENTE,
                        sucursalEmpresa: null,
                        nombre: '',
                        apellido: '',
                        telefono: '',
                        email: '',
                        domicilio: {
                            id: null,
                            calle: '',
                            numero: 0,
                            cp: 0,
                            localidad: {
                                id: null,
                                nombre: '',
                                provincia: {
                                    id: null,
                                    nombre: '',
                                    pais: {
                                        id: null,
                                        nombre: '',
                                        alta: null,
                                        baja: null,
                                        modificacion: null
                                    } as Pais,
                                    alta: null,
                                    baja: null,
                                    modificacion: null
                                } as Provincia,
                                alta: null,
                                baja: null,
                                modificacion: null
                            } as Localidad,
                            alta: null,
                            baja: null,
                            modificacion: null
                        } as Domicilio
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        const key = Object.keys(Rol).find(k => Rol[k as keyof typeof Rol] === values.rol);
                        const usuario: Usuario = {
                            id: null,
                            auth0Id: '',
                            username: values.username,
                            password: values.password,
                            sucursalEmpresa: values.sucursalEmpresa,
                            rol: key?.toString() as Rol,
                            alta: null,
                            baja: null,
                            modificacion: null
                        }
                        register(usuario);
                        if (values.rol === Rol.EMPLEADO) {
                            const empleado: Empleado = {
                                id: null,
                                nombre: values?.nombre,
                                apellido: values?.apellido,
                                telefono: values?.telefono,
                                email: values?.email,
                                usuario: user,
                                perfil: 'EMPLEDADO',
                                alta: null,
                                baja: null,
                                modificacion: null
                            }
                            const { data: empleadoData } = await createEmpleado(empleado);
                            setEmpleado(empleadoData)
                        }
                        if(values.rol === Rol.CLIENTE) {
                            const cliente:Cliente = {
                                id: null,
                                nombre: values?.nombre,
                                apellido: values?.apellido,
                                telefono: values?.telefono,
                                email: values?.email,
                                usuario: user,
                                domicilio: values?.domicilio,
                                 alta: null,
                                baja: null,
                                modificacion: null
                            }
                            const { data: clienteData } = await createCliente(cliente);
                            setCliente(clienteData);
                        }
                        setSubmitting(false)
                        if (isAuthenticated) {
                            navigate('/')
                        }
                    }}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            setFieldValue,
                            isSubmitting,
                            touched,
                            errors, // Incluir errors para helperText
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}> {/* Espaciado consistente */}
                                    <Grid size={12}> {/* Usar 'item' */}
                                        <TextField
                                            fullWidth
                                            id="username"
                                            name="username"
                                            label="Nombre de Usuario" // Usar label en lugar de placeholder
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
                                            type="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
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
                                    <Grid size={12}>
                                        <FormControl fullWidth variant="outlined" error={touched.rol && Boolean(errors.rol)}>
                                            <InputLabel id="rol-label" sx={{ color: '#b0b0b0' }}>Rol</InputLabel>
                                            <Select
                                                labelId="rol-label"
                                                id="rol"
                                                name="rol"
                                                value={values.rol}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                label="Rol"
                                                sx={{
                                                    color: '#ffffff',
                                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                                                    '& .MuiSvgIcon-root': { color: '#b0b0b0' },
                                                }}
                                            >
                                                {Object.values(Rol).map((rol) => (
                                                    <MenuItem key={rol} value={rol} sx={{
                                                        backgroundColor: 'rgba(30, 30, 30, 0.9)',
                                                        color: '#e0e0e0',
                                                        '&:hover': { backgroundColor: 'rgba(50, 50, 50, 0.9)' },
                                                    }}>
                                                        {rol}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {touched.rol && errors.rol && (
                                                <Typography variant="caption" color="error" sx={{ color: '#ffb0b0', mt: 0.5, ml: 1.4 }}>
                                                    {errors.rol}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid size={12}>
                                        <Autocomplete
                                            fullWidth
                                            id="sucursalEmpresa"
                                            options={sucursales}
                                            getOptionLabel={(option) => option.nombre}
                                            value={values.sucursalEmpresa}
                                            onChange={(_, newValue) => {
                                                setFieldValue("sucursalEmpresa", newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Sucursal"
                                                    variant="outlined"
                                                    error={touched.sucursalEmpresa && Boolean(errors.sucursalEmpresa)}
                                                    helperText={touched.sucursalEmpresa && errors.sucursalEmpresa ? "La sucursal es requerida para este rol" : null}
                                                    InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        style: { color: '#ffffff' },
                                                        sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                    }}
                                                    sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                />
                                            )}
                                            sx={{
                                                '& .MuiAutocomplete-inputRoot': { color: '#ffffff' },
                                                '& .MuiAutocomplete-clearIndicator': { color: '#b0b0b0' },
                                                '& .MuiAutocomplete-popupIndicator': { color: '#b0b0b0' },
                                            }}
                                            PaperComponent={({ children }) => (
                                                <Paper sx={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', color: '#e0e0e0' }}>
                                                    {children}
                                                </Paper>
                                            )}
                                        />
                                    </Grid>

                                    {(values.rol === Rol.EMPLEADO || values.rol === Rol.CLIENTE) &&
                                        <>
                                            <Grid size={{xs:12, sm:6}}>
                                                <TextField
                                                    fullWidth
                                                    id="nombre"
                                                    name="nombre"
                                                    label="Nombre"
                                                    value={values.nombre}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
                                                    error={touched.nombre && Boolean(errors.nombre)}
                                                    helperText={touched.nombre && errors.nombre}
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
                                                    id="apellido"
                                                    name="apellido"
                                                    label="Apellido"
                                                    value={values.apellido}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
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
                                                    value={values.telefono}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
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
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    required
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
                                            {values.rol === Rol.CLIENTE &&
                                                <>
                                                    <Grid size={12}>
                                                        <Typography variant="h6" sx={{ color: '#f0f0f0', mb: 1, mt: 2 }}>
                                                            Datos de Domicilio:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:4}}>
                                                        <TextField
                                                            fullWidth
                                                            id="domicilio.calle"
                                                            name="domicilio.calle"
                                                            label="Calle"
                                                            value={values.domicilio.calle || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.domicilio?.calle && Boolean(errors.domicilio?.calle)}
                                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                            InputProps={{
                                                                style: { color: '#ffffff' },
                                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                            }}
                                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:4}}>
                                                        <TextField
                                                            fullWidth
                                                            id="domicilio.numero"
                                                            name="domicilio.numero"
                                                            label="Número"
                                                            type="number" // Set type to number
                                                            value={values.domicilio.numero === 0 ? '' : values.domicilio.numero} // Handle 0 for empty field
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.domicilio?.numero && Boolean(errors.domicilio?.numero)}
                                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                            InputProps={{
                                                                style: { color: '#ffffff' },
                                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                            }}
                                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:4}}>
                                                        <TextField
                                                            fullWidth
                                                            id="domicilio.cp"
                                                            name="domicilio.cp"
                                                            label="CP"
                                                            type="number"
                                                            value={values.domicilio.cp === 0 ? '' : values.domicilio.cp} 
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.domicilio?.cp && Boolean(errors.domicilio?.cp)}
                                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                            InputProps={{
                                                                style: { color: '#ffffff' },
                                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                            }}
                                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:4}}>
                                                        <TextField
                                                            fullWidth
                                                            id="domicilio.localidad.nombre"
                                                            name="domicilio.localidad.nombre"
                                                            label="Localidad"
                                                            value={values.domicilio.localidad.nombre || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.domicilio?.localidad?.nombre && Boolean(errors.domicilio?.localidad?.nombre)}
                                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                            InputProps={{
                                                                style: { color: '#ffffff' },
                                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                            }}
                                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:4}}>
                                                        <TextField
                                                            fullWidth
                                                            id="domicilio.localidad.provincia.nombre"
                                                            name="domicilio.localidad.provincia.nombre"
                                                            label="Provincia"
                                                            value={values.domicilio.localidad.provincia.nombre || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.domicilio?.localidad?.provincia?.nombre && Boolean(errors.domicilio?.localidad?.provincia?.nombre)}
                                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                            InputProps={{
                                                                style: { color: '#ffffff' },
                                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                            }}
                                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                        />
                                                    </Grid>
                                                    <Grid size={{xs:12, sm:4}}>
                                                        <TextField
                                                            fullWidth
                                                            id="domicilio.localidad.provincia.pais.nombre"
                                                            name="domicilio.localidad.provincia.pais.nombre"
                                                            label="País"
                                                            value={values.domicilio.localidad.provincia.pais.nombre || ''}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            error={touched.domicilio?.localidad?.provincia?.pais?.nombre && Boolean(errors.domicilio?.localidad?.provincia?.pais?.nombre)}
                                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                            InputProps={{
                                                                style: { color: '#ffffff' },
                                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                            }}
                                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                                        />
                                                    </Grid>
                                                </>
                                            }
                                        </>
                                    }
                                    <Grid size={12} sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                            sx={{
                                                px: 5,
                                                py: 1.5,
                                                backgroundColor: '#4CAF50', // Verde vibrante
                                                '&:hover': {
                                                    backgroundColor: '#388E3C', // Verde oscuro al pasar el ratón
                                                },
                                                color: '#ffffff'
                                            }}
                                        >
                                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                    <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
                        <Typography variant='h6' sx={{ color: '#f0f0f0', mb: 1 }}>
                            ¿Ya tienes cuenta?
                        </Typography>
                        <Button
                            variant='text'
                            onClick={() => navigate('/login')}
                            sx={{
                                color: '#90CAF9', // Azul claro para el enlace
                                '&:hover': {
                                    backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                }
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default RegisterView

