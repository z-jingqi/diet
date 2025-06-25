import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/sqlite-core';

// 标签分类表
export const tagCategories = sqliteTable('tag_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 标签表
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  categoryId: text('category_id').notNull().references(() => tagCategories.id),
  restrictions: text('restrictions'), // JSON 数组格式存储限制条件
  aiPrompt: text('ai_prompt').notNull(), // 给AI的专门描述
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 标签互斥关系表
export const tagConflicts = sqliteTable('tag_conflicts', {
  id: text('id').primaryKey(),
  tagId1: text('tag_id_1').notNull().references(() => tags.id),
  tagId2: text('tag_id_2').notNull().references(() => tags.id),
  conflictType: text('conflict_type').notNull(), // 'mutual_exclusive', 'warning', 'info'
  description: text('description'), // 冲突描述
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 创建唯一索引
export const tagConflictsUniquePair = uniqueIndex('tag_conflicts_unique_pair').on(tagConflicts.tagId1, tagConflicts.tagId2); 
