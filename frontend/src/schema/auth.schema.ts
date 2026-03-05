import z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
})
export type SignUpSchema = z.infer<typeof signUpSchema>


export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})
export type LogInSchema = z.infer<typeof loginSchema>