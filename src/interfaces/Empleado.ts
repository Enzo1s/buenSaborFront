import { Rol } from "../enums/Rol";
import { Usuario } from "./Usuario";

export interface Empleado {
    id: String | null,
    nombre: String,
    apellido: String,
    telefono: String,
    email: String,
    usuario: Usuario,
    perfil: Rol
}