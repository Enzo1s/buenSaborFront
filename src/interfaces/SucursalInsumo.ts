import { ArticuloInsumo } from "./ArticuloInsumo";
import { SucursalEmpresa } from "./SucursalEmpresa";

export interface SucursalInsumo {
    id: String | null,
	stockActual: Number, 
	stockMinimo: Number, 
	stockMaximo: Number, 
	sucursalEmpresa: SucursalEmpresa | null,
	articuloInsumo: ArticuloInsumo | null,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}