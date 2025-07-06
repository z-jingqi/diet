import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 聊天会话表
export const chat_sessions = sqliteTable("chat_sessions", {
  id: text("id").primaryKey(), // 会话 id（客户端生成的 nanoid / uuid）
  user_id: text("user_id").notNull(), // 所属用户，关联 users 表
  title: text("title").notNull(), // 会话标题
  messages: text("messages").notNull(), // 整个消息数组（JSON 字符串）
  tag_ids: text("tag_ids"), // 关联标签 ID 列表（JSON 字符串）
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deleted_at: text("deleted_at"), // 软删除时间戳，NULL = 活跃
});
