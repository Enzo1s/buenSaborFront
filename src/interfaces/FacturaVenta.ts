import { FormaPago } from "../enums/FormaPago";
import { DatosMercadoPago } from "./DatosMercadoPago";
import { FacturaVentaDetalle } from "./FacturaVentaDetalle";

export interface FacturaVenta {
    id: String,
	fechaFacturacion: Date,
	numeroComprobante: Number,
	formaPago: FormaPago,
	subTotal: Number,
	descuento: Number,
	gastosEnvio: Number,
	totalVenta: Number,
	datosMP: DatosMercadoPago,
	facturaVentaDetalle: [FacturaVentaDetalle]
}