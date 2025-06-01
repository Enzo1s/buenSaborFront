import { SucursalEmpresa } from "./SucursalEmpresa";

export interface Empresa {
    id: String | null,
	nombre: String,
	razonSocial: String,
	cuil: Number,
	sucursalEmpresa: SucursalEmpresa[],
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}