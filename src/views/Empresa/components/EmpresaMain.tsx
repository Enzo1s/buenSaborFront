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
  MenuItem,
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
  const [searchCUIT, setSearchCUIT] = useState("");
  const [searchEstado, setSearchEstado] = useState("");

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
    )
    .filter((c) => {
      // Check if CUIT starts with the search term (prefix matching)
      if (searchCUIT) {
        return c.cuil.toString().startsWith(searchCUIT);
      }
      return true; // If searchCUIT is empty, include all
    })
    .filter((c) => {
      if (searchEstado === "activo") {
        return !c.baja;
      } else if (searchEstado === "inactivo") {
        return !!c.baja;
      }
      return true;
    });

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
      {/* Botón crear empresa */}
      <Grid container size={12} sx={{ mb: 3 }}>
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
            sx={{
              backgroundColor: "#2F3B52",
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
            sx={{
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
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Buscar por CUIT"
            variant="outlined"
            size="small"
            value={searchCUIT}
            onChange={(e) => setSearchCUIT(e.target.value)}
            fullWidth
            sx={{
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
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            select
            label="Estado"
            variant="outlined"
            size="small"
            value={searchEstado}
            onChange={(e) => setSearchEstado(e.target.value)}
            fullWidth
            SelectProps={{
              style: { color: "#FFFFFF" }, // White text for better readability
              MenuProps: {
                PaperProps: {
                  style: {
                    backgroundColor: "#2F3B52", // Consistent background
                    color: "#FFFFFF", // White text
                  },
                },
              },
            }}
            sx={{
              backgroundColor: "#2F3B52", // Dark blue-gray background for better contrast
              borderRadius: "8px",
              height: "40px",
              width: "150px",
              "& .MuiInputBase-input": {
                color: "#FFFFFF", // White text for better readability
              },
              "& .MuiInputLabel-root": {
                color: "#A0B0C0", // Light blue-gray text (same as other filters)
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
          >
            <MenuItem value="" sx={{
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
            }}>
              Todos
            </MenuItem>
            <MenuItem value="activo" sx={{
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
            }}>
              Activo
            </MenuItem>
            <MenuItem value="inactivo" sx={{
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
            }}>
              Inactivo
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Tabla */}
      {sortedCompanies && sortedCompanies.length > 0 ? (
        <Grid item size={12}>
          <Paper
            elevation={6}
            sx={{
              borderRadius: "12px",
              backgroundColor: "rgba(30, 30, 30, 0.9)",
              boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              maxHeight: "calc(100vh - 320px)",
              overflow: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 650,
              }}
            >
              <TableHead
                sx={{
                  backgroundColor: "rgba(50, 50, 50, 0.95)",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableRow
                  sx={{
                    backgroundColor: "rgba(50, 50, 50, 0.95)",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <TableCell
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      borderBottom: "1px solid #444",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      backgroundColor: "rgba(50, 50, 50, 0.95)",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "nombre"}
                      direction={orderBy === "nombre" ? order : "asc"}
                      onClick={() => handleSort("nombre")}
                      sx={{ color: "#ffffff" }}
                    >
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#f0f0f0",
                      fontWeight: "bold",
                      borderBottom: "1px solid #444",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      backgroundColor: "rgba(50, 50, 50, 0.95)",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === "razonSocial"}
                      direction={orderBy === "razonSocial" ? order : "asc"}
                      onClick={() => handleSort("razonSocial")}
                      sx={{ color: "#f0f0f0" }}
                    >
                      Razón Social
                    </TableSortLabel>
                  </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "rgba(50, 50, 50, 0.95)",
                  }}
                >
                  CUIT
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "rgba(50, 50, 50, 0.95)",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    borderBottom: "1px solid #444",
                    width: "150px",
                    position: "sticky",
                    top: 0,
                    zIndex: 2,
                    backgroundColor: "rgba(50, 50, 50, 0.95)",
                  }}
                  align="center"
                >
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
                      backgroundColor: "rgba(40, 40, 40, 0.8)",
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "rgba(35, 35, 35, 0.8)",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(60, 60, 60, 0.9) !important",
                    },
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {company.nombre}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {company.razonSocial}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#e0e0e0", borderBottom: "1px solid #333" }}
                  >
                    {company.cuil.toString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: company.baja ? "#ff6b6b" : "#66bb6a",
                      fontWeight: "bold",
                      borderBottom: "1px solid #333",
                    }}
                  >
                    {company.baja ? "Inactivo" : "Activo"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      borderBottom: "1px solid #333",
                      width: "150px",
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/empresa/ver/${company.id}`)}
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
                      onClick={() => navigate(`/empresa/editar/${company.id}`)}
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
                        setOpenDelete({ open: true, id: company?.id })
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
          </Paper>
        </Grid>
      ) : (
        <Grid item size={12}>
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "rgba(30, 30, 30, 0.9)",
              color: "#e0e0e0",
            }}
          >
            <Typography variant="h5">
              No hay empresas registradas. ¡Crea la primera!
            </Typography>
          </Paper>
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
    </Box>
  );
};

export default EmpresaMain;
