import { Rol } from "../enums/Rol";
import { SucursalEmpresa } from "./SucursalEmpresa";

export interface Usuario {
    id: String | null,
	auth0Id: String,
	username: String,
    password: String,
    sucursalEmpresa: SucursalEmpresa | null,
    rol: Rol,
    alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}