import axios from "axios"
import { Cliente } from "../interfaces/Cliente"

export const getClienteById = async (id: string) => {
    return axios.get(`http://localhost:8080/api/cliente/${id}`)
}

export const getClientes = async () => {
    return axios.get("http://localhost:8080/api/cliente")
}

export const createCliente = async (cliente: Cliente) => {
    return axios.post("http://localhost:8080/api/cliente/create", cliente)
}

export const deleteCliente = async (id: string) => {
    return axios.delete(`http://localhost:8080/api/cliente/${id}`)
}