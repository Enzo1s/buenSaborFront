import axios from "axios"
import { Empresa } from "../interfaces/Empresa"

export const crearEmpresa = async (empresa: Empresa) => {
    return await axios.post("http://localhost:8080/api/empresa/create", empresa)
}

export const getEmpresas = async () => {
    return await axios.get("http://localhost:8080/api/empresa")
}

export const getByIdEmpresa = async (id: string) => {
    return await axios.get(`http://localhost:8080/api/empresa/${id}`)
}

export const deleteEmpresa = async (id: String) => {
    return axios.delete(`http://localhost:8080/api/empresa/${id}`)
}