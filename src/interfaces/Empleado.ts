import { Usuario } from "./Usuario";

export interface Empleado {
    id: string | null,
    nombre: String | null,
    apellido: String | null,
    telefono: String | null,
    email: String | null,
    usuario: Usuario | null,
    perfil: String | null,
    alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}