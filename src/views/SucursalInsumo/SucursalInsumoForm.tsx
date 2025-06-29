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
            <Grid size={12}>
                <Typography  variant="h3"
                    component="h1"
                    sx={{
                        color: '#90CAF9',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 3,
                    }}>
                       {sucursalInsumo?.id ? "Editar Insumo" : "Crear Insumo"} </Typography>
            </Grid>
            
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
                                baja: null,
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
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }} sx={{ marginBottom: 2 }}>
                                        <Autocomplete
                                            id="articuloInsumo"
                                            value={values.articuloInsumo}
                                            disablePortal
                                            options={insumos || []}
                                            onChange={(_, newValue) => {
                                                setFieldValue("articuloInsumo", newValue);
                                            }}
                                            getOptionLabel={(option: ArticuloInsumo) => option.denominacion as string}
                                            renderInput={(params) => <TextField {...params} label="Articulo Insumo" variant="outlined"
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
                                                        }} />}
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
                                    <Grid size={12} sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}>
                                            {sucursalInsumo ? "Actualizar" : "Crear"}
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

export default SucursalInsumoForm