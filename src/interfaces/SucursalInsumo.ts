import { SucursalEmpresa } from "./SucursalEmpresa";

export interface SucursalInsumo {
    id: String | null,
	stockActual: Number, 
	stockMinimo: Number, 
	stockMaximo: Number, 
	sucursalEmpresa: SucursalEmpresa
}