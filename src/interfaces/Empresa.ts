import { SucursalEmpresa } from "./SucursalEmpresa";

export interface Empresa {
    id: String,
	nombre: String,
	razonSocial: String,
	cuil: Number,
	sucursalEmpresa: [SucursalEmpresa]
}