import { Typography, Box } from "@mui/material";
import { Outlet } from "react-router";

const ArticuloInsumoView = () => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography variant="h5" className="textWhte" sx={{ flexShrink: 0 }}>
        Articulo Insumo
      </Typography>

      <Box sx={{ flexGrow: 1, overflow: "hidden", p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ArticuloInsumoView;
