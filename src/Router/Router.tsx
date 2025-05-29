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
import LoginView from "../views/Login/LoginView"
import RegisterView from "../views/Register/RegisterView"
import ProtectedRoute from "./ProtectedRoute"

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/" element={<HomeView />} />
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR', 'CLIENTE', 'EMPLEADO']} />}>
        <Route path="/articulo-insumo" element={<ArticuloInsumoView />} >
            <Route path="" element={<InsumosTable />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']} />}>
            <Route path="crear" element={<InsumoForm />} />
            <Route path="editar/:id" element={<InsumoForm />} />
            </Route>
            <Route path="ver/:id" element={<InsumoDetails />} />
        </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'VENDEDOR', 'CLIENTE', 'EMPLEADO']} />}>
        <Route path="/articulo-manufacturado" element={<ArticuloManufacturadoView />} >
            <Route path="" element={<ManufacturadoTable />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']} />}>
            <Route path="crear" element={<ManufacturadoForm />} />
            <Route path="editar/:id" element={<ManufacturadoForm />} />
            </Route>
            <Route path="ver/:id" element={<ManufacturadoDetails />} />
        </Route>
        </Route>
    </Routes>
  )
}

export default Router