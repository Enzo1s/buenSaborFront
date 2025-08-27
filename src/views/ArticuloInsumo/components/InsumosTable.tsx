import {
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal as MuiModal,
  Box,
  TableSortLabel,
  Select,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Key, useEffect, useState } from "react";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import {
  deleteArticuloInsumo,
  getListArticuloInsumo,
} from "../../../Api/ArticuloInsumo";
import { useNavigate } from "react-router";

type Order = "asc" | "desc";

const InsumosTable = () => {
  const navigate = useNavigate();
  const [articuloInsumos, setArticuloInsumos] = useState<ArticuloInsumo[]>([]);
  const [articuloInsumosBefore, setArticuloInsumosBefore] = useState<
    ArticuloInsumo[]
  >([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("");

  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: String | null;
  }>({ open: false, id: null });

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  const handleDelete = async (id: String) => {
    try {
      await deleteArticuloInsumo(id);
      setOpenDelete({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting articulo insumo:", error);
    }
  };

  const handleSearch = (searchTerm: string) => {
    let filtered = articuloInsumosBefore;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (articuloInsumo) =>
          articuloInsumo.denominacion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          articuloInsumo.categoriaArticulo?.some((categoria) =>
            categoria?.denominacion
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      );
    }

    if (categoriaFiltro) {
      filtered = filtered.filter((insumo) =>
        insumo.categoriaArticulo?.some(
          (cat) =>
            cat?.denominacion.toLowerCase() === categoriaFiltro.toLowerCase()
        )
      );
    }

    setArticuloInsumos(filtered);
  };

  const handleCategoriaFiltro = (categoria: string) => {
    setCategoriaFiltro(categoria);
    let filtered = articuloInsumosBefore;

    if (categoria) {
      filtered = filtered.filter((insumo) =>
        insumo.categoriaArticulo?.some(
          (cat) => cat?.denominacion.toLowerCase() === categoria.toLowerCase()
        )
      );
    }

    setArticuloInsumos(filtered);
  };

  // ---- ORDENAMIENTO ----
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(
    a: ArticuloInsumo,
    b: ArticuloInsumo,
    orderBy: string
  ) {
    const aValue = a[orderBy as keyof ArticuloInsumo];
    const bValue = b[orderBy as keyof ArticuloInsumo];

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return bValue - aValue;
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return Number(bValue) - Number(aValue);
    }

    return String(bValue).localeCompare(String(aValue));
  }

  function getComparator(
    order: Order,
    orderBy: string
  ): (a: ArticuloInsumo, b: ArticuloInsumo) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedRows = orderBy
    ? [...articuloInsumos].sort(getComparator(order, orderBy))
    : articuloInsumos;

  // ---- FETCH ----
  useEffect(() => {
    const getInsumos = async () => {
      const { data } = await getListArticuloInsumo();
      setArticuloInsumos(data);
      setArticuloInsumosBefore(data);

      // Extraer categorías únicas
      const categoriasUnicas = Array.from(
        new Set(
          data.flatMap(
            (i) => i.categoriaArticulo?.map((c) => c.denominacion) || []
          )
        )
      );
      setCategorias(categoriasUnicas);
    };
    getInsumos();
  }, []);

  return (
    <Grid
      container
      sx={{
        color: "#e0e0e0",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Grid size={12} sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Listado de Artículos Insumo
        </Typography>
      </Grid>

      {/* Barra de búsqueda y filtro */}
      <Grid
        size={12}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Buscar por Denominación"
          variant="outlined"
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            flexBasis: "25%", // <-- 1/4 del ancho
            backgroundColor: "rgba(70, 70, 70, 0.7)",
            borderRadius: "4px",
            "& .MuiInputBase-input": {
              color: "#e0e0e0",
            },
            "& .MuiInputLabel-root": {
              color: "#a0a0a0",
              "&.Mui-focused": {
                color: "#fff",
              },
              "&.MuiFormLabel-filled": {
                color: "#fff",
              },
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
          }}
        />

        <Select
          value={categoriaFiltro}
          onChange={(e) => handleCategoriaFiltro(e.target.value)}
          displayEmpty
          sx={{
            flexBasis: "20%",
            backgroundColor: "rgba(70,70,70,0.7)",
            color: "#e0e0e0",
            borderRadius: "4px",
          }}
        >
          <MenuItem value="">Todas las Categorías</MenuItem>
          {categorias.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/articulo-insumo/crear")}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          Crear Artículo Insumo
        </Button>
      </Grid>

      {/* Tabla */}
      {articuloInsumos && articuloInsumos.length > 0 ? (
        <Grid size={12}>
          <Table
            sx={{
              minWidth: 900,
              backgroundColor: "rgba(50, 50, 50, 0.9)",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              overflow: "hidden",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(70, 70, 70, 0.95)" }}>
                {[
                  { id: "denominacion", label: "Denominación", sortable: true },
                  {
                    id: "precioCompra",
                    label: "Precio Compra",
                    sortable: true,
                  },
                  { id: "precioVenta", label: "Precio Venta", sortable: true },
                  {
                    id: "esParaElaborar",
                    label: "Para Elaborar",
                    sortable: true,
                  },
                  {
                    id: "unidadMedida",
                    label: "Unidad de Medida",
                    sortable: true,
                  },
                  { id: "categoria", label: "Categoría", sortable: false },
                  { id: "baja", label: "Estado (Baja)", sortable: true },
                ].map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() =>
                          headCell.sortable && handleRequestSort(headCell.id)
                        }
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedRows.map((articuloInsumo) => (
                <TableRow
                  key={articuloInsumo.id as Key}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(60, 60, 60, 0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(55, 55, 55, 0.8)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(80, 80, 80, 0.9)",
                    },
                    opacity: articuloInsumo.baja ? 0.6 : 1,
                    fontStyle: articuloInsumo.baja ? "italic" : "normal",
                  }}
                >
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {articuloInsumo.denominacion}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {`$${articuloInsumo.precioCompra.toFixed(2)}`}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {`$${articuloInsumo.precioVenta.toFixed(2)}`}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {articuloInsumo.esParaElaborar ? "Sí" : "No"}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {articuloInsumo.unidadMedida}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {articuloInsumo.categoriaArticulo
                      ?.map((cat) => cat.denominacion)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: articuloInsumo.baja ? "#EF9A9A" : "#A5D6A7",
                    }}
                  >
                    {articuloInsumo.baja ? "Dada de Baja" : "Activo"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/articulo-insumo/ver/${articuloInsumo.id}`)
                      }
                      sx={{ "&:hover": { color: "#64B5F6" } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        navigate(`/articulo-insumo/editar/${articuloInsumo.id}`)
                      }
                      sx={{ "&:hover": { color: "#BA68C8" } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setOpenDelete({ open: true, id: articuloInsumo?.id })
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
        </Grid>
      ) : (
        <Grid
          size={12}
          sx={{ textAlign: "center", mt: 4 }}
          display={"flex"}
          justifyContent={"center"}
        >
          <Typography
            variant="h6"
            className="textWhte"
            sx={{ borderRadius: "10px", width: "400px" }}
          >
            No hay artículos insumo para mostrar.
          </Typography>
        </Grid>
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
                ¿Desea eliminar el artículo insumo?
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
    </Grid>
  );
};

export default InsumosTable;
