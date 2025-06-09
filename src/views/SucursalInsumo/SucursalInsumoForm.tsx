import { useEffect, useState } from 'react'
import { ArticuloInsumo } from '../../interfaces/ArticuloInsumo'
import { getListArticuloInsumo } from '../../Api/ArticuloInsumo'
import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material'
import { SucursalInsumo } from '../../interfaces/SucursalInsumo'
import { useNavigate, useParams } from 'react-router'
import { createSucursalInsumo, findByIdSucursalInsumo } from '../../Api/SucursalInsumoAPI'
import { Formik } from 'formik'
import { getByIdSucursal } from '../../Api/SucursalAPI'
import { SucursalEmpresa } from '../../interfaces/SucursalEmpresa'

const SucursalInsumoForm = () => {

    const { id, idSucursal } = useParams();
    const navigate = useNavigate()
    const [insumos, setInsumos] = useState<ArticuloInsumo[] | null>([])
    const [sucursalInsumo, setSucursalInsumo] = useState<SucursalInsumo | null>(null)
    const [sucursal, setSucursal] = useState<SucursalEmpresa | null>(null)

    const getInsumos = async () => {
        const { data } = await getListArticuloInsumo();
        setInsumos(data);
        if (id) {
            const { data: insumo } = await findByIdSucursalInsumo(id);
            setSucursalInsumo(insumo)
        }
        if (idSucursal) {
            const { data: sucEmpresa } = await getByIdSucursal(idSucursal);
            setSucursal(sucEmpresa)
        }
    }

    useEffect(() => {
        getInsumos()
    }, [])

    return (
        <Grid container spacing={2} alignContent={"center"} justifyContent="center">
            <Grid size={12}>
                <Typography variant='h2'>Nuevo Insumo</Typography>
            </Grid>
            <Grid container spacing={2} width={"100%"}>
                <Grid size={12} width={"100%"}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            id: sucursalInsumo?.id || null,
                            stockActual: sucursalInsumo?.stockActual || 0,
                            stockMinimo: sucursalInsumo?.stockMinimo || 0,
                            stockMaximo: sucursalInsumo?.stockMaximo || 0,
                            sucursalEmpresa: sucursalInsumo?.sucursalEmpresa || null,
                            articuloInsumo: sucursalInsumo?.articuloInsumo || null,
                            alta: sucursalInsumo?.alta || null,
                            baja: sucursalInsumo?.baja || null,
                            modificacion: sucursalInsumo?.modificacion || null
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const nuevoInsumo: SucursalInsumo = {
                                id: values.id,
                                stockActual: values.stockActual,
                                stockMinimo: values.stockMinimo,
                                stockMaximo: values.stockMaximo,
                                sucursalEmpresa: idSucursal ? sucursal:sucursalInsumo?.sucursalEmpresa ? sucursalInsumo.sucursalEmpresa : null,
                                articuloInsumo: values.articuloInsumo,
                                alta: values.alta,
                                baja: values.baja,
                                modificacion: values.modificacion
                            }
                            await createSucursalInsumo(nuevoInsumo);
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
                                    <Grid size={12} sx={{ marginBottom: 2 }}>
                                        <Autocomplete
                                            id="articuloInsumo"
                                            value={values.articuloInsumo}
                                            disablePortal
                                            options={insumos || []}
                                            onChange={(_, newValue) => {
                                                setFieldValue("articuloInsumo", newValue);
                                            }}
                                            getOptionLabel={(option: ArticuloInsumo) => option.denominacion as string}
                                            renderInput={(params) => <TextField {...params} label="Articulo Insumo" />}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="stockActual"
                                            name="stockActual"
                                            label="Stock Actual"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.stockActual}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="stockMinimo"
                                            name="stockMinimo"
                                            label="Stock Minimo"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.stockMinimo}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="stockMaximo"
                                            name="stockMaximo"
                                            label="Stock Máximo"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.stockMaximo}
                                        />
                                    </Grid>
                                    <Grid size={12} sx={{ marginBottom: 2 }}>
                                        <Button variant="contained" type="submit" disabled={isSubmitting}>
                                            {sucursalInsumo ? "Actualizar" : "Crear"}
                                        </Button>
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

export default SucursalInsumoForm