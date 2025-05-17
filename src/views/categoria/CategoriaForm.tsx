import { Autocomplete, Button, Grid, TextField } from "@mui/material"
import { Formik } from "formik"
import { useEffect, useState } from "react"
import { crearCategoria, getAllCategoria } from "../../Api/CategoriaAPI"
import { CategoriaArticulo } from "../../interfaces/CategoriaArticulo"

export interface CategoriaFormProps {
  setCategoria: (value: CategoriaArticulo) => void;
  }

const CategoriaForm = (props: CategoriaFormProps) => {
  const { setCategoria } = props
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    const getCategorias = async () => {
      const {data} = await getAllCategoria();
      setCategorias(data);
    }
    getCategorias()
  }, [])
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
            const nuevaCategoria: CategoriaArticulo = {
              id: null,
              denominacion: values.denominacion,
              categoria: values.categoria
            }
            const { data } = await crearCategoria(nuevaCategoria);
            console.log(data)
            setCategoria(data as CategoriaArticulo)
            setSubmitting(false);
          }}
          >
            {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
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
                                <Autocomplete
                                    id="categoria"
                                    value={values.categoria}
                                    disablePortal
                                    options={categorias}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option: CategoriaArticulo) => option.denominacion as string}
                                    renderInput={(params) => <TextField {...params} label="Categoria" />}
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

export default CategoriaForm