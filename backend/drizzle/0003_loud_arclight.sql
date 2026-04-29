ALTER TABLE "conversation" RENAME COLUMN "latest_read_message_created_at" TO "user1_last_read_at";--> statement-breakpoint
ALTER TABLE "conversation" ADD COLUMN "user2_last_read_at" timestamp;

update conversation c
set user2_last_read_at=user1_last_read_at