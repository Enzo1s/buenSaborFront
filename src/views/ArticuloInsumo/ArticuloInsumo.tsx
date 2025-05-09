import { Typography } from "@mui/material"
import { Outlet } from "react-router";

const ArticuloInsumo = () => {
  
  return (
    <div>
      <Typography variant="h1">Articulo Insumo</Typography>
      
      <Outlet />
    </div>
  )
}

export default ArticuloInsumo