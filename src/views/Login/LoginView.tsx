import { Button, Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useAuth } from '../../Context/authContext'
import { useNavigate } from 'react-router'

const LoginView = () => {
    const {login, isAuthenticated} = useAuth()
    const navigate = useNavigate()
    return (
        <Grid container spacing={2} justifyContent={"center"}>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }} justifyContent={"center"}  display={"flex"} className="textWhte">
                <Typography variant='h3'>Inicio de Sesión</Typography>
            </Grid>
            <Grid size={6} sx={{ margin: 'auto', padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        login(values);
                        if(isAuthenticated){
                            navigate('/')
                        }
                        setSubmitting(false)
                    }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                     }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={12} sx={{ marginBottom: 2 }}>
                                    <TextField
                                        id="username"
                                        name="username"
                                        label="Nombre de Usuario"
                                        value={values.username}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid size={12} sx={{ marginBottom: 2 }}>
                                    <TextField
                                        id="password"
                                        name="password"
                                        label="Contraseña"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid size={12} justifyContent={"center"} display={"flex"}>
                                    <Button variant="contained" type="submit" disabled={isSubmitting}>Iniciar Sesión</Button>
                                </Grid>
                            </Grid>
                        </form>
                    )
                    }
                </Formik>
            <Grid size={12} justifyContent={"center"} display={"flex"}>
                <Button variant='text' onClick={() => navigate('/register')}>Crear Cuenta</Button>
            </Grid>
            </Grid>
            {/* <Grid size={12} justifyContent={"center"} display={"flex"}>
                <Typography variant='body1'>Recuperar contraseña</Typography>
            </Grid> */}

        </Grid>
    )
}

export default LoginView