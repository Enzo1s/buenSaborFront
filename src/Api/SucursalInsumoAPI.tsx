import axios from "axios"
import { SucursalInsumo } from "../interfaces/SucursalInsumo"

export const getSucursalInsumosByIdSucursal = async (id: string) => {
    return await axios.get(`http://localhost:8080/api/sucursal-insumo/search?idSucursal=${id}`)
}

export const createSucursalInsumo = async (sucursalInsumo: SucursalInsumo) => {
    return await axios.post(`http://localhost:8080/api/sucursal-insumo/create`, sucursalInsumo)
}

export const findByIdSucursalInsumo = async (id: string) => {
    return await axios.get(`http://localhost:8080/api/sucursal-insumo/${id}`)
}
