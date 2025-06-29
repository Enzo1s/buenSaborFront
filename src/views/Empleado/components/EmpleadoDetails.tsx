import { useEffect, useState } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router";
import { Empleado } from "../../../interfaces/Empleado";
import { getByIdEmpleado } from "../../../Api/EmpleadoAPI";
import PedidoVentaTable from "../../PedidoVenta/components/PedidoVentaTable";

const EmpleadoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);

  const getEmpleado = async () => {
    if (id) {
      const { data } = await getByIdEmpleado(id);
      setEmpleado(data);
    }
  };

  useEffect(() => {
    getEmpleado();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, color: "#e0e0e0" }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: "12px",
              backgroundColor: "rgba(30, 30, 30, 0.9)",
              color: "#e0e0e0",
              boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                pb: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: "#f0f0f0",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                Detalle Empleado
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/empleado/editar/${empleado?.id}`)}
                  sx={{
                    ml: 2,
                    borderColor: "#FFC107",
                    color: "#FFC107",
                    "&:hover": {
                      backgroundColor: "rgba(255, 193, 7, 0.1)",
                      borderColor: "#FFC107",
                    },
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/empleado")}
                  sx={{
                    ml: 2,
                    borderColor: "#90CAF9",
                    color: "#90CAF9",
                    "&:hover": {
                      backgroundColor: "rgba(144, 202, 249, 0.1)",
                      borderColor: "#90CAF9",
                    },
                  }}
                >
                  Volver
                </Button>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Nombre y Apellido:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{empleado?.nombre} {empleado?.apellido}</Typography>
                            </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Correo:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{empleado?.email}</Typography>
                            </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Teléfono:</Typography>
                                <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 'bold' }}>{empleado?.telefono}</Typography>
                            </Grid>
              {/* <Grid size={12}>
                                <Typography variant='h6' sx={{ color: '#b0b0b0' }}>Cargo:</Typography>
                <Typography variant="h5">{empleado?.perfil}</Typography>
              </Grid> */}
              </Grid>
          </Paper>
        </Grid>
      </Grid>
      {empleado?.id && <PedidoVentaTable idEmpleado={empleado?.id} />}
    </Box>
  );
};

export default EmpleadoDetails;
