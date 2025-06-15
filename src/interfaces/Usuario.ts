import { Rol } from "../enums/Rol";

export interface Usuario {
    id: String | null,
	auth0Id: String,
	username: String,
    password: String,
    rol: Rol,
    alta: Date | null,
	baja: Date | null,
	modificacion: Date | null,
}