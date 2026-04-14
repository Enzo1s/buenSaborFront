import {
    Grid,
    Typography,
    TextField,
    Button,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Modal as MuiModal,
    Box,
    Paper,
    Input,
} from '@mui/material';
import { Formik } from "formik";
import { PhotoCamera } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useEffect, useState } from "react";
import { CategoriaArticulo } from "../../../interfaces/CategoriaArticulo";
import CategoriaForm from "../../categoria/CategoriaForm";
import { createArticuloInsumo, getByIdArticuloInsumo } from "../../../Api/ArticuloInsumo";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { getAllCategoria } from "../../../Api/CategoriaAPI";
import { useNavigate, useParams } from "react-router";

const InsumoForm = () => {

    const {id} = useParams()

    const [articulo, setArticulo] = useState<ArticuloInsumo | null>(null)
    const [categorias, setCategorias] = useState<CategoriaArticulo[]>([])
    const [viewForm, setViewForm] = useState(false)
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const navigate = useNavigate()

    const baseURL = "http://localhost:8080/api/imagenes/"
    
    // Helper function to extract filename from full path
    const getFilename = (path: string) => path.split(/[\\/]/).pop() || path;

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
                    setPreviewUrls(data.pathImagen?.map((img: String) => `${baseURL}${getFilename(img as string)}`) || []);
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
        <Box sx={{ height: '100%', pb: 4, display: 'flex', justifyContent: 'center' }}>
            <Grid
                container
                spacing={2}
                alignContent="flex-start"
                sx={{
                    backgroundColor: 'rgba(35, 35, 35, 0.95)',
                    padding: { xs: 2, md: 4 },
                    borderRadius: '12px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                    color: '#e0e0e0',
                    maxWidth: '900px',
                    width: '100%',
                    maxHeight: '100%',
                    overflowY: 'auto',
                    border: '1px solid rgba(70, 70, 70, 0.5)'
                }}
            >
                <Grid size={12}>
                    <Typography
                        variant="h3"
                        component="h1"
           sx={{
             color: "#90CAF9",
             fontWeight: "bold",
             textAlign: "center",
             mb: 3,
           }}
         >
           {articulo ? "Editar Insumo" : "Nuevo Insumo"}
         </Typography>
       </Grid>
       <Grid size={12}>
         <Formik
           enableReinitialize
           initialValues={{
             denominacion: articulo?.denominacion || "",
             precioCompra: articulo?.precioCompra || 0,
             precioVenta: articulo?.precioVenta || 0,
             esParaElaborar: articulo?.esParaElaborar ?? true,
             unidadMedida: articulo?.unidadMedida || "",
             categoriaArticulo: articulo?.categoriaArticulo || [],
             pathImagen: articulo?.pathImagen || [],
           }}
           onSubmit={async (values, { setSubmitting }) => {
             const insumoToSend: ArticuloInsumo = {
               ...values,
               id: articulo?.id || null,
               esParaElaborar: values.esParaElaborar,
               pathImagen: previewUrls,
               alta: articulo?.alta || null,
               modificacion: articulo?.modificacion || null,
               baja: articulo?.baja || null,
             };
             await createArticuloInsumo(insumoToSend);
             setSubmitting(false);
             navigate("/articulo-insumo");
           }}
         >
           {({
             values,
             handleChange,
             handleBlur,
             handleSubmit,
             isSubmitting,
             setFieldValue,
           }) => (
             <form onSubmit={handleSubmit}>
               <Grid container spacing={3}>
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
                       backgroundColor: "rgba(70, 70, 70, 0.7)", //
                       borderRadius: "4px",
                       "& .MuiInputBase-input": { color: "#e0e0e0" },
                       "& .MuiInputLabel-root": {
                         color: "#a0a0a0",
                         "&.Mui-focused": { color: "#fff" },
                         "&.MuiFormLabel-filled": { color: "#fff" },
                       },
                       "& .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#757575",
                       },
                       "&:hover .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#e0e0e0",
                       },
                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#90CAF9",
                         borderWidth: "2px",
                       },
                     }}
                   />
                 </Grid>

                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField
                     fullWidth
                     id="precioCompra"
                     name="precioCompra"
                     label="Precio de Compra"
                     variant="outlined"
                     type="number"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.precioCompra}
                     inputProps={{ step: "0.01" }}
                     sx={{
                       backgroundColor: "rgba(70, 70, 70, 0.7)",
                       borderRadius: "4px",
                       "& .MuiInputBase-input": { color: "#e0e0e0" },
                       "& .MuiInputLabel-root": {
                         color: "#a0a0a0",
                         "&.Mui-focused": { color: "#fff" },
                         "&.MuiFormLabel-filled": { color: "#fff" },
                       },
                       "& .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#757575",
                       },
                       "&:hover .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#e0e0e0",
                       },
                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#90CAF9",
                         borderWidth: "2px",
                       },
                     }}
                   />
                 </Grid>

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
                       backgroundColor: "rgba(70, 70, 70, 0.7)",
                       borderRadius: "4px",
                       "& .MuiInputBase-input": { color: "#e0e0e0" },
                       "& .MuiInputLabel-root": {
                         color: "#a0a0a0",
                         "&.Mui-focused": { color: "#fff" },
                         "&.MuiFormLabel-filled": { color: "#fff" },
                       },
                       "& .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#757575",
                       },
                       "&:hover .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#e0e0e0",
                       },
                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#90CAF9",
                         borderWidth: "2px",
                       },
                     }}
                   />
                 </Grid>

                 <Grid
                   size={{ xs: 12, sm: 6 }}
                   sx={{ display: "flex", alignItems: "center" }}
                 >
                   <FormGroup>
                     <FormControlLabel
                       control={
                         <Checkbox
                           name="esParaElaborar"
                           id="esParaElaborar"
                           checked={!!values.esParaElaborar}
                           onChange={handleChange}
                           color="primary"
                           sx={{
                             color: "#90CAF9",
                             "&.Mui-checked": {
                               color: "#90CAF9",
                             },
                           }}
                         />
                       }
                       label={
                         <Typography sx={{ color: "#e0e0e0" }}>
                           Es para elaborar
                         </Typography>
                       }
                     />
                   </FormGroup>
                 </Grid>

                 <Grid size={{ xs: 12, sm: 6 }}>
                   <TextField
                     fullWidth
                     id="unidadMedida"
                     name="unidadMedida"
                     label="Unidad de Medida"
                     variant="outlined"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={values.unidadMedida}
                     sx={{
                       backgroundColor: "rgba(70, 70, 70, 0.7)",
                       borderRadius: "4px",
                       "& .MuiInputBase-input": { color: "#e0e0e0" },
                       "& .MuiInputLabel-root": {
                         color: "#a0a0a0",
                         "&.Mui-focused": { color: "#fff" },
                         "&.MuiFormLabel-filled": { color: "#fff" },
                       },
                       "& .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#757575",
                       },
                       "&:hover .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#e0e0e0",
                       },
                       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                         borderColor: "#90CAF9",
                         borderWidth: "2px",
                       },
                     }}
                   />
                 </Grid>

                 <Grid size={{ xs: 12, sm: 6 }}>
                   <Grid container spacing={1} alignItems="flex-end">
                     <Grid size={10}>
                       <Autocomplete
                         fullWidth
                         id="categoriaArticulo"
                         value={values.categoriaArticulo}
                         multiple
                         options={categorias}
                         onChange={(_, newValue) => {
                           setFieldValue("categoriaArticulo", newValue);
                         }}
                         getOptionLabel={(option: CategoriaArticulo) =>
                           (option.denominacion || "").toString()
                         }
                         isOptionEqualToValue={(option, value) =>
                           option.id === value.id
                         }
                         renderInput={(params) => (
                           <TextField
                             {...params}
                             label="Categorías"
                             variant="outlined"
                             sx={{
                               backgroundColor: "rgba(70, 70, 70, 0.7)",
                               borderRadius: "4px",
                               "& .MuiInputBase-input": { color: "#e0e0e0" },
                               "& .MuiInputLabel-root": {
                                 color: "#a0a0a0",
                                 "&.Mui-focused": { color: "#fff" },
                                 "&.MuiFormLabel-filled": { color: "#fff" },
                               },
                               "& .MuiOutlinedInput-notchedOutline": {
                                 borderColor: "#757575",
                               },
                               "&:hover .MuiOutlinedInput-notchedOutline": {
                                 borderColor: "#e0e0e0",
                               },
                               "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                 {
                                   borderColor: "#90CAF9",
                                   borderWidth: "2px",
                                 },
                               "& .MuiChip-root": {
                                 backgroundColor: "#90CAF9",
                                 color: "#212121",
                               },
                               "& .MuiChip-deleteIcon": {
                                 color: "#212121",
                                 "&:hover": { color: "#424242" },
                               },
                             }}
                           />
                         )}
                       />
                     </Grid>
                     <Grid size={2}>
                       <Button
                         fullWidth
                         variant="contained"
                         type="button"
                         onClick={() => setViewForm(true)}
                         sx={{ height: "56px", minWidth: "40px" }}
                       >
                         +
                       </Button>
                     </Grid>
                   </Grid>
                 </Grid>

                 <Grid size={12}>
                   <Box
                     sx={{
                       display: "flex",
                       flexDirection: "column",
                       alignItems: "center",
                       p: 2,
                       border: "1px dashed #757575",
                       borderRadius: "8px",
                       backgroundColor: "rgba(70, 70, 70, 0.5)",
                     }}
                   >
                     <label htmlFor="upload-image">
                       <Input
                         inputProps={{ accept: "image/*", multiple: true }}
                         id="upload-image"
                         type="file"
                         onChange={handleImageChange}
                         sx={{ display: "none" }}
                       />
                       <IconButton
                         color="primary"
                         aria-label="upload picture"
                         component="span"
                         sx={{ fontSize: 40 }}
                       >
                         <PhotoCamera
                           sx={{ fontSize: "inherit", color: "#90CAF9" }}
                         />
                       </IconButton>
                       <Typography
                         variant="body2"
                         sx={{ color: "#a0a0a0", mt: 1 }}
                       >
                         Click para subir imágenes
                       </Typography>
                     </label>
                     {previewUrls.length > 0 && (
                       <Box mt={3} sx={{ width: "100%" }}>
                         <Typography variant="h6" sx={{ color: "#fff", mb: 2 }}>
                           Imágenes Cargadas:
                         </Typography>
                         <Grid container spacing={2} justifyContent="center">
                           {previewUrls.map((url, index) => (
                             <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                               <Paper
                                 elevation={3}
                                 sx={{
                                   backgroundColor: "rgba(50, 50, 50, 0.8)",
                                   borderRadius: "8px",
                                   p: 1,
                                   display: "flex",
                                   flexDirection: "column",
                                   alignItems: "center",
                                 }}
                               >
                                 <img
                                   src={url}
                                   alt={`Vista previa ${index + 1}`}
                                   style={{
                                     maxWidth: "100%",
                                     maxHeight: "180px",
                                     objectFit: "contain",
                                     borderRadius: "4px",
                                   }}
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

                 <Grid
                   size={12}
                   sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}
                 >
                   <Button
                     variant="contained"
                     color="primary"
                     type="submit"
                     disabled={isSubmitting}
                     sx={{ px: 4, py: 1.5, fontWeight: "bold" }}
                   >
                     {isSubmitting
                       ? articulo
                         ? "Actualizando..."
                         : "Creando..."
                       : articulo
                         ? "Actualizar"
                         : "Crear"}
                   </Button>
                 </Grid>
               </Grid>
             </form>
           )}
         </Formik>
       </Grid>

       <MuiModal open={viewForm} onClose={() => setViewForm(false)}>
         <Box
           sx={{
             position: "absolute",
             top: "50%",
             left: "50%",
             transform: "translate(-50%, -50%)",
             width: { xs: "90%", sm: 400 },
             bgcolor: "background.paper",
             boxShadow: 24,
             p: 4,
             borderRadius: "8px",
             backgroundColor: "#424242",
             color: "#e0e0e0",
           }}
         >
           <CategoriaForm setCategoria={newCategoria} />
           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
             <Button
               variant="outlined"
               color="inherit"
               onClick={() => setViewForm(false)}
               sx={{
                 mr: 2,
                 borderColor: "#a0a0a0",
                 color: "#a0a0a0",
                 "&:hover": { borderColor: "#fff", color: "#fff" },
               }}
             >
               Cerrar
             </Button>
           </Box>
         </Box>
       </MuiModal>
     </Grid>
    </Box>
   );
}

export default InsumoForm