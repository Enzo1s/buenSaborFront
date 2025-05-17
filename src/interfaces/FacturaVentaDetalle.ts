import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManufacturado } from "./ArticuloManufacturado";

export interface FacturaVentaDetalle {
    id: String | null,
	cantidad: Number,
	subTotal: Number,
	articuloManufacturado: ArticuloManufacturado | null,
	articuloInsumo: ArticuloInsumo | null
}