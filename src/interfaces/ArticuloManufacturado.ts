import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle"
import { CategoriaArticuloManufacturado } from "./CategoriaArticuloManufacturado"

export interface ArticuloManufacturado {
    id: string | null,
	denominacion: string,
	descripcion: string,
	precioVenta: Number,
	precioCosto: Number,
	tiempoEstimado: Number,
	categoriaArticuloManufacturado: CategoriaArticuloManufacturado | null,
	pathImagen: string[]
	articuloManufacturadoDetalle: ArticuloManufacturadoDetalle[]
}