import { useEffect, useState } from "react";
import { ArticuloManufacturado } from "../../interfaces/ArticuloManufacturado";
import { ArticuloInsumo } from "../../interfaces/ArticuloInsumo";
import { getAllArticuloManufacturado } from "../../Api/ArticuloManufacturadoAPI";
import { getListArticuloInsumo } from "../../Api/ArticuloInsumo";
import { CardProps } from "../../components/Interfaces/CardProps";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";
import CardObject from "../../components/CardObject";
import { Promocion } from "../../interfaces/Promocion";
import { getPromociones, getPromocionesActivas } from "../../Api/PromocionAPI";
import PromocionCard from "../../components/PromocionCard";

const HomeView = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promocionesBeforeFilter, setPromocionesBeforeFilter] = useState<
    Promocion[]
  >([]);
  const [productos, setProductos] = useState<CardProps[]>([]);
  const [productosBeforeFilter, setProductosBeforeFilter] = useState<
    CardProps[]
  >([]);

  const [categoriaProductoFiltro, setCategoriaProductoFiltro] = useState<string>("");

  const [categoriasProducto, setCategoriasProducto] = useState<string[]>([]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;

      if (event.data?.pagoTerminado) {
        window.location.reload();
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Fetch Promotions
  useEffect(() => {
    const fetchPromociones = async () => {
      const { data } = await getPromocionesActivas(); // Use only active promotions
      setPromociones(data);
      setPromocionesBeforeFilter(data);
    };
    fetchPromociones();
  }, []);

  // Fetch Products (Manufactured Articles + Insumos)
  useEffect(() => {
    const fetchProducts = async () => {
      const { data: manufacturados } = await getAllArticuloManufacturado();
      const manufacturedCardProps: CardProps[] = manufacturados.map(
        (articulo: ArticuloManufacturado) => ({
          itemCard: {
            id: articulo.id,
            imagen: articulo.pathImagen && articulo.pathImagen.length > 0 ? articulo.pathImagen[0] : null,
            titulo: articulo.denominacion,
            precioVenta: articulo.precioVenta,
            esInsumo: false,
            categoriaArticulo: articulo.categoriaArticuloManufacturado ? [{ denominacion: articulo.categoriaArticuloManufacturado.denominacion }] : [],
          },
        })
      );

      const { data: insumosData } = await getListArticuloInsumo();
      const insumos = insumosData.filter(
        (insumo: ArticuloInsumo) => insumo.esParaElaborar === false
      );
      const insumosCardProps: CardProps[] = insumos.map(
        (articulo: ArticuloInsumo) => ({
          itemCard: {
            id: articulo.id,
            imagen: articulo.pathImagen && articulo.pathImagen.length > 0 ? articulo.pathImagen[0] : null,
            titulo: articulo.denominacion,
            precioVenta: articulo.precioVenta,
            esInsumo: true,
            categoriaArticulo: articulo.categoriaArticulo,
          },
        })
      );

      const allProducts = [...manufacturedCardProps, ...insumosCardProps];
      setProductos(allProducts);
      setProductosBeforeFilter(allProducts);

      const uniqueCategories = Array.from(
        new Set(
          [...manufacturados.flatMap(item => item.categoriaArticuloManufacturado ? [item.categoriaArticuloManufacturado.denominacion] : []),
           ...insumos.flatMap(item => item.categoriaArticulo?.map(cat => cat.denominacion) || [])
          ].filter(Boolean) as string[]
        )
      );
      setCategoriasProducto(uniqueCategories);
    };
    fetchProducts();
  }, []);

  // Filter Functions
  const handleCategoriaProductoFiltro = (categoria: string) => {
    setCategoriaProductoFiltro(categoria);
    let filtered = productosBeforeFilter;

    if (categoria) {
      filtered = filtered.filter((producto) =>
        producto.itemCard.categoriaArticulo?.some(
          (cat) =>
            cat?.denominacion.toLowerCase() === categoria.toLowerCase()
        )
      );
    }
    setProductos(filtered);
  };

  return (
    <Box
      sx={{
        color: "#e0e0e0",
        padding: { xs: 2, md: 4 },
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Sección de Promociones */}
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Promociones
        </Typography>
      </Box>

      <Box
        sx={{ padding: 2, borderRadius: 2, flexShrink: 0 }}
      >
        {promociones && promociones.length > 0 ? (
          <Grid
            container
            spacing={2}
            alignContent={"center"}
            justifyContent="center"
            sx={{ flexWrap: "wrap" }}
          >
            {promociones.map((promocion: Promocion) => (
              <Grid item key={promocion.id} sx={{ margin: 2 }}>
                <PromocionCard promocion={promocion} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            variant="h6"
            className="textWhte"
            sx={{ borderRadius: "10px", width: "400px" }}
          >
            No hay promociones para mostrar.
          </Typography>
        )}
      </Box>

      {/* Sección de Productos */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 1,
          flexWrap: "wrap",
          gap: 3,
          mt: 2,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Productos
        </Typography>
        <Select
          value={categoriaProductoFiltro}
          onChange={(e) => handleCategoriaProductoFiltro(e.target.value)}
          displayEmpty
          size="small"
          sx={{
            minWidth: "200px",
            backgroundColor: "#2F3B52",
            color: "#FFFFFF",
            borderRadius: "8px",
            height: "40px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#5D6D82",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8FA4C2",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#90CAF9",
              borderWidth: "2px",
            },
          }}
        >
          <MenuItem value="">Todas las Categorías</MenuItem>
          {categoriasProducto.map((cat) => (
            <MenuItem
              key={cat}
              value={cat}
              sx={{
                backgroundColor: "#2F3B52",
                color: "#FFFFFF",
                "&.Mui-selected": {
                  backgroundColor: "#5D6D82",
                  "&:hover": {
                    backgroundColor: "#4A5A70",
                  }
                },
                "&:hover": {
                  backgroundColor: "#3C4A63",
                }
              }}
            >
              {cat}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Grid de Productos con scroll */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "0",
          backgroundColor: "transparent",
          boxShadow: "none",
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          p: 2,
        }}
      >
        {productos && productos.length > 0 ? (
          <Grid
            container
            spacing={2}
            alignContent={"center"}
            justifyContent="center"
            sx={{ flexWrap: "wrap" }}
          >
            {productos.map((itemCard: CardProps) => (
              <Grid item key={itemCard.itemCard.id} sx={{ margin: 2 }}>
                <CardObject itemCard={itemCard.itemCard} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4, color: "#e0e0e0" }}>
            No hay productos para mostrar.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default HomeView;