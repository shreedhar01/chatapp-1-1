import {
  integer,
  pgTable,
  varchar,
  timestamp,
  index,
  uniqueIndex,
  text,
  check,
  pgEnum
} from "drizzle-orm/pg-core";
import { desc, relations, sql } from "drizzle-orm";




export const userStatusDrizzler = pgEnum("usersStatus", ["active", "offline"])
export const friendshipStatusDrizzler = pgEnum("friendshipStatus", ["block", "pending", "accepted"])
export const messageTypeDrizzler = pgEnum("messageType", ["text", "file", "video", "audio", "image"])
export const messageStatusDrizzler = pgEnum("messageStatus", ["sent", "delivered", "read"])




export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  status: userStatusDrizzler().default("offline"),
  last_seen: timestamp().defaultNow(),
  created_at: timestamp().defaultNow(),
});

export const friendship = pgTable("friendship", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  friend_id: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  sender_id: integer().notNull().references(()=> users.id,{onDelete:"cascade"}),
  status: friendshipStatusDrizzler().default("pending"),
  created_at: timestamp().defaultNow()
}, (table) => [
  uniqueIndex("unique_friendship_idx").on(table.user_id, table.friend_id),
  check("ordered_friendship", sql`${table.user_id} < ${table.friend_id}`)
])

export const conversation = pgTable("conversation", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user1_id: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  user2_id: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp().defaultNow()
}, (table) => [
  uniqueIndex("unique_conversation_idx").on(table.user1_id, table.user2_id),
  check("ordered_users", sql`${table.user1_id} < ${table.user2_id}`)
])

export const message = pgTable("message", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  conversation_id: integer().notNull().references(() => conversation.id, { onDelete: "cascade" }),
  sender_id: integer().notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text().notNull(),
  type: messageTypeDrizzler().default("text"),
  status: messageStatusDrizzler().default("sent"),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
  deleted_at: timestamp()
}, (table) => [
  index("conversation_idx").on(table.conversation_id, desc(table.created_at)),
  index("sender_idx").on(table.sender_id)
])


export const userRelation = relations(users, ({ many }) => ({
  sentFriendRequests: many(friendship, { relationName: "user" }),
  receivedFriendRequests: many(friendship, { relationName: "friend" }),
  conversationsAsUser1: many(conversation, { relationName: "user1" }),
  conversationsAsUser2: many(conversation, { relationName: "user2" }),
  message: many(message, { relationName: "sender" })
}))

export const friendshipRelation = relations(friendship, ({ one }) => ({
  user: one(users, {
    fields: [friendship.user_id],
    references: [users.id],
    relationName: "user"
  }),
  friend: one(users, {
    fields: [friendship.friend_id],
    references: [users.id],
    relationName: "friend"
  }),
}))

export const conversationRelation = relations(conversation, ({ one, many }) => ({
  message: many(message),
  user1: one(users, {
    fields: [conversation.user1_id],
    references: [users.id],
    relationName: "user1"
  }),
  user2: one(users, {
    fields: [conversation.user2_id],
    references: [users.id],
    relationName: "user2"
  })
}))

export const messageRelation = relations(message, ({ one }) => ({
  conversation: one(conversation, {
    fields: [message.conversation_id],
    references: [conversation.id]
  }),
  sender: one(users, {
    fields: [message.sender_id],
    references: [users.id],
    relationName: "sender"
  })
}))



