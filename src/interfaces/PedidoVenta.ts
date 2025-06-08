import { Cliente } from "./Cliente"
import { Empleado } from "./Empleado"
import { FacturaVenta } from "./FacturaVenta"
import { PedidoVentaDetalle } from "./PedidoVentaDetalle"
import { SucursalEmpresa } from "./SucursalEmpresa"

export interface PedidoVenta {
    id: string | null,
	horaEstimadaFinalizacion: Date,
	subtotal: number,
	descuento: number,
	gastosEnvio: number,
	total: number,
	totalCosto: number,
	estado: string,
	tipoEnvio: string,
	formaPago: string,
	empleado: Empleado | null,
	sucursal: SucursalEmpresa | null,
	cliente: Cliente | null,
	factura: FacturaVenta | null,
	pedidoVentaDetalle: PedidoVentaDetalle[]
	fechaPedido: Date,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}