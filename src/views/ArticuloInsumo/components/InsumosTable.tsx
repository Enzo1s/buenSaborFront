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
  Paper,
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
            backgroundColor: "#2F3B52", // Dark blue-gray background for better contrast
            borderRadius: "8px",
            height: "40px",
            "& .MuiInputBase-input": {
              color: "#FFFFFF", // White text for better readability
            },
            "& .MuiInputLabel-root": {
              color: "#A0B0C0", // Light blue-gray text
              "&.Mui-focused": {
                color: "#90CAF9", // Blue when focused
              },
              "&.MuiFormLabel-filled": {
                color: "#90CAF9", // Blue when filled
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#5D6D82", // Subtle border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8FA4C2", // Lighter border on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#90CAF9", // Blue focus border
              borderWidth: "2px",
            },
          }}
          size="small" // Add size small to match other views
        />

        <Select
          value={categoriaFiltro}
          onChange={(e) => handleCategoriaFiltro(e.target.value)}
          displayEmpty
          size="small"
          sx={{
            flexBasis: "20%",
            backgroundColor: "#2F3B52", // Dark blue-gray background for better contrast
            color: "#FFFFFF", // White text for better readability
            borderRadius: "8px",
            height: "40px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#5D6D82", // Subtle border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8FA4C2", // Lighter border on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#90CAF9", // Blue focus border
              borderWidth: "2px",
            },
          }}
        >
          <MenuItem value="">Todas las Categorías</MenuItem>
          {categorias.map((cat) => (
            <MenuItem
              key={cat}
              value={cat}
              sx={{
                backgroundColor: "#2F3B52", // Consistent menu item background
                color: "#FFFFFF", // White text
                "&.Mui-selected": {
                  backgroundColor: "#5D6D82", // Selected state
                  "&:hover": {
                    backgroundColor: "#4A5A70", // Hover when selected
                  }
                },
                "&:hover": {
                  backgroundColor: "#3C4A63", // Hover state
                }
              }}
            >
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
        <Grid size={12} sx={{
          maxHeight: "600px",
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}>
          <Table
            sx={{
              minWidth: 900,
              backgroundColor: "rgba(30, 30, 30, 0.9)",
              borderRadius: "12px",
              boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(50, 50, 50, 0.9)" }}>
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
                    sx={{
                      color: "#f0f0f0",
                      fontWeight: "bold",
                      borderBottom: "1px solid #444",
                    }}
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
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                  }}
                >
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
                      backgroundColor: "rgba(40, 40, 40, 0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(35, 35, 35, 0.8)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(60, 60, 60, 0.9) !important",
                    },
                    transition: "background-color 0.3s ease",
                    opacity: articuloInsumo.baja ? 0.6 : 1,
                    fontStyle: articuloInsumo.baja ? "italic" : "normal",
                  }}
                >
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {articuloInsumo.denominacion}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {`$${articuloInsumo.precioCompra.toFixed(2)}`}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {`$${articuloInsumo.precioVenta.toFixed(2)}`}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {articuloInsumo.esParaElaborar ? "Sí" : "No"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {articuloInsumo.unidadMedida}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {articuloInsumo.categoriaArticulo
                      ?.map((cat) => cat.denominacion)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: articuloInsumo.baja ? "#EF9A9A" : "#A5D6A7",
                      fontWeight: "bold",
                      borderBottom: "1px solid #333"
                    }}
                  >
                    {articuloInsumo.baja ? "Dada de Baja" : "Activo"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "1px solid #333" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/articulo-insumo/ver/${articuloInsumo.id}`)
                      }
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
                      color="secondary"
                      onClick={() =>
                        navigate(`/articulo-insumo/editar/${articuloInsumo.id}`)
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
                      color="error"
                      onClick={() =>
                        setOpenDelete({ open: true, id: articuloInsumo?.id })
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
        </Grid>
      ) : (
        <Grid size={12}>
          <Box
            component="Paper"
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
            <Typography variant="h5">
              No hay artículos insumo registrados. ¡Crea el primero!
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Modal de eliminación */}
      <MuiModal
        open={openDelete.open}
        onClose={() => setOpenDelete({ open: false, id: null })}
      >
        <Box
          component="Paper"
          elevation={10}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            p: 4,
            borderRadius: "12px",
            backgroundColor: "rgba(40, 40, 40, 0.95)",
            color: "#e0e0e0",
            boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
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
