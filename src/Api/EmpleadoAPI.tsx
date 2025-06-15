import axios from "axios"
import { Empleado } from "../interfaces/Empleado"

export const getEmpleados = async () => {
    return axios.get(`http://localhost:8080/api/empleado`)
}

export const getByIdEmpleado = async (id: string) => {
    return axios.get(`http://localhost:8080/api/empleado/${id}`)
}

export const createEmpleado = async (empleado: Empleado) => {
    return axios.post(`http://localhost:8080/api/empleado/create`, empleado)
}

export const deleteEmpleado = async (id: string) => {
    return axios.delete(`http://localhost:8080/api/empleado/${id}`)
}