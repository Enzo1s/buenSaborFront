import { Domicilio } from "./Domicilio";
import { Usuario } from "./Usuario";

export interface Cliente {
    id: String | null,
	nombre: String,
	apellido: String,
	telefono: String,
	email: String
	usuario: Usuario,
	domicilio: Domicilio,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}