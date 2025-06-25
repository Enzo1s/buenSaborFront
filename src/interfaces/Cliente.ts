import { Domicilio } from "./Domicilio";
import { Usuario } from "./Usuario";

export interface Cliente {
    id: string | null,
	nombre: string,
	apellido: string,
	telefono: string,
	email: string
	usuario: Usuario | null,
	domicilio: Domicilio | null,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}