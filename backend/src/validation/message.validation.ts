import z from "zod";
import { messageStatusDrizzler, messageTypeDrizzler } from "../db/schema.js";

export const createNewMessageSchema = z.object({
    content: z.string().min(1).max(255),
    type: z.enum(messageTypeDrizzler.enumValues).default("text"),
    receiverId: z.number(),
    status: z.enum(messageStatusDrizzler.enumValues).default("sent")
})
export type CreateNewMessage = z.infer<typeof createNewMessageSchema>

export const readMessageSchema = z.object({
  friendId: z.number(),
  activeConversationId: z.number(),
  messageId: z.number()
})
export type ReadMessage = z.infer<typeof readMessageSchema>