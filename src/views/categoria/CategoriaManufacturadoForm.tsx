import { Button, Grid, TextField } from "@mui/material"
import { Formik } from "formik"
import { CategoriaArticuloManufacturado } from "../../interfaces/CategoriaArticuloManufacturado"
import { createCategoriaManufacturado } from "../../Api/CategoriaManufacturadoAPI"

export interface CategoriaFormProps {
  setCategoria: (value: CategoriaArticuloManufacturado) => void;
}


const CategoriaManufacturadoForm = (props: CategoriaFormProps) => {
  const { setCategoria } = props

  return (
    <Grid container spacing={2} alignContent={"center"} justifyContent="center" sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
      <Grid size={12}>
        <h2>Nuevo Categoria</h2>
      </Grid>
      <Grid container spacing={2}>
        <Formik
          initialValues={{
            denominacion: '',
            categoria: null
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const nuevaCategoria: CategoriaArticuloManufacturado = {
              id: null,
              denominacion: values.denominacion,
              alta: null,
              baja: null,
              modificacion: null
            }
            const { data } = await createCategoriaManufacturado(nuevaCategoria);
            setCategoria(data as CategoriaArticuloManufacturado)
            setSubmitting(false);
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid size={12} sx={{ marginBottom: 2 }}>
                <TextField
                  id="denominacion"
                  name="denominacion"
                  label="Denominación"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.denominacion}
                />
              </Grid>
              <Grid size={12} sx={{ marginBottom: 2 }}>
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  Crear
                </Button>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  )
}
export default CategoriaManufacturadoForm