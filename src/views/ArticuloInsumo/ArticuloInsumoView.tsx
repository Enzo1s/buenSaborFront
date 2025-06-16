import { Typography } from "@mui/material"
import { Outlet } from "react-router";

const ArticuloInsumoView = () => {
  
  return (
    <div>
      <Typography variant="h3" className="textWhte">Articulo Insumo</Typography>
      
      <Outlet />
    </div>
  )
}

export default ArticuloInsumoView