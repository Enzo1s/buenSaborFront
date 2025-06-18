import axios from 'axios'
import { SucursalEmpresa } from '../interfaces/SucursalEmpresa'

export const getSucursales = async () => {
  return await axios.get("http://localhost:8080/api/sucursal-empresa")
}

export const crearSucursalEmpresa = async (sucursal: SucursalEmpresa) => {
  return await axios.post("http://localhost:8080/api/sucursal-empresa/create", sucursal)
}

export const getByIdSucursal = async ( id: string) => {
  return await axios.get(`http://localhost:8080/api/sucursal-empresa/${id}`)
}

export const deleteSucursal = async (id: string) => {
  return await axios.delete(`http://localhost:8080/api/sucursal-empresa/${id}`)
}
