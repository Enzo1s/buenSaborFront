import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Empresa } from '../../../interfaces/Empresa'
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa'
import { crearEmpresa, getByIdEmpresa } from '../../../Api/EmpresaAPI'
import { useNavigate, useParams } from 'react-router'
import Modal from '../../../components/Modal'
import SucursalForm from '../../Sucursal/components/SucursalForm'

const EmpresaForm = () => {
  const navigate = useNavigate()

  const [viewForm, setViewForm] = useState(false)
  const [sucursales, setSucursales] = useState<SucursalEmpresa[]>([])
  const [empresa, setEmpresa] = useState<Empresa | null>(null)

  const { id } = useParams()

  const getCompany = async () => {
    if (id) {
      const { data } = await getByIdEmpresa(id)
      setEmpresa(data)
    }
  }

  useEffect(() => {
    getCompany()
  }, [])


  return (
    <Grid container spacing={2} alignContent={"center"} justifyContent="center" sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
      <Grid size={12}>
        <Typography variant='h3'>Formulario de Empresa</Typography>
      </Grid>
      <Grid container spacing={2} width={"100%"}>
        <Grid size={12} width={"100%"}>
          <Formik
            enableReinitialize
            initialValues={{
              id: empresa?.id || null,
              nombre: empresa?.nombre || '',
              razonSocial: empresa?.razonSocial || '',
              cuil: empresa?.cuil || 0,
              sucursalEmpresa: empresa?.sucursalEmpresa || [] as SucursalEmpresa[],
              alta: empresa?.alta || null,
              baja: empresa?.baja || null,
              modificacion: empresa?.modificacion || null
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const nuevaEmpresa: Empresa = {
                id: values.id,
                nombre: values.nombre,
                razonSocial: values.razonSocial,
                cuil: values.cuil,
                sucursalEmpresa: sucursales,
                alta: null,
                baja: null,
                modificacion: null
              }
              await crearEmpresa(nuevaEmpresa)
              setSubmitting(false);
              navigate("/empresa")
            }}>
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
                <Grid container spacing={2} width={"100%"}>
                  <Grid size={6}>
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
                      id="razonSocial"
                      name="razonSocial"
                      label="Razon Social"
                      value={values.razonSocial}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid size={6} >
                    <TextField
                      fullWidth
                      id="cuil"
                      name="cuil"
                      label="CUIL"
                      value={values.cuil}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                <Grid size={6} container spacing={2}>
                  <Grid size={11}>
                    <Autocomplete
                      id="sucursalEmpresa"
                      multiple
                      value={values.sucursalEmpresa}
                      options={sucursales}
                      onChange={(_, newValue) => {
                        setFieldValue("sucursalEmpresa", newValue);
                      }}
                      getOptionLabel={(option: SucursalEmpresa) => option.domicilio.calle as string}
                      renderInput={(params) => <TextField {...params} label="Sucursales" />}
                    />
                  </Grid>
                  <Grid size={1}>
                    <Button fullWidth variant="contained" type="button" onClick={() => setViewForm(true)} sx={{ height: "100%" }}>
                      +
                    </Button>
                  </Grid>
                </Grid>
                </Grid>
                <Grid size={2} sx={{ marginTop: 2 }}>
                  <Button fullWidth variant="contained" type="submit" disabled={isSubmitting}>
                    Guardar
                  </Button>
                </Grid>
              </form>
            )}

          </Formik>
        </Grid>
      </Grid>
      <Modal open={viewForm} onClose={() => setViewForm(false)} title="Crear Sucursal">
        <SucursalForm setSucursales={setSucursales} sucursales={sucursales} setViewForm={setViewForm} isFromCompany={true}/>
      </Modal>
    </Grid>
  )
}

export default EmpresaForm