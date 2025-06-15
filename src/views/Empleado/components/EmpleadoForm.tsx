import { useEffect, useState } from 'react'
import { Empleado } from '../../../interfaces/Empleado'
import { useNavigate, useParams } from 'react-router'
import { createEmpleado, getByIdEmpleado } from '../../../Api/EmpleadoAPI'
import { Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { createUser, updateUser } from '../../../Api/UsuarioAPI'
import { Usuario } from '../../../interfaces/Usuario'
import { Rol } from '../../../enums/Rol'

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
        <Grid container spacing={2}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '10px', width: '80%', alignContent: 'center', justifyContent: 'center', margin: 'auto' }}>
            <Grid size={12}>
                <Typography variant='h3'>{id ? 'Editar Empleado' : 'Crear Empleado'}
                </Typography>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={12}>
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
                            modificacion: null
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const nuevoEmpleado: Empleado = {
                                id: values?.id || null,
                                nombre: values?.nombre,
                                apellido: values?.apellido,
                                telefono: values?.telefono,
                                email: values?.email,
                                usuario: values?.usuario,
                                perfil: values?.perfil?.toUpperCase() || 'EMPLEDADO',
                                alta: null,
                                baja: null,
                                modificacion: null
                            }
                            try {
                                if (empleado) {
                                    const { data } = await updateUser({ ...empleado.usuario, username: values.username, password: values.password } as Usuario)
                                    nuevoEmpleado.usuario = data
                                } else {
                                    const { data } = await createUser({
                                        username: values.username as String,
                                        password: values.password as String,
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
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid size={{xs:12, sm:6}}>
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
                                        />
                                    </Grid>

                                    <Grid size={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                            sx={{ px: 5, py: 1.5 }}
                                        >
                                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (empleado ? 'Actualizar Empleado' : 'Crear Empleado')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
            </Paper>
        </Grid>
    )
}

export default EmpleadoForm