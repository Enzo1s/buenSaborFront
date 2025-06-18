import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { Cliente } from '../../../interfaces/Cliente';
import { createCliente, getClienteById } from '../../../Api/ClienteAPI';
import { Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { Pais } from '../../../interfaces/Pais';
import { Provincia } from '../../../interfaces/Provincia';
import { Localidad } from '../../../interfaces/Localidad';
import { Domicilio } from '../../../interfaces/Domicilio';
import { createUser, updateUser } from '../../../Api/UsuarioAPI';
import { Usuario } from '../../../interfaces/Usuario';
import { Rol } from '../../../enums/Rol';

const ClienteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState<Cliente | null>(null)

    const getCliente = async () => {
        if (id) {
            const { data } = await getClienteById(id)
            setCliente(data)
        }
    }
    const initialValues = {
        id: cliente?.id || null,
        nombre: cliente?.nombre || '',
        apellido: cliente?.apellido || '',
        telefono: cliente?.telefono || '',
        email: cliente?.email || '',
        usuario: cliente?.usuario || null,
        username: cliente?.usuario?.username || "",
        password: "",
        domicilio: cliente?.domicilio || {
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
        } as Domicilio,
        alta: null,
        baja: null,
        modificacion: null
    }

    useEffect(() => {
        getCliente()
    }, [])

    return (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Paper
                elevation={6} // Aumentar la elevación para un efecto más pronunciado
                sx={{
                    p: 4,
                    borderRadius: '12px', // Bordes más redondeados
                    width: '90%',
                    maxWidth: '800px',
                    margin: 'auto',
                    // Estilos para un fondo oscuro
                    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Fondo semi-transparente oscuro
                    color: '#e0e0e0', // Color de texto claro para el Paper
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)', // Sombra más profunda
                    backdropFilter: 'blur(5px)', // Efecto de desenfoque sutil si el fondo es una imagen
                    border: '1px solid rgba(255, 255, 255, 0.1)' // Borde sutil para definir el Paper
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
                    {id ? 'Editar Cliente' : 'Crear Cliente'}
                </Typography>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    onSubmit={async (values, { setSubmitting }) => {
                        const nuevoCliente: Cliente = {
                            id: values?.id || null,
                            nombre: values?.nombre,
                            apellido: values?.apellido,
                            telefono: values?.telefono,
                            email: values?.email,
                            usuario: values?.usuario,
                            domicilio: {
                                id: null,
                                calle: values.domicilio.calle,
                                numero: values.domicilio.numero,
                                cp: values.domicilio.cp,
                                localidad: {
                                    id: null,
                                    nombre: values.domicilio.localidad.nombre,
                                    provincia: {
                                        id: null,
                                        nombre: values.domicilio.localidad.provincia.nombre,
                                        pais: {
                                            id: null,
                                            nombre: values.domicilio.localidad.provincia.pais.nombre,
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
                            } as Domicilio,
                            alta: null,
                            baja: null,
                            modificacion: null
                        }
                        try {
                            if (cliente) {
                                const { data } = await updateUser({ ...cliente.usuario, username: values.username, password: values.password } as Usuario)
                                nuevoCliente.usuario = data
                            } else {
                                const { data } = await createUser({
                                    username: values.username as String,
                                    password: values.password as String,
                                    rol: Object.keys(Rol).find(k => Rol[k as keyof typeof Rol] === 'Cliente'),
                                    alta: null,
                                    baja: null,
                                    modificacion: null
                                } as Usuario)
                                nuevoCliente.usuario = data
                            }
                            setSubmitting(true)
                            await createCliente(nuevoCliente)
                            setSubmitting(false)
                            navigate(-1)
                        } catch (error) {
                            console.log(error)
                            alert("Error al crear el empleado")
                            setSubmitting(false)
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
                                <Grid size={{ xs: 12, sm: 6 }}> {/* Usar 'item' para los hijos de Grid container */}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
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

                                <Grid size={{ xs: 12, sm: 6 }}>
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

                                <Grid size={{ xs: 12, sm: 6 }}>
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

                                <Grid size={12}>
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
                                        required={!id}
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

                                ---

                                <Grid size={12}>
                                    <Typography variant='h6' gutterBottom sx={{ mt: 2, color: '#f0f0f0' }}>
                                        Datos de Domicilio
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="domicilio.calle"
                                        name="domicilio.calle"
                                        label="Calle"
                                        value={values.domicilio.calle}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="domicilio.numero"
                                        name="domicilio.numero"
                                        label="Número"
                                        type="number"
                                        value={values.domicilio.numero}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="domicilio.cp"
                                        name="domicilio.cp"
                                        label="Código Postal"
                                        type="number"
                                        value={values.domicilio.cp}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="domicilio.localidad.nombre"
                                        name="domicilio.localidad.nombre"
                                        label="Localidad"
                                        value={values.domicilio.localidad.nombre}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="domicilio.localidad.provincia.nombre"
                                        name="domicilio.localidad.provincia.nombre"
                                        label="Provincia"
                                        value={values.domicilio.localidad.provincia.nombre}
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="domicilio.localidad.provincia.pais.nombre"
                                        name="domicilio.localidad.provincia.pais.nombre"
                                        label="País"
                                        value={values.domicilio.localidad.provincia.pais.nombre}
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

                                ---

                                <Grid size={12} sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        sx={{
                                            px: 5,
                                            py: 1.5,
                                            backgroundColor: '#4CAF50', // Un verde vibrante
                                            '&:hover': {
                                                backgroundColor: '#388E3C', // Un verde más oscuro al pasar el ratón
                                            },
                                            color: '#ffffff'
                                        }}
                                    >
                                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (id ? 'Actualizar Cliente' : 'Crear Cliente')}
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => navigate(-1)}
                                        disabled={isSubmitting}
                                        sx={{
                                            px: 5,
                                            py: 1.5,
                                            borderColor: '#90CAF9', // Un azul claro para el borde
                                            color: '#90CAF9', // Texto azul claro
                                            '&:hover': {
                                                backgroundColor: 'rgba(144, 202, 249, 0.1)', // Fondo sutil al pasar el ratón
                                                borderColor: '#90CAF9',
                                            }
                                        }}
                                    >
                                        Cancelar
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

export default ClienteForm


