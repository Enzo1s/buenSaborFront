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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { ArticuloManufacturado } from "../../../interfaces/ArticuloManufacturado";
import {
  deleteArticuloManufacturadoById,
  getAllArticuloManufacturado,
} from "../../../Api/ArticuloManufacturadoAPI";
import { useNavigate } from "react-router";

type Order = "asc" | "desc";

const ManufacturadoTable = () => {
  const [aManufacturados, setAManufacturados] = useState<
    ArticuloManufacturado[]
  >([]);
  const [aManufacturadosBefore, setAManufacturadosBefore] = useState<
    ArticuloManufacturado[]
  >([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("");

  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      await deleteArticuloManufacturadoById(id);
      setOpenDelete({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting articulo manufacturado:", error);
    }
  };

  const handleSearch = (searchTerm: string) => {
    let filtered = [...aManufacturadosBefore];

    if (categoriaSeleccionada) {
      filtered = filtered.filter(
        (a) =>
          a.categoriaArticuloManufacturado?.denominacion ===
          categoriaSeleccionada
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (aManufacturado) =>
          aManufacturado.denominacion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          aManufacturado.categoriaArticuloManufacturado?.denominacion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          aManufacturado.descripcion
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          aManufacturado.articuloManufacturadoDetalle.some((insumo) =>
            insumo.articuloInsumo?.denominacion
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
      );
    }

    setAManufacturados(filtered);
  };

  const handleCategoriaChange = (categoria: string) => {
    setCategoriaSeleccionada(categoria);
    let filtered = [...aManufacturadosBefore];

    if (categoria) {
      filtered = filtered.filter(
        (a) => a.categoriaArticuloManufacturado?.denominacion === categoria
      );
    }

    setAManufacturados(filtered);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(
    a: ArticuloManufacturado,
    b: ArticuloManufacturado,
    orderBy: string
  ) {
    if (orderBy === "articuloManufacturadoDetalle") {
      return (
        b.articuloManufacturadoDetalle.length -
        a.articuloManufacturadoDetalle.length
      );
    }

    if (
      b[orderBy as keyof ArticuloManufacturado] === null ||
      b[orderBy as keyof ArticuloManufacturado] === undefined
    )
      return -1;
    if (
      a[orderBy as keyof ArticuloManufacturado] === null ||
      a[orderBy as keyof ArticuloManufacturado] === undefined
    )
      return 1;

    if (
      typeof b[orderBy as keyof ArticuloManufacturado] === "number" &&
      typeof a[orderBy as keyof ArticuloManufacturado] === "number"
    ) {
      return (
        (b[orderBy as keyof ArticuloManufacturado] as number) -
        (a[orderBy as keyof ArticuloManufacturado] as number)
      );
    }
    return String(b[orderBy as keyof ArticuloManufacturado]).localeCompare(
      String(a[orderBy as keyof ArticuloManufacturado])
    );
  }

  function getComparator(
    order: Order,
    orderBy: string
  ): (a: ArticuloManufacturado, b: ArticuloManufacturado) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const sortedRows = orderBy
    ? [...aManufacturados].sort(getComparator(order, orderBy))
    : aManufacturados;

  useEffect(() => {
    const getArticulos = async () => {
      const { data } = await getAllArticuloManufacturado();
      setAManufacturados(data);
      setAManufacturadosBefore(data);

      const categoriasUnicas = Array.from(
        new Set(
          data
            .map((a) => a.categoriaArticuloManufacturado?.denominacion)
            .filter(Boolean)
        )
      ) as string[];
      setCategorias(categoriasUnicas);
    };
    getArticulos();
  }, []);

  return (
    <Grid
      container
      sx={{
        color: "#e0e0e0",
        padding: { xs: 2, md: 4 },
      }}
    >
      {/* Título */}
      <Grid size={12} sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: "#fff", fontWeight: "bold" }}
        >
          Listado de Artículos Manufacturados
        </Typography>
      </Grid>

      {/* Search + Filtro + Crear */}
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
            flex: "0 0 25%", // ocupa 1/4 del espacio
            backgroundColor: "rgba(70, 70, 70, 0.7)",
            borderRadius: "4px",
            "& .MuiInputBase-input": { color: "#e0e0e0" },
            "& .MuiInputLabel-root": {
              color: "#a0a0a0",
              "&.Mui-focused": { color: "#fff" },
              "&.MuiFormLabel-filled": { color: "#fff" },
            },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#757575" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#90CAF9",
              borderWidth: "2px",
            },
          }}
        />

        <FormControl
          variant="outlined"
          sx={{
            minWidth: 200,
            backgroundColor: "rgba(70, 70, 70, 0.7)",
            borderRadius: "4px",
          }}
        >
          <InputLabel sx={{ color: "#a0a0a0" }}>Categoría</InputLabel>
          <Select
            value={categoriaSeleccionada}
            onChange={(e) => handleCategoriaChange(e.target.value)}
            label="Categoría"
            sx={{
              color: "#e0e0e0",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "#757575" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e0e0e0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#90CAF9",
              },
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            {categorias.map((categoria) => (
              <MenuItem key={categoria} value={categoria}>
                {categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/articulo-manufacturado/crear")}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            px: 4,
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          Crear Artículo Manufacturado
        </Button>
      </Grid>

      {/* Tabla */}
      {aManufacturados && aManufacturados.length > 0 ? (
        <Grid size={12}>
          <Table
            sx={{
              minWidth: 1000,
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
                  { id: "precioCosto", label: "Precio Costo", sortable: true },
                  { id: "precioVenta", label: "Precio Venta", sortable: true },
                  {
                    id: "tiempoEstimado",
                    label: "Tiempo Est. (min)",
                    sortable: true,
                  },
                  { id: "descripcion", label: "Descripción", sortable: false },
                  {
                    id: "articuloManufacturadoDetalle",
                    label: "Insumos",
                    sortable: true,
                  },
                  {
                    id: "categoriaArticuloManufacturado",
                    label: "Categoría",
                    sortable: false,
                  },
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
                        onClick={() => handleRequestSort(headCell.id)}
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
              {sortedRows.map((aManufacturado) => (
                <TableRow
                  key={aManufacturado.id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(60, 60, 60, 0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(55, 55, 55, 0.8)",
                    },
                    "&:hover": { backgroundColor: "rgba(80, 80, 80, 0.9)" },
                    opacity: aManufacturado.baja ? 0.6 : 1,
                    fontStyle: aManufacturado.baja ? "italic" : "normal",
                  }}
                >
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {aManufacturado.denominacion}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {`$${aManufacturado.precioCosto.toFixed(2)}`}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {`$${aManufacturado.precioVenta.toFixed(2)}`}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {aManufacturado.tiempoEstimado.toFixed(2)} Minutos
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#e0e0e0",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {aManufacturado.descripcion}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#e0e0e0",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {aManufacturado.articuloManufacturadoDetalle
                      .map((detalle) => detalle.articuloInsumo?.denominacion)
                      .join(", ") || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {aManufacturado.categoriaArticuloManufacturado
                      ?.denominacion || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: aManufacturado.baja ? "#EF9A9A" : "#A5D6A7" }}
                  >
                    {aManufacturado.baja ? "Dada de Baja" : "Activo"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/articulo-manufacturado/ver/${aManufacturado.id}`
                        )
                      }
                      sx={{ "&:hover": { color: "#64B5F6" } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        navigate(
                          `/articulo-manufacturado/editar/${aManufacturado.id}`
                        )
                      }
                      sx={{ "&:hover": { color: "#BA68C8" } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setOpenDelete({ open: true, id: aManufacturado?.id })
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
        <Grid size={12} sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" sx={{ color: "#a0a0a0" }}>
            No hay artículos manufacturados para mostrar.
          </Typography>
        </Grid>
      )}

      {/* Modal de Eliminación */}
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
                ¿Desea eliminar el artículo manufacturado?
              </Typography>
              <Typography variant="body1" sx={{ color: "#a0a0a0" }}>
                Esta acción lo marcará como dado de baja en el sistema.
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

export default ManufacturadoTable;
