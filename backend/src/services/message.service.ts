import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { conversation, friendship, message } from "../db/schema.js";
import type { CreateNewMessage } from "../types/message.types.js";
import { ApiError } from "../utils/ApiError.js";

export const createNewMessageService = async (messageData: CreateNewMessage, senderId: number) => {
    const user1 = Math.min(senderId, messageData.receiverId)
    const user2 = Math.max(senderId, messageData.receiverId)

    const [isFriendship] = await db
        .select()
        .from(friendship)
        .where(and(
            eq(friendship.user_id, user1),
            eq(friendship.friend_id, user2),
            eq(friendship.status, "accepted")
        ))
    if (!isFriendship) {
        throw new ApiError(404, "Friendship not found")
    }

    await db
        .insert(conversation)
        .values({
            user1_id: user1,
            user2_id: user2
        })
        .onConflictDoNothing()

    const [isConversationExist] = await db
        .select({
            id: conversation.id
        })
        .from(conversation)
        .where(and(
            eq(conversation.user1_id, user1),
            eq(conversation.user2_id, user2)
        ))

    if (!isConversationExist) {
        throw new ApiError(500, "Conversation not exist")
    }


    const [isMessageCreated] = await db
        .insert(message)
        .values({
            conversation_id: isConversationExist.id,
            sender_id: senderId,
            content: messageData.content,
        })
        .returning({
            id: message.id,
            content: message.content,
            type: message.type,
            status: message.status,
            senderId: message.sender_id,
            createdAt: message.created_at
        })
    if (!isMessageCreated) {
        throw new ApiError(500, "Message not created")
    }

    return isMessageCreated
}