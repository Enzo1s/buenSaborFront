import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
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
          setInsumos(aInsumos)
          setArticulos(data)
        }
        listArticulos()
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
            articuloManufacturado: null,
            articuloInsumo: null
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
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={12} sx={{ marginBottom: 2 }}>
                  <Autocomplete
                    id="articuloManufacturado"
                    value={values.articuloManufacturado}
                    disablePortal
                    options={articulos}
                    onChange={(_, newValue) => {
                      setFieldValue("articuloManufacturado", newValue);
                    }}
                    getOptionLabel={(option: ArticuloManufacturado) => option.denominacion as string}
                    renderInput={(params) => <TextField {...params} label="Articulo Manufacturado" />}
                  />
                </Grid>
                <Grid size={12} sx={{ marginBottom: 2 }}>
                  <Autocomplete
                    id="articuloInsumo"
                    value={values.articuloInsumo}
                    disablePortal
                    options={insumos}
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
                    {(values.articuloManufacturado || values.articuloInsumo) && (
                      <Typography variant="body1" sx={{ marginTop: 2 }}>
                        {
                        values.articuloManufacturado ? (values.articuloManufacturado as ArticuloManufacturado).denominacion :
                        values.articuloInsumo && (values.articuloInsumo as ArticuloInsumo).denominacion}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {detalles && detalles.length > 0 && (
                  <Grid container spacing={2} size={12} sx={{ marginBottom: 2 }}>
                    {detalles.map((detalle, index) => (
                      <Grid size={12} key={index}>
                        <Typography variant="body1">
                          {detalle.articuloManufacturado ? (detalle.articuloManufacturado as ArticuloManufacturado).denominacion :
                          detalle.articuloInsumo?.denominacion} - {detalle.cantidad.toString()}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                )}
                <Grid size={6} >
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    Agregar
                  </Button>
                </Grid>
                <Grid size={6} justifyContent={"flex-end"} display={"flex"}>
                  <Button variant="contained" type="button" disabled={isSubmitting}
                    onClick={() => setViewForm(false)}>
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