import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManufacturado } from "./ArticuloManufacturado";

export interface FacturaVentaDetalle {
    id: String,
	cantidad: Number,
	subTotal: Number,
	articuloManufacturado: ArticuloManufacturado,
	articuloInsumo: ArticuloInsumo
}