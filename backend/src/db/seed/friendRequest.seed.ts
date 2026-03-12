import { db } from "../index.js"
import { friendship } from "../schema.js"
import { type FriendshipStatus } from "../../types/dbLevel.enums.js"

type FriendSeed = {
    user_id: number
    friend_id: number
    status: FriendshipStatus
}

const seedFriend: FriendSeed[] = [
    { user_id: 2, friend_id: 1, status: "pending" },
    { user_id: 3, friend_id: 1, status: "pending" },
    { user_id: 4, friend_id: 1, status: "pending" },
    { user_id: 5, friend_id: 1, status: "pending" },
    { user_id: 6, friend_id: 1, status: "pending" },
    { user_id: 7, friend_id: 1, status: "pending" },
    { user_id: 8, friend_id: 1, status: "pending" },
    { user_id: 9, friend_id: 1, status: "pending" },
    { user_id: 10, friend_id: 1, status: "pending" },
    { user_id: 11, friend_id: 1, status: "pending" },
    { user_id: 12, friend_id: 1, status: "pending" },
    { user_id: 23, friend_id: 1, status: "pending" },
    { user_id: 24, friend_id: 1, status: "pending" },
    { user_id: 25, friend_id: 1, status: "pending" },
    { user_id: 26, friend_id: 1, status: "pending" },
    { user_id: 27, friend_id: 1, status: "pending" },
    { user_id: 28, friend_id: 1, status: "pending" },
    { user_id: 29, friend_id: 1, status: "pending" },
    { user_id: 30, friend_id: 1, status: "pending" },
    { user_id: 31, friend_id: 1, status: "pending" },
    { user_id: 32, friend_id: 1, status: "pending" },
    { user_id: 33, friend_id: 1, status: "pending" },
    { user_id: 34, friend_id: 1, status: "pending" },
];

export async function seedFriendTable() {
    console.log("Seeding Friend table ....")

    for (const friend of seedFriend) {
        const userId = Math.min(friend.user_id, friend.friend_id)
        const friendId = Math.max(friend.user_id, friend.friend_id)


        await db
            .insert(friendship)
            .values({
                user_id: userId,
                friend_id: friendId,
                status: friend.status,
                sender_id: friend.user_id
            })
            .onConflictDoNothing()
    }

    console.log(`Seeded ${seedFriend.length} friend`)
}