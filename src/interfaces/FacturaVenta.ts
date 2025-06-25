import { DatosMercadoPago } from "./DatosMercadoPago";
import { FacturaVentaDetalle } from "./FacturaVentaDetalle";

export interface FacturaVenta {
    id: string | null,
	fechaFacturacion: Date,
	numeroComprobante: number,
	formaPago: string,
	subTotal: number,
	descuento: number,
	gastosEnvio: number,
	totalVenta: number,
	datosMP: DatosMercadoPago,
	facturaVentaDetalle: FacturaVentaDetalle[],
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}