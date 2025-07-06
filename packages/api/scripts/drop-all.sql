-- One-time reset script: remove all data tables and migration history
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS tag_conflicts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS tag_categories;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS oauth_accounts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS csrf_tokens;

-- Drop migration tracker so baseline can be re-applied
DROP TABLE IF EXISTS __drizzle_migrations;

PRAGMA foreign_keys = ON; 