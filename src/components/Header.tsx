import {
  Button,
  Grid,
  IconButton,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/authContext";
import { useCartContext } from "../Context/cartContext";
import { useState, useRef, useEffect } from "react";
import { createPedidoVenta } from "../Api/PedidoVentaApi";
import { createPreference } from "../Api/DatosMPAPI";
import MercadoPago from "./MercadoPago";
import Modal from "./Modal";
import { PedidoVentaDetalle } from "../interfaces/PedidoVentaDetalle";
import { FormaPago } from "../enums/FormaPago";

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const [idPreference] = useState<string | null>(null);
  const [viewForm, setViewForm] = useState(false);

  const { isAuthenticated, user, logout, cliente, empleado } = useAuth();
  const { pedidoVenta, removeItemFromCart, clearCart, shouldOpenCart, setShouldOpenCart, recalculatePromotion } = useCartContext();
  const cartContentRef = useRef<HTMLDivElement | null>(null);

  const ventanaPagoRef = useRef<Window | null>(null);
  const timerRef = useRef<number | null>(null);
  const pagoTerminadoRef = useRef(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;

      if (event.data?.pagoTerminado) {
        pagoTerminadoRef.current = true;

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        window.location.reload();
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Effect to handle opening the cart when shouldOpenCart is true
  useEffect(() => {
    if (shouldOpenCart && cartButtonRef.current) {
      // Open the cart by setting the anchor element and open state
      setAnchorEl(cartButtonRef.current);
      setOpen(true);

      // Reset the shouldOpenCart state after opening the cart
      setShouldOpenCart(false);
    }
  }, [shouldOpenCart, setShouldOpenCart]);

  // Effect to scroll to the bottom when cart content changes
  useEffect(() => {
    if (open && cartContentRef.current) {
      cartContentRef.current.scrollTop = cartContentRef.current.scrollHeight;
    }
  }, [open, pedidoVenta?.pedidoVentaDetalle?.length]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };
  
  const buy = async () => {
    try {
      if (pedidoVenta && user) {
        // Make sure the latest discount is applied before sending to backend
        const updatedPedido = recalculatePromotion(pedidoVenta);

        const { data } = await createPedidoVenta({
          ...pedidoVenta, // Use the original pedidoVenta with updated discount calculation
          descuento: updatedPedido.descuento,
          total: updatedPedido.total,
          sucursal: user.sucursalEmpresa,
          cliente: cliente,
          empleado: empleado,
          formaPago: FormaPago.MERCADOPAGO
        });

        const response = await createPreference(data.id);
        const preferenceUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.data.idPreference}`;

        ventanaPagoRef.current = window.open(
          preferenceUrl,
          "_blank",
          "width=1100,height=700"
        );

        if (!ventanaPagoRef.current) {
          alert("Por favor desbloqueá las ventanas emergentes.");
          return;
        }

        pagoTerminadoRef.current = false;

        timerRef.current = window.setInterval(() => {
          if (ventanaPagoRef.current && ventanaPagoRef.current.closed) {
            clearInterval(timerRef.current!);
            timerRef.current = null;

            if (!pagoTerminadoRef.current) {
              console.log("Ventana de pago cerrada manualmente");
            }
            clearCart()
            navigate("/")
          }
        }, 500);
      }
    } catch (error) {
      console.error(error);
      if((error as any)?.response)
        alert((error as any)?.response?.data)
      else
        alert("Error al procesar el pago. Por favor, intentá nuevamente más tarde.");
    }
  };

  const handleDelete = (item: PedidoVentaDetalle) => {
    if (item.articuloInsumo) {
      removeItemFromCart(item.articuloInsumo.id as string);
    } else {
      removeItemFromCart(item.articuloManufacturado?.id as string);
    }
  };

  return (
    <Grid
      container
      sx={{
        bgcolor: "rgba(50, 50, 50, 0.9)",
        margin: 0,
        padding: 0,
        minHeight: 64,
        flexShrink: 0,
      }}
    >
      <Grid size={9} sx={{ padding: "5px" }}>
        <Typography variant="h2" color="white">
          Buen Sabor
        </Typography>
      </Grid>
      <Grid
        size={3}
        sx={{ padding: "10px" }}
        justifyContent={"flex-end"}
        display={"flex"}
      >
        <Button ref={cartButtonRef} variant="text" onClick={handleClick}>
          <Typography variant="h6" color="white">
            <ShoppingCartIcon />
          </Typography>
        </Button>
        <Button
          variant="text"
          onClick={() => (isAuthenticated ? logout() : navigate("/login"))}
        >
          <Typography variant="h6" color="white">
            {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
          </Typography>
        </Button>
      </Grid>
      <Grid size={9} sx={{ bgcolor: "rgba(50, 50, 50, 0.9)", padding: "20px" }}>
        <Button variant="text" onClick={() => navigate("/")}>
          <Typography color="white">Inicio</Typography>
        </Button>
        {isAuthenticated &&
          (user?.rol.toString() === "EMPLEADO" ||
            user?.rol.toString() === "ADMIN") && (
            <>
              <Button
                variant="text"
                onClick={() => navigate("/articulo-manufacturado")}
              >
                <Typography color="white">Artículos</Typography>
              </Button>
              <Button
                variant="text"
                onClick={() => navigate("/articulo-insumo")}
              >
                <Typography color="white">Insumos</Typography>
              </Button>
              <Button variant="text" onClick={() => navigate("/pedido-venta")}>
                <Typography color="white">Pedidos</Typography>
              </Button>
              <Button variant="text" onClick={() => navigate("/promocion")}>
                <Typography color="white">Promoción</Typography>
              </Button>
              <Button variant="text" onClick={() => navigate("/cliente")}>
                <Typography color="white">Clientes</Typography>
              </Button>
              <Button variant="text" onClick={() => navigate("/reporte")}>
                <Typography color="white">Reporte</Typography>
              </Button>
            </>
          )}

        {isAuthenticated && user?.rol.toString() === "ADMIN" && (
          <>
            <Button variant="text" onClick={() => navigate("/empresa")}>
              <Typography color="white">Empresa</Typography>
            </Button>
            <Button variant="text" onClick={() => navigate("/sucursal")}>
              <Typography color="white">Sucursales</Typography>
            </Button>
            <Button variant="text" onClick={() => navigate("/empleado")}>
              <Typography color="white">Empleados</Typography>
            </Button>
          </>
        )}
      </Grid>

      <Grid
        size={3}
        sx={{ bgcolor: "rgba(50, 50, 50, 0.9)", padding: "20px" }}
      ></Grid>

      <Popper
        anchorEl={anchorEl}
        open={open}
        placement="bottom-end"
        disablePortal={false}
        modifiers={[
          {
            name: "flip",
            enabled: true,
            options: {
              altBoundary: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              tether: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
        ]}
      >
        <Grid
          container
          ref={cartContentRef}
          sx={{
            textAlign: "center",
            borderRadius: "12px",
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            color: "#e0e0e0",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "10px",
            width: "400px",
            maxHeight: "400px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Grid size={12}>
            <Typography variant="h6" sx={{ color: "#f0f0f0", mb: 2 }}>
              Carrito de Compras
            </Typography>
          </Grid>
          <Grid sx={{ color: "#f0f0f0", marginTop: "10px" }} size={12}>
            <Typography variant="body1">Productos en el carrito:</Typography>
            {pedidoVenta &&
            pedidoVenta?.pedidoVentaDetalle &&
            pedidoVenta?.pedidoVentaDetalle?.length > 0 ? (
              <Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{color: "#f0f0f0"}}>Producto</TableCell>
                      <TableCell sx={{color: "#f0f0f0"}}>Cantidad</TableCell>
                      <TableCell sx={{color: "#f0f0f0"}}>Precio</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidoVenta?.pedidoVentaDetalle?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{color: "#f0f0f0"}}>
                          {item.articuloInsumo?.denominacion ||
                            item.articuloManufacturado?.denominacion}
                        </TableCell>
                        <TableCell sx={{color: "#f0f0f0"}}>{item.cantidad.toString()}</TableCell>
                        <TableCell sx={{color: "#f0f0f0"}}>${item.subTotal.toFixed(2)}</TableCell>
                        <TableCell sx={{color: "#f0f0f0"}}>
                          <IconButton onClick={() => handleDelete(item)}>
                            <DeleteOutlineIcon sx={{color: "#f0f0f0"}}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
            ) : (
              <Typography variant="body2">
                No hay productos en el carrito.
              </Typography>
            )}
          </Grid>
          <Grid
            container
            sx={{ marginTop: "10px", display: "flex", flexDirection: "column" }}
            size={12}
            justifyContent={"flex-start"}
            display={"flex"}
            alignItems={"start"}
          >
            {/* Show discount information if a promotion is applied */}
            {pedidoVenta?.descuento != null && pedidoVenta.descuento > 0 && (
              <Typography variant="body1" color="success.main">
                Descuento aplicado: -${pedidoVenta.descuento.toFixed(2)}
              </Typography>
            )}
            <Typography variant="h6" sx={{ marginTop: "5px" }}>
              Total: ${pedidoVenta?.total != null ? pedidoVenta.total.toFixed(2) : '0.00'}
            </Typography>
          </Grid>

          <Grid sx={{ marginTop: "10px" }} size={6}>
            <Button variant="contained" color="primary" onClick={buy}>
              Comprar
            </Button>
          </Grid>
          <Grid sx={{ marginTop: "10px" }} size={6}>
            <Button variant="contained" color="primary" onClick={handleClick}>
              Cerrar
            </Button>
          </Grid>
        </Grid>
      </Popper>
      <Modal
        open={viewForm}
        onClose={() => setViewForm(false)}
        title="Método de pago"
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
      </Modal>
    </Grid>
  );
};

export default Header;
