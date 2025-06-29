import { Button, Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useAuth } from '../../Context/authContext'
import { useNavigate } from 'react-router'

const LoginView = () => {
    const {login, isAuthenticated} = useAuth()
    const navigate = useNavigate()
    return (
        <Grid container
            spacing={2}
            alignContent={"center"}
            justifyContent="center"
            sx={{
                backgroundColor: 'rgba(35, 35, 35, 0.95)', // Fondo oscuro para la tarjeta del formulario
                padding: { xs: 2, md: 4 },
                borderRadius: '12px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                color: '#e0e0e0', // Texto claro por defecto
                maxWidth: '1000px', // Mayor ancho para este formulario
                margin: 'auto',
                mt: 5,
                border: '1px solid rgba(70, 70, 70, 0.5)'
            }}>
            <Grid size={12} >
                <Typography component="h1"
                variant="h3"
                    sx={{
                        color: '#90CAF9',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 3,
                    }}>Inicio de Sesión</Typography>
            </Grid>
            <Grid size={6} >
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
                                        sx={{
                                            backgroundColor: 'rgba(70, 70, 70, 0.7)',
                                            borderRadius: '4px',
                                            '& .MuiInputBase-input': { color: '#e0e0e0' },
                                            '& .MuiInputLabel-root': {
                                                color: '#a0a0a0',
                                                '&.Mui-focused': { color: '#fff' },
                                                '&.MuiFormLabel-filled': { color: '#fff' },
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9', borderWidth: '2px' },
                                        }}
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
                                        sx={{
                                            backgroundColor: 'rgba(70, 70, 70, 0.7)',
                                            borderRadius: '4px',
                                            '& .MuiInputBase-input': { color: '#e0e0e0' },
                                            '& .MuiInputLabel-root': {
                                                color: '#a0a0a0',
                                                '&.Mui-focused': { color: '#fff' },
                                                '&.MuiFormLabel-filled': { color: '#fff' },
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9', borderWidth: '2px' },
                                        }}
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

        </Grid>
    )
}

export default LoginView