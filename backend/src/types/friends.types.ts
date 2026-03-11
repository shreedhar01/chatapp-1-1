import z from "zod";

export const searchFriendSchema = z.object({
    name : z.string().nonempty()
})
export type SearchFriend = z.infer<typeof searchFriendSchema>

export const friendRequestSchema = z.object({
    senderId: z.string().nonempty(),
    to: z.string().nonempty()
})
export type FriendRequest = z.infer<typeof friendRequestSchema>