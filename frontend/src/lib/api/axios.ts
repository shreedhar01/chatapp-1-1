import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
    baseURL:BASE_URL,
    timeout:1000
})

api.interceptors.response.use(
    (response) => {
        console.log("Success response:", response)
        return response
    },
    (error) => {
        console.log("Error response:", error.response)
        return Promise.reject(error)
    }
)