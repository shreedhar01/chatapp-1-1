
import { createSelectSchema } from "drizzle-zod";
import {
    friendshipStatusDrizzler,
    messageStatusDrizzler,
    messageTypeDrizzler,
    userStatusDrizzler
} from "../db/schema.js";
import z from "zod";

export const userStatusEnum = createSelectSchema(userStatusDrizzler)
export const friendshipStatusEnum = createSelectSchema(friendshipStatusDrizzler)
export const messageTypeEnum = createSelectSchema(messageTypeDrizzler)
export const messageStatusEnum = createSelectSchema(messageStatusDrizzler)


export type UserStatus = z.infer<typeof userStatusEnum>
export type FriendshipStatus = z.infer<typeof friendshipStatusEnum>
export type MessageType = z.infer<typeof messageTypeEnum>
export type MessageStatus = z.infer<typeof messageStatusEnum>