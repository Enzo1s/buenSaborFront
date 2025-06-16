import { Button, Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useNavigate, useParams } from 'react-router'
import { Promocion } from '../../../interfaces/Promocion'
import { createPromocion, getPromocionById } from '../../../Api/PromocionAPI'
import { PickerValue } from '@mui/x-date-pickers/internals';
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado';
import { PromocionDetalle } from '../../../interfaces/PromocionDetalle';
import DetallePromocionForm from './DetallePromocionForm';
import Modal from '../../../components/Modal';

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
        <Grid container spacing={2} alignContent={"center"} justifyContent="center" sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            <Grid size={12}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>{id ? 'Editar Promoción' : 'Crear Promoción'}</Typography>
            </Grid>
            <Grid size={12}>
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
                        setFieldValue
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        id="denominacion"
                                        name="denominacion"
                                        label="Denominación"
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.denominacion}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <DatePicker
                                        label="Selecciona una fecha de inicio"
                                        value={values.fechaDesde}
                                        onChange={(newValue: PickerValue) => {
                                            if (newValue !== null) {
                                                setFieldValue('fechaDesde', newValue);
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                helperText: values.fechaDesde ? `Fecha elegida: ${format(values.fechaDesde, 'dd/MM/yyyy', { locale: es })}` : 'Ninguna fecha seleccionada',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <DatePicker
                                        label="Selecciona una fecha de fin"
                                        value={values.fechaHasta}
                                        onChange={(newValue: PickerValue) => {
                                            if (newValue !== null) {
                                                setFieldValue('fechaHasta', newValue);
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                helperText: values.fechaHasta ? `Fecha elegida: ${format(values.fechaHasta, 'dd/MM/yyyy', { locale: es })}` : 'Ninguna fecha seleccionada',
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth
                                        id="descuento"
                                        name="descuento"
                                        label="Descuento"
                                        variant="outlined"
                                        type="number"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.descuento}
                                    />
                                </Grid>
                                <Grid size={6} sx={{ marginBottom: 2 }} container>
                                    <Grid size={2}>
                                        <Typography variant="h6">Articulos</Typography>
                                    </Grid>
                                    <Grid size={1}>
                                        <Button fullWidth variant="contained" type="button" onClick={() => setViewForm(true)} >
                                            +
                                        </Button>
                                    </Grid>
                                    {detalles && detalles.length > 0 && detalles.map((detalle, index) => (
                                        <Grid size={12} sx={{ marginBottom: 2 }} key={index}>
                                            <Typography variant="body1">
                                                {detalle.articuloManufacturado ? (detalle.articuloManufacturado as ArticuloManufacturado).denominacion :
                                                    detalle.articuloInsumo?.denominacion} - {detalle.cantidad.toString()}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid size={12} sx={{ marginBottom: 2 }}>
                                <Button variant="contained" type="submit" disabled={isSubmitting}>
                                    {promocion ? "Actualizar" : "Crear"}
                                </Button>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Grid>
            <Modal open={viewForm} onClose={() => setViewForm(false)} title="Agregar artículo">
                <DetallePromocionForm detalles={detalles} setDetalles={setDetalles} setViewForm={setViewForm} />
            </Modal>
        </Grid>
    )
}

export default PromocionForm