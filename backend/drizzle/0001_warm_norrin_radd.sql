ALTER TABLE "conversation" ADD COLUMN "recent_message_id" integer;

UPDATE conversation c
SET recent_message_id = m.id
FROM (
    SELECT DISTINCT ON (conversation_id)
        id,
        conversation_id
    FROM message
    ORDER BY conversation_id, created_at DESC
) m
WHERE c.id = m.conversation_id;