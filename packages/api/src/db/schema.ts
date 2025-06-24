import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { uniqueIndex } from 'drizzle-orm/sqlite-core';

// 用户表
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  passwordHash: text('password_hash'), // 密码哈希，微信登录时可为空
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  phone: text('phone'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  lastLoginAt: text('last_login_at'), // DATETIME
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 第三方登录表
export const oauthAccounts = sqliteTable('oauth_accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'wechat', 'qq', 'github' 等
  providerUserId: text('provider_user_id').notNull(), // 第三方平台的用户ID
  providerUserData: text('provider_user_data'), // JSON格式存储第三方用户信息
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: text('expires_at'), // DATETIME
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 用户会话表（支持 refresh token）
export const userSessions = sqliteTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: text('session_token').notNull().unique(),
  refreshToken: text('refresh_token').notNull().unique(),
  sessionExpiresAt: text('session_expires_at').notNull(), // session token 过期时间（短期）
  refreshExpiresAt: text('refresh_expires_at').notNull(), // refresh token 过期时间（长期）
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// CSRF Token 表
export const csrfTokens = sqliteTable('csrf_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(), // DATETIME
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

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

// 聊天会话表
export const chatSessions = sqliteTable('chat_sessions', {
  id: text('id').primaryKey(), // 会话 id（客户端生成的 nanoid / uuid）
  userId: text('user_id').notNull().references(() => users.id), // 所属用户，关联 users 表
  title: text('title').notNull(), // 会话标题
  messages: text('messages').notNull(), // 整个消息数组（JSON 字符串）
  currentTags: text('current_tags'), // 当前标签列表（JSON 字符串）
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'), // 软删除时间戳，NULL = 活跃
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