import { Domicilio } from "./Domicilio"

export interface SucursalEmpresa {
    id: String | null,
	nombre: String,
	horarioApertura: String,
	horarioCIerre: String,
	domicilio: Domicilio
}