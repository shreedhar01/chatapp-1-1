import z from "zod";
import { friendshipStatusDrizzler } from "../db/schema.js";

export const searchFriendSchema = z.object({
    name : z.string().nonempty()
})
export type SearchFriend = z.infer<typeof searchFriendSchema>

export const friendRequestSchema = z.object({
    senderId: z.string().nonempty(),
    to: z.string().nonempty()
})
export type FriendRequest = z.infer<typeof friendRequestSchema>

export const responseFriendRequestSchema = z.object({
    id: z.number(),
    status: z.enum(friendshipStatusDrizzler.enumValues).default("pending")
})
export type ResponseFriendRequest = z.infer<typeof responseFriendRequestSchema>