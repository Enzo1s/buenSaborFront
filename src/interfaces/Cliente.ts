import { Domicilio } from "./Domicilio";
import { Usuario } from "./Usuario";

export interface Cliente {
    id: String,
	nombre: String,
	apellido: String,
	telefono: String,
	email: String
	usuario: Usuario,
	domicilio: Domicilio,

}