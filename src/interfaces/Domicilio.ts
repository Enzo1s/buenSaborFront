import { Localidad } from "./Localidad";

export interface Domicilio {
    id: String,
	calle: String,
	numero:  Number,
	cp: Number,
	localidad: Localidad
}