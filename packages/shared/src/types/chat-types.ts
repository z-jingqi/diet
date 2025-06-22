import { HealthAdvice, Tag } from "../schemas";

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
  /** 菜谱详情的唯一标识符 */
  id: string;
  /** 菜谱名称 */
  name: string;
  /** 可供食用的人数，例如："2人份" */
  servings?: string;
  /** 需要的厨具，例如："炒锅、铲子" */
  tools?: string;
  /** 成本等级，例如："经济实惠"、"中等"、"高档" */
  cost?: string;
  /** 烹饪难度，例如："简单"、"中等"、"困难" */
  difficulty?: string;
  /** 菜谱特色描述，例如："低脂健康、快手菜" */
  features?: string;
  /** 菜谱生成时间，用于判断是否已生成完整菜谱 */
  generatedAt?: Date;
  /** 生成的完整菜谱的ID，用于导航到菜谱详情页面 */
  recipeId?: string;
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
