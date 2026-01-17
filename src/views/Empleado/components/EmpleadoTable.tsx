import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteEmpleado, getEmpleados } from "../../../Api/EmpleadoAPI";
import { Empleado } from "../../../interfaces/Empleado";
import { useNavigate } from "react-router";
import { Cargo } from "../../../enums/Cargo";

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

const EmpleadoTable = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [empleados, setEmpleados] = useState<Empleado[] | null>([]);
  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterNombre, setFilterNombre] = useState("");
  const [filterUsuario, setFilterUsuario] = useState("");
  const [filterCargo, setFilterCargo] = useState<string>("");
  const [filterEstado, setFilterEstado] = useState<string>("");

  const listadoEmpleados = async () => {
    try {
      setLoading(true);
      const { data } = await getEmpleados();
      setEmpleados(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEmpleado(id);
      listadoEmpleados();
      setOpenDelete({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting empleado:", error);
    }
  };

  useEffect(() => {
    listadoEmpleados();
  }, []);

  const sortedEmpleados = () => {
    if (!empleados) return [];
    let filtered = empleados.filter(
      (emp) =>
        emp.nombre?.toLowerCase().includes(filterNombre.toLowerCase()) &&
        (emp.usuario?.username || "")
          .toLowerCase()
          .includes(filterUsuario.toLowerCase()) &&
        (filterCargo ? emp.cargo === filterCargo : true) &&
        (filterEstado ?
          (filterEstado === "activo" ? !emp.baja : !!emp.baja)
          : true)
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case "nombre":
            aValue = a.nombre?.toLowerCase();
            bValue = b.nombre?.toLowerCase();
            break;
          case "apellido":
            aValue = a.apellido?.toLowerCase();
            bValue = b.apellido?.toLowerCase();
            break;
          case "email":
            aValue = a.email?.toLowerCase() || "";
            bValue = b.email?.toLowerCase() || "";
            break;
          case "usuario":
            aValue = a.usuario?.username?.toLowerCase() || "";
            bValue = b.usuario?.username?.toLowerCase() || "";
            break;
          case "cargo":
            aValue = a.cargo?.toLowerCase() || "";
            bValue = b.cargo?.toLowerCase() || "";
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  };

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Box sx={{ p: 3, color: "#e0e0e0" }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#f0f0f0", textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}
        >
          Listado de Empleados
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/empleado/crear")}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#388E3C" },
            color: "#ffffff",
            px: 3,
            py: 1.2,
            borderRadius: "8px",
          }}
        >
          Crear Empleado
        </Button>
      </Box>

      {/* Filtros */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          size="small"
          value={filterNombre}
          onChange={(e) => setFilterNombre(e.target.value)}
          sx={{ width: "20%" }}
        />
        <TextField
          label="Buscar por usuario"
          variant="outlined"
          size="small"
          value={filterUsuario}
          onChange={(e) => setFilterUsuario(e.target.value)}
          sx={{ width: "20%" }}
        />
        <FormControl sx={{ width: "15%" }} size="small">
          <InputLabel id="filter-cargo-label">Cargo</InputLabel>
          <Select
            labelId="filter-cargo-label"
            value={filterCargo}
            label="Cargo"
            onChange={(e) => setFilterCargo(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="CAJERO">Cajero</MenuItem>
            <MenuItem value="COCINERO">Cocinero</MenuItem>
            <MenuItem value="DELIVERY">Delivery</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: "15%" }} size="small">
          <InputLabel id="filter-estado-label">Estado</InputLabel>
          <Select
            labelId="filter-estado-label"
            value={filterEstado}
            label="Estado"
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 4,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "#90CAF9" }} />
          <Typography variant="h6" sx={{ ml: 2, mt: 2, color: "#b0b0b0" }}>
            Cargando empleados...
          </Typography>
        </Box>
      ) : empleados && empleados.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={6}
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
            overflow: "hidden",
          }}
        >
          <Table aria-label="tabla de empleados">
            <TableHead sx={{ backgroundColor: "rgba(50, 50, 50, 0.9)" }}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    cursor: "pointer",
                  }}
                  onClick={() => requestSort("nombre")}
                >
                  Nombre y Apellido
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Teléfono
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    cursor: "pointer",
                  }}
                  onClick={() => requestSort("email")}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    cursor: "pointer",
                  }}
                  onClick={() => requestSort("usuario")}
                >
                  Usuario
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    cursor: "pointer",
                  }}
                  onClick={() => requestSort("cargo")}
                >
                  Cargo
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    width: "150px",
                    borderBottom: "1px solid #444",
                  }}
                  align="center"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedEmpleados().map((empleado) => (
                <TableRow
                  key={empleado?.id?.toString() || `temp-${empleado.nombre}`}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(40, 40, 40, 0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(35, 35, 35, 0.8)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(60, 60, 60, 0.9) !important",
                    },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >{`${empleado.nombre} ${empleado.apellido}`}</TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {empleado.telefono || (
                      <Typography
                        component="span"
                        sx={{ fontStyle: "italic", color: "#999" }}
                      >
                        No disponible
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {empleado.email || (
                      <Typography
                        component="span"
                        sx={{ fontStyle: "italic", color: "#999" }}
                      >
                        No disponible
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {empleado.usuario?.username || (
                      <Typography
                        component="span"
                        sx={{ fontStyle: "italic", color: "#999" }}
                      >
                        No disponible
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {empleado.cargo || (
                      <Typography
                        component="span"
                        sx={{ fontStyle: "italic", color: "#999" }}
                      >
                        No asignado
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: empleado.baja ? "#ff6b6b" : "#66bb6a",
                      fontWeight: "bold",
                      borderBottom: "1px solid #333"
                    }}
                  >
                    {empleado.baja ? "Inactivo" : "Activo"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "1px solid #333" }}
                  >
                    <IconButton
                      aria-label="ver"
                      onClick={() => navigate(`/empleado/ver/${empleado.id}`)}
                      sx={{
                        color: "#90CAF9",
                        "&:hover": {
                          backgroundColor: "rgba(144, 202, 249, 0.1)",
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      aria-label="editar"
                      onClick={() =>
                        navigate(`/empleado/editar/${empleado.id}`)
                      }
                      sx={{
                        color: "#FFC107",
                        "&:hover": {
                          backgroundColor: "rgba(255, 193, 7, 0.1)",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="eliminar"
                      onClick={() =>
                        setOpenDelete({ open: true, id: empleado?.id })
                      }
                      sx={{
                        color: "#EF5350",
                        "&:hover": {
                          backgroundColor: "rgba(239, 83, 80, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            color: "#e0e0e0",
          }}
        >
          <Typography variant="h5">
            No hay empleados registrados. ¡Crea el primero!
          </Typography>
        </Paper>
      )}

      {/* Modal for Delete */}
      <Modal
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, id: null })}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: "12px",
            backgroundColor: "rgba(40, 40, 40, 0.95)",
            color: "#e0e0e0",
            maxWidth: 400,
            width: "90%",
            margin: "auto",
            mt: "10%",
          }}
        >
          <Typography variant="h5" gutterBottom>
            ¿Desea eliminar el empleado?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDelete({ open: false, id: null })}
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
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default EmpleadoTable;
