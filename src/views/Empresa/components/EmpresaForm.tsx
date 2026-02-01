import {
    Grid,
    Typography,
    TextField,
    Button,
    Autocomplete,
    Modal as MuiModal, // Renombramos para evitar conflictos
    Box,
    Paper,
} from '@mui/material';
import { Formik } from 'formik'
import { useEffect, useState } from 'react'
import { Empresa } from '../../../interfaces/Empresa'
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa'
import { crearEmpresa, getByIdEmpresa } from '../../../Api/EmpresaAPI'
import { getSucursales } from '../../../Api/SucursalAPI'
import { useNavigate, useParams } from 'react-router'
import Modal from '../../../components/Modal'
import SucursalForm from '../../Sucursal/components/SucursalForm'

const EmpresaForm = () => {
  const navigate = useNavigate()

  const [viewForm, setViewForm] = useState(false)
  const [sucursales, setSucursales] = useState<SucursalEmpresa[]>([])
  const [allSucursales, setAllSucursales] = useState<SucursalEmpresa[]>([])
  const [empresa, setEmpresa] = useState<Empresa | null>(null)

  const { id } = useParams()

  const getCompany = async () => {
    if (id) {
      const { data } = await getByIdEmpresa(id)
      setEmpresa(data)
      // Set the associated branches when editing an existing company
      // Only include active branches, but preserve inactive ones that are already associated
      const activeAssociatedBranches = data.sucursalEmpresa?.filter((sucursal: SucursalEmpresa) => sucursal.baja === null) || [];
      setSucursales(activeAssociatedBranches)
    }
  }

  useEffect(() => {
    getCompany()
    // Fetch all available branches
    const fetchAllSucursales = async () => {
      try {
        const response = await getSucursales();
        // Filter to only include active branches (where baja is null)
        const activeSucursales = response.data.filter((sucursal: SucursalEmpresa) => sucursal.baja === null);
        setAllSucursales(activeSucursales);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchAllSucursales();
  }, [])


  return (
    <Grid
            container
            spacing={2}
            alignContent={"center"}
            justifyContent="center"
            sx={{
                // Fondo para la tarjeta del formulario
                backgroundColor: 'rgba(35, 35, 35, 0.95)', // Fondo oscuro similar a las tarjetas de detalle
                padding: { xs: 2, md: 4 }, // Padding responsivo
                borderRadius: '12px', // Bordes redondeados
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)', // Sombra para profundidad
                color: '#e0e0e0', // Color de texto por defecto
                maxWidth: '900px', // Limita el ancho del formulario
                margin: 'auto', // Centra el formulario
                mt: 5, // Margen superior
                border: '1px solid rgba(70, 70, 70, 0.5)' // Borde sutil
            }}
        >
            <Grid size={12}>
                <Typography
                    variant='h3'
                    sx={{
                        color: '#90CAF9', // Color primario para el título
                        fontWeight: 'bold',
                        textAlign: 'center', // Centra el título
                        mb: 3, // Margen inferior
                    }}
                >
                    Formulario de Empresa
                </Typography>
            </Grid>

            <Grid size={12}> {/* Usamos item para el Formik para que ocupe todo el ancho */}
                <Formik
                    enableReinitialize
                    initialValues={{
                        id: empresa?.id || null,
                        nombre: empresa?.nombre || '',
                        razonSocial: empresa?.razonSocial || '',
                        cuil: empresa?.cuil || 0,
                        // Suponemos que sucursalEmpresa se manejará por su propio estado 'sucursales'
                        sucursalEmpresa: empresa?.sucursalEmpresa || [],
                        alta: empresa?.alta || null,
                        baja: empresa?.baja || null,
                        modificacion: empresa?.modificacion || null
                    }}
                    // validationSchema={validationSchema} // Descomentar si usas Yup
                    onSubmit={async (values, { setSubmitting }) => {
                        const empresaToSend: Empresa = {
                            ...values, // Coge todos los valores de Formik
                            sucursalEmpresa: sucursales, // Usa el estado de sucursales manejado localmente
                        };
                        console.log("Datos a enviar:", empresaToSend); // Para depuración
                        await crearEmpresa(empresaToSend); // O actualizarEmpresa
                        setSubmitting(false);
                        navigate("/empresa");
                    }}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        // errors, // Descomentar si usas validación
                        // touched, // Descomentar si usas validación
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}> {/* Espaciado consistente para los campos */}
                                {/* Campo Nombre */}
                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="nombre"
                                        name="nombre"
                                        label="Nombre"
                                        value={values.nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        // error={touched.nombre && Boolean(errors.nombre)} // Descomentar si usas validación
                                        // helperText={touched.nombre && errors.nombre} // Descomentar si usas validación
                                        variant="outlined"
                                        sx={{
                                            '& .MuiInputBase-input': { color: '#e0e0e0' }, // Color del texto que se escribe
                                            '& .MuiInputLabel-root': { color: '#a0a0a0' }, // Color del label
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' }, // Color del borde normal
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }, // Color del borde al hover
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9' }, // Color del borde al enfocar
                                        }}
                                    />
                                </Grid>

                                {/* Campo Razón Social */}
                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="razonSocial"
                                        name="razonSocial"
                                        label="Razón Social"
                                        value={values.razonSocial}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiInputBase-input': { color: '#e0e0e0' },
                                            '& .MuiInputLabel-root': { color: '#a0a0a0' },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9' },
                                        }}
                                    />
                                </Grid>

                                {/* Campo CUIL */}
                                <Grid size={{xs:12, sm:6}}>
                                    <TextField
                                        fullWidth
                                        id="cuil"
                                        name="cuil"
                                        label="CUIL"
                                        type="number" // Asegura que sea un campo numérico
                                        value={values.cuil}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiInputBase-input': { color: '#e0e0e0' },
                                            '& .MuiInputLabel-root': { color: '#a0a0a0' },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9' },
                                        }}
                                    />
                                </Grid>

                                {/* Campo Sucursales (Autocomplete con botón Añadir) */}
                                <Grid size={{xs:12, sm:6}}>
                                    <Grid container spacing={1} alignItems="flex-end"> {/* Alinea el Autocomplete y el botón */}
                                        <Grid size={10}> {/* Autocomplete ocupa 10 de 12 columnas */}
                                            <Autocomplete
                                                id="sucursalEmpresa"
                                                multiple
                                                value={sucursales} // Usa el estado local de sucursales
                                                options={allSucursales} // Mostrar todas las sucursales disponibles
                                                onChange={(_, newValue) => {
                                                    setSucursales(newValue); // Actualiza el estado local con la nueva selección
                                                }}
                                                getOptionLabel={(option: SucursalEmpresa) => option.nombre as string || 'Nueva Sucursal'}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Sucursales Asociadas"
                                                        variant="outlined"
                                                        sx={{
                                                            '& .MuiInputBase-input': { color: '#e0e0e0' },
                                                            '& .MuiInputLabel-root': { color: '#a0a0a0' },
                                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#757575' },
                                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#90CAF9' },
                                                            // Estilos para los chips (elementos seleccionados)
                                                            '& .MuiChip-root': {
                                                                backgroundColor: '#90CAF9', // Fondo de chip primario
                                                                color: '#212121', // Texto oscuro en el chip
                                                            },
                                                            '& .MuiChip-deleteIcon': {
                                                                color: '#212121', // Icono de eliminación oscuro
                                                                '&:hover': { color: '#424242' }
                                                            },
                                                        }}
                                                    />
                                                )}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                            />
                                        </Grid>
                                        <Grid size={2}> {/* Botón '+' ocupa 2 de 12 columnas */}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                type="button"
                                                onClick={() => setViewForm(true)}
                                                sx={{ height: "56px", minWidth: '40px' }} // Altura y ancho para que coincida con TextField
                                            >
                                                +
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Botón Guardar */}
                                <Grid size={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                                    >
                                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Grid>

            {/* Modal para Crear Sucursal */}
            <MuiModal open={viewForm} onClose={() => setViewForm(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 500 },
                        bgcolor: 'background.paper', // Usa el color del tema para modals
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        backgroundColor: '#424242', // Fondo oscuro para el modal
                        color: '#e0e0e0', // Texto claro en el modal
                    }}
                >
                    <SucursalForm
                        setSucursales={setSucursales}
                        sucursales={sucursales}
                        setViewForm={setViewForm}
                        isFromCompany={true}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => setViewForm(false)}
                            sx={{ mr: 2, borderColor: '#a0a0a0', color: '#a0a0a0', '&:hover': { borderColor: '#fff', color: '#fff' } }}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </MuiModal>
        </Grid>
  )
}

export default EmpresaForm