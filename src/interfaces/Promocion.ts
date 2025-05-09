import { PromocionDetalle } from "./PromocionDetalle";

export interface Promocion {
    id: String,
	denominacion: String,
	fechaDesde: Date,
	fechaHasta: Date,
	descuento: Number,
	promocionDetalle: [PromocionDetalle]
	
}