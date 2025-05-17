import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle"
import { CategoriaArticuloManufacturado } from "./CategoriaArticuloManufacturado"

export interface ArticuloManufacturado {
    id: String | null,
	denominacion: String,
	descripcion: String,
	precioVenta: Number,
	precioCosto: Number,
	tiempoEstimado: Number,
	categoriaArticuloManufacturado: CategoriaArticuloManufacturado | null,
	pathImagen: String[]
	articuloManufacturadoDetalle: ArticuloManufacturadoDetalle[]
}