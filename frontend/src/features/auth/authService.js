import axios from "axios";

const REGISTER_URL = '/api/user'
const LOGIN_URL = '/api/user/login'
const USER_INFO = '/api/user/info'

const register = async(userData) => {
    const response = await axios.post(REGISTER_URL, userData)
    if(response.data){
        const token = response.data.token
        localStorage.setItem('user', JSON.stringify({token}))
    }
    return {token:response?.data?.token} 
}


const login = async(userData) => {
    const response = await axios.post(LOGIN_URL, userData)
    if(response.data){
        const token = response.data.token
        localStorage.setItem('user', JSON.stringify({token}))
    }
    return {token:response?.data?.token}  
}

const logout = () => {
    localStorage.removeItem("user")
}

export const userInfo = async({token}) => {
    const response = await axios.post(USER_INFO, {token})
    return response.data
}

const authService = {
    register,
    login,
    logout,
    userInfo
}
export default authService