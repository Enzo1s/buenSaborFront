import { Route, Routes } from "react-router"
import ArticuloInsumoView from "../views/ArticuloInsumo/ArticuloInsumoView"
import InsumoForm from "../views/ArticuloInsumo/components/InsumoForm"
import InsumosTable from "../views/ArticuloInsumo/components/InsumosTable"
import ArticuloManufacturadoView from "../views/articulosManufacturados/ArticuloManufacturadoView"
import ManufacturadoTable from "../views/articulosManufacturados/components/ManufacturadoTable"
import ManufacturadoForm from "../views/articulosManufacturados/components/ManufacturadoForm"

const Router = () => {
  return (
    <Routes>
        <Route path="/articulo-insumo" element={<ArticuloInsumoView />} >
            <Route path="" element={<InsumosTable />} />
            <Route path="crear" element={<InsumoForm />} />
            <Route path="editar/id" element={<InsumoForm />} />
            <Route path="ver" element={<h1>Ver Articulo Insumo</h1>} />
        </Route>
        <Route path="/articulo-manufacturado" element={<ArticuloManufacturadoView />} >
            <Route path="" element={<ManufacturadoTable />} />
            <Route path="crear" element={<ManufacturadoForm />} />
        </Route>
    </Routes>
  )
}

export default Router