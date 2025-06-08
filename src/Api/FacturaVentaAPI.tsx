import axios from "axios"
import { FacturaVenta } from "../interfaces/FacturaVenta"

export const createFacturaVenta = async (facturaVenta: FacturaVenta) => {
    return await axios.post("http://localhost:8080/api/factura-venta/create", facturaVenta)
}