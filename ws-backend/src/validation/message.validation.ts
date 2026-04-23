import z from "zod"

export interface SendMessageEvent {
  to: string
  message: string
}

export const createMessageSchema = z.object({
  content: z.string().min(1).max(255),
  receiverId: z.number(),
  status: z.enum(["sent", "delivered", "read"]).default("delivered")
})
export type CreateNewMessage = z.infer<typeof createMessageSchema>

export const readMessageSchema = z.object({
  friendId: z.number(),
  activeConversationId: z.number(),
  messageId: z.number()
})
export type ReadMessage = z.infer<typeof readMessageSchema>