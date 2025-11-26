import axios from "axios"
import { Promocion } from "../interfaces/Promocion"

export const getPromociones = async () => {
    return axios.get("http://localhost:8080/api/promocion")
}

export const getPromocionesActivas = async () => {
    return axios.get("http://localhost:8080/api/promocion/activas")
}

export const getPromocionById = async (id: string) => {
    return axios.get(`http://localhost:8080/api/promocion/${id}`)
}

export const createPromocion = async (promocion: Promocion) => {
    return axios.post("http://localhost:8080/api/promocion/create", promocion)
}

export const deletePromocion = async(id: string) => {
    return axios.delete(`http://localhost:8080/api/promocion/delete${id}`)
}


