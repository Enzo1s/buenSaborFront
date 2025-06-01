import { Pais } from "./Pais";

export interface Provincia {
    id: String | null,
    nombre: String,
    pais: Pais,
    alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}