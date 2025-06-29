import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import {
  createPedidoVenta,
  getPedidoVentaById,
} from "../../../Api/PedidoVentaApi";
import { Empleado } from "../../../interfaces/Empleado";
import { getByIdEmpleado } from "../../../Api/EmpleadoAPI";
import CardArticulos from "./CardArticulos";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../../../interfaces/ArticuloManufacturado";
import { addItemToCart, removeItemFromCart } from "../utils/addAndRemove";
import { Estado } from "../../../enums/Estado";
import { TipoEnvio } from "../../../enums/TipoEnvio";
import { FormaPago } from "../../../enums/FormaPago";
import { getAllArticuloManufacturado } from "../../../Api/ArticuloManufacturadoAPI";
import { getListArticuloInsumo } from "../../../Api/ArticuloInsumo";
import { format, isWithinInterval } from "date-fns";
import Modal from "../../../components/Modal";
import { createPreference } from "../../../Api/DatosMPAPI";
import MercadoPago from "../../../components/MercadoPago";
import { getSucursales } from "../../../Api/SucursalAPI";
import { SucursalEmpresa } from "../../../interfaces/SucursalEmpresa";
import PagoModal from "./PagoModal";
import { useAuth } from "../../../Context/authContext";
import { Promocion } from "../../../interfaces/Promocion";
import { getPromociones } from "../../../Api/PromocionAPI";
import { PedidoVentaDetalle } from "../../../interfaces/PedidoVentaDetalle";

interface CardArticulosProps {
  imagen: string;
  titulo: string;
  descripcion: string;
  articuloManufacturado?: ArticuloManufacturado;
  articuloInsumo?: ArticuloInsumo;
}

const PedidoVentaForm = () => {
  const { id, idEmpleado } = useParams();
  const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [viewForm, setViewForm] = useState(false);
  const [idPreference, setIdPreference] = useState(null);
  const [sucursales, setSucursales] = useState<SucursalEmpresa[]>([]);
  const [viewFormBuy, setViewFormBuy] = useState(false);
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  const { empleado: empleadoLogin, user } = useAuth();

  const [listCard, setListCard] = useState<CardArticulosProps[]>([]);

  const getManufacturados = async () => {
    const { data: manufacturados } = await getAllArticuloManufacturado();
    const cardProps: CardArticulosProps[] = manufacturados.map(
      (articulo: ArticuloManufacturado) => ({
        imagen: articulo.pathImagen[0],
        titulo: articulo.denominacion,
        descripcion: `$${articulo.precioVenta} tiempo estimado: ${articulo.tiempoEstimado} minutos ${articulo.descripcion}`,
        articuloManufacturado: articulo,
      })
    );
    const { data } = await getListArticuloInsumo();
    const insumos = data.filter(
      (insumo: ArticuloInsumo) => insumo.esParaElaborar === false
    );
    const insumosCardProps: CardArticulosProps[] = insumos.map(
      (articulo: ArticuloInsumo) => ({
        imagen: articulo.pathImagen[0],
        titulo: articulo.denominacion,
        descripcion: `$${
          articulo.precioVenta
        } Tipo de producto: ${articulo.categoriaArticulo
          .map((categoria) => categoria.denominacion)
          .join(", ")}`,
        articuloInsumo: articulo,
      })
    );
    setListCard([...listCard, ...cardProps, ...insumosCardProps]);
  };

  const getPedidoVenta = async () => {
    if (id) {
      const { data } = await getPedidoVentaById(id);
      setPedidoVenta(data);
    } else {
      setPedidoVenta({
        id: null,
        horaEstimadaFinalizacion: new Date(),
        subtotal: 0,
        descuento: 0,
        gastosEnvio: 0,
        total: 0,
        totalCosto: 0,
        estado: Estado.PENDIENTE.toUpperCase(),
        tipoEnvio: null,
        formaPago: null,
        empleado: empleado || empleadoLogin || null,
        sucursal: user?.sucursalEmpresa || null,
        cliente: null,
        factura: null,
        pedidoVentaDetalle: null,
        fechaPedido: new Date(),
        alta: null,
        baja: null,
        modificacion: null,
      });
    }
  };

  const getEmpleado = async () => {
    if (idEmpleado) {
      const { data } = await getByIdEmpleado(idEmpleado);
      setEmpleado(data);
    } else {
      setEmpleado(empleadoLogin);
    }
  };

  const listadoPromociones = async () => {
    const { data } = await getPromociones();
    const promocionesActivas = data.filter((promocion: Promocion) =>
      isWithinInterval(new Date(), {
        start: promocion.fechaDesde,
        end: promocion.fechaHasta,
      })
    );
    setPromociones(promocionesActivas);
  };

  const validacion = () => {
    if (pedidoVenta) {
      if (!pedidoVenta.sucursal) {
        alert("Debe seleccionar una sucursal");
        return false;
      }

      if (!pedidoVenta.tipoEnvio) {
        alert("Debe seleccionar un tipo de envío");
        return false;
      }

      if (
        !pedidoVenta.pedidoVentaDetalle ||
        pedidoVenta.pedidoVentaDetalle.length === 0
      ) {
        alert("Debe agregar al menos un artículo");
        return false;
      }

      return true;
    }

    return false;
  };

  const buy = async (formaPago?: FormaPago) => {
    try {
      if (!validacion()) return;

      if (pedidoVenta) {
        const pedidoFinal = {
          ...pedidoVenta,
          formaPago: formaPago ?? pedidoVenta.formaPago,
        };

        const { data } = await createPedidoVenta(pedidoFinal);

        if (pedidoFinal.formaPago === FormaPago.EFECTIVO) {
          await setViewFormBuy(true);
        } else if (pedidoFinal.formaPago === FormaPago.MERCADOPAGO) {
          const response = await createPreference(data.id);
          setIdPreference(response.data.idPreference);
          setViewForm(true);
        }

        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error en compra: ", error);
    }
  };

  const agregarArticulo = (
    insumo: ArticuloInsumo | null,
    manufacturado: ArticuloManufacturado | null
  ) => {
    const tienePromo = promociones.find((promo) =>
      promo.promocionDetalle?.some((detalle) => {
        if (detalle.articuloInsumo?.id && insumo?.id)
          return detalle.articuloInsumo?.id === insumo?.id;
        else return detalle.articuloManufacturado?.id === manufacturado?.id;
      })
    );
    const newPedido = addItemToCart(
      insumo,
      manufacturado,
      tienePromo || null,
      1,
      pedidoVenta
    );
    setPedidoVenta(newPedido);
  };

  const handleDelete = (item: PedidoVentaDetalle) => {
    if (item.articuloInsumo) {
      const newPedido = removeItemFromCart(
        item.articuloInsumo.id as string,
        pedidoVenta
      );
      if (newPedido) setPedidoVenta(newPedido);
    } else {
      const newPedido = removeItemFromCart(
        item.articuloManufacturado?.id as string,
        pedidoVenta
      );
      if (newPedido) setPedidoVenta(newPedido);
    }
  };

  const handleSubmit = async () => {
    if (pedidoVenta) {
      setViewFormBuy(false);
      getPedidoVenta();
      alert("Compra realizada con exito");
    }
  };

  const listadoSucursales = async () => {
    const { data } = await getSucursales();
    setSucursales(data);
  };

  const handlePagoMercadoPago = () => {
    if (!pedidoVenta) return;
    buy(FormaPago.MERCADOPAGO);
  };

  const handlePagoEfectivo = () => {
    if (!pedidoVenta) return;
    buy(FormaPago.EFECTIVO);
  };

  useEffect(() => {
    getPedidoVenta();
    listadoPromociones();
    getManufacturados();
    listadoSucursales();
    getEmpleado();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      alignContent={"center"}
      justifyContent={"center"}
    >
      <Grid size={12} justifyContent={"center"} alignItems={"center"}>
        <Typography
          variant="h4"
          className="textWhte"
          sx={{ textAlign: "center" }}
        >
          Nuevo Pedido
        </Typography>
      </Grid>
      <Grid container size={8} spacing={2}>
        {listCard &&
          listCard.map((card, index) => {
            const tienePromo = promociones.find((promo) =>
              promo.promocionDetalle?.some((detalle) => {
                if (detalle.articuloInsumo?.id && card.articuloInsumo?.id)
                  return detalle.articuloInsumo?.id === card.articuloInsumo?.id;
                else
                  return (
                    detalle.articuloManufacturado?.id ===
                    card.articuloManufacturado?.id
                  );
              })
            );
            if (tienePromo) {
              return (
                <Grid
                  size={3}
                  onClick={() =>
                    agregarArticulo(
                      card.articuloInsumo || null,
                      card.articuloManufacturado || null
                    )
                  }
                >
                  <CardArticulos
                    key={index}
                    imagen={card.imagen}
                    titulo={card.titulo}
                    descripcion={card.descripcion}
                    promocion={tienePromo}
                  />
                </Grid>
              );
            }
            return (
              <Grid
                size={3}
                onClick={() =>
                  agregarArticulo(
                    card.articuloInsumo || null,
                    card.articuloManufacturado || null
                  )
                }
              >
                <CardArticulos
                  key={index}
                  imagen={card.imagen}
                  titulo={card.titulo}
                  descripcion={card.descripcion}
                  promocion={null}
                />
              </Grid>
            );
          })}
      </Grid>
      <Grid container size={4} spacing={2}>
        <Grid size={12}>
          <Grid
            container
            spacing={2}
            sx={{
              backgroundColor: "rgba(35, 35, 35, 0.95)",
              padding: { xs: 2, md: 4 },
              borderRadius: "12px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
              color: "#e0e0e0",
              maxWidth: "900px",
              margin: "auto",
              border: "1px solid rgba(70, 70, 70, 0.5)",
            }}
          >
            <Grid size={11}>
              <Autocomplete
                fullWidth
                id="sucursal"
                value={pedidoVenta?.sucursal || user?.sucursalEmpresa || null}
                options={sucursales}
                onChange={(_, newValue) => {
                  const sucursal = (newValue as SucursalEmpresa) || null;
                  if (sucursal) {
                    setPedidoVenta({
                      ...pedidoVenta,
                      sucursal,
                    } as PedidoVenta);
                  }
                }}
                getOptionLabel={(option: SucursalEmpresa) =>
                  option.nombre as string
                }
                renderInput={(params) => (
                  <TextField {...params} label="Sucursal" />
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
            </Grid>
            <Grid size={5} sx={{ marginBottom: 2 }}>
              <Autocomplete
                fullWidth
                id="tipoEnvio"
                options={Object.values(TipoEnvio)}
                value={pedidoVenta?.tipoEnvio ?? null}
                onChange={(_, newValue) => {
                  setPedidoVenta((prev) =>
                    prev ? { ...prev, tipoEnvio: newValue as TipoEnvio } : prev
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tipo de Envío" />
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
            </Grid>
            <Grid size={12} sx={{ marginBottom: 2 }}>
              <Typography variant="h5">
                Hora finalizacion:{" "}
                {pedidoVenta && pedidoVenta.horaEstimadaFinalizacion
                  ? format(pedidoVenta?.horaEstimadaFinalizacion, "HH:mm")
                  : format(new Date(), "HH:mm")}
              </Typography>
            </Grid>
            <Grid size={23} sx={{ marginBottom: 2, borderBottom: 1 }}>
              {pedidoVenta && pedidoVenta.pedidoVentaDetalle && (
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Table>
                    <TableHead sx={{ backgroundColor: 'rgba(50, 50, 50, 0.9)' }}>
                      <TableRow>
                        <TableCell>
                          <Typography sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Articulo</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Cantidad</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Precio</Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pedidoVenta.pedidoVentaDetalle.map((detalle, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                            <Typography variant="h6">
                              {detalle.articuloInsumo
                                ? detalle.articuloInsumo.denominacion
                                : detalle?.articuloManufacturado?.denominacion}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                            <Typography variant="h6">
                              {detalle.cantidad}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                            <Typography variant="h6">
                              $
                              {detalle.articuloInsumo
                                ? detalle.articuloInsumo.precioVenta.toFixed(2)
                                : detalle?.articuloManufacturado?.precioVenta.toFixed(
                                    2
                                  )}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(detalle)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Grid>
            <Grid
              size={12}
              sx={{ marginBottom: 2 }}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Typography variant="h5">Subtotal: </Typography>
              <Typography variant="h5">
                {" "}
                ${pedidoVenta ? pedidoVenta.subtotal.toFixed(2) : 0}
              </Typography>
            </Grid>
            <Grid
              size={12}
              sx={{ marginBottom: 2 }}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Typography variant="h5">Descuento: </Typography>
              <Typography variant="h5">
                {" "}
                ${pedidoVenta ? pedidoVenta.descuento.toFixed(2) : 0}
              </Typography>
            </Grid>
            <Grid
              size={12}
              sx={{ marginBottom: 2 }}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Typography variant="h5">Total: </Typography>
              <Typography variant="h5">
                {" "}
                ${pedidoVenta ? pedidoVenta.total.toFixed(2) : 0}
              </Typography>
            </Grid>
          </Grid>
          <Button
            type="button"
            variant="contained"
            color="success"
            onClick={() => setOpenModal(true)}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={"Elija la forma de pago"}
      >
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
        <Grid
          display={"flex"}
          justifyContent={"space-between"}
          sx={{ margin: "10px", width: "30rem" }}
          size={12}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handlePagoMercadoPago}
          >
            Mercado Pago
          </Button>
          <Button
            type="button"
            variant="contained"
            color="success"
            onClick={handlePagoEfectivo}
          >
            {" "}
            Efectivo{" "}
          </Button>
        </Grid>
        </Box>
      </Modal>

      <Modal
        open={viewForm}
        onClose={() => setViewForm(false)}
        title="Método de pago"
      >
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
        {idPreference && pedidoVenta && (
          <Grid sx={{ marginTop: "10px" }} size={12}>
            <MercadoPago
              idPreference={idPreference}
              monto={pedidoVenta?.total || 10}
              pedidoVenta={pedidoVenta}
              setViewForm={setViewForm}
            />
          </Grid>
        )}
        </Box>
      </Modal>
      <Modal
        open={viewFormBuy}
        onClose={() => setViewFormBuy(false)}
        title="Método de pago"
      >
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
        <PagoModal pedidoVenta={pedidoVenta} handleSubmit={handleSubmit} />
        </Box>
      </Modal>
    </Grid>
  );
};

export default PedidoVentaForm;
