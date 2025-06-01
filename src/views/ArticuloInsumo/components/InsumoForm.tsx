import { Autocomplete, Box, Button, Checkbox, FormControlLabel, FormGroup, Grid, IconButton, Paper, styled, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { PhotoCamera } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useEffect, useState } from "react";
import { CategoriaArticulo } from "../../../interfaces/CategoriaArticulo";
import CategoriaForm from "../../categoria/CategoriaForm";
import Modal from "../../../components/Modal";
import { createArticuloInsumo, getByIdArticuloInsumo } from "../../../Api/ArticuloInsumo";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { getAllCategoria } from "../../../Api/CategoriaAPI";
import { useNavigate, useParams } from "react-router";

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


const InsumoForm = () => {

    const {id} = useParams()

    const [articulo, setArticulo] = useState<ArticuloInsumo | null>(null)
    const [categorias, setCategorias] = useState<CategoriaArticulo[]>([])
    const [viewForm, setViewForm] = useState(false)
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const navigate = useNavigate()

    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="

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
      }, [ previewUrls]);


    const newCategoria = (categoria: CategoriaArticulo) => {
        if (categoria !== null)
            setCategorias([...categorias, categoria])
        setViewForm(false)
    }

    const getArticulo = async () => {
            try {
                if (id !== undefined) {
                    const { data } = await getByIdArticuloInsumo(id)
                    setArticulo(data);
                    setPreviewUrls(data.pathImagen?.map((img: String) => `${baseURL}${img}`) || []);
                }
            } catch (error) {
                console.log(error)
            }
        }
        useEffect(() => {
            getArticulo()
        }, [id])

    useEffect(() => {
        const getCategorias = async () => {
            const { data } = await getAllCategoria();
            
            setCategorias( [
  ...data,
  ...data.flatMap((categoria: CategoriaArticulo) => categoria.categoria || []),
]);
        }
        getCategorias()
    }, [])


    return (
        <Grid container spacing={2} alignContent={"center"} justifyContent="center" sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            <Grid size={12}>
                <Typography variant="h2">Nuevo Insumo</Typography>
            </Grid>
            <Grid container spacing={2} sx={{width: "100%"}}>
                <Grid size={12} sx={{width: "100%"}}>
                <Formik
                enableReinitialize
                    initialValues={{
                        denominacion: articulo?.denominacion || '',
                        precioCompra: articulo?.precioCompra || 0,
                        precioVenta: articulo?.precioVenta || 0,
                        esParaElaborar: id !== undefined ? articulo?.esParaElaborar : true,
                        unidadMedida: articulo?.unidadMedida || '',
                        categoriaArticulo: articulo?.categoriaArticulo || [],
                        pathImagen: articulo?.pathImagen || []
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        const nuevoInsumo: ArticuloInsumo = {
                            id: articulo?.id || null,
                            denominacion: values.denominacion,
                            precioCompra: values.precioCompra,
                            precioVenta: values.precioVenta,
                            esParaElaborar: values.esParaElaborar === true ? true : false,
                            unidadMedida: values.unidadMedida,
                            categoriaArticulo: values.categoriaArticulo,
                            pathImagen: previewUrls
                        }
                        await createArticuloInsumo(nuevoInsumo)
                        setSubmitting(false);
                        navigate("/articulo-insumo")
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
                            <Grid size={6} sx={{ marginBottom: 2}}>
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
                                    id="precioCompra"
                                    name="precioCompra"
                                    label="Precio de compra"
                                    variant="outlined"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.precioCompra}
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
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox name="esParaElaborar" id="esParaElaborar" value={values.esParaElaborar} onChange={handleChange} color="primary" />} label="Es para elaborar" />
                                </FormGroup>
                            </Grid>
                            <Grid size={6} sx={{ marginBottom: 2 }}>
                                <TextField
                                fullWidth
                                    id="unidadMedida"
                                    name="unidadMedida"
                                    label="Unidad de medida"
                                    variant="outlined"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.unidadMedida}
                                />
                            </Grid>
                            <Grid size={6} sx={{ marginBottom: 2 }} container>
                                <Grid size={11}>
                                <Autocomplete
                                fullWidth
                                    id="categoriaArticulo"
                                    value={values.categoriaArticulo}
                                    multiple
                                    options={categorias}
                                    onChange={(_, newValue) => {
                                        setFieldValue("categoriaArticulo", newValue);
                                    }}
                                    getOptionLabel={(option: CategoriaArticulo) => option.denominacion as string}
                                    renderInput={(params) => <TextField {...params} label="Categoria" />}
                                />
                                </Grid>
                                <Grid size={1}>
                                <Button fullWidth variant="contained" type="button" onClick={() => setViewForm(true)} sx={{ height: "100%" }}>
                                    +
                                </Button>
                                </Grid>
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
                                                <Grid  size={{xs:12, md:4, sm:6}} key={index}>
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
                <CategoriaForm setCategoria={newCategoria} />
            </Modal>
        </Grid >
    )
}

export default InsumoForm