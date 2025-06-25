import { Usuario } from "./Usuario";

export interface Empleado {
    id: string | null,
    nombre: string | null,
    apellido: string | null,
    telefono: string | null,
    email: string | null,
    usuario: Usuario | null,
    perfil: string | null,
    alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}