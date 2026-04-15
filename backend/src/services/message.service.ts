import { and, desc, eq, sql } from "drizzle-orm";
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
            status: messageData.status
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

    await db.update(conversation)
        .set({ recent_message_id: isMessageCreated.id })
        .where(eq(conversation.id, isConversationExist.id))

    return {
        conversationId: isConversationExist.id,
        message:isMessageCreated
    }
}


export const getAllMessagesService = async (page: number, limit: number, friendId: number, userId: number) => {
    const user1 = Math.min(friendId, userId)
    const user2 = Math.max(friendId, userId)

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
        throw new ApiError(404, "Conversation not exist")
    }

    const offset = (page - 1) * limit

    const isMessage = await db
        .select({
            id: message.id,
            // conversationId: message.conversation_id,
            senderId: message.sender_id,
            content: message.content,
            type: message.type,
            status: message.status,
            createdAt: message.created_at,
            count: sql`count(*) over()`
        })
        .from(message)
        .where(eq(message.conversation_id, isConversationExist.id))
        .orderBy(desc(message.created_at))
        .limit(limit)
        .offset(offset)

    if (isMessage.length === 0) {
        throw new ApiError(404, "Message not found")
    }

    const total = Number(isMessage[0]!.count)

    const updateMessage = await Promise.all(
        isMessage.map(async ({ count, ...v }) => {
            if (v.status !== "read" && v.senderId !== userId) {
                await db
                    .update(message)
                    .set({ status: "read" })
                    .where(eq(message.id, v.id))
                return { ...v, status: "read" }
            }
            return v
        })
    )



    return {
        data: updateMessage,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    }
}