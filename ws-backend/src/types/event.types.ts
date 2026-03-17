import z from "zod"

export interface AddFriendEvent{
    to: string
}

export interface SendMessageEvent {
  to: string
  message: string
}


export const responseFriendRequestSchema = z.object({
    id: z.number(),
    status: z.enum(["block", "pending", "accepted"]),
    sender: z.object({
      id: z.number(),
      name: z.string().nonempty()
    })
})
export type ResponseFriendRequest = z.infer<typeof responseFriendRequestSchema>