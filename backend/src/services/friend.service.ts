import { ilike, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import type { SearchFriend } from "../types/friends.types.js";
import { ApiError } from "../utils/ApiError.js";

export const searchFriendService = async (data: SearchFriend, page = 1, limit = 10) => {
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
        data: allResult.map(({count, ...res})=> res),
        pagination: {
            total,
            limit,
            page,
            totalPages: Math.ceil(total! /limit),
            hasNext: page < Math.ceil(total! /limit),
            hasPrev: page > 1,
        }
    }
}