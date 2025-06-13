import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useAuth } from '../../Context/authContext'
import { useNavigate } from 'react-router'
import { Rol } from '../../enums/Rol'
import { Usuario } from '../../interfaces/Usuario'
import { useEffect, useState } from 'react'
import { SucursalEmpresa } from '../../interfaces/SucursalEmpresa'
import { getSucursales } from '../../Api/SucursalAPI'

const RegisterView = () => {
    const { register, isAuthenticated } = useAuth()
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
        <Grid container spacing={2}>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }} justifyContent={"center"} display={"flex"}>
                <Typography variant='h3'>Registro</Typography>
            </Grid>
            <Grid size={6} sx={{ margin: 'auto', padding: 2 }}>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        rol: Rol.CLIENTE,
                        sucursalEmpresa: null
                    }}
                    onSubmit={(values, {setSubmitting}) => {
                        const key = Object.keys(Rol).find(k => Rol[k as keyof typeof Rol] === values.rol);
                        const usuario: Usuario = {
                            id: null,
                            auth0Id: '',
                            username: values.username,
                            password: values.password,
                            empresa: null,
                            rol: key?.toString() as Rol,
                            sucursalEmpresa: values.sucursalEmpresa,
                            alta: null,
                            baja: null,
                            modificacion: null
                        }
                        register(usuario);
                        setSubmitting(false)
                    }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={12} sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        id="username"
                                        name="username"
                                        placeholder="Nombre de Usuario"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </Grid>
                                <Grid size={12} sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                </Grid>
                                <Grid size={12} sx={{ marginBottom: 2 }}>
                                    <Autocomplete
                                        fullWidth
                                        id="rol"
                                        value={values.rol}
                                        options={Object.values(Rol)}
                                        onChange={(_, newValue) => {
                                            setFieldValue("rol", newValue);
                                        }}
                                        getOptionLabel={(option: Rol) => option}
                                        renderInput={(params) => <TextField {...params} label="Rol" />}
                                    />
                                </Grid>
                                <Grid size={12} sx={{ marginBottom: 2 }}>
                                    <Autocomplete
                                        fullWidth
                                        id="sucursalEmpresa"
                                        value={values.sucursalEmpresa}
                                        options={sucursales}
                                        onChange={(_, newValue) => {
                                            setFieldValue("sucursalEmpresa", newValue);
                                        }}
                                        getOptionLabel={(option: SucursalEmpresa) => option.nombre}
                                        renderInput={(params) => <TextField {...params} label="Sucursal" />}
                                    />
                                </Grid>
                                <Grid size={12} justifyContent={"center"} display={"flex"}>
                                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>Registrar</Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Grid>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={12}  justifyContent={"center"} display={"flex"}>
                        <Typography variant='h5'>¿Ya tienes cuenta?</Typography>
                    </Grid>
                    <Grid size={12} justifyContent={"center"} display={"flex"}>
                        <Button variant='text' onClick={() => navigate('/login')}>Iniciar Sesión</Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default RegisterView