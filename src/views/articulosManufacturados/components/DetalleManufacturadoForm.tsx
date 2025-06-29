import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ArticuloManufacturadoDetalle } from "../../../interfaces/ArticuloManufacturadoDetalle";
import { Formik } from "formik";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { getListArticuloInsumo } from "../../../Api/ArticuloInsumo";

export interface DetalleManufacturadoFormProps {
  detalles: ArticuloManufacturadoDetalle[];
  setDetalles: (value: ArticuloManufacturadoDetalle[]) => void;
  setViewFormInsumo: (value: boolean) => void;
}

const DetalleManufacturadoForm = (props: DetalleManufacturadoFormProps) => {
  const { detalles, setDetalles, setViewFormInsumo } = props;
  const [listInsumos, setListInsumos] = useState<ArticuloInsumo[]>([]);

  useEffect(() => {
    const listInsumos = async () => {
      const { data } = await getListArticuloInsumo();
      setListInsumos(
        data.filter((insumo: ArticuloInsumo) => insumo.esParaElaborar === true)
      );
    };
    listInsumos();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      alignContent={"center"}
      justifyContent="center"
      sx={{
        backgroundColor: "rgba(35, 35, 35, 0.95)", // Fondo oscuro para la tarjeta del formulario
        padding: { xs: 2, md: 4 },
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
        color: "#e0e0e0", // Texto claro por defecto
        maxWidth: "1000px", // Mayor ancho para este formulario
        margin: "auto",
        mt: 5,
        border: "1px solid rgba(70, 70, 70, 0.5)",
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
          Nuevo Detalle
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Formik
          initialValues={{
            cantidad: 0,
            articuloInsumo: null,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            const nuevoDetalle: ArticuloManufacturadoDetalle = {
              id: null,
              cantidad: values.cantidad,
              articuloInsumo: values.articuloInsumo,
            };
            const detalle = [...detalles, nuevoDetalle];
            setDetalles(detalle);
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
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }} sx={{ marginBottom: 2 }}>
                  <Autocomplete
                    id="articuloInsumo"
                    value={values.articuloInsumo}
                    disablePortal
                    options={listInsumos}
                    onChange={(_, newValue) => {
                      setFieldValue("articuloInsumo", newValue);
                    }}
                    getOptionLabel={(option: ArticuloInsumo) =>
                      option.denominacion as string
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Articulo Insumo" />
                    )}
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
                <Grid container size={12} sx={{ marginBottom: 2 }}>
                  <Grid size={6}>
                    <TextField
                      id="cantidad"
                      name="cantidad"
                      label="Canidad"
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cantidad}
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
                  <Grid size={6}>
                    {values.articuloInsumo && (
                      <Typography variant="body1" sx={{ marginTop: 2 }}>
                        {(values.articuloInsumo as ArticuloInsumo).unidadMedida}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {detalles && detalles.length > 0 && (
                  <Grid
                    container
                    spacing={2}
                    size={12}
                    sx={{ marginBottom: 2 }}
                  >
                    {detalles.map((detalle, index) => (
                      <Grid size={12} key={index}>
                        <Typography variant="body1">
                          {
                            (detalle.articuloInsumo as ArticuloInsumo)
                              .denominacion
                          }{" "}
                          - {detalle.cantidad.toString()}{" "}
                          {
                            (detalle.articuloInsumo as ArticuloInsumo)
                              .unidadMedida
                          }
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                )}
                <Grid size={6}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Agregar
                  </Button>
                </Grid>
                <Grid size={6} justifyContent={"flex-end"} display={"flex"}>
                  <Button
                    variant="contained"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setViewFormInsumo(false)}
                  >
                    Finalizar
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default DetalleManufacturadoForm;
