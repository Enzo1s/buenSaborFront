import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Modal as MuiModal,
  Grid,
  TableSortLabel,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import { SucursalEmpresa } from "../../../interfaces/SucursalEmpresa";
import { deleteSucursal, getSucursales } from "../../../Api/SucursalAPI";
import { useNavigate } from "react-router";

const SucursalMain = () => {
  const [sucursales, setSucursales] = useState<SucursalEmpresa[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [searchNombre, setSearchNombre] = useState("");
  const [orderBy, setOrderBy] = useState<keyof SucursalEmpresa>("nombre");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  const listadoSucursales = async () => {
    setLoading(true);
    const { data } = await getSucursales();
    setSucursales(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSucursal(id);
      setOpenDelete({ open: false, id: null });
      listadoSucursales();
    } catch (error) {
      console.error("Error deleting sucursal:", error);
    }
  };

  const handleSort = (property: keyof SucursalEmpresa) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredSucursales = sucursales?.filter((s) =>
    s.nombre.toLowerCase().includes(searchNombre.toLowerCase())
  );

  const sortedSucursales = filteredSucursales
    ? [...filteredSucursales].sort((a, b) => {
        let aValue: any = a[orderBy];
        let bValue: any = b[orderBy];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return order === "asc" ? aValue - bValue : bValue - aValue;
        }

        aValue = aValue ? aValue.toString().toLowerCase() : "";
        bValue = bValue ? bValue.toString().toLowerCase() : "";
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  useEffect(() => {
    listadoSucursales();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh", color: "#e0e0e0" }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#90CAF9",
            textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
          }}
        >
          Listado de Sucursales
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#388E3C" },
            color: "#fff",
            px: 3,
            py: 1.2,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "1rem",
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate("/sucursal/crear")}
        >
          Crear Nueva Sucursal
        </Button>
      </Box>

      {/* Buscador por Nombre */}
      <Box mb={2} width="25%">
        <TextField
          label="Buscar por Nombre"
          variant="outlined"
          size="small"
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
          fullWidth
        />
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 6,
            minHeight: "50vh",
            backgroundColor: "rgba(25,25,25,0.8)",
            borderRadius: "12px",
            boxShadow: "0px 8px 25px rgba(0,0,0,0.4)",
          }}
        >
          <CircularProgress
            sx={{ color: "#90CAF9", mb: 2 }}
            size={60}
            thickness={5}
          />
          <Typography variant="h6" sx={{ ml: 2, color: "#f0f0f0" }}>
            Cargando sucursales...
          </Typography>
        </Box>
      ) : sortedSucursales && sortedSucursales.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={8}
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(30,30,30,0.9)",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <Table aria-label="tabla de sucursales">
            <TableHead sx={{ bgcolor: "rgba(40,40,40,0.95)" }}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#90CAF9",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === "nombre"}
                    direction={orderBy === "nombre" ? order : "asc"}
                    onClick={() => handleSort("nombre")}
                    sx={{ color: "#90CAF9" }}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sx={{
                    color: "#90CAF9",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Dirección
                </TableCell>
                <TableCell
                  sx={{
                    color: "#90CAF9",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Horarios
                </TableCell>
                <TableCell
                  sx={{
                    color: "#90CAF9",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "180px",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                  }}
                  align="center"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedSucursales.map((sucursal) => (
                <TableRow
                  key={sucursal?.id?.toString() || `temp-${sucursal.nombre}`}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(45,45,45,0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(35,35,35,0.8)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(60,60,60,0.9) !important",
                    },
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <TableCell sx={{ color: "#e0e0e0", borderBottom: "none" }}>
                    {sucursal.nombre}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0", borderBottom: "none" }}>
                    {sucursal.domicilio ? (
                      `${sucursal.domicilio.calle || ""} ${
                        sucursal.domicilio.numero || ""
                      }, ${sucursal.domicilio.localidad?.nombre || ""} (${
                        sucursal.domicilio.cp || ""
                      })`
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ fontStyle: "italic", color: "#b0b0b0" }}
                      >
                        Sin dirección
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0", borderBottom: "none" }}>
                    {`Desde: ${sucursal.horarioApertura || "N/A"} - Hasta: ${
                      sucursal.horarioCierre || "N/A"
                    }`}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: "none" }}>
                    <Box display="flex" justifyContent="center" gap={1}>
                      <IconButton
                        aria-label="ver"
                        onClick={() =>
                          sucursal.id &&
                          navigate(`/sucursal/ver/${sucursal.id}`)
                        }
                        disabled={!sucursal.id}
                        sx={{
                          color: "#90CAF9",
                          "&:hover": {
                            backgroundColor: "rgba(144, 202, 249,0.1)",
                          },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="editar"
                        onClick={() =>
                          sucursal.id &&
                          navigate(`/sucursal/editar/${sucursal.id}`)
                        }
                        disabled={!sucursal.id}
                        sx={{
                          color: "#FFB74D",
                          "&:hover": {
                            backgroundColor: "rgba(255,183,77,0.1)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="eliminar"
                        onClick={() =>
                          sucursal.id &&
                          setOpenDelete({ open: true, id: sucursal.id })
                        }
                        disabled={!sucursal.id}
                        sx={{
                          color: "#EF5350",
                          "&:hover": { backgroundColor: "rgba(239,83,80,0.1)" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          elevation={6}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "12px",
            backgroundColor: "rgba(25,25,25,0.9)",
            boxShadow: "0px 8px 25px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h5" sx={{ color: "#f0f0f0", mb: 2 }}>
            No hay sucursales registradas.
          </Typography>
          <Typography variant="body1" sx={{ color: "#b0b0b0", mb: 3 }}>
            ¡Parece que no se ha añadido ninguna sucursal aún!
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2196F3",
              "&:hover": { backgroundColor: "#1976D2" },
              color: "#fff",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate("/sucursal/crear")}
          >
            Añadir Nueva Sucursal
          </Button>
        </Paper>
      )}

      <MuiModal
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, id: null })}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "#424242",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            color: "#e0e0e0",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1, color: "#fff" }}>
                ¿Desea eliminar la sucursal?
              </Typography>
              <Typography variant="body1" sx={{ color: "#a0a0a0" }}>
                Esta acción es irreversible y el artículo quedará marcado como
                dado de baja.
              </Typography>
            </Grid>
            <Grid
              size={12}
              sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => setOpenDelete({ open: false, id: null })}
                sx={{
                  mr: 2,
                  borderColor: "#a0a0a0",
                  color: "#a0a0a0",
                  "&:hover": { borderColor: "#fff", color: "#fff" },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(openDelete.id ?? "")}
              >
                Eliminar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </MuiModal>
    </Box>
  );
};

export default SucursalMain;
