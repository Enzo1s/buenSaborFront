import {
    Grid,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Modal as MuiModal
} from '@mui/material';
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate, useParams } from 'react-router'
import { Promocion } from '../../../interfaces/Promocion'
import { createPromocion, getPromocionById } from '../../../Api/PromocionAPI'
import { PickerValue } from '@mui/x-date-pickers/internals';
import { PromocionDetalle } from '../../../interfaces/PromocionDetalle';
import DetallePromocionForm from './DetallePromocionForm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const PromocionForm = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const [promocion, setPromocion] = useState<Promocion | null>(null)
    const [viewForm, setViewForm] = useState(false)
    const [detalles, setDetalles] = useState<PromocionDetalle[]>([])

    const getPromocion = async () => {
        if (id) {
            const { data } = await getPromocionById(id)
            setPromocion(data)
        }
    }

    useEffect(() => {
        getPromocion()
    }, [])


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Grid container spacing={4} justifyContent="center" sx={{ p: 4, minHeight: '100vh', color: '#e0e0e0' }}>
                <Grid size={12}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)', mb: 3 }}>
                        {id ? 'Editar Promoción' : 'Crear Nueva Promoción'}
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6 }} >
                    <Paper
                        elevation={6}
                        sx={{
                            p: 4,
                            borderRadius: '12px',
                            backgroundColor: 'rgba(30, 30, 30, 0.9)',
                            boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Formik
                            initialValues={{
                        id: promocion?.id || null,
                        denominacion: promocion?.denominacion || '',
                        fechaDesde: new Date(),
                        fechaHasta: new Date(),
                        descuento: 0,
                        promocionDetalle: promocion?.promocionDetalle || [],
                        alta: null,
                        baja: null,
                        modificacion: null,
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        const nuevaPromo: Promocion = {
                            id: values.id,
                            denominacion: values.denominacion,
                            fechaDesde: values.fechaDesde,
                            fechaHasta: values.fechaHasta,
                            descuento: values.descuento,
                            promocionDetalle: detalles,
                            alta: null,
                            baja: null,
                            modificacion: null
                        }
                        await createPromocion(nuevaPromo)
                        setSubmitting(false);
                        navigate(-1)
                    }}
                        >
                            {({
                                values,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                id="denominacion"
                                                name="denominacion"
                                                label="Denominación de la Promoción"
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.denominacion}
                                                InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                InputProps={{
                                                    style: { color: '#ffffff' },
                                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                }}
                                                sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <DatePicker
                                                label="Fecha de Inicio"
                                                value={values.fechaDesde}
                                                onChange={(newValue: PickerValue) => {
                                                    setFieldValue('fechaDesde', newValue);
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        variant: 'outlined',
                                                        InputLabelProps: { style: { color: '#b0b0b0' } },
                                                        InputProps: {
                                                            style: { color: '#ffffff' },
                                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                        },
                                                        sx: { '& .MuiFormHelperText-root': { color: '#ffb0b0' } },
                                                        helperText: values.fechaDesde ? `Fecha elegida: ${format(values.fechaDesde, 'dd/MM/yyyy', { locale: es })}` : 'Ninguna fecha seleccionada',
                                                    },
                                                    actionBar: {
                                                        actions: ['clear', 'today'],
                                                    },
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { color: '#90CAF9' },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <DatePicker
                                                label="Fecha de Fin"
                                                value={values.fechaHasta}
                                                onChange={(newValue: PickerValue) => {
                                                    setFieldValue('fechaHasta', newValue);
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        variant: 'outlined',
                                                        InputLabelProps: { style: { color: '#b0b0b0' } },
                                                        InputProps: {
                                                            style: { color: '#ffffff' },
                                                            sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                        },
                                                        sx: { '& .MuiFormHelperText-root': { color: '#ffb0b0' } },
                                                        helperText: values.fechaHasta ? `Fecha elegida: ${format(values.fechaHasta, 'dd/MM/yyyy', { locale: es })}` : 'Ninguna fecha seleccionada',
                                                    },
                                                    actionBar: {
                                                        actions: ['clear', 'today'],
                                                    },
                                                }}
                                                sx={{
                                                    '& .MuiSvgIcon-root': { color: '#90CAF9' },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <TextField
                                                fullWidth
                                                id="descuento"
                                                name="descuento"
                                                label="Descuento (%)"
                                                variant="outlined"
                                                type="number"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.descuento}
                                                InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                                InputProps={{
                                                    style: { color: '#ffffff' },
                                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                                }}
                                                sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                            />
                                        </Grid>
                                        <Grid size={12} container alignItems="center" spacing={1}>
                                            <Grid >
                                                <Typography variant="h6" sx={{ color: '#f0f0f0' }}>Artículos de la Promoción:</Typography>
                                            </Grid>
                                            <Grid >
                                                <Button
                                                    variant="contained"
                                                    color="info" // Use info color for adding items
                                                    onClick={() => setViewForm(true)}
                                                    sx={{
                                                        minWidth: 'auto', // Allow button to shrink
                                                        px: 2, py: 1, // Add padding
                                                        backgroundColor: '#2196F3', // Blue color
                                                        '&:hover': { backgroundColor: '#1976D2' },
                                                        color: '#ffffff',
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    + Agregar Artículo
                                                </Button>
                                            </Grid>
                                            <Grid size={12} sx={{ mt: 2 }}>
                                                {detalles && detalles.length > 0 ? (
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
                                                                    x{`${detalle?.cantidad}`}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Paper>
                                                ) : (
                                                    <Typography variant="body2" sx={{ color: '#b0b0b0', fontStyle: 'italic' }}>
                                                        No se han agregado artículos a la promoción.
                                                    </Typography>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12} sx={{ mt: 4, textAlign: 'right' }}>
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={isSubmitting}
                                            sx={{
                                                px: 4, py: 1.5,
                                                borderRadius: '8px',
                                                backgroundColor: promocion ? '#FFA726' : '#4CAF50', // Orange for Update, Green for Create
                                                '&:hover': { backgroundColor: promocion ? '#FB8C00' : '#388E3C' },
                                                color: '#ffffff',
                                            }}
                                        >
                                            {promocion ? "Actualizar Promoción" : "Crear Promoción"}
                                        </Button>
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Paper>
                </Grid>
                <MuiModal open={viewForm} onClose={() => setViewForm(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 400 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        backgroundColor: '#424242',
                        color: '#e0e0e0',
                    }}
                >
                    <DetallePromocionForm detalles={detalles} setDetalles={setDetalles} setViewForm={setViewForm} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => setViewForm(false)}
                            sx={{ mr: 2, borderColor: '#a0a0a0', color: '#a0a0a0', '&:hover': { borderColor: '#fff', color: '#fff' } }}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </Box>
                </MuiModal>
            </Grid>
        </LocalizationProvider>
    )
}

export default PromocionForm

