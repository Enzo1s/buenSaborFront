import axios from 'axios'

export const getByToken = async (token: string) => {
    return await axios.get(`/api/usuairo/token?token=${token}`)
}

