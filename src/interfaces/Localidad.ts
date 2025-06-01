import { Provincia } from "./Provincia";

export interface Localidad {
    id: String | null,
	nombre: String,
	provincia: Provincia,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}