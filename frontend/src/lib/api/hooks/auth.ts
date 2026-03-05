import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";
import toast from "react-hot-toast";
import type { SignUpSchema } from "@/schema/auth.schema";
import axios from "axios";

export function useSignup() {
    return useMutation({
        mutationFn: async (input: SignUpSchema) => {
            const response = await api.post("/user", input);
            return response;
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
