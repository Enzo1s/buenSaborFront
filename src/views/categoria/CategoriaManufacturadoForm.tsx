import {
    Grid,
    Typography,
    TextField,
    Button,
    Paper,
} from '@mui/material'
import { Formik } from "formik"
import { CategoriaArticuloManufacturado } from "../../interfaces/CategoriaArticuloManufacturado"
import { createCategoriaManufacturado } from "../../Api/CategoriaManufacturadoAPI"

export interface CategoriaFormProps {
  setCategoria: (value: CategoriaArticuloManufacturado) => void;
  onClose?: () => void;
}


const CategoriaManufacturadoForm = (props: CategoriaFormProps) => {
  const { setCategoria, onClose } = props

  return (
   <Paper
            elevation={8} 
            sx={{
                backgroundColor: 'rgba(35, 35, 35, 0.98)',
                padding: { xs: 3, md: 4 },
                borderRadius: '16px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
                color: '#e0e0e0',
                maxWidth: { xs: '95%', sm: 500, md: 600 },
                margin: 'auto',
                border: '1px solid rgba(70, 70, 70, 0.6)',
            }}
        >
            <Grid container spacing={3} alignContent="center" justifyContent="center">
                <Grid size={12}>
                    <Typography
                        variant="h4"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{
                            color: '#90CAF9',
                            fontWeight: 'bold',
                            mb: 3,
                        }}
                    >
                        Nueva Categoría
                    </Typography>
                </Grid>

                <Grid size={12}>
                    <Formik
                        initialValues={{
                            denominacion: '',
                        }}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            const nuevaCategoria: CategoriaArticuloManufacturado = {
                                id: null,
                                denominacion: values.denominacion,
                                alta:null,
                                baja: null,
                                modificacion: null
                            };
                            try {
                                const { data } = await createCategoriaManufacturado(nuevaCategoria);
                                setCategoria(data as CategoriaArticuloManufacturado);
                                resetForm();
                                if (onClose) {
                                    onClose();
                                }
                            } catch (error) {
                                console.error("Error creating category:", error);
                            } finally {
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
                        }) => (
                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Grid container spacing={3}>
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            id="denominacion"
                                            name="denominacion"
                                            label="Nombre de la Categoría"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.denominacion}
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
                                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting || !values.denominacion.trim()}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                                                '&:hover': {
                                                    backgroundColor: '#64B5F6',
                                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6)',
                                                },
                                            }}
                                        >
                                            {isSubmitting ? "Creando..." : "Crear Categoría"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </Paper>
  )
}
export default CategoriaManufacturadoForm