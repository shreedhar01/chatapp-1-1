import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import toast from "react-hot-toast";
import type { LogInSchema, SignUpSchema } from "@/schema/auth.schema";
import axios from "axios";
import { useAuth } from "@/providers/AuthContext.provider";

export function useSignup() {
    const { login } = useAuth()

    return useMutation({
        mutationFn: async (input: SignUpSchema) => {
            const response = await api.post("/user", input);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("User Register Successfully");
            login({ name: data?.name, email: data?.email })
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
    const { login } = useAuth()

    return useMutation({
        mutationFn: async (input: LogInSchema) => {
            const response = await api.post("/user/login", input);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("User Login Successfully");
            login({ name: data?.name, email: data?.email })
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
