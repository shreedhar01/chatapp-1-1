import { db } from "../index.js"
import { message } from "../schema.js"

const messages = [
    {
        "sender_id": 1,
        "content": "hey",
        "created_at": "2026-03-25 04:22:29"
    },
    {
        "sender_id": 2,
        "content": "hey! what's up?",
        "created_at": "2026-03-25 04:22:40"
    },
    {
        "sender_id": 1,
        "content": "just working on a project",
        "created_at": "2026-03-25 04:22:55"
    },
    {
        "sender_id": 2,
        "content": "nice, what kind of project?",
        "created_at": "2026-03-25 04:23:10"
    },
    {
        "sender_id": 1,
        "content": "a chat application backend",
        "created_at": "2026-03-25 04:23:25"
    },
    {
        "sender_id": 2,
        "content": "oh cool",
        "created_at": "2026-03-25 04:23:40"
    },
    {
        "sender_id": 1,
        "content": "yeah trying to seed messages properly",
        "created_at": "2026-03-25 04:23:55"
    },
    {
        "sender_id": 2,
        "content": "that can be tricky",
        "created_at": "2026-03-25 04:24:10"
    },
    {
        "sender_id": 1,
        "content": "exactly, want it to look realistic",
        "created_at": "2026-03-25 04:24:25"
    },
    {
        "sender_id": 2,
        "content": "just simulate real conversation flow",
        "created_at": "2026-03-25 04:24:40"
    },
    {
        "sender_id": 1,
        "content": "yeah alternating users",
        "created_at": "2026-03-25 04:24:55"
    },
    {
        "sender_id": 2,
        "content": "and natural timing gaps",
        "created_at": "2026-03-25 04:25:10"
    },
    {
        "sender_id": 1,
        "content": "doing that now",
        "created_at": "2026-03-25 04:25:25"
    },
    {
        "sender_id": 2,
        "content": "great",
        "created_at": "2026-03-25 04:25:40"
    },
    {
        "sender_id": 1,
        "content": "after this UI work",
        "created_at": "2026-03-25 04:25:55"
    },
    {
        "sender_id": 2,
        "content": "react?",
        "created_at": "2026-03-25 04:26:10"
    },
    {
        "sender_id": 1,
        "content": "yep with tailwind",
        "created_at": "2026-03-25 04:26:25"
    },
    {
        "sender_id": 2,
        "content": "nice stack",
        "created_at": "2026-03-25 04:26:40"
    },

    {
        "sender_id": 1,
        "content": "btw did you fix your bug?",
        "created_at": "2026-03-25 04:26:55"
    },
    {
        "sender_id": 2,
        "content": "not yet",
        "created_at": "2026-03-25 04:27:10"
    },
    {
        "sender_id": 1,
        "content": "what's the issue?",
        "created_at": "2026-03-25 04:27:25"
    },
    {
        "sender_id": 2,
        "content": "query returning empty results",
        "created_at": "2026-03-25 04:27:40"
    },
    {
        "sender_id": 1,
        "content": "check your where clause",
        "created_at": "2026-03-25 04:27:55"
    },
    {
        "sender_id": 2,
        "content": "i did, still nothing",
        "created_at": "2026-03-25 04:28:10"
    },
    {
        "sender_id": 1,
        "content": "maybe wrong column?",
        "created_at": "2026-03-25 04:28:25"
    },
    {
        "sender_id": 2,
        "content": "oh wait… yeah",
        "created_at": "2026-03-25 04:28:40"
    },
    {
        "sender_id": 1,
        "content": "lol classic",
        "created_at": "2026-03-25 04:28:55"
    },
    {
        "sender_id": 2,
        "content": "fixed now",
        "created_at": "2026-03-25 04:29:10"
    },

    {
        "sender_id": 1,
        "content": "nice!",
        "created_at": "2026-03-25 04:29:25"
    },
    {
        "sender_id": 2,
        "content": "thanks for the hint",
        "created_at": "2026-03-25 04:29:40"
    },
    {
        "sender_id": 1,
        "content": "anytime",
        "created_at": "2026-03-25 04:29:55"
    }
]

export async function seedMessageTable() {
    console.log("Seeding message table")

    for (const mes of messages) {
        await db
            .insert(message)
            .values({
                conversation_id: 3,
                sender_id: mes.sender_id,
                content: mes.content,
                created_at: new Date(mes.created_at),
                type: "text",
                status: "read"
            })
            .onConflictDoNothing()
    }
}