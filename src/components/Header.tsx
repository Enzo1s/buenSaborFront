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
import { TipoEnvio } from "../enums/TipoEnvio";
import { FormaPago } from "../enums/FormaPago";

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [idPreference] = useState<string | null>(null);
  const [viewForm, setViewForm] = useState(false);

  const { isAuthenticated, user, logout, cliente, empleado } = useAuth();
  const { pedidoVenta, removeItemFromCart } = useCartContext();
  
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };
  
  const buy = async () => {
    try {
      if (pedidoVenta && user) {
        const { data } = await createPedidoVenta({
          ...pedidoVenta,
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
              console.log(
                "Ventana de pago cerrada manualmente"
              );
            }
          }
        }, 500);
      }
    } catch (error) {
      console.error(error);
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
      sx={{ bgcolor: "rgba(50, 50, 50, 0.9)", margin: 0, padding: 0 }}
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
        <Button variant="text" onClick={handleClick}>
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
          sx={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "400px",
            height: "300px",
          }}
        >
          <Grid size={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Carrito de Compras
            </Typography>
          </Grid>
          <Grid sx={{ marginTop: "10px" }} size={12}>
            <Typography variant="body1">Productos en el carrito:</Typography>
            {pedidoVenta &&
            pedidoVenta?.pedidoVentaDetalle &&
            pedidoVenta?.pedidoVentaDetalle?.length > 0 ? (
              <Grid>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pedidoVenta?.pedidoVentaDetalle?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.articuloInsumo?.denominacion ||
                            item.articuloManufacturado?.denominacion}
                        </TableCell>
                        <TableCell>{item.cantidad.toString()}</TableCell>
                        <TableCell>${item.subTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDelete(item)}>
                            <DeleteOutlineIcon />
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
            sx={{ marginTop: "10px" }}
            size={12}
            justifyContent={"flex-start"}
            display={"flex"}
            alignItems={"start"}
          >
            <Typography variant="body1">
              Total:{pedidoVenta?.total?.toFixed(2)}
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
