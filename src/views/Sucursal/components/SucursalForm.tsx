import { useEffect, useState } from 'react'
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { Domicilio } from '../../../interfaces/Domicilio';
import { Pais } from '../../../interfaces/Pais';
import { Provincia } from '../../../interfaces/Provincia';
import { Localidad } from '../../../interfaces/Localidad';
import { crearSucursalEmpresa, getByIdSucursal } from '../../../Api/SucursalAPI';
import { useNavigate, useParams } from 'react-router';

interface SucursalFormProps {
    sucursales: SucursalEmpresa[] | null;
    setSucursales: (sucursales: SucursalEmpresa[]) => void | null;
    setViewForm: (viewForm: boolean) => void | null;
    isFromCompany: boolean | null;
}

const SucursalForm = (props: SucursalFormProps) => {

    const { sucursales, setSucursales, setViewForm, isFromCompany } = props

    const [sucursal, setSucursal] = useState<SucursalEmpresa | null>(null)

    const navigate = useNavigate()
    const {id} = useParams()

    const getsucursal = async () => {
        if(id) {
            const { data } = await getByIdSucursal(id)
            setSucursal(data)
        }
    }

    useEffect(() => {
        getsucursal()
    }, [])
    
    return (
        <Grid sx={{ padding: 2}}>
            {!isFromCompany && <Grid size={12} >
                <Typography variant='h4'>Formulario de sucursal</Typography>
            </Grid>}
            <Grid container spacing={2} >
                <Grid size={12}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            id: sucursal?.id ||null,
                            nombre: sucursal?.nombre || '',
                            horarioApertura: sucursal?.horarioApertura || '',
                            horarioCierre: sucursal?.horarioCierre || '',
                            domicilio: sucursal?.domicilio || {
                                id: null,
                                calle: '',
                                numero: 0,
                                cp: 0,
                                localidad: {
                                    id: null,
                                    nombre: '',
                                    provincia: {
                                        id: null,
                                        nombre: '',
                                        pais: {
                                            id: null,
                                            nombre: '',
                                            alta: null,
                                            baja: null,
                                            modificacion: null
                                        } as Pais,
                                        alta: null,
                                        baja: null,
                                        modificacion: null
                                    } as Provincia,
                                    alta: null,
                                    baja: null,
                                    modificacion: null
                                } as Localidad,
                                alta: null,
                                baja: null,
                                modificacion: null
                            } as Domicilio,
                            alta: null,
                            baja: null,
                            modificacion: null
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const nuevaSucursal: SucursalEmpresa = {
                            id: null,
                            nombre: values.nombre,
                            horarioApertura: values.horarioApertura,
                            horarioCierre: values.horarioCierre,
                            domicilio: {
                                id: null,
                                calle: values.domicilio.calle,
                                numero: values.domicilio.numero,
                                cp: values.domicilio.cp,
                                localidad: {
                                    id: null,
                                    nombre: values.domicilio.localidad.nombre,
                                    provincia: {
                                        id: null,
                                        nombre: values.domicilio.localidad.provincia.nombre,
                                        pais: {
                                            id: null,
                                            nombre: values.domicilio.localidad.provincia.pais.nombre,
                                            alta: null,
                                            baja: null,
                                            modificacion: null
                                        } as Pais,
                                        alta: null,
                                        baja: null,
                                        modificacion: null
                                    } as Provincia,
                                    alta: null,
                                    baja: null,
                                    modificacion: null
                                } as Localidad,
                                alta: null,
                                baja: null,
                                modificacion: null
                            } as Domicilio,
                            alta: null,
                            baja: null,
                            modificacion: null
                        }
                            const {data} = await crearSucursalEmpresa(nuevaSucursal)
                            if(isFromCompany && sucursales) {
                                setSucursales([...sucursales, data])
                                setViewForm(false)
                            } else  {
                                setSubmitting(false);
                                navigate("/empresa")
                            }
                        }}>
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2} >
                                    <Grid size={6} >
                                        <TextField
                                            fullWidth
                                            id="nombre"
                                            name="nombre"
                                            label="Nombre"
                                            value={values.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="horarioApertura"
                                            name="horarioApertura"
                                            label="Horario Apertura"
                                            value={values.horarioApertura}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="horarioCierre"
                                            name="horarioCierre"
                                            label="Horario Cierre"
                                            value={values.horarioCierre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    {/* Domicilio */}
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="domicilio.calle"
                                            name="domicilio.calle"
                                            label="Calle"
                                            value={values.domicilio.calle}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="domicilio.numero"
                                            name="domicilio.numero"
                                            label="Numero"
                                            value={values.domicilio.numero}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="domicilio.cp"
                                            name="domicilio.cp"
                                            label="CP"
                                            value={values.domicilio.cp}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    {/* Localidad */}
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="domicilio.localidad.nombre"
                                            name="domicilio.localidad.nombre"
                                            label="Localidad"
                                            value={values.domicilio.localidad.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="domicilio.localidad.provincia.nombre"
                                            name="domicilio.localidad.provincia.nombre"
                                            label="Provincia"
                                            value={values.domicilio.localidad.provincia.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                    {/* pais */}
                                    <Grid size={6}>
                                        <TextField
                                            fullWidth
                                            id="domicilio.localidad.provincia.pais.nombre"
                                            name="domicilio.localidad.provincia.pais.nombre"
                                            label="País"
                                            value={values.domicilio.localidad.provincia.pais.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Grid size={6} sx={{ margin: 2 }}>
                                    <Button fullWidth variant="contained" type="submit" disabled={isSubmitting}>
                                        Guardar
                                    </Button>
                                </Grid>
                            </form>
                        )}

                    </Formik>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SucursalForm