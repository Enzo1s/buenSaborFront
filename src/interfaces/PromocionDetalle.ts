import { ArticuloManufacturado } from "./ArticuloManufacturado"

export interface PromocionDetalle {
    id: String | null,
	cantidad: Number,
	articuloManufacturado: ArticuloManufacturado,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}