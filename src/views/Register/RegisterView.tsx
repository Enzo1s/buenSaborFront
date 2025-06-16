import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material'
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
        <Grid container spacing={2}>
            <Grid size={6} sx={{ margin: 'auto', marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                <Grid size={12} sx={{ margin: 'auto', padding: 2 }} justifyContent={"center"} display={"flex"} >
                    <Typography variant='h3'>Registro</Typography>
                </Grid>
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
                                {(values.rol === Rol.EMPLEADO || values.rol === Rol.CLIENTE) &&
                                    <>
                                        <Grid size={6} sx={{ marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                id="nombre"
                                                name="nombre"
                                                placeholder="Nombre"
                                                value={values.nombre}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={6} sx={{ marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                id="apellido"
                                                name="apellido"
                                                placeholder="Apellido"
                                                value={values.apellido}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={6} sx={{ marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                id="telefono"
                                                name="telefono"
                                                placeholder="Telefono"
                                                value={values.telefono}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={6} sx={{ marginBottom: 2 }}>
                                            <TextField
                                                fullWidth
                                                id="email"
                                                name="email"
                                                placeholder="Email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                        </Grid>
                                        {values.rol === Rol.CLIENTE &&
                                            <>
                                                <Grid size={4}>
                                                    <TextField
                                                        fullWidth
                                                        id="domicilio.calle"
                                                        name="domicilio.calle"
                                                        label="Calle"
                                                        value={values.domicilio.calle || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                <Grid size={4}>
                                                    <TextField
                                                        fullWidth
                                                        id="domicilio.numero"
                                                        name="domicilio.numero"
                                                        label="Numero"
                                                        value={values.domicilio.numero || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                <Grid size={4}>
                                                    <TextField
                                                        fullWidth
                                                        id="domicilio.cp"
                                                        name="domicilio.cp"
                                                        label="CP"
                                                        value={values.domicilio.cp || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                {/* Localidad */}
                                                <Grid size={4}>
                                                    <TextField
                                                        fullWidth
                                                        id="domicilio.localidad.nombre"
                                                        name="domicilio.localidad.nombre"
                                                        label="Localidad"
                                                        value={values.domicilio.localidad.nombre || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                <Grid size={4}>
                                                    <TextField
                                                        fullWidth
                                                        id="domicilio.localidad.provincia.nombre"
                                                        name="domicilio.localidad.provincia.nombre"
                                                        label="Provincia"
                                                        value={values.domicilio.localidad.provincia.nombre || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                                {/* pais */}
                                                <Grid size={4}>
                                                    <TextField
                                                        fullWidth
                                                        id="domicilio.localidad.provincia.pais.nombre"
                                                        name="domicilio.localidad.provincia.pais.nombre"
                                                        label="País"
                                                        value={values.domicilio.localidad.provincia.pais.nombre || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </>

                                }
                                <Grid size={12} justifyContent={"center"} display={"flex"}>
                                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>Registrar</Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
                <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={12} justifyContent={"center"} display={"flex"}>
                            <Typography variant='h5'>¿Ya tienes cuenta?</Typography>
                        </Grid>
                        <Grid size={12} justifyContent={"center"} display={"flex"}>
                            <Button variant='text' onClick={() => navigate('/login')}>Iniciar Sesión</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default RegisterView