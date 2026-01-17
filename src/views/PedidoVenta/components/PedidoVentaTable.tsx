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
  TextField,
  Autocomplete,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";

import { useEffect, useState } from "react";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import { Empleado } from "../../../interfaces/Empleado";
import { useNavigate } from "react-router";
import {
  gePedidoVenta,
  getPedidoVentaByEmpleadoId,
  updateStatusPedidoVenta,
  updatePedidoVenta,
} from "../../../Api/PedidoVentaApi";
import { getEmpleados } from "../../../Api/EmpleadoAPI";
import { format } from "date-fns";
import { Estado } from "../../../enums/Estado";
import { Cargo } from "../../../enums/Cargo";
import { useAuth } from "../../../Context/authContext";
import axios from "axios";

interface PedidoVentaTableProps {
  idEmpleado: string | null;
}

const PedidoVentaTable = (props: PedidoVentaTableProps) => {
  const { idEmpleado } = props;
  const { empleado: authEmpleado } = useAuth();

  const [pedidosVenta, setPedidosVenta] = useState<PedidoVenta[] | null>([]);
  const [pedidosVentaBefore, setPedidosVentaBefore] = useState<PedidoVenta[] | null>([])
  const [loading, setLoading] = useState(false);
  const [viewFormStatus, setViewFormStatus] = useState(false);
  const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
  const [modalExcelOpen, setModalExcelOpen] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [filterEstado, setFilterEstado] = useState<string[]>([]);
  const [filterEmpleadoCargo, setFilterEmpleadoCargo] = useState<string[]>([]);

  const navigate = useNavigate();

  const listadoPedidosVenta = async () => {
    setLoading(true);
    try {
      let data;

      if (idEmpleado) {
        const response = await getPedidoVentaByEmpleadoId(idEmpleado);
        data = response.data;
      } else if (authEmpleado && authEmpleado.cargo) {
        const response = await gePedidoVenta();
        data = response.data;
      } else {
        const response = await gePedidoVenta();
        data = response.data;
      }

      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.fechaPedido);
        const dateB = new Date(b.fechaPedido);
        return dateB.getTime() - dateA.getTime();
      });

      setPedidosVenta(sortedData);
      setPedidosVentaBefore(sortedData);

      if (authEmpleado && authEmpleado.cargo) {
        if (authEmpleado.cargo !== "CAJERO") {
          setFilterEmpleadoCargo([authEmpleado.cargo]);
        }
      }
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const listadoEmpleados = async () => {
    setLoadingEmpleados(true);
    try {
      const response = await getEmpleados();
      setEmpleados(response.data);
    } catch (error) {
      console.error("Error al cargar los empleados:", error);
    } finally {
      setLoadingEmpleados(false);
    }
  };

  const getPdf = async (id: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reportes/pdf?id=${id}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = "reporte.pdf";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };

  const getExcel = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Por favor, complete ambas fechas");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/reportes/excel",
        {
          fechaDesde: fechaDesde,
          fechaHasta: fechaHasta,
        },
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const contentDisposition = response.headers["content-disposition"];
      let filename = "ReportePedidos.xlsx";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setModalExcelOpen(false);
    } catch (error) {
      console.error("Error al generar el Excel:", error);
    }
  };


  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  // Función para aplicar todos los filtros
  const applyFilters = () => {
    if (!pedidosVentaBefore) {
      setPedidosVenta([]);
      return;
    }

    let filtered = [...pedidosVentaBefore];

    if (filterEstado.length > 0) {
      filtered = filtered.filter(pedido =>
        filterEstado.includes(pedido.estado)
      );
    }

    if (filterEmpleadoCargo.length > 0) {
      filtered = filtered.filter(pedido =>
        pedido.empleado && filterEmpleadoCargo.includes(pedido.empleado.cargo || '')
      );
    }

    // Aplicar también el filtro de búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((pedido) =>
        pedido.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente?.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${pedido.cliente?.nombre.toLowerCase()} ${pedido.cliente?.apellido.toLowerCase()}`.includes(searchTerm.toLowerCase()) ||
        pedido.empleado?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.empleado?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${pedido.empleado?.nombre?.toLowerCase()} ${pedido.empleado?.apellido?.toLowerCase()}`.includes(searchTerm.toLowerCase()) ||
        pedido.pedidoVentaDetalle?.some(detalle => detalle?.articuloInsumo ?
           detalle?.articuloInsumo?.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) :
           detalle?.articuloManufacturado?.denominacion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    const sortedFiltered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.fechaPedido);
      const dateB = new Date(b.fechaPedido);
      return dateB.getTime() - dateA.getTime();
    });

    setPedidosVenta(sortedFiltered);
  };

  // Actualizar los filtros cuando cambian
  useEffect(() => {
    applyFilters();
  }, [filterEstado, filterEmpleadoCargo, pedidosVentaBefore, searchTerm]);

  useEffect(() => {
    listadoPedidosVenta();
  }, []);

  useEffect(() => {
    if (viewFormStatus) {
      listadoEmpleados();
    }
  }, [viewFormStatus]);

  const getEstadoColor = (estado: Estado | null) => {
    switch (estado) {
      case Estado.PENDIENTE:
        return "#FFC107";
      case Estado.PREPARACION:
        return "#FF9800";
      case Estado.RECHAZADO:
        return "#EF5350";
      case Estado.ENTREGADO:
        return "#66BB6A";
      case Estado.CANCELADO:
        return "#EF5350";
      default:
        return "#B0B0B0";
    }
  };

  return (
    <Box sx={{ p: 3, color: "#e0e0e0" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#f0f0f0", textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}
        >
          Listado de Pedidos de Venta
        </Typography>
        {/* Sección de Búsqueda y Botón de Creación */}
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <TextField
                  label="Buscar "
                  variant="outlined"
                  onChange={(e) => handleSearch(e.target.value)}
                  sx={{
                    flexGrow: 1,
                    mr: { xs: 0, sm: 2 },
                    minWidth: { xs: '100%', sm: 'auto' },
                    backgroundColor: 'rgba(70, 70, 70, 0.7)',
                    borderRadius: '4px',
                    '& .MuiInputBase-input': {
                      color: '#e0e0e0',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#a0a0a0',
                      '&.Mui-focused': {
                        color: '#fff',
                      },
                      '&.MuiFormLabel-filled': {
                        color: '#fff',
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#757575',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#90CAF9',
                      borderWidth: '2px',
                    },
                  }}
                />

                {/* Filtros por estado */}
                <FormControl sx={{ minWidth: 150, mr: 1 }} size="small">
                  <InputLabel id="estado-filter-label">Estado</InputLabel>
                  <Select
                    labelId="estado-filter-label"
                    multiple
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    input={<OutlinedInput label="Estado" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    sx={{
                      backgroundColor: 'rgba(70, 70, 70, 0.7)',
                      color: '#e0e0e0',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#90CAF9',
                      },
                    }}
                  >
                    {Object.values(Estado).map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Filtros por cargo del empleado */}
                <FormControl sx={{ minWidth: 150, mr: 1 }} size="small">
                  <InputLabel id="cargo-filter-label">Cargo Empleado</InputLabel>
                  <Select
                    labelId="cargo-filter-label"
                    multiple
                    value={filterEmpleadoCargo}
                    onChange={(e) => setFilterEmpleadoCargo(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                    input={<OutlinedInput label="Cargo Empleado" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    sx={{
                      backgroundColor: 'rgba(70, 70, 70, 0.7)',
                      color: '#e0e0e0',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#757575',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#90CAF9',
                      },
                    }}
                  >
                    {Object.values(Cargo).map((cargo) => (
                      <MenuItem key={cargo} value={cargo}>
                        {cargo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={<FaFileExcel style={{ color: "white" }} />}
            onClick={() => setModalExcelOpen(true)}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
              color: "#fff",
            }}
          >
            Generar Excel
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() =>
              idEmpleado
                ? navigate(`/pedido-venta/crear/${idEmpleado}`)
                : navigate("/pedido-venta/crear")
            }
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#388E3C" },
              color: "#ffffff",
              px: 3,
              py: 1.2,
              borderRadius: "8px",
            }}
          >
            Crear Pedido
          </Button>
        </Box>
              </Grid>
        {/* <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={<FaFileExcel style={{ color: "white" }} />}
            onClick={() => setModalExcelOpen(true)}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
              color: "#fff",
            }}
          >
            Generar Excel
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() =>
              idEmpleado
                ? navigate(`/pedido-venta/crear/${idEmpleado}`)
                : navigate("/pedido-venta/crear")
            }
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#388E3C" },
              color: "#ffffff",
              px: 3,
              py: 1.2,
              borderRadius: "8px",
            }}
          >
            Crear Pedido
          </Button>
        </Box> */}
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
            Cargando pedidos de venta...
          </Typography>
        </Box>
      ) : pedidosVenta && pedidosVenta.length > 0 ? (
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
          <Table aria-label="tabla de pedidos venta">
            <TableHead sx={{ backgroundColor: "rgba(50, 50, 50, 0.9)" }}>
              <TableRow>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Cliente
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
                    borderBottom: "1px solid #444",
                  }}
                >
                  Tipo de Envío
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Subtotal
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Descuento
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Costo Total
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Forma de Pago
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
                  Fecha del Pedido
                </TableCell>
                <TableCell
                  sx={{ color: "#f0f0f0", fontWeight: "bold", borderBottom: "1px solid #444" }}
                >
                  Asignado a
                </TableCell>
                <TableCell
                  sx={{ color: "#f0f0f0", fontWeight: "bold", width: "180px" }}
                  align="center"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosVenta.map((pedido) => (
                <TableRow
                  key={
                    pedido?.id?.toString() ||
                    `temp-${pedido.fechaPedido?.toString()}`
                  }
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
                  >
                    {pedido.cliente?.nombre} {pedido.cliente?.apellido || ""}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: getEstadoColor(pedido?.estado as Estado),
                      fontWeight: "bold",
                      borderBottom: "1px solid #333",
                    }}
                  >
                    {pedido.estado === "PREPARACION" ? "Preparación" :
                     pedido.estado === "PENDIENTE" ? "Pendiente" :
                     pedido.estado === "CANCELADO" ? "Cancelado" :
                     pedido.estado === "RECHAZADO" ? "Rechazado" :
                     pedido.estado === "ENTREGADO" ? "Entregado" : pedido.estado}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {pedido.tipoEnvio || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    ${pedido.subtotal?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    ${pedido.descuento?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    ${pedido.total?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    ${pedido.totalCosto?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {pedido.formaPago || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {pedido.fechaPedido
                      ? format(pedido.fechaPedido, "dd/MM/yyyy HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {pedido.empleado
                      ? `${pedido.empleado.nombre} ${pedido.empleado.apellido} (${pedido.empleado.cargo})`
                      : "Sin asignar"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "1px solid #333" }}
                  >
                    <IconButton
                      aria-label="ver"
                      onClick={() =>
                        pedido.id && navigate(`/pedido-venta/ver/${pedido.id}`)
                      }
                      disabled={!pedido.id}
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
                      aria-label="cambiar estado"
                      onClick={() => {
                        setViewFormStatus(true);
                        setPedidoVenta(pedido);
                      }}
                      disabled={!pedido.id}
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
                      aria-label="descargar pdf"
                      onClick={() => getPdf(pedido?.id as string)}
                      sx={{
                        color: "rgb(255, 15, 7)",
                        "&:hover": { backgroundColor: "rgba(255, 15, 7, 0.1)" },
                      }}
                    >
                      <FaFilePdf size={24} />
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
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            color: "#e0e0e0",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="h5" sx={{ color: "#f0f0f0", mb: 2 }}>
            No hay pedidos de venta registrados. ¡Crea el primero!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() =>
              idEmpleado
                ? navigate(`/pedido-venta/crear/${idEmpleado}`)
                : navigate("/pedido-venta/crear")
            }
            sx={{
              mt: 3,
              backgroundColor: "#FFA726",
              "&:hover": {
                backgroundColor: "#FB8C00",
              },
              color: "#ffffff",
              px: 4,
              py: 1.5,
              borderRadius: "8px",
            }}
          >
            Añadir Nuevo Pedido
          </Button>
        </Paper>
      )}

      <Modal
        open={viewFormStatus}
        onClose={() => setViewFormStatus(false)}
        aria-labelledby="update-status-modal-title"
        aria-describedby="update-status-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: "12px",
            backgroundColor: "rgba(40, 40, 40, 0.95)",
            color: "#e0e0e0",
            boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            maxWidth: "450px",
            width: "90%",
          }}
        >
          <Typography
            variant="h5"
            id="update-status-modal-title"
            gutterBottom
            sx={{ color: "#f0f0f0", mb: 3 }}
          >
            Estado actual del pedido
          </Typography>
          {pedidoVenta && (
            <Grid container spacing={2}>
              <Grid size={12} sx={{ mb: 2 }}>
                <Autocomplete
                  fullWidth
                  id="estado-update"
                  value={pedidoVenta?.estado as Estado}
                  options={Object.values(Estado)}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      const newPedido: PedidoVenta = {
                        ...pedidoVenta,
                        estado: newValue,
                      };
                      setPedidoVenta(newPedido);
                    }
                  }}
                  getOptionLabel={(option: Estado) =>
                    option === "PREPARACION" ? "Preparación" :
                    option === "PENDIENTE" ? "Pendiente" :
                    option === "CANCELADO" ? "Cancelado" :
                    option === "RECHAZADO" ? "Rechazado" :
                    option === "ENTREGADO" ? "Entregado" : option
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nuevo Estado"
                      variant="outlined"
                      InputLabelProps={{ style: { color: "#b0b0b0" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "#ffffff" },
                        sx: {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#555",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        },
                      }}
                    />
                  )}
                  sx={{
                    backgroundColor: "rgba(20, 20, 20, 0.8)",
                    borderRadius: "6px",
                  }}
                />
              </Grid>
              <Grid size={12} sx={{ mb: 2 }}>
                <Autocomplete
                  fullWidth
                  id="empleado-assignment"
                  value={pedidoVenta?.empleado || null}
                  options={empleados}
                  getOptionLabel={(option) =>
                    option ? `${option.nombre} ${option.apellido} (${option.cargo})` : ""
                  }
                  onChange={(_, newValue) => {
                    const newPedido: PedidoVenta = {
                      ...pedidoVenta,
                      empleado: newValue,
                    };
                    setPedidoVenta(newPedido);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Asignar a Empleado"
                      variant="outlined"
                      InputLabelProps={{ style: { color: "#b0b0b0" } }}
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "#ffffff" },
                        sx: {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#555",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        },
                      }}
                    />
                  )}
                  loading={loadingEmpleados}
                  sx={{
                    backgroundColor: "rgba(20, 20, 20, 0.8)",
                    borderRadius: "6px",
                  }}
                />
              </Grid>
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  variant="contained"
                  onClick={async () => {
                    if (pedidoVenta?.id) {
                      await updatePedidoVenta(pedidoVenta);
                      setViewFormStatus(false);
                      listadoPedidosVenta();
                    }
                  }}
                  sx={{
                    backgroundColor: "#4caf50",
                    color: "#ffffff",
                    "&:hover": { backgroundColor: "#388e3c" },
                    px: 3,
                    py: 1,
                    borderRadius: "8px",
                  }}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Modal>

      {/* Modal para generar Excel */}
      <Modal
        open={modalExcelOpen}
        onClose={() => setModalExcelOpen(false)}
        aria-labelledby="excel-modal-title"
        aria-describedby="excel-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: "12px",
            backgroundColor: "rgba(40, 40, 40, 0.95)",
            color: "#e0e0e0",
            boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            maxWidth: "450px",
            width: "90%",
          }}
        >
          <Typography
            variant="h5"
            id="excel-modal-title"
            gutterBottom
            sx={{ color: "#f0f0f0", mb: 3 }}
          >
            Generar reporte Excel
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Fecha Desde"
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              InputLabelProps={{
                shrink: true,
                style: { color: "#b0b0b0" },
              }}
              InputProps={{
                sx: {
                  color: "#ffffff",
                  backgroundColor: "rgba(20, 20, 20, 0.8)",
                  borderRadius: "6px",
                },
              }}
            />
            <TextField
              label="Fecha Hasta"
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              InputLabelProps={{
                shrink: true,
                style: { color: "#b0b0b0" },
              }}
              InputProps={{
                sx: {
                  color: "#ffffff",
                  backgroundColor: "rgba(20, 20, 20, 0.8)",
                  borderRadius: "6px",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setModalExcelOpen(false)}
                sx={{
                  backgroundColor: "#EF5350",
                  "&:hover": { backgroundColor: "#d32f2f" },
                  color: "#ffffff",
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={getExcel}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#388e3c" },
                  color: "#ffffff",
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                }}
              >
                Descargar Excel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default PedidoVentaTable;
