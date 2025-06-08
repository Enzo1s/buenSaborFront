import axios from "axios"
import { ArticuloInsumo } from "../interfaces/ArticuloInsumo"

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const getListArticuloInsumo = async () => {
  return await axios.get("http://localhost:8080/api/articulo-insumo")
}

export const getByIdArticuloInsumo = async (id:String) => {
    return await axios.get(`http://localhost:8080/api/articulo-insumo/${id}`)
  }
  export const createArticuloInsumo = async (data: ArticuloInsumo) => {
    return await axios.post("http://localhost:8080/api/articulo-insumo/create",data)
  }
  export const deleteArticuloInsumo = async (id: String) => {
    return await axios.delete(`http://localhost:8080/api/articulo-insumo/${id}`)
  }