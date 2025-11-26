import { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle"
import { CategoriaArticuloManufacturado } from "./CategoriaArticuloManufacturado"

export interface ArticuloManufacturado {
    id: string | null,
	denominacion: string,
	descripcion: string,
	precioVenta: Number | null,
	precioCosto: Number | null,
	tiempoEstimado: Number,
	categoriaArticuloManufacturado: CategoriaArticuloManufacturado | null,
	pathImagen: string[]
	articuloManufacturadoDetalle: ArticuloManufacturadoDetalle[],
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}