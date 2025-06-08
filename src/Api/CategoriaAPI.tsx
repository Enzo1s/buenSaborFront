import axios from 'axios'
import { CategoriaArticulo } from '../interfaces/CategoriaArticulo'

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const crearCategoria = async (data: CategoriaArticulo) => {
  return await axios.post("http://localhost:8080/api/categoria-articulo/create",data)
}

export const getAllCategoria = async () => {
  return await axios.get("http://localhost:8080/api/categoria-articulo")
}