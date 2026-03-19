import { and, desc, eq, ilike, inArray, ne, notExists, or, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { friendship, users } from "../db/schema.js";
import type { FriendRequest, ResponseFriendRequest, SearchFriend } from "../types/friends.types.js";
import { ApiError } from "../utils/ApiError.js";
import { alias } from "drizzle-orm/pg-core";

export const searchFriendService = async (data: SearchFriend, page = 1, limit = 20, currentUserId: number) => {
    const offset = (page - 1) * limit
    const allResult = await db
        .select({
            id: users.id,
            name: users.name,
            count: sql<number>`count(*) over()`
        })
        .from(users)
        .where(and(
            ilike(users.name, `${data.name}%`),
            notExists(
                db
                    .select({ id: sql`1` })
                    .from(friendship)
                    .where(
                        or(
                            and(
                                eq(friendship.user_id, users.id),
                                eq(friendship.friend_id, currentUserId)
                            ),
                            and(
                                eq(friendship.friend_id, users.id),
                                eq(friendship.user_id, currentUserId)
                            )
                        )
                    )
            )

        )
        )
        .orderBy(users.name)
        .limit(limit)
        .offset(offset)

    if (allResult.length <= 0) {
        throw new ApiError(400, "User not found")
    }
    const total = allResult[0]?.count

    return {
        data: allResult.map(({ count, ...res }) => res),
        pagination: {
            total,
            limit,
            page,
            totalPages: Math.ceil(total! / limit),
            hasNext: page < Math.ceil(total! / limit),
            hasPrev: page > 1,
        }
    }
}


export const friendRequestService = async (data: FriendRequest) => {
    const senderId = Math.min(Number(data.senderId), Number(data.to))
    const to = Math.max(Number(data.senderId), Number(data.to))

    if (isNaN(senderId) || isNaN(to)) {
        throw new ApiError(400, `Invalid IDs — senderId: ${data.senderId}, to: ${data.to}`)
    }

    const [[isUserExist], [isRequestExist]] = await Promise.all([
        db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, senderId))
            .limit(1),

        db
            .select({ id: friendship.id })
            .from(friendship)
            .where(
                and(
                    eq(friendship.user_id, Number(data.senderId)),
                    eq(friendship.friend_id, to)
                )
            )
            .limit(1)
    ])

    if (!isUserExist) {
        throw new ApiError(404, "User not found")
    }

    if (isRequestExist) {
        throw new ApiError(400, "request alredy exist")
    }

    const [friendRequest] = await db.insert(friendship).values({
        user_id: senderId,
        friend_id: to,
        sender_id: Number(data.senderId),
        status: "pending"
    }).returning({
        id: friendship.id,
        friend_id: friendship.friend_id,
        status: friendship.status,
        created_at: friendship.created_at
    })
    if (!friendRequest) {
        throw new ApiError(500, "Unable to send request please try again")
    }

    return {
        id: friendRequest.id,
        to: friendRequest.friend_id,
        status: friendRequest.status,
        createdAt: friendRequest.created_at
    }
}


export const getAllFriendRequestService = async (page: number, limit: number, data: number) => {
    const offset = (page - 1) * limit
    const reqData = await db
        .select({
            id: friendship.id,
            sender: {
                id: users.id,
                name: users.name
            },
            created_at: friendship.created_at,
            count: sql<number>`count(*) over()`
        })
        .from(friendship)
        .leftJoin(users, eq(users.id, friendship.sender_id))
        .where(and(
            or(
                eq(friendship.user_id, data),
                eq(friendship.friend_id, data),
            ),
            eq(friendship.status, "pending"),
            ne(friendship.sender_id, data)
        ))
        .orderBy(desc(friendship.created_at))
        .limit(limit)
        .offset(offset)

    if (reqData.length === 0) {
        throw new ApiError(404, "No request found")
    }

    const total = reqData[0]!.count
    return {
        data: reqData.map(({ count, ...res }) => res),
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


export const responseFriendRequestService = async (data: ResponseFriendRequest) => {
    const [requestResponse] = await db
        .update(friendship)
        .set({ status: data.status })
        .where(eq(friendship.id, data.id))
        .returning({ id: friendship.id })

    if (!requestResponse) {
        throw new ApiError(404, "Request not exist")
    }

    return requestResponse
}


export const getAllFriendService = async (limit: number, page: number, userId: number) => {
    const offset = (page - 1) * limit
    const friends = await db
        .select({
            id: friendship.id,
            friend: {
                id: users.id,
                name: users.name,
                email: users.email,
                status: users.status,
                lastSeen: users.last_seen,
            },
            count: sql<number>`count(*) over()`
        })
        .from(friendship)
        .leftJoin(users, sql<number>`
            ${users.id} = case 
            when ${friendship.user_id} = ${userId} then ${friendship.friend_id}
            else ${friendship.user_id}
            end`)
        .where(and(
            or(
                eq(friendship.user_id, userId),
                eq(friendship.friend_id, userId)
            ),
            eq(friendship.status, "accepted")
        ))
        .orderBy(users.status, desc(friendship.created_at))
        .limit(limit)
        .offset(offset)

    if (friends.length === 0) {
        throw new ApiError(404, "Friends not found")
    }

    const total = Number(friends[0]!.count)

    return {
        data: friends.map(({ count, ...data }) => data),
        pagination: {
            total,
            page,
            totalPage: Math.ceil(total / limit),
            hasNext: Math.ceil(total / limit) > page,
            hasPrev: page < 1
        }
    }
}

export const getAllActiveFriendsService = async (userId: number) => {
    const u2 = alias(users, "u2")
    const allFriends = await db
        .select({id:u2.id})
        .from(users)
        .innerJoin(friendship, or(
            eq(friendship.user_id, users.id),
            eq(friendship.friend_id, users.id)
        ))
        .innerJoin(u2, sql<number>`
            ${u2.id} = case 
            when ${friendship.user_id} = ${userId} then ${friendship.friend_id}
            else ${friendship.user_id}
            end`)
        .where(and(
            eq(users.id, userId),
            eq(u2.status, "active")
        ))

    if(allFriends.length === 0){
        throw new ApiError(404,"No active friends found")
    }

    return [...allFriends.map(v => v.id)]
}