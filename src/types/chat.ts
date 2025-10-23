import type { Recipe } from "./recipe";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  conversationId?: string;
  role: ChatRole;
  content: string;
  recipeId?: string;
  recipe?: Recipe;
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: Record<string, unknown>;
};

export type ChatHistoryItem = {
  id: string;
  conversationId: string;
  title: string;
  /** 列表展示用的概览文案，通常取该会话最新消息的摘要 */
  preview: string;
  lastMessageAt?: Date;
  pinned?: boolean;
  tags?: string[];
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
};
