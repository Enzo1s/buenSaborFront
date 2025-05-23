import axios from 'axios'
import { Login } from '../interfaces/Login'
import { Usuario } from '../interfaces/Usuario'

export const iniciarSesion = (user: Login) => {
  return axios.post('http://localhost:8080/api/auth/login', user)
}

export const registrarUsuario = (user: Usuario) => {
  return axios.post('http://localhost:8080/api/auth/register', user)
}