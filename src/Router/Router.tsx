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
import EmpresaView from "../views/Empresa/EmpresaView"
import EmpresaDetails from "../views/Empresa/components/EmpresaDetails"
import EmpresaForm from "../views/Empresa/components/EmpresaForm"
import EmpresaMain from "../views/Empresa/components/EmpresaMain"
import SucursalView from "../views/Sucursal/SucursalView"
import SucursalMain from "../views/Sucursal/components/SucursalMain"
import SucursalForm from "../views/Sucursal/components/SucursalForm"
import SucursalDetails from "../views/Sucursal/components/SucursalDetails"
import SucursalInsumoView from "../views/SucursalInsumo/SucursalInsumoView"
import SucursalInsumoForm from "../views/SucursalInsumo/SucursalInsumoForm"
import PedidoVentaView from "../views/PedidoVenta/PedidoVentaView"
import PedidoVentaTable from "../views/PedidoVenta/components/PedidoVentaTable"
import EmpleadoView from "../views/Empleado/EmpleadoView"
import EmpleadoTable from "../views/Empleado/components/EmpleadoTable"
import EmpleadoForm from "../views/Empleado/components/EmpleadoForm"
import EmpleadoDetails from "../views/Empleado/components/EmpleadoDetails"
import PedidoVentaForm from "../views/PedidoVenta/components/PedidoVentaForm"
import PromocionView from "../views/Promocion/PromocionView"
import PromocionForm from "../views/Promocion/components/PromocionForm"
import PromocionTable from "../views/Promocion/components/PromocionTable"
import PromocionDetails from "../views/Promocion/components/PromocionDetails"
import MercadoPagoResponse from "../views/PedidoVenta/MercadoPagoResponse"

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      <Route path="/" element={<HomeView />} />
      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLEADO"]} />}>
        <Route path="/empresa" element={<EmpresaView />}>
          <Route path="" element={<EmpresaMain />} />
          <Route path="ver/:id" element={<EmpresaDetails />} />
          <Route path="crear" element={<EmpresaForm />} />
          <Route path="editar/:id" element={<EmpresaForm />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLEADO"]} />}>
        <Route path="/sucursal" element={<SucursalView />}>
          <Route path="" element={<SucursalMain />} />
          <Route path="crear" element={ <SucursalForm sucursales={[]} setSucursales={() => {}} setViewForm={() => {}} isFromCompany={false}/>}/>
          <Route path="editar/:id" element={<SucursalForm sucursales={[]} setSucursales={() => {}} setViewForm={() => {}} isFromCompany={false}/>}/>
          <Route path="ver/:id" element={<SucursalDetails />} />
        </Route>

        <Route path="/empleado" element={<EmpleadoView />}>
          <Route path="" element={<EmpleadoTable />} />
          <Route path="crear" element={<EmpleadoForm />} />
          <Route path="editar/:id" element={<EmpleadoForm />} />
          <Route path="ver/:id" element={<EmpleadoDetails />} />
        </Route>

        <Route path="/pedido-venta" element={<PedidoVentaView />}>
          <Route path="" element={<PedidoVentaTable idEmpleado={null} />} />
          <Route path="crear" element={<PedidoVentaForm />} />
          <Route path="crear/:idEmpleado" element={<PedidoVentaForm />} />
          <Route path="editar/:id" element={<PedidoVentaForm />} />
          <Route path="Pago" element={<MercadoPagoResponse />} />
        </Route>

        <Route path="/sucursal-insumo" element={<SucursalInsumoView />}>
          <Route path="crear/:idSucursal" element={<SucursalInsumoForm />} />
          <Route path="editar/:id" element={<SucursalInsumoForm />} />
        </Route>

        <Route path="/articulo-insumo" element={<ArticuloInsumoView />}>
          <Route path="" element={<InsumosTable />} />
          <Route
            element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLEADO"]} />}
          >
            <Route path="crear" element={<InsumoForm />} />
            <Route path="editar/:id" element={<InsumoForm />} />
          </Route>
          <Route path="ver/:id" element={<InsumoDetails />} />
        </Route>

        <Route path="/promocion" element={<PromocionView />}>
          <Route path="" element={<PromocionTable />} />
          <Route path="crear" element={<PromocionForm />} />
          <Route path="editar/:id" element={<PromocionForm />} />
          <Route path="ver/:id" element={<PromocionDetails />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN", "CLIENTE", "EMPLEADO"]} />}>
        <Route path="/articulo-manufacturado" element={<ArticuloManufacturadoView />}>
          <Route path="" element={<ManufacturadoTable />} />
          <Route element={<ProtectedRoute allowedRoles={["ADMIN", "EMPLEADO"]} />}>
            <Route path="crear" element={<ManufacturadoForm />} />
            <Route path="editar/:id" element={<ManufacturadoForm />} />
          </Route>
          <Route path="ver/:id" element={<ManufacturadoDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router