import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 用户表
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password_hash: text("password_hash"), // 密码哈希，微信登录时可为空
  nickname: text("nickname"),
  avatar_url: text("avatar_url"),
  phone: text("phone"),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  is_verified: integer("is_verified", { mode: "boolean" }).default(false),
  last_login_at: text("last_login_at"), // DATETIME
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 第三方登录表
export const oauth_accounts = sqliteTable("oauth_accounts", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // 'wechat', 'qq', 'github' 等
  provider_user_id: text("provider_user_id").notNull(), // 第三方平台的用户ID
  provider_user_data: text("provider_user_data"), // JSON格式存储第三方用户信息
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  expires_at: text("expires_at"), // DATETIME
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// 用户会话表（支持 refresh token）
export const user_sessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  session_token: text("session_token").notNull().unique(),
  refresh_token: text("refresh_token").notNull().unique(),
  session_expires_at: text("session_expires_at").notNull(), // session token 过期时间（短期）
  refresh_expires_at: text("refresh_expires_at").notNull(), // refresh token 过期时间（长期）
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// CSRF Token 表
export const csrf_tokens = sqliteTable("csrf_tokens", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expires_at: text("expires_at").notNull(), // DATETIME
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
