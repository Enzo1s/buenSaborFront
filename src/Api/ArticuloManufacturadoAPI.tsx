import axios from 'axios'
import { ArticuloManufacturado } from '../interfaces/ArticuloManufacturado';

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const getAllArticuloManufacturado = async () => {
  return axios.get("http://localhost:8080/api/articulo-manufacturado");
}

export const getArticuloManufacturadoById = async (id: string) => {
  return await axios.get(`http://localhost:8080/api/articulo-manufacturado/${id}`);
}

export const crearArticuloManufacturado = async (data: ArticuloManufacturado) => {
  return await axios.post("http://localhost:8080/api/articulo-manufacturado/create", data);
}

export const deleteArticuloManufacturadoById = async (id: string) => {
  return await axios.delete(`http://localhost:8080/api/articulo-manufacturado/${id}`);
}