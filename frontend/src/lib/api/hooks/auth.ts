import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import toast from "react-hot-toast";
import type { LogInSchema, SignUpSchema } from "@/schema/auth.schema";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthContext.provider";

export function useSignup() {
    return useMutation({
        mutationKey: ["signup"],
        mutationFn: async (input: SignUpSchema) => {
            const response = await api.post("/user", input);
            return response.data;
        },
        onSuccess: () => {
            toast.success("User Register Successfully");
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Something went wrong"
                toast.error(message)
            } else {
                toast.error("Unexpected error occurred")
            }
        },
    });
}


export function useLogIn() {
    const navigate = useNavigate()
    const { login } = useAuth()

    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (input: LogInSchema) => {
            const response = await api.post("/user/login", input);
            return response.data;
        },
        onSuccess: async(data) => {
            await login(data)
            navigate("/dashboard")
            toast.success("User Login Successfully");
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Something went wrong"
                toast.error(message)
            } else {
                toast.error("Unexpected error occurred")
            }
        },
    });
}

export function useLogOut() {
    const navigate = useNavigate()
    const { logout } = useAuth()


    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            const response = await api.post("/user/logout");
            return response.data;
        },
        onSuccess: async() => {
            await logout()
            navigate("/")
            toast.success("User LogOut Successfully");
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message ?? "Something went wrong"
                toast.error(message)
            } else {
                toast.error("Unexpected error occurred")
            }
        },
    });
}
