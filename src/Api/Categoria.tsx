import axios from 'axios'
import { CategoriaArticulo } from '../interfaces/CategoriaArticulo'

export const crearCategoria = async (data: CategoriaArticulo) => {
  return await axios.post("http://localhost:8080/api/categoria-articulo/create",data)
}
