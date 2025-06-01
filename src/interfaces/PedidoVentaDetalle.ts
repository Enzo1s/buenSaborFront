import { ArticuloInsumo } from "./ArticuloInsumo";
import { ArticuloManufacturado } from "./ArticuloManufacturado";
import { Promocion } from "./Promocion";

export interface PedidoVentaDetalle {
    id: string | null,
	cantidad: number,
	subTotal: number,
	articuloManufacturado: ArticuloManufacturado | null,
	articuloInsumo: ArticuloInsumo | null,
	promocion: Promocion[] | null,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}