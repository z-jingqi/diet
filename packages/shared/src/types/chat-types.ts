import { HealthAdvice, Recipe, Tag } from "../schemas";

/**
 * 消息类型
 */
export type MessageType = "chat" | "recipe" | "health_advice";

/**
 * 消息状态
 */
export type MessageStatus =
  | "pending"
  | "streaming"
  | "done"
  | "error"
  | "abort";

/**
 * 菜谱详细信息
 */
export interface RecipeDetail {
  name: string;
  servings?: string;
  tools?: string;
  cost?: string;
  difficulty?: string;
  features?: string;
}

/**
 * 聊天消息
 */
export interface Message {
  /** 消息唯一标识 */
  id: string;
  /** 消息内容 */
  content: string;
  /** 消息类型：普通对话、菜谱或健康建议 */
  type: MessageType;
  /** 是否为用户发送的消息 */
  isUser: boolean;
  /** 消息创建时间 */
  createdAt: Date;
  /** 消息完成时间 */
  finishedAt?: Date;
  /** 菜谱列表（仅当 type 为 recipe 时有效） */
  recipes?: Recipe[];
  /** 健康建议查询结果（仅当 type 为 health_advice 时有效） */
  healthAdvice?: HealthAdvice;
  /** 菜谱名称列表（用于菜谱推荐消息） */
  recipeNames?: string[];
  /** 菜谱详细信息列表（用于菜谱推荐消息） */
  recipeDetails?: RecipeDetail[];
  /** 消息状态 */
  status?: MessageStatus;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  currentTags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}
