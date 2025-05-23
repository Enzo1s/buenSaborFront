import { Button, Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'

const LoginView = () => {
    return (
        <Grid container>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                <Typography variant='h3'>Inicio de Sersión</Typography>
            </Grid>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting }) => (
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
                                <Grid size={12}>
                                    <Button variant="contained" type="submit" disabled={isSubmitting}>Iniciar Sesión</Button>
                                </Grid>
                            </Grid>
                        </form>
                    )
                    }
                </Formik>
            </Grid>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>d
                <Typography variant='h3'>Olvidaste tu contraseña?</Typography>
            </Grid>
            <Grid size={12} sx={{ margin: 'auto', padding: 2 }}>
                <Typography variant='h3'>No tienes cuenta?</Typography>
            </Grid>

        </Grid>
    )
}

export default LoginView