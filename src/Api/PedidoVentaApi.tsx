import axios from 'axios'
import { PedidoVenta } from '../interfaces/PedidoVenta'

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const gePedidoVenta = async () => {
  return await axios.get("http://localhost:8080/api/pedido-venta");
}

export const createPedidoVenta = async (pedidoVenta: PedidoVenta) => {
    return await axios.post("http://localhost:8080/api/pedido-venta/create", pedidoVenta);
}

export const getPedidoVentaByIdSucursal = async (id: string) => {
  return await axios.get(`http://localhost:8080/api/pedido-venta/sucursal?id=${id}`)
}