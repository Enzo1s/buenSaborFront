import { Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { PedidoVenta } from '../../../interfaces/PedidoVenta'
import { createPedidoVenta } from '../../../Api/PedidoVentaApi'
import { useNavigate } from 'react-router'

const PedidoVentaForm = () => {

    const navigate = useNavigate()
    const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null)
    return (
        <Grid container spacing={2} alignContent={"center"} justifyContent={"center"} >
            <Grid size={12}>
                <Typography variant='h2' >Nuevo Pedido</Typography>
            </Grid>
            <Grid container spacing={2} width={'100%'} >
                <Grid size={12} width={'100%'} >
                    <Formik
                        enableReinitialize
                        initialValues={{
                            id: pedidoVenta?.id || null,
                            horaEstimadaFinalizacion: pedidoVenta?.horaEstimadaFinalizacion || null,
                            subtotal: pedidoVenta?.subtotal || 0,
                            descuento: pedidoVenta?.descuento || 0,
                            gastosEnvio: pedidoVenta?.gastosEnvio || 0,
                            total: pedidoVenta?.total || 0,
                            totalCosto: pedidoVenta?.totalCosto || 0,
                            estado: pedidoVenta?.estado || '',
                            tipoEnvio: pedidoVenta?.tipoEnvio || '',
                            formaPago: pedidoVenta?.formaPago || '',
                            empleado: pedidoVenta?.empleado || null,
                            sucursal: pedidoVenta?.sucursal || null,
                            cliente: pedidoVenta?.cliente || null,
                            factura: pedidoVenta?.factura || null,
                            pedidoVentaDetalle: pedidoVenta?.pedidoVentaDetalle || null,
                            fechaPedido: pedidoVenta?.fechaPedido || null,
                            alta: pedidoVenta?.alta || null,
                            baja: null,
                            modificacion: pedidoVenta?.modificacion || null,
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const nuevoPedidoVenta: PedidoVenta = {
                                id: pedidoVenta?.id || null,
                                horaEstimadaFinalizacion: values.horaEstimadaFinalizacion,
                                subtotal: values.subtotal,
                                descuento: values.descuento,
                                gastosEnvio: values.gastosEnvio,
                                total: values.total,
                                totalCosto: values.totalCosto,
                                estado: values.estado,
                                tipoEnvio: values.tipoEnvio,
                                formaPago: values.formaPago,
                                empleado: values.empleado,
                                sucursal: values.sucursal,
                                cliente: values.cliente,
                                factura: values.factura,
                                pedidoVentaDetalle: values.pedidoVentaDetalle,
                                fechaPedido: values.fechaPedido,
                                alta: pedidoVenta?.alta || null,
                                baja: null,
                                modificacion: pedidoVenta?.modificacion || null,
                            };
                            await createPedidoVenta(nuevoPedidoVenta);
                            setSubmitting(false);
                            navigate(-1);
                        }} >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TimePicker
                                            label="Selecciona una hora"
                                            value={values.horaEstimadaFinalizacion}
                                            onChange={(newValue) => setFieldValue("horaEstimadaFinalizacion",newValue)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="subtotal"
                                            name="subtotal"
                                            label="Subtotal"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.subtotal}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="descuento"
                                            name="descuento"
                                            label="Descuento"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.descuento}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="gastosEnvio"
                                            name="gastosEnvio"
                                            label="Gastos Envio"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.gastosEnvio}
                                        />
                                    </Grid>
                                    
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default PedidoVentaForm