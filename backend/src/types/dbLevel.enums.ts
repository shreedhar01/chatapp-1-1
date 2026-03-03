
import { createSelectSchema } from "drizzle-zod";
import {
    friendshipStatusDrizzler,
    messageStatusDrizzler,
    messageTypeDrizzler,
    userStatusDrizzler
} from "../db/schema.js";

export const userStatusEnum = createSelectSchema(userStatusDrizzler)
export const friendshipStatusEnum = createSelectSchema(friendshipStatusDrizzler)
export const messageTypeEnum = createSelectSchema(messageTypeDrizzler)
export const messageStatusEnum = createSelectSchema(messageStatusDrizzler)