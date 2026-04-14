import { PromocionDetalle } from "./PromocionDetalle";

export interface Promocion {
    id: String | null,
	denominacion: String,
	fechaDesde: Date,
	fechaHasta: Date,
	descuento: Number,
	pathImagen: string[],
	promocionDetalle: PromocionDetalle[],
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}