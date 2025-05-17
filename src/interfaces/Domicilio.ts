import { Localidad } from "./Localidad";

export interface Domicilio {
    id: String | null,
	calle: String,
	numero:  Number,
	cp: Number,
	localidad: Localidad
}