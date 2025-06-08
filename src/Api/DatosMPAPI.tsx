import axios from "axios"

axios.defaults.headers.common.Authorization = `${localStorage.getItem('token')}`;

export const createPreference = async (id: string) => {
    return await axios.post(`http://localhost:8080/api/datos-mercadopago/create-preference?idPedidoVentas=${id}`)
}