import z from "zod";
import { messageTypeDrizzler } from "../db/schema.js";

export const createNewMessageSchema = z.object({
    content: z.string().min(1).max(255),
    type: z.enum(messageTypeDrizzler.enumValues).default("text"),
    receiverId: z.number()
})
export type CreateNewMessage = z.infer<typeof createNewMessageSchema>