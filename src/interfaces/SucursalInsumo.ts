import { SucursalEmpresa } from "./SucursalEmpresa";

export interface SucursalInsumo {
    id: String,
	stockActual: Number, 
	stockMinimo: Number, 
	stockMaximo: Number, 
	sucursalEmpresa: SucursalEmpresa
}