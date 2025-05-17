import { Estado } from "../enums/Estado"
import { FormaPago } from "../enums/FormaPago"
import { TipoEnvio } from "../enums/TipoEnvio"
import { Cliente } from "./Cliente"
import { Empleado } from "./Empleado"
import { FacturaVenta } from "./FacturaVenta"
import { PedidoVentaDetalle } from "./PedidoVentaDetalle"
import { SucursalEmpresa } from "./SucursalEmpresa"

export interface PedidoVenta {
    id: String | null,
	horaEstimadaFinalizacion: Date,
	subtotal: Number,
	descuento: Number,
	gastosEnvio: Number,
	total: Number,
	totalCosto: Number,
	estado: Estado,
	tipoEnvpio: TipoEnvio,
	formaPago: FormaPago,
	empleado: Empleado,
	sucursal: SucursalEmpresa,
	cliente: Cliente,
	factura: FacturaVenta
	pedidoVentaDetalle: PedidoVentaDetalle[]
	fechaPedido: Date
}