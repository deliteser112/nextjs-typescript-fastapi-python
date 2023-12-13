// axiosInstance.ts
import axios from 'axios';

const baseURL: string = 'http://127.0.0.1:8000';

const axiosInstance = axios.create({ baseURL });

export function setAPIToken(token: string) {
    if (token) {
        // Add default headers, including the Authorization header with the token
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // If no token is provided (e.g., during logout), remove the Authorization header
        delete axios.defaults.headers.common['Authorization'];
    }
}


export default axiosInstance;