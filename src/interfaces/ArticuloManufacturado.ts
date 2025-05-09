import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle"
import { CategoriaArticuloManufacturado } from "./CategoriaArticuloManufacturado"

export interface ArticuloManufacturado {
    id: String | null,
	denominacion: String,
	descripcion: String,
	precioVenta: String,
	precioCosto: String,
	tiempoEstimado: Number,
	categoriaArticuloManufacturado: CategoriaArticuloManufacturado,
	pathImagen: [String]
	articuloManufacturadoDetalle: ArticuloManufacturadoDetalle[]
}