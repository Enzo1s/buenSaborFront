import {
  Grid,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Modal as MuiModal,
  Box,
  Paper,
  TableSortLabel,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Empresa } from "../../../interfaces/Empresa";
import { deleteEmpresa, getEmpresas } from "../../../Api/EmpresaAPI";

const EmpresaMain = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Empresa[] | null>([]);
  const [openDelete, setOpenDelete] = useState<{
    open: boolean;
    id: String | null;
  }>({ open: false, id: null });

  const [orderBy, setOrderBy] = useState<keyof Empresa>("nombre");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [searchNombre, setSearchNombre] = useState("");
  const [searchRazonSocial, setSearchRazonSocial] = useState("");

  const getCompanies = async () => {
    const { data } = await getEmpresas();
    setCompanies(data);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const handleDelete = async (id: String) => {
    try {
      await deleteEmpresa(id as string);
      setOpenDelete({ open: false, id: null });
      getCompanies();
    } catch (error) {
      console.error("Error eliminando empresa:", error);
    }
  };

  const handleSort = (property: keyof Empresa) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredCompanies = companies
    ?.filter((c) => c.nombre.toLowerCase().includes(searchNombre.toLowerCase()))
    .filter((c) =>
      c.razonSocial.toLowerCase().includes(searchRazonSocial.toLowerCase())
    );

  const sortedCompanies = filteredCompanies
    ? [...filteredCompanies].sort((a, b) => {
        let aValue: any = a[orderBy];
        let bValue: any = b[orderBy];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return order === "asc" ? aValue - bValue : bValue - aValue;
        }

        aValue = aValue ? aValue.toString().toLowerCase() : "";
        bValue = bValue ? bValue.toString().toLowerCase() : "";
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  return (
    <Grid container sx={{ color: "#e0e0e0", padding: { xs: 2, md: 4 } }}>
      {/* Botón crear empresa */}
      <Grid size={12} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/empresa/crear")}
        >
          Crear Empresa
        </Button>
      </Grid>

      {/* Buscadores */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={3}>
          <TextField
            label="Buscar por Nombre"
            variant="outlined"
            size="small"
            value={searchNombre}
            onChange={(e) => setSearchNombre(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Buscar por Razón Social"
            variant="outlined"
            size="small"
            value={searchRazonSocial}
            onChange={(e) => setSearchRazonSocial(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Tabla */}
      {sortedCompanies && sortedCompanies.length > 0 ? (
        <Grid size={12}>
          <Table
            sx={{
              minWidth: 650,
              backgroundColor: "rgba(50,50,50,0.9)",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(70,70,70,0.95)" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <TableSortLabel
                    active={orderBy === "nombre"}
                    direction={orderBy === "nombre" ? order : "asc"}
                    onClick={() => handleSort("nombre")}
                    sx={{ color: "#fff" }}
                  >
                    Nombre
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <TableSortLabel
                    active={orderBy === "razonSocial"}
                    direction={orderBy === "razonSocial" ? order : "asc"}
                    onClick={() => handleSort("razonSocial")}
                    sx={{ color: "#fff" }}
                  >
                    Razón Social
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  CUIT
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCompanies.map((company) => (
                <TableRow
                  key={company.id as Key}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(60,60,60,0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(55,55,55,0.8)",
                    },
                    "&:hover": { backgroundColor: "rgba(80,80,80,0.9)" },
                  }}
                >
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {company.nombre}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {company.razonSocial}
                  </TableCell>
                  <TableCell sx={{ color: "#e0e0e0" }}>
                    {company.cuil.toString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/empresa/ver/${company.id}`)}
                      sx={{ "&:hover": { color: "#64B5F6" } }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => navigate(`/empresa/editar/${company.id}`)}
                      sx={{ "&:hover": { color: "#BA68C8" } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        setOpenDelete({ open: true, id: company?.id })
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
            No hay empresas para mostrar.
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
            bgcolor: "#424242",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            color: "#e0e0e0",
          }}
        >
          <Grid container spacing={2}>
            <Grid size={12}>
              <Typography variant="h5" sx={{ mb: 1, color: "#fff" }}>
                ¿Desea eliminar la empresa?
              </Typography>
              <Typography variant="body1" sx={{ color: "#a0a0a0" }}>
                Se perderán todos los datos asociados a la empresa.
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

export default EmpresaMain;
