// Auth related types
import { users, user_sessions, chat_sessions } from "../db/schema";
import type { InferSelectModel } from "drizzle-orm";
import type { DB } from "../db";
import type { AuthService } from "../services/auth-service";
import type { ChatService } from "../services/chat-service";
import type { TagService } from "../services/tag-service";

// 使用 schema 定义作为单一来源
export type UserModel = InferSelectModel<typeof users>;

// 定义从 UserModel 到 User 的映射类型
export type User = {
  id: string;
  username: string;
  email: string | null;
  nickname: string | null;
  avatarUrl: string | null; // 对应 avatar_url
  phone: string | null;
  isActive: boolean; // 对应 is_active
  isVerified: boolean; // 对应 is_verified
  lastLoginAt: string | null; // 对应 last_login_at
  createdAt: string | null; // 对应 created_at
  updatedAt: string | null; // 对应 updated_at
};

// 使用 schema 定义作为单一来源
export type UserSessionModel = InferSelectModel<typeof user_sessions>;

// 定义从 UserSessionModel 到 UserSession 的映射类型
export type UserSession = {
  id: string;
  userId: string; // 对应 user_id
  sessionToken: string; // 对应 session_token
  refreshToken: string; // 对应 refresh_token
  sessionExpiresAt: string; // 对应 session_expires_at
  refreshExpiresAt: string; // 对应 refresh_expires_at
  ipAddress: string | null; // 对应 ip_address
  userAgent: string | null; // 对应 user_agent
  createdAt: string | null; // 对应 created_at
  updatedAt: string | null; // 对应 updated_at
};

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
  csrfToken?: string;
}

export interface AuthContext {
  user: User;
  session: UserSession;
}

export interface RefreshTokenResponse {
  sessionToken: string;
  sessionExpiresAt: string;
  csrfToken?: string;
}

// GraphQL 上下文类型
export interface GraphQLContext {
  db: DB;
  user: AuthContext | null;
  responseCookies: string[];
  headers: Headers;
  services: {
    auth: AuthService;
    chat: ChatService;
    tag: TagService;
  };
}

// Chat related types
export type ChatSessionModel = InferSelectModel<typeof chat_sessions>;

// 定义从 ChatSessionModel 到 ChatSession 的映射类型（如果需要）
export interface ChatSession {
  id: string;
  userId: string; // 对应 user_id
  title: string;
  messages: string;
  tagIds: string[] | null; // 对应 tag_ids，解析后的数组
  createdAt: string | null; // 对应 created_at
  updatedAt: string | null; // 对应 updated_at
  deletedAt: string | null; // 对应 deleted_at
}

export interface CreateChatSessionRequest {
  userId: string;
  title: string;
  messages: string;
  tagIds?: string[] | null;
}

export interface UpdateChatSessionRequest {
  title?: string;
  messages?: string;
  tagIds?: string[] | null;
} 
