import { SucursalEmpresa } from "./SucursalEmpresa";

export interface Usuario {
    id: String | null,
	auth0Id: String,
	username: String,
    sucursalEmpresa: SucursalEmpresa
}