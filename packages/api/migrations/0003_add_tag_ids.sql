-- Add tag_ids column to chat_sessions and migrate existing data
ALTER TABLE chat_sessions ADD COLUMN tag_ids text;

-- Copy existing values from current_tags (if column exists) into tag_ids
UPDATE chat_sessions SET tag_ids = current_tags WHERE tag_ids IS NULL AND current_tags IS NOT NULL; 