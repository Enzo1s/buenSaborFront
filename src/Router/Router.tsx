import { Route, Routes } from "react-router"
import ArticuloInsumoView from "../views/ArticuloInsumo/ArticuloInsumoView"
import InsumoForm from "../views/ArticuloInsumo/components/InsumoForm"
import InsumosTable from "../views/ArticuloInsumo/components/InsumosTable"
import ArticuloManufacturadoView from "../views/articulosManufacturados/ArticuloManufacturadoView"
import ManufacturadoTable from "../views/articulosManufacturados/components/ManufacturadoTable"
import ManufacturadoForm from "../views/articulosManufacturados/components/ManufacturadoForm"
import HomeView from "../views/Home/HomeView"
import ManufacturadoDetails from "../views/articulosManufacturados/components/ManufacturadoDetails"
import InsumoDetails from "../views/ArticuloInsumo/components/InsumoDetails"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeView />} />
        <Route path="/articulo-insumo" element={<ArticuloInsumoView />} >
            <Route path="" element={<InsumosTable />} />
            <Route path="crear" element={<InsumoForm />} />
            <Route path="editar/:id" element={<InsumoForm />} />
            <Route path="ver/:id" element={<InsumoDetails />} />
        </Route>
        <Route path="/articulo-manufacturado" element={<ArticuloManufacturadoView />} >
            <Route path="" element={<ManufacturadoTable />} />
            <Route path="crear" element={<ManufacturadoForm />} />
            <Route path="editar/:id" element={<ManufacturadoForm />} />
            <Route path="ver/:id" element={<ManufacturadoDetails />} />
        </Route>
    </Routes>
  )
}

export default Router