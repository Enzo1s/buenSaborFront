import {
    Grid,
    Typography,
    TextField,
    Button,
    Autocomplete,
    IconButton,
    Modal as MuiModal,
    Box,
    Paper,
    Input,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik'
import { Key, useCallback, useEffect, useState } from 'react';
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'
import { crearArticuloManufacturado, getArticuloManufacturadoById } from '../../../Api/ArticuloManufacturadoAPI';
import { CategoriaArticuloManufacturado } from '../../../interfaces/CategoriaArticuloManufacturado';
import { ArticuloManufacturadoDetalle } from '../../../interfaces/ArticuloManufacturadoDetalle';
import DetalleManufacturadoForm from './DetalleManufacturadoForm';
import CategoriaManufacturadoForm from '../../categoria/CategoriaManufacturadoForm';
import { getAllCategoriaManufacturado } from '../../../Api/CategoriaManufacturadoAPI';
import { useNavigate, useParams } from 'react-router';


const ManufacturadoForm = () => {

    const navigate = useNavigate();
    const { id } = useParams()

    const [articulo, setArticulo] = useState<ArticuloManufacturado | null>(null)
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [categorias, setCategorias] = useState<CategoriaArticuloManufacturado[]>([])
    const [viewForm, setViewForm] = useState(false)
    const [viewFormInsumo, setViewFormInsumo] = useState(false)
    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([])
    const baseURL = "http://localhost:8080/api/articulo-manufacturado/imagen?path="

    const newCategoria = (categoria: CategoriaArticuloManufacturado) => {
        if (categoria !== null)
            setCategorias([...categorias, categoria])
        setViewForm(false)
    }

    const handleRemoveDetalle = (indexToRemove: number) => {
        setDetalles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

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
                setArticulo(data);
                setDetalles(data.articuloManufacturadoDetalle || []);
                setPreviewUrls(data.pathImagen?.map((img: String) => `${baseURL}${img}`) || []);
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
        <Grid
            container
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
            }}
        >
            <Grid size={12}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        color: '#90CAF9',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 3,
                    }}
                >
                    {articulo ? "Editar Artículo Manufacturado" : "Nuevo Artículo Manufacturado"}
                </Typography>
            </Grid>
            <Grid size={12}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        denominacion: articulo?.denominacion || '',
                        descripcion: articulo?.descripcion || '',
                        precioCosto: articulo?.precioCosto || 0,
                        precioVenta: articulo?.precioVenta || 0,
                        tiempoEstimado: articulo?.tiempoEstimado || 0, // Ajustado el nombre del campo
                        categoriaArticuloManufacturado: articulo?.categoriaArticuloManufacturado || null,
                        articuloManufacturadoDetalle: articulo?.articuloManufacturadoDetalle || [], // Mantener para Formik, pero usaremos `detalles` del estado
                        pathImagen: articulo?.pathImagen || []
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        const articuloToSend: ArticuloManufacturado = {
                            ...values,
                            id: articulo?.id || null,
                            tiempoEstimado: values.tiempoEstimado,
                            articuloManufacturadoDetalle: detalles, // Usar el estado `detalles`
                            pathImagen: previewUrls, // Usar el estado `previewUrls`
                            alta: articulo?.alta || null,
                            modificacion: null,
                            baja: articulo?.baja || null,
                        };
                        console.log("Datos a enviar:", articuloToSend);
                        await crearArticuloManufacturado(articuloToSend);
                        setSubmitting(false);
                        navigate("/articulo-manufacturado");
                    }}
                >
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
                                {/* Denominación */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="denominacion"
                                        name="denominacion"
                                        label="Denominación"
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.denominacion}
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

                                {/* Descripción */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="descripcion"
                                        name="descripcion"
                                        label="Descripción"
                                        variant="outlined"
                                        multiline // Permite múltiples líneas
                                        rows={1} // Altura inicial de 1 fila
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.descripcion}
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

                                {/* Precio Costo */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="precioCosto"
                                        name="precioCosto"
                                        label="Precio Costo"
                                        variant="outlined"
                                        type="number"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.precioCosto}
                                        inputProps={{ step: "0.01" }}
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

                                {/* Precio Venta */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="precioVenta"
                                        name="precioVenta"
                                        label="Precio de Venta"
                                        variant="outlined"
                                        type="number"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.precioVenta}
                                        inputProps={{ step: "0.01" }}
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

                                {/* Tiempo Estimado */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        id="tiempoEstimado"
                                        name="tiempoEstimado"
                                        label="Tiempo Estimado (minutos)"
                                        variant="outlined"
                                        type="number"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.tiempoEstimado}
                                        inputProps={{ min: 0 }}
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

                                {/* Categoría Articulo Manufacturado */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Grid container spacing={1} alignItems="flex-end">
                                        <Grid size={10}>
                                            <Autocomplete
                                                fullWidth
                                                id="categoriaArticuloManufacturado"
                                                value={values.categoriaArticuloManufacturado}
                                                options={categorias}
                                                onChange={(_, newValue) => {
                                                    setFieldValue("categoriaArticuloManufacturado", newValue);
                                                }}
                                                getOptionLabel={(option) => option.denominacion as string || ''}
                                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Categoría Manufacturado"
                                                        variant="outlined"
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
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={2}>
                                            <Button fullWidth variant="contained" type="button" onClick={() => setViewForm(true)} sx={{ height: "56px", minWidth: '40px' }}>
                                                +
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Detalles de Insumos (Articulos) */}
                                <Grid size={12}>
                                    <Box sx={{
                                        p: 2,
                                        border: '1px dashed #757575',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(70, 70, 70, 0.5)',
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#fff' }}>Insumos Necesarios</Typography>
                                            <Button variant="contained" color="primary" type="button" onClick={() => setViewFormInsumo(true)}>
                                                Añadir Insumo
                                            </Button>
                                        </Box>
                                        {detalles.length > 0 ? (
                                            <List sx={{ width: '100%' }}>
                                                {detalles.map((detalle, index) => (
                                                    <ListItem
                                                        key={detalle.id as Key || index} // Usa id si existe, sino index
                                                        sx={{
                                                            backgroundColor: 'rgba(50, 50, 50, 0.8)',
                                                            borderRadius: '4px',
                                                            mb: 1,
                                                            border: '1px solid rgba(80, 80, 80, 0.7)',
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography sx={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                                                                    {detalle.articuloInsumo?.denominacion}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography sx={{ color: '#a0a0a0' }}>
                                                                    Cantidad: {Number(detalle?.cantidad).toFixed(2)} {detalle.articuloInsumo?.unidadMedida}
                                                                </Typography>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDetalle(index)} color="error">
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: '#a0a0a0', textAlign: 'center' }}>
                                                Aún no se han añadido insumos.
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Sección de Carga y Previsualización de Imágenes */}
                                <Grid size={12}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        p: 2,
                                        border: '1px dashed #757575',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(70, 70, 70, 0.5)',
                                    }}>
                                        <label htmlFor="upload-image">
                                            <Input inputProps={{ accept: "image/*", multiple: true }} id="upload-image" type="file" onChange={handleImageChange} sx={{ display: 'none' }} />
                                            <IconButton color="primary" aria-label="upload picture" component="span" sx={{ fontSize: 40 }}>
                                                <PhotoCamera sx={{ fontSize: 'inherit', color: '#90CAF9' }} />
                                            </IconButton>
                                            <Typography variant="body2" sx={{ color: '#a0a0a0', mt: 1 }}>
                                                Click para subir imágenes
                                            </Typography>
                                        </label>
                                        {previewUrls.length > 0 && (
                                            <Box mt={3} sx={{ width: "100%" }}>
                                                <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Imágenes Cargadas:</Typography>
                                                <Grid container spacing={2} justifyContent="center">
                                                    {previewUrls.map((url, index) => (
                                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                                            <Paper
                                                                elevation={3}
                                                                sx={{
                                                                    backgroundColor: 'rgba(50, 50, 50, 0.8)',
                                                                    borderRadius: '8px',
                                                                    p: 1,
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <img
                                                                    src={url}
                                                                    alt={`Vista previa ${index + 1}`}
                                                                    style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '4px' }}
                                                                />
                                                                <IconButton
                                                                    aria-label={`remove image ${index + 1}`}
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    color="error"
                                                                    sx={{ mt: 1 }}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>

                                {/* Botón Guardar/Actualizar */}
                                <Grid size={12} sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
                                    >
                                        {isSubmitting ? (articulo ? "Actualizando..." : "Creando...") : (articulo ? "Actualizar" : "Crear")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Grid>

            {/* Modal para Crear Categoría Manufacturada */}
            <MuiModal open={viewForm} onClose={() => setViewForm(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 400 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        backgroundColor: '#424242',
                        color: '#e0e0e0',
                    }}
                >
                    <CategoriaManufacturadoForm setCategoria={newCategoria} />
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

            {/* Modal para Añadir/Editar Detalles de Insumos */}
            <MuiModal open={viewFormInsumo} onClose={() => setViewFormInsumo(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '90%', sm: 500 },
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                        backgroundColor: '#424242',
                        color: '#e0e0e0',
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={() => setViewFormInsumo(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DetalleManufacturadoForm detalles={detalles} setDetalles={setDetalles} setViewFormInsumo={setViewFormInsumo} />
                    {/* Se podría añadir un botón de cerrar aquí también si se desea */}
                </Box>
            </MuiModal>
        </Grid>
    )
}

export default ManufacturadoForm