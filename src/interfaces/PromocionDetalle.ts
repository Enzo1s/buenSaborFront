import { ArticuloManufacturado } from "./ArticuloManufacturado"

export interface PromocionDetalle {
    id: String | null,
	cantidad: Number,
	articuloManufacturado: ArticuloManufacturado
}