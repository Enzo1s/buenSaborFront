import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { Promocion } from "./Promocion";

export interface PedidoVentaDetalle {
    id: String | null,
	cantidad: Number,
	subTotal: Number,
	articuloManufacturado: ArticuloManufacturado[],
	articuloInsumo: ArticuloInsumo[],
	promocion: Promocion[]
}