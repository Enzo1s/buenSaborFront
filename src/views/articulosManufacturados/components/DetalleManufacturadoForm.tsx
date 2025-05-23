import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { ArticuloManufacturadoDetalle } from '../../../interfaces/ArticuloManufacturadoDetalle';
import { Formik } from 'formik';
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo';
import { getListArticuloInsumo } from '../../../Api/ArticuloInsumo';

export interface DetalleManufacturadoFormProps {
  detalles: ArticuloManufacturadoDetalle[];
  setDetalles: (value: ArticuloManufacturadoDetalle[]) => void;
  setViewFormInsumo: (value: boolean) => void
}

const DetalleManufacturadoForm = (props: DetalleManufacturadoFormProps) => {
  const { detalles, setDetalles, setViewFormInsumo } = props
  const [listInsumos, setListInsumos] = useState<ArticuloInsumo[]>([])

  useEffect(() => {
    const listInsumos = async () => {
      const { data } = await getListArticuloInsumo()
      setListInsumos(data)
    }
    listInsumos()
  }, [])


  return (
    <Grid container spacing={2} alignContent={"center"} justifyContent="center" sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
      <Grid size={12}>
        <h2>Nuevo Detalle</h2>
      </Grid>
      <Grid container spacing={2}>
        <Formik
          initialValues={{
            cantidad: 0,
            articuloInsumo: null
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const nuevoDetalle: ArticuloManufacturadoDetalle = {
              id: null,
              cantidad: values.cantidad,
              articuloInsumo: values.articuloInsumo
            }
            const detalle = [...detalles, nuevoDetalle]
            setDetalles(detalle)
            setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={12} sx={{ marginBottom: 2 }}>
                  <Autocomplete
                    id="articuloInsumo"
                    value={values.articuloInsumo}
                    disablePortal
                    options={listInsumos}
                    onChange={(_, newValue) => {
                      setFieldValue("articuloInsumo", newValue);
                    }}
                    getOptionLabel={(option: ArticuloInsumo) => option.denominacion as string}
                    renderInput={(params) => <TextField {...params} label="Articulo Insumo" />}
                  />
                </Grid>
                <Grid container size={12} sx={{ marginBottom: 2 }}>
                  <Grid size={6} >
                    <TextField
                      id="cantidad"
                      name="cantidad"
                      label="Canidad"
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cantidad}
                    />
                  </Grid>
                  <Grid size={6} >
                    {values.articuloInsumo && (
                      <Typography variant="body1" sx={{ marginTop: 2 }}>
                        {(values.articuloInsumo as ArticuloInsumo).unidadMedida}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {detalles && detalles.length > 0 && (
                  <Grid container spacing={2} size={12} sx={{ marginBottom: 2 }}>
                    {detalles.map((detalle, index) => (
                      <Grid size={12} key={index}>
                        <Typography variant="body1">
                          {(detalle.articuloInsumo as ArticuloInsumo).denominacion} - {detalle.cantidad.toString()} {(detalle.articuloInsumo as ArticuloInsumo).unidadMedida}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                )}
                <Grid size={6} >
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    Crear
                  </Button>
                </Grid>
                <Grid size={6} justifyContent={"flex-end"} display={"flex"}>
                  <Button variant="contained" type="button" disabled={isSubmitting}
                    onClick={() => setViewFormInsumo(false)}>
                    Guardar
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

export default DetalleManufacturadoForm