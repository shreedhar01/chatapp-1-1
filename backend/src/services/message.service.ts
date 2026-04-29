import { and, desc, eq, gt, lte, ne, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { conversation, friendship, message } from "../db/schema.js";
import type { CreateNewMessage, ReadMessage } from "../validation/message.validation.js";
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
        message: isMessageCreated
    }
}


export const getAllMessagesService = async (page: number, limit: number, friendId: number, userId: number) => {
    const user1 = Math.min(friendId, userId)
    const user2 = Math.max(friendId, userId)
    const isUserId = userId === user1

    const [isConversationExist] = await db
        .select({
            id: conversation.id,
            user1lastReadAt: conversation.user1_last_read_at,
            user2lastReadAt: conversation.user2_last_read_at,
        })
        .from(conversation)
        .where(and(
            eq(conversation.user1_id, user1),
            eq(conversation.user2_id, user2)
        ))
    if (!isConversationExist) {
        throw new ApiError(404, "Conversation not exist")
    }

    const myRecentRead = isUserId ? isConversationExist.user1lastReadAt : isConversationExist.user2lastReadAt

    await db
        .update(message)
        .set({ status: "read" })
        .where(and(
            eq(message.conversation_id, isConversationExist.id),
            gt(message.created_at, myRecentRead ?? new Date(0)),
            lte(message.created_at, new Date()),
            ne(message.sender_id, userId)
        ))

    await db
        .update(conversation)
        .set(isUserId
            ? { user1_last_read_at: new Date() }
            : { user2_last_read_at: new Date() }
        )
        .where(eq(conversation.id, isConversationExist.id))

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
        return {
            data: [],
            pagination: { total: 0, page, limit, totalPages: 0, hasNext: false, hasPrev: false }
        }
    }

    const total = Number(isMessage[0]!.count)

    return {
        data: isMessage.map(({ count, ...v }) => v),
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


export const updateMessageStatusService = async (data: ReadMessage, userId: number) => {
    const user1 = Math.min(data.friendId, userId)
    const user2 = Math.max(data.friendId, userId)
    const isUserId = user1 === userId

    const [isConversation] = await db
        .select({
            recentMessageId: conversation.recent_message_id,
            user1lastReadAt: conversation.user1_last_read_at,
            user2lastReadAt: conversation.user2_last_read_at,
            recetnMessageCreatedAt: message.created_at
        })
        .from(conversation)
        .leftJoin(message, eq(message.id, conversation.recent_message_id))
        .where(
            eq(conversation.id, data.activeConversationId)
        )
        .limit(1)
    if (!isConversation) {
        throw new ApiError(400, "No conversation exist with this id")
    }

    const myRecentRead = isUserId ? isConversation.user1lastReadAt : isConversation.user2lastReadAt

    const updatedData = await db.
        update(message).
        set({ status: "read" }).
        where(
            and(
                eq(message.conversation_id, data.activeConversationId),
                eq(message.sender_id, data.friendId),
                gt(message.created_at, myRecentRead ?? new Date()),
                lte(message.created_at, isConversation?.recetnMessageCreatedAt ?? new Date())
            )
        )
        .returning({
            id: message.id,
            content: message.content,
            type: message.type,
            status: message.status,
            senderId: message.sender_id,
            createdAt: message.created_at
        })
    if (updatedData.length === 0) {
        throw new ApiError(500, "Status not updated")
    }

    await db
        .update(conversation)
        .set(isUserId
            ? { user1_last_read_at: new Date() }
            : { user2_last_read_at: new Date() }
        )
        .where(eq(conversation.id, data.activeConversationId))

    return updatedData
}