import z from "zod";

export const activeConversationIdSchema = z.object({
    activeConversationId: z.number()
})
export type ActiveConversationId = z.infer<typeof activeConversationIdSchema>