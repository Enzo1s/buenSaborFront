import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal as MuiModal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableSortLabel,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { Cliente } from "../../../interfaces/Cliente";
import { deleteCliente, getClientes } from "../../../Api/ClienteAPI";
import { useNavigate } from "react-router";

type Order = "asc" | "desc";

const ClienteTable = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[] | null>([]);
  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: String | null;
  }>({ open: false, id: null });
  const [loading, setLoading] = useState(false);

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Cliente>("nombre");
  const [searchNombreApellido, setSearchNombreApellido] = useState("");
  const [searchCliente, setSearchCliente] = useState("");

  const listadoClientes = async () => {
    setLoading(true);
    const { data } = await getClientes();
    setClientes(data);
    setLoading(false);
  };

  const handleDelete = async (id: String) => {
    try {
      await deleteCliente(id as string);
      setOpenDelete({ open: false, id: null });
      listadoClientes();
    } catch (error) {
      console.error("Error deleting cliente:", error);
    }
  };

  useEffect(() => {
    listadoClientes();
  }, []);

  const handleSort = (property: keyof Cliente) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredClientes = clientes
    ?.filter((c) =>
      `${c.nombre} ${c.apellido}`
        .toLowerCase()
        .includes(searchNombreApellido.toLowerCase())
    )
    .filter((c) =>
      c.usuario?.username.toLowerCase().includes(searchCliente.toLowerCase())
    );

  const sortedClientes = filteredClientes
    ? [...filteredClientes].sort((a, b) => {
        let aValue = a[orderBy];
        let bValue = b[orderBy];

        if (aValue instanceof Date && bValue instanceof Date) {
          return order === "asc"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

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

  return (
    <Box sx={{ p: 3, color: "#e0e0e0" }}>
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
          Listado de Clientes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/cliente/crear")}
          sx={{
            backgroundColor: "#4CAF50",
            "&:hover": { backgroundColor: "#388E3C" },
            color: "#ffffff",
            px: 3,
            py: 1.2,
            borderRadius: "8px",
          }}
        >
          Crear Cliente
        </Button>
      </Box>

      {/* Buscadores */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Buscar por Nombre y Apellido"
          variant="outlined"
          size="small"
          value={searchNombreApellido}
          onChange={(e) => setSearchNombreApellido(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Buscar por Cliente (usuario)"
          variant="outlined"
          size="small"
          value={searchCliente}
          onChange={(e) => setSearchCliente(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

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
            Cargando clientes...
          </Typography>
        </Box>
      ) : clientes && clientes.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={6}
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          <Table aria-label="tabla de clientes">
            <TableHead sx={{ backgroundColor: "rgba(50, 50, 50, 0.9)" }}>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "nombre"}
                    direction={orderBy === "nombre" ? order : "asc"}
                    onClick={() => handleSort("nombre")}
                    sx={{ color: "#f0f0f0" }}
                  >
                    Nombre y Apellido
                  </TableSortLabel>
                </TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleSort("email")}
                    sx={{ color: "#f0f0f0" }}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "usuario"}
                    direction={orderBy === "usuario" ? order : "asc"}
                    onClick={() => handleSort("usuario")}
                    sx={{ color: "#f0f0f0" }}
                  >
                    Usuario
                  </TableSortLabel>
                </TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell sx={{ width: "150px" }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedClientes.map((cliente) => (
                <TableRow
                  key={cliente.id?.toString() || `temp-${cliente.nombre}`}
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
                  >{`${cliente.nombre} ${cliente.apellido}`}</TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {cliente.telefono || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {cliente.email || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {cliente.usuario?.username || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {cliente.domicilio ? (
                      `${cliente.domicilio.calle || ""} ${
                        cliente.domicilio.numero || ""
                      }, ${cliente.domicilio.localidad?.nombre || ""} (${
                        cliente.domicilio.cp || ""
                      })`
                    ) : (
                      <Typography
                        component="span"
                        sx={{ fontStyle: "italic", color: "#999" }}
                      >
                        Sin dirección
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "1px solid #333" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/cliente/ver/${cliente.id}`)}
                      sx={{ "&:hover": { color: "#64B5F6" } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => navigate(`/cliente/editar/${cliente.id}`)}
                      sx={{ "&:hover": { color: "#BA68C8" } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setOpenDelete({ open: true, id: cliente?.id })
                      }
                      sx={{ "&:hover": { color: "#EF5350" } }}
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
          elevation={6}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "12px",
            backgroundColor: "rgba(30,30,30,0.9)",
            color: "#e0e0e0",
            boxShadow: "0px 8px 25px rgba(0,0,0,0.4)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h5" sx={{ color: "#f0f0f0", mb: 2 }}>
            No hay clientes registrados. ¡Crea el primero!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/cliente/crear")}
            sx={{
              mt: 3,
              backgroundColor: "#FFA726",
              "&:hover": { backgroundColor: "#FB8C00" },
              color: "#fff",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
            }}
          >
            Añadir Nueva Cliente
          </Button>
        </Paper>
      )}

      {/* Modal de eliminación */}
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            backgroundColor: "#424242",
            color: "#e0e0e0",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1, color: "#fff" }}>
                ¿Desea eliminar el cliente?
              </Typography>
              <Typography variant="body1" sx={{ color: "#a0a0a0" }}>
                El cliente quedará marcado como dado de baja.
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

export default ClienteTable;
