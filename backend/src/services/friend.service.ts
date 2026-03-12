import { and, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { friendship, users } from "../db/schema.js";
import type { FriendRequest, SearchFriend } from "../types/friends.types.js";
import { ApiError } from "../utils/ApiError.js";

export const searchFriendService = async (data: SearchFriend, page = 1, limit = 20) => {
    const offset = (page - 1) * limit
    const allResult = await db
        .select({
            id: users.id,
            name: users.name,
            count: sql<number>`count(*) over()`
        })
        .from(users)
        .where(ilike(users.name, `${data.name}%`))
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
    const senderId = Number(data.senderId)
    const to = Number(data.to)

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
        user_id: Number(data.senderId),
        friend_id: Number(data.to),
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