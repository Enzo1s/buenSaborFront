import { Domicilio } from "./Domicilio"

export interface SucursalEmpresa {
    id: String | null,
	nombre: string,
	horarioApertura: String,
	horarioCIerre: String,
	domicilio: Domicilio,
	alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}