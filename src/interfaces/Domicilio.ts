import { Localidad } from "./Localidad";

export interface Domicilio {
    id: String | null,
	calle: String,
	numero:  Number,
	cp: Number,
	localidad: Localidad,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}