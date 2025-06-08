import axios from 'axios'

export const getByToken = async (token: string) => {
    return await axios.get(`http://localhost:8080/api/usuario/token?token=${token}`)
}

