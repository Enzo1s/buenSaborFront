import { CategoriaArticulo } from "./CategoriaArticulo";

export interface ArticuloInsumo {
    id:String | null,
	denominacion: String,
	precioCompra: Number | null,
	precioVenta: Number | null,
	esParaElaborar: Boolean,
	unidadMedida: String,
	categoriaArticulo: CategoriaArticulo[],
	pathImagen: String[],
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}