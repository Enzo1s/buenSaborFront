import axios from 'axios'

import { CategoriaArticuloManufacturado } from '../interfaces/CategoriaArticuloManufacturado'

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const getAllCategoriaManufacturado = async () => {
  return await axios.get("http://localhost:8080/api/categoria-articulo-manufacturado")
}

export const createCategoriaManufacturado = async (data: CategoriaArticuloManufacturado) => {
  return await axios.post("http://localhost:8080/api/categoria-articulo-manufacturado/create",data)
}