import { Domicilio } from "./Domicilio"

export interface SucursalEmpresa {
    id: String
	nombre: String,
	horarioApertura: String,
	horarioCIerre: String,
	domicilio: Domicilio
}