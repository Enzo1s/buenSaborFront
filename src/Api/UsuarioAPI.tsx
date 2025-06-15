import axios from 'axios'
import { Usuario } from '../interfaces/Usuario'

export const getByToken = async (token: string) => {
    return await axios.get(`http://localhost:8080/api/usuario/token?token=${token}`)
}

export const updateUser = async (user: Usuario) => {
    return await axios.put(`http://localhost:8080/api/usuario/update`, user)
}

export const createUser = async (user: Usuario) => {
    return await axios.post(`http://localhost:8080/api/usuario/create`, user)
}

