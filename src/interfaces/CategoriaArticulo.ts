export interface CategoriaArticulo {
    id: String | null,
	denominacion: String,
	categoria: CategoriaArticulo | null,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}