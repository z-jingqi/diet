-- Chat Sessions Table
-- 存储会话元数据和消息历史（以 JSON 格式）

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS chat_sessions (
  id          TEXT PRIMARY KEY,                -- 会话 id（客户端生成的 nanoid / uuid）
  user_id     TEXT    NOT NULL,                -- 所属用户，关联 users 表
  title       TEXT    NOT NULL,                -- 会话标题
  messages    TEXT    NOT NULL,                -- 整个消息数组（JSON 字符串）
  current_tags TEXT,                           -- 当前标签列表（JSON 字符串）
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at  DATETIME                         -- 软删除时间戳，NULL = 活跃
);

-- 仅查询未删除的会话时使用的索引
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_active
  ON chat_sessions (user_id)
  WHERE deleted_at IS NULL; 