import { Rol } from "../enums/Rol";
import { SucursalEmpresa } from "./SucursalEmpresa";

export interface Usuario {
    id: string | null,
	auth0Id: string,
	username: string,
    password: string,
    sucursalEmpresa: SucursalEmpresa | null,
    rol: Rol,
    alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}