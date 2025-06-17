import axios from "axios"
import { MercadoPagoResponse } from "../interfaces/MercadoPagoResponse";

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const createPreference = async (id: string) => {
    return await axios.post(`http://localhost:8080/api/datos-mercadopago/create-preference?idPedidoVentas=${id}`)
}

export const proccesPay = async (paymentResponse: MercadoPagoResponse) => {
    return await axios.post(
      "http://localhost:8080/api/datos-mercadopago/process_payment",
      paymentResponse,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
}