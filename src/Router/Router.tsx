import { Route, Routes } from "react-router"
import ArticuloInsumo from "../views/ArticuloInsumo/ArticuloInsumo"
import InsumoForm from "../views/ArticuloInsumo/components/InsumoForm"
import InsumosTable from "../views/ArticuloInsumo/components/InsumosTable"

const Router = () => {
  return (
    <Routes>
        <Route path="/articulo-insumo" element={<ArticuloInsumo />} >
            <Route path="" element={<InsumosTable />} />
            <Route path="crear" element={<InsumoForm />} />
            <Route path="editar" element={<h1>Editar Articulo Insumo</h1>} />
            <Route path="eliminar" element={<h1>Eliminar Articulo Insumo</h1>} />
            <Route path="ver" element={<h1>Ver Articulo Insumo</h1>} />
        </Route>
        
    </Routes>
  )
}

export default Router