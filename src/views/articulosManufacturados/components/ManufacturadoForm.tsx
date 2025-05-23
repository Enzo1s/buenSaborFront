import { Autocomplete, Box, Button, Grid, IconButton, Paper, styled, TextField, Typography } from '@mui/material'
import { Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'
import { crearArticuloManufacturado, getArticuloManufacturadoById } from '../../../Api/ArticuloManufacturadoAPI';
import { CategoriaArticuloManufacturado } from '../../../interfaces/CategoriaArticuloManufacturado';
import { PhotoCamera } from '@mui/icons-material';
import Modal from '../../../components/Modal';
import { ArticuloManufacturadoDetalle } from '../../../interfaces/ArticuloManufacturadoDetalle';
import DetalleManufacturadoForm from './DetalleManufacturadoForm';
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo';
import CategoriaManufacturadoForm from '../../categoria/CategoriaManufacturadoForm';
import { getAllCategoriaManufacturado } from '../../../Api/CategoriaManufacturadoAPI';
import { useNavigate, useParams } from 'react-router';

const Input = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const ManufacturadoForm = () => {

    const navigate = useNavigate();
    const {id} = useParams()

    const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null)
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [categorias, setCategorias] = useState<CategoriaArticuloManufacturado[]>([])
    const [viewForm, setViewForm] = useState(false)
    const [viewFormInsumo, setViewFormInsumo] = useState(false)
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([])

    const newCategoria = (categoria: CategoriaArticuloManufacturado) => {
        if (categoria !== null)
            setCategorias([...categorias, categoria])
        setViewForm(false)
    }

    const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newPreviewUrls: string[] = [];
            const readers: FileReader[] = [];
            const base64Results: (string | null)[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                readers.push(reader);
                reader.onloadend = () => {
                    newPreviewUrls.push(reader.result as string);
                    base64Results.push(reader.result as string);
                    if (base64Results.length === files.length) {
                        setPreviewUrls([...previewUrls, ...newPreviewUrls]);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }, []);

    const handleRemoveImage = useCallback((indexToRemove: number) => {
        const newPreviewUrls = previewUrls.filter((_, index) => index !== indexToRemove);
        setPreviewUrls(newPreviewUrls);
    }, [previewUrls]);

    const getArticuloManufacturado = async () => {
        try {
            if (id !== undefined) {
                const { data } = await getArticuloManufacturadoById(id)
                console.log("data", data)
                setArticulo(data);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getArticuloManufacturado()
    }, [id])

    useEffect(() => {
      const listCategorias = async () => {
        const { data } = await getAllCategoriaManufacturado()
        setCategorias(data)
      }
      listCategorias()
    }, [])

    return (
        <Grid container spacing={2} alignContent={"center"} justifyContent="center" sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            <Grid size={12}>
                <Typography variant="h2">Nuevo Articulo</Typography>
            </Grid>
            <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid size={12} sx={{ width: "100%" }}>
                    <Formik
                    enableReinitialize
                        initialValues={{
                            denominacion: articulo?.denominacion || '',
                            descripcion: articulo?.descripcion || '',
                            precioCosto: articulo?.precioCosto || 0,
                            precioVenta: articulo?.precioVenta || 0,
                            tiempoEstimado: articulo?.tiempoEstimado || 0,
                            categoriaArticuloManufacturado: articulo?.categoriaArticuloManufacturado || null,
                            articuloManufacturadoDetalle: articulo?.articuloManufacturadoDetalle || [],
                            pathImagen: articulo?.pathImagen || []
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            const nuevoArticulo: ArticuloManufacturado = {
                                id: articulo?.id || null,
                                denominacion: values.denominacion,
                                descripcion: values.descripcion,
                                precioCosto: values.precioCosto,
                                precioVenta: values.precioVenta,
                                tiempoEstimado: values.tiempoEstimado,
                                categoriaArticuloManufacturado: values.categoriaArticuloManufacturado,
                                articuloManufacturadoDetalle: detalles,
                                pathImagen: previewUrls
                            }
                            await crearArticuloManufacturado(nuevoArticulo)
                            setSubmitting(false);
                            navigate("/articulo-manufacturado")
                        }}
                    >
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
                                <Grid container spacing={2} sx={{ width: "100%" }}>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="denominacion"
                                            name="denominacion"
                                            label="Denominación"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.denominacion}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="descripcion"
                                            name="descripcion"
                                            label="Descripción"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.descripcion}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="precioCosto"
                                            name="precioCosto"
                                            label="Precio costo"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.precioCosto}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="precioVenta"
                                            name="precioVenta"
                                            label="precio de venta"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.precioVenta}
                                        />
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }}>
                                        <TextField
                                            fullWidth
                                            id="tiempoEstimado"
                                            name="tiempoEstimado"
                                            label="Tiempo estimado"
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.tiempoEstimado}
                                        />
                                    </Grid>

                                    <Grid size={6} sx={{ marginBottom: 2 }} container>
                                        <Grid size={11}>
                                            <Autocomplete
                                                fullWidth
                                                id="categoriaArticuloManufacturado"
                                                value={values.categoriaArticuloManufacturado}
                                                options={categorias}
                                                onChange={(_, newValue) => {
                                                    setFieldValue("categoriaArticuloManufacturado", newValue);
                                                }}
                                                getOptionLabel={(option: CategoriaArticuloManufacturado) => option.denominacion as string}
                                                renderInput={(params) => <TextField {...params} label="Categoria" />}
                                            />
                                        </Grid>
                                        <Grid size={1}>
                                            <Button fullWidth variant="contained" type="button" onClick={() => setViewForm(true)} sx={{ height: "100%" }}>
                                                +
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid size={6} sx={{ marginBottom: 2 }} container>
                                        <Grid size={2}>
                                            <Typography variant="h6">Articulos</Typography>
                                        </Grid>
                                        <Grid size={1}>
                                            <Button fullWidth variant="contained" type="button" onClick={() => setViewFormInsumo(true)} >
                                                +
                                            </Button>
                                        </Grid>
                                        {detalles && detalles.length > 0 && detalles.map((detalle, index) => (
                                            <Grid size={12} sx={{ marginBottom: 2 }} key={index}>
                                                <Typography variant="body1">
                                                    {(detalle.articuloInsumo as ArticuloInsumo).denominacion} - {detalle.cantidad.toString()} {(detalle.articuloInsumo as ArticuloInsumo).unidadMedida}
                                                </Typography>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <label htmlFor="upload-image">
                                            <Input accept="image/*" id="upload-image" multiple type="file" onChange={handleImageChange} />
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                        {previewUrls.length > 0 && (
                                            <Box mt={2} width="100%">
                                                <Grid container spacing={2}>
                                                    {previewUrls.map((url, index) => (
                                                        <Grid size={{ xs: 12, md: 4, sm: 6 }} key={index}>
                                                            <Paper>
                                                                <Box display="flex" flexDirection="column" alignItems="center" p={1}>
                                                                    <img src={url} alt={`Vista previa ${index + 1}`} style={{ maxWidth: '150px', maxHeight: '150px' }} />
                                                                    <IconButton aria-label={`remove image ${index + 1}`} onClick={() => handleRemoveImage(index)} sx={{ mt: 1 }}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}
                                        {/* {previewUrls.length === 0 && (
                                    <TextField
                                        fullWidth
                                        label="Imágenes (Base64)"
                                        value={previewUrls.join(', ') || ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        helperText="Las imágenes se mostrarán aquí después de la selección."
                                        sx={{ mt: 2 }}
                                    />
                                )} */}
                                    </Box>
                                    <Grid size={12} sx={{ marginBottom: 2 }}>
                                        <Button variant="contained" type="submit" disabled={isSubmitting}>
                                            {articulo ? "Actualizar" : "Crear"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Grid>

            </Grid>
            <Modal open={viewForm} onClose={() => setViewForm(false)} title="Crear Categoria">
                <CategoriaManufacturadoForm setCategoria={newCategoria} />
            </Modal>
            <Modal open={viewFormInsumo} onClose={() => setViewFormInsumo(false)} title="Crear Insumo">
                <DetalleManufacturadoForm detalles={detalles} setDetalles={setDetalles} setViewFormInsumo={setViewFormInsumo} />
            </Modal>
        </Grid >
    )
}

export default ManufacturadoForm