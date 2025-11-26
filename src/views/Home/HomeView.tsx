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
            imagen: articulo.pathImagen[0],
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
            imagen: articulo.pathImagen[0],
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
    <Grid
      container
      sx={{
        color: "#e0e0e0",
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* Sección de Promociones */}
      <Grid item xs={12} sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Promociones
        </Typography>
      </Grid>

      <Grid
        container
        spacing={2}
        alignContent={"center"}
        justifyContent="center"
        sx={{ padding: 2, borderRadius: 2, flexWrap: "wrap" }}
      >
        {promociones && promociones.length > 0 ? (
          promociones.map((promocion: Promocion) => (
            <Grid item key={promocion.id} sx={{ margin: 2 }}>
              <PromocionCard promocion={promocion} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <Typography
              variant="h6"
              className="textWhte"
              sx={{ borderRadius: "10px", width: "400px" }}
            >
              No hay promociones para mostrar.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Sección de Productos */}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
          mt: 5, // Keep the top margin for separation from promotions
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
          sx={{
            flexBasis: "20%",
            backgroundColor: "rgba(70,70,70,0.7)",
            color: "#e0e0e0",
            borderRadius: "4px",
          }}
        >
          <MenuItem value="">Todas las Categorías</MenuItem>
          {categoriasProducto.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      <Grid
        container
        spacing={2}
        alignContent={"center"}
        justifyContent="center"
        sx={{ padding: 2, borderRadius: 2, flexWrap: "wrap" }}
      >
        {productos && productos.length > 0 ? (
          productos.map((itemCard: CardProps) => (
            <Grid item key={itemCard.itemCard.id} sx={{ margin: 2 }}>
              <CardObject itemCard={itemCard.itemCard} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <Typography
              variant="h6"
              className="textWhte"
              sx={{ borderRadius: "10px", width: "400px" }}
            >
              No hay productos para mostrar.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default HomeView;