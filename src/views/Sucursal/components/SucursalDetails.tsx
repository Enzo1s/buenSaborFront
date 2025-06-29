import {
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Modal as MuiModal,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StoreIcon from "@mui/icons-material/Store";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { getByIdSucursal } from "../../../Api/SucursalAPI";
import { SucursalEmpresa } from "../../../interfaces/SucursalEmpresa";
import { SucursalInsumo } from "../../../interfaces/SucursalInsumo";
import {
  deleteSucursalInsumo,
  getSucursalInsumosByIdSucursal,
} from "../../../Api/SucursalInsumoAPI";
import Modal from "../../../components/Modal";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import { getPedidoVentaByIdSucursal } from "../../../Api/PedidoVentaApi";

const SucursalDetails = () => {
  const [sucursal, setSucursal] = useState<SucursalEmpresa | null>(null);
  const [insumos, setInsumos] = useState<SucursalInsumo[] | null>([]);
  const [pedidosVenta, setPedidosVenta] = useState<PedidoVenta[] | null>([]);
  const [loadingSucursal, setLoadingSucursal] = useState(false);
  const [loadingInsumos, setLoadingInsumos] = useState(false);
  const [loadingPedidosVenta, setLoadingPedidosVenta] = useState(false);
  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: String | null;
  }>({ open: false, id: null });
  const [openDeleteClient, setOpenDeleteClient] = useState<{
    open: boolean;
    id: String | null;
  }>({ open: false, id: null });

  const navigate = useNavigate();

  const { id } = useParams();

  const handleDelete = async (id: String) => {
    try {
      await deleteSucursalInsumo(id);
      setOpenDelete({ open: false, id: null });
      const newInsumos = insumos?.map((insumo) =>
        insumo.id === id ? { ...insumo, baja: new Date() } : insumo
      );
      setInsumos(newInsumos ?? []);
    } catch (error) {
      console.error("Error deleting articulo:", error);
    }
  };

  const getsucursal = async () => {
    if (id) {
      try {
        setLoadingSucursal(true);
        const { data } = await getByIdSucursal(id);
        setSucursal(data);
        setLoadingSucursal(false);
        setLoadingInsumos(true);
        setLoadingPedidosVenta(true);
        const { data: insumos } = await getSucursalInsumosByIdSucursal(id);
        setInsumos(insumos);
        setLoadingInsumos(false);
        const { data: listPedidosVenta } = await getPedidoVentaByIdSucursal(id);
        setPedidosVenta(listPedidosVenta);
        setLoadingPedidosVenta(false);
      } catch (error) {
        console.log(error);
        setLoadingSucursal(false);
        setLoadingInsumos(false);
        setLoadingPedidosVenta(false);
      }
    }
  };
  useEffect(() => {
    getsucursal();
  }, []);

  if (loadingSucursal) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando detalles de la sucursal...
        </Typography>
      </Box>
    );
  }

  if (!sucursal) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Sucursal no encontrada o no disponible.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/sucursales")}
        >
          Volver a Sucursales
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 2, md: 4 },
        color: "#e0e0e0",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4}>
        <Grid size={12}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "12px",
              backgroundColor: "rgba(35, 35, 35, 0.95)", // Fondo oscuro para la tarjeta
              color: "#e0e0e0", // Texto claro
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)", // Sombra más pronunciada
              border: "1px solid rgba(70, 70, 70, 0.5)", // Borde sutil
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <StoreIcon
                color="primary"
                sx={{ mr: 2, fontSize: { xs: 32, md: 48 } }}
              />
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  mb: 0,
                  color: "#90CAF9",
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", md: "3rem" },
                }}
              >
                {sucursal.nombre}
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: "rgba(100, 100, 100, 0.5)" }} />
            <Grid container spacing={3}>
              {" "}
              {/* Aumentado el spacing */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon color="info" sx={{ mr: 1.5, fontSize: 24 }} />{" "}
                  {/* Color info para un contraste azul */}
                  <Typography variant="h6" sx={{ color: "#a0a0a0" }}>
                    {" "}
                    {/* Texto secundario más tenue */}
                    Dirección:{" "}
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#e0e0e0" }}
                    >
                      {`${sucursal.domicilio?.calle || "N/A"} ${
                        sucursal.domicilio?.numero || ""
                      }` +
                        (sucursal.domicilio?.localidad
                          ? `, ${sucursal.domicilio.localidad.nombre}`
                          : "") +
                        (sucursal.domicilio?.cp
                          ? ` (${sucursal.domicilio.cp})`
                          : "")}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center">
                  <ScheduleIcon color="info" sx={{ mr: 1.5, fontSize: 24 }} />
                  <Typography variant="h6" sx={{ color: "#a0a0a0" }}>
                    Horarios:{" "}
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#e0e0e0" }}
                    >
                      {`Desde: ${sucursal.horarioApertura || "N/A"} - Hasta: ${
                        sucursal.horarioCierre || "N/A"
                      }`}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ p: 3, color: "#e0e0e0" }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Inventory2Icon color="primary" sx={{ mr: 1, fontSize: 30 }} />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: "#f0f0f0",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                Insumos
              </Typography>
            </Box>
              {insumos && insumos.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    navigate(`/sucursal-insumo/crear/${sucursal.id}`)
                  }
                  sx={{
                    backgroundColor: "#4CAF50", // Verde vibrante
                    "&:hover": {
                      backgroundColor: "#388E3C", // Verde más oscuro al pasar el ratón
                    },
                    color: "#ffffff", // Texto blanco para contraste
                    px: 3, // Padding horizontal
                    py: 1.2, // Padding vertical
                    borderRadius: "8px", // Bordes redondeados
                  }}
                >
                  Agregar Insumo
                </Button>
              )}
          </Box>

          {loadingInsumos ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 4,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress size={24} sx={{ color: "#90CAF9" }} />
              <Typography variant="h6" sx={{ ml: 2, mt: 2, color: "#b0b0b0" }}>
                Cargando insumos...
              </Typography>
            </Box>
          ) : insumos && insumos.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={6}
              sx={{
                borderRadius: "12px", // Bordes más redondeados
                backgroundColor: "rgba(30, 30, 30, 0.9)", // Fondo semi-transparente oscuro
                boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)", // Sombra profunda
                backdropFilter: "blur(5px)", // Efecto de desenfoque
                border: "1px solid rgba(255, 255, 255, 0.1)", // Borde sutil
                overflow: "hidden", // Asegura que el border radius se aplique a todo el contenido
              }}
            >
              <Table aria-label="tabla de insumos">
                <TableHead sx={{ backgroundColor: "rgba(50, 50, 50, 0.9)" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      Denominación
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      Stock Actual
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      Stock Mínimo
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      Stock Máximo
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      Baja
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
                  {insumos.map((insumo) => (
                    <TableRow
                      key={
                        insumo?.id?.toString() ||
                        insumo?.articuloInsumo?.id?.toString()
                      }
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(40, 40, 40, 0.8)",
                        }, // Fila impar más oscura
                        "&:nth-of-type(even)": {
                          backgroundColor: "rgba(35, 35, 35, 0.8)",
                        }, // Fila par ligeramente menos oscura
                        "&:hover": {
                          backgroundColor: "rgba(60, 60, 60, 0.9) !important",
                        }, // Resaltado al pasar el ratón
                        transition: "background-color 0.3s ease", // Transición suave
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {/* Si se ve mal sacar typography */}
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}
                        >
                          {insumo?.articuloInsumo?.denominacion}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <Typography
                          variant="body1"
                          color={
                            insumo.stockActual <= insumo.stockMinimo
                              ? "error"
                              : "text.primary"
                          }
                        >
                          {insumo.stockActual.toString()}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {insumo.stockMinimo.toString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {insumo.stockMaximo.toString()}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          borderBottom: "1px solid #333",
                          color: insumo?.baja
                            ? "error.light"
                            : "inh#e0e0e0erit",
                        }}
                        align="center"
                      >
                        {insumo?.baja
                          ? format(insumo?.baja, "dd/MM/yyyy HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            navigate(`/sucursal-insumo/editar/${insumo.id}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            setOpenDelete({ open: true, id: insumo?.id })
                          }
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
              elevation={6} // Mayor elevación
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
                No hay insumos registrados para esta sucursal.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() =>
                  navigate(`/sucursal-insumo/crear/${sucursal.id}`)
                }
                sx={{
                  mt: 3,
                  backgroundColor: "#FFA726", // Un naranja vibrante
                  "&:hover": {
                    backgroundColor: "#FB8C00", // Naranja más oscuro al pasar el ratón
                  },
                  color: "#ffffff",
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                }}
              >
                Añadir Nuevo Insumo
              </Button>
            </Paper>
          )}
        </Grid>
        <Grid size={12}>
          <Box sx={{ p: 3, color: "#e0e0e0" }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: "#f0f0f0",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
                }}
              >
                <Inventory2Icon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                Pedidos Ventas
              </Typography>
            </Box>
              {pedidosVenta && pedidosVenta.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/pedido-venta/crear/${sucursal.id}`)}
                  sx={{
                    backgroundColor: "#4CAF50", // Verde vibrante
                    "&:hover": {
                      backgroundColor: "#388E3C", // Verde más oscuro al pasar el ratón
                    },
                    color: "#ffffff", // Texto blanco para contraste
                    px: 3, // Padding horizontal
                    py: 1.2, // Padding vertical
                    borderRadius: "8px", // Bordes redondeados
                  }}
                >
                  Crear Pedido Venta
                </Button>
              )}
          </Box>

          {loadingPedidosVenta ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 4,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress size={24} sx={{ color: "#90CAF9" }} />
              <Typography variant="h6" sx={{ ml: 2, mt: 2, color: "#b0b0b0" }}>
                Cargando pediodos de ventas...
              </Typography>
            </Box>
          ) : pedidosVenta && pedidosVenta.length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={6} // Mayor elevación para destacarse
              sx={{
                borderRadius: "12px", // Bordes más redondeados
                backgroundColor: "rgba(30, 30, 30, 0.9)", // Fondo semi-transparente oscuro
                boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)", // Sombra profunda
                backdropFilter: "blur(5px)", // Efecto de desenfoque
                border: "1px solid rgba(255, 255, 255, 0.1)", // Borde sutil
                overflow: "hidden", // Asegura que el border radius se aplique a todo el contenido
              }}
            >
              <Table aria-label="tabla de pedidos de Venta">
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
                      Forma de pago
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      factura
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                    >
                      total
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#f0f0f0",
                        fontWeight: "bold",
                        borderBottom: "1px solid #444",
                      }}
                      align="center"
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidosVenta.map((pedido) => (
                    <TableRow
                      key={pedido?.id?.toString()}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(40, 40, 40, 0.8)",
                        }, // Fila impar más oscura
                        "&:nth-of-type(even)": {
                          backgroundColor: "rgba(35, 35, 35, 0.8)",
                        }, // Fila par ligeramente menos oscura
                        "&:hover": {
                          backgroundColor: "rgba(60, 60, 60, 0.9) !important",
                        }, // Resaltado al pasar el ratón
                        transition: "background-color 0.3s ease", // Transición suave
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: "medium" }}
                        >
                          {`${pedido?.cliente?.nombre} ${pedido?.cliente?.apellido}`}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <Typography variant="body1">{pedido.estado}</Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {pedido.tipoEnvio}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {pedido.formaPago}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {pedido.factura?.numeroComprobante.toString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        {pedido.total}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#e0e0e0",
                          borderBottom: "1px solid #333",
                        }}
                      >
                        <IconButton
                          color="secondary"
                          onClick={() =>
                            navigate(`/pedido-venta/editar/${pedido.id}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            setOpenDelete({ open: true, id: pedido?.id })
                          }
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
              elevation={6} // Mayor elevación
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
                No hay pedidos de ventas registrados para esta sucursal.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/pedido-venta/crear/${sucursal.id}`)}
                sx={{
                  mt: 3,
                  backgroundColor: "#FFA726", // Un naranja vibrante
                  "&:hover": {
                    backgroundColor: "#FB8C00", // Naranja más oscuro al pasar el ratón
                  },
                  color: "#ffffff",
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                }}
              >
                Crear Pedido venta
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
      <MuiModal
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, id: null })}
        title="Eliminar Insumo"
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
                ¿Desea eliminar el insumo de la sucursal?
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
        {/* <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid size={12}>
            <Typography variant="h5">
              ¿Desea eliminar el insumo de la sucursal?
            </Typography>
          </Grid>
          <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(openDelete.id ?? "")}
            >
              Eliminar
            </Button>
          </Grid>
        </Grid> */}
      </MuiModal>
      <MuiModal
        open={openDeleteClient.open}
        onClose={() => setOpenDeleteClient({ open: false, id: null })}
        title="Eliminar Insumo"
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
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1, color: '#fff' }}>
                ¿Desea eliminar el insumo de la sucursal?
              </Typography>
            </Grid>
            <Grid
              size={12}
              sx={{ display: "flex", justifyContent: "flex-end", mt:3 }}
            >
              <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => setOpenDelete({ open: false, id: null })}
                                    sx={{ mr: 2, borderColor: '#a0a0a0', color: '#a0a0a0', '&:hover': { borderColor: '#fff', color: '#fff' } }}
                                  >
                                    Cancelar
                                  </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(openDeleteClient.id ?? "")}
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

export default SucursalDetails;
