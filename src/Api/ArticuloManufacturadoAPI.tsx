import axios from 'axios'
import { ArticuloManufacturado } from '../interfaces/ArticuloManufacturado';

export const getAllArticuloManufacturado = async () => {
  return axios.get("http://localhost:8080/api/articulo-manufacturado");
}

export const crearArticuloManufacturado = async (data: ArticuloManufacturado) => {
  return await axios.post("http://localhost:8080/api/articulo-manufacturado/create", data);
}