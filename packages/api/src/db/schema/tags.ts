import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/sqlite-core";

// 标签分类表
export const tag_categories = sqliteTable("tag_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sort_order: integer("sort_order").default(0),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 标签表
export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category_id: text("category_id")
    .notNull()
    .references(() => tag_categories.id, { onDelete: "cascade" }),
  ai_prompt: text("ai_prompt"), // AI 提示词
  restrictions: text("restrictions"), // JSON 格式存储限制条件
  sort_order: integer("sort_order").default(0),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 标签冲突表
export const tag_conflicts = sqliteTable("tag_conflicts", {
  id: text("id").primaryKey(),
  tag_id_1: text("tag_id_1")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
  tag_id_2: text("tag_id_2")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
  conflict_type: text("conflict_type").notNull(), // 'mutual_exclusive', 'warning', 'info'
  description: text("description"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// 创建唯一索引，确保同一对标签只有一个冲突记录
uniqueIndex("tag_conflicts_unique").on(
  tag_conflicts.tag_id_1,
  tag_conflicts.tag_id_2,
);
