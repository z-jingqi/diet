import type { Recipe } from "./recipe";
import type { UIMessage } from "ai";

export type ChatRole = "system" | "user" | "assistant";

export type ChatMessageMetadata = {
  intent?: "generate_recipe" | "follow_up" | "unknown";
  hasRecipe?: boolean;
  modelName?: string;
  responseTimeMs?: number;
  [key: string]: unknown;
};

// This type now aligns with Vercel AI SDK's UIMessage structure
export type ChatMessage = UIMessage<ChatMessageMetadata> & {
  conversationId?: string;
  recipeId?: string;
  recipe?: Recipe;
  createdAt?: Date;
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
