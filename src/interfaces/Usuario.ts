import { SucursalEmpresa } from "./SucursalEmpresa";

export interface Usuario {
    id: String,
	auth0Id: String,
	username: String,
    sucursalEmpresa: SucursalEmpresa
}