import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    withCredentials: true
})

api.interceptors.response.use(
    (response) => {
        console.log("Success response:", response)
        return response
    },
    (error) => {
        const status = error.response?.status
        if (status === 401 && error.response?.data?.code === "INVALID_SESSION") {
            window.location.href = '/'
        }
        console.log("Error response:", error.response)
        return Promise.reject(error)
    }
)