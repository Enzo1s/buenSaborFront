import { DatosMercadoPago } from "./DatosMercadoPago";
import { FacturaVentaDetalle } from "./FacturaVentaDetalle";

export interface FacturaVenta {
    id: String | null,
	fechaFacturacion: Date,
	numeroComprobante: Number,
	formaPago: string,
	subTotal: Number,
	descuento: Number,
	gastosEnvio: Number,
	totalVenta: Number,
	datosMP: DatosMercadoPago,
	facturaVentaDetalle: FacturaVentaDetalle[],
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}