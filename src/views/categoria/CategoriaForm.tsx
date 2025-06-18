import {
    Grid,
    Typography,
    TextField,
    Button,
    Autocomplete,
    Paper,
} from '@mui/material';
import { Formik } from "formik"
import { useEffect, useState } from "react"
import { crearCategoria, getAllCategoria } from "../../Api/CategoriaAPI"
import { CategoriaArticulo } from "../../interfaces/CategoriaArticulo"

export interface CategoriaFormProps {
  setCategoria: (value: CategoriaArticulo) => void;
  onClose?: () => void;
  }

const CategoriaForm = (props: CategoriaFormProps) => {
  const { setCategoria , onClose} = props
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const getCategorias = async () => {
      const {data} = await getAllCategoria();
      setCategorias(data);
    }
    getCategorias()
  }, [])
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
                            categoria: null
                        }}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            const nuevaCategoria: CategoriaArticulo = {
                                id: null,
                                denominacion: values.denominacion,
                                categoria: values.categoria,
                                alta: null,
                                baja: null,
                                modificacion: null
                            };
                            try {
                                const { data } = await crearCategoria(nuevaCategoria);
                                setCategoria(data as CategoriaArticulo);
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
                            setFieldValue
                        }) => (
                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Grid container spacing={3}>
                                    {/* Campo Denominación */}
                                    <Grid size={12}>
                                        <TextField
                                            fullWidth
                                            id="denominacion"
                                            name="denominacion"
                                            label="Denominación de la Categoría"
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

                                    {/* Campo Autocomplete para Categoría Padre */}
                                    <Grid size={12}>
                                        <Autocomplete
                                            fullWidth
                                            id="categoria"
                                            options={categorias}
                                            value={values.categoria}
                                            onChange={(_, newValue) => {
                                                setFieldValue("categoria", newValue);
                                            }}
                                            getOptionLabel={(option: CategoriaArticulo) => option.denominacion as string}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Categoría Padre (Opcional)"
                                                    variant="outlined"
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
                                                        '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': { color: '#a0a0a0' },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* Botón Crear */}
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

export default CategoriaForm