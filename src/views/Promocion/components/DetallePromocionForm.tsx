import { Autocomplete, Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { PromocionDetalle } from '../../../interfaces/PromocionDetalle';
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado';
import { getAllArticuloManufacturado } from '../../../Api/ArticuloManufacturadoAPI';
import { getListArticuloInsumo } from '../../../Api/ArticuloInsumo';
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo';

interface DetallePromocionFormProps {
  detalles: PromocionDetalle[];
  setDetalles: (value: PromocionDetalle[]) => void;
  setViewForm: (value: boolean) => void
}

const DetallePromocionForm = (props: DetallePromocionFormProps) => {

     const { detalles, setDetalles, setViewForm } = props
      const [articulos, setArticulos] = useState<ArticuloManufacturado[]>([])
      const [insumos, setInsumos] = useState<ArticuloInsumo[]>([])
    
      useEffect(() => {
        const listArticulos = async () => {
          const { data } = await getAllArticuloManufacturado()
          const { data: aInsumos } = await getListArticuloInsumo()
          setInsumos(aInsumos.filter((insumo: ArticuloInsumo) => insumo.esParaElaborar !== true))
          setArticulos(data)
        }
        listArticulos()
      }, [])
    
  return (
    <Grid container spacing={3} justifyContent="center" sx={{
            // No background color here, as it's likely in a Modal that handles its own background
            // p: 2, // Padding from modal's container
            color: '#e0e0e0', // Default text color
        }}>
            <Grid size={12}>
                <Typography variant="h5" component="h2" gutterBottom sx={{
                    textAlign: "center",
                    color: '#f0f0f0',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
                    mb: 2,
                }}>
                    Añadir Artículo al Detalle
                </Typography>
            </Grid>
            <Grid size={12}>
                <Formik
                    initialValues={{
            cantidad: 0,
            articuloManufacturado: null as ArticuloManufacturado | null,
            articuloInsumo: null as ArticuloInsumo | null
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const nuevoDetalle: PromocionDetalle = {
              id: null,
              cantidad: values.cantidad,
              articuloManufacturado: values.articuloManufacturado,
              articuloInsumo: values.articuloInsumo,
              alta: null,
              baja: null,
              modificacion: null
            }
            const detalle = [...detalles, nuevoDetalle]
            setDetalles(detalle)
            setSubmitting(false);
            resetForm();
          }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}> {/* Adjusted spacing */}
                                <Grid size={12}>
                                    <Autocomplete
                                        id="articuloManufacturado"
                                        value={values.articuloManufacturado}
                                        disablePortal
                                        options={articulos}
                                        onChange={(_, newValue) => {
                                            setFieldValue("articuloManufacturado", newValue);
                                            // Clear insumo if manufacturado is selected
                                            if (newValue) setFieldValue("articuloInsumo", null);
                                        }}
                                        getOptionLabel={(option: ArticuloManufacturado) => option.denominacion}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Artículo Manufacturado"
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
                                <Grid size={12}>
                                    <Autocomplete
                                        id="articuloInsumo"
                                        value={values.articuloInsumo}
                                        disablePortal
                                        options={insumos}
                                        onChange={(_, newValue) => {
                                            setFieldValue("articuloInsumo", newValue);
                                            // Clear manufacturado if insumo is selected
                                            if (newValue) setFieldValue("articuloManufacturado", null);
                                        }}
                                        getOptionLabel={(option: ArticuloInsumo) => option.denominacion as string}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Artículo Insumo"
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
                                <Grid container size={12} alignItems="center" spacing={2}>
                                    <Grid size={6}> {/* Use item */}
                                        <TextField
                                            fullWidth
                                            id="cantidad"
                                            name="cantidad"
                                            label="Cantidad"
                                            variant="outlined"
                                            type="number"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.cantidad}
                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                            InputProps={{
                                                style: { color: '#ffffff' },
                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                            }}
                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                        />
                                    </Grid>
                                    <Grid size={6}> {/* Use item */}
                                        {(values.articuloManufacturado || values.articuloInsumo) && (
                                            <Typography variant="subtitle1" sx={{ color: '#90CAF9', fontWeight: 'bold' }}>
                                                Seleccionado: { values.articuloManufacturado ? values.articuloManufacturado.denominacion as string : values.articuloInsumo ? values.articuloInsumo.denominacion as string : ''}
                                                
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>

                                {detalles && detalles.length > 0 && (
                                    <Grid size={12}>
                                        <Typography variant="h6" sx={{ color: '#f0f0f0', mb: 1 }}>Artículos agregados:</Typography>
                                        <Paper sx={{
                                            p: 2,
                                            backgroundColor: 'rgba(20, 20, 20, 0.7)',
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            borderRadius: '8px',
                                        }}>
                                            {detalles.map((detalle, index) => (
                                                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1, pb: 1, borderBottom: '1px dotted rgba(255,255,255,0.1)' }}>
                                                    <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
                                                        {detalle.articuloManufacturado ? detalle.articuloManufacturado.denominacion : detalle.articuloInsumo?.denominacion}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ color: '#90CAF9', fontWeight: 'bold' }}>
                                                        x{detalle.cantidad.toString()}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Paper>
                                    </Grid>
                                )}

                                <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitting || (!values.articuloManufacturado && !values.articuloInsumo)} // Disable if no article is selected
                                        sx={{
                                            backgroundColor: '#4CAF50', // Green for Add
                                            '&:hover': { backgroundColor: '#388E3C' },
                                            color: '#ffffff',
                                            px: 4, py: 1.2, borderRadius: '8px',
                                        }}
                                    >
                                        Agregar
                                    </Button>
                                    <Button
                                        variant="outlined" // Outlined for Cancel/Finish
                                        type="button"
                                        onClick={() => setViewForm(false)}
                                        sx={{
                                            borderColor: '#90CAF9', // Light blue border
                                            color: '#90CAF9', // Light blue text
                                            '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)', borderColor: '#90CAF9' },
                                            px: 4, py: 1.2, borderRadius: '8px',
                                        }}
                                    >
                                        Finalizar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Grid>
        </Grid>
  )
}

export default DetallePromocionForm


