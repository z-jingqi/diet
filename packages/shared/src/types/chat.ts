import { Recipe } from "./recipe";
import { HealthAdviceResponse } from "./health-advice";

/**
 * 消息类型
 */
export type MessageType = "chat" | "recipe" | "health_advice";

/**
 * AI 响应内容
 */
export interface AIResponse {
  intent_type: MessageType;
  content_body:
    | string
    | {
        description: string;
        recipes: Recipe[];
      }
    | HealthAdviceResponse;
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
  /** 菜谱列表（仅当 type 为 recipe 时有效） */
  recipes?: Recipe[];
  /** 健康建议查询结果（仅当 type 为 health_advice 时有效） */
  healthAdvice?: HealthAdviceResponse;
}

/**
 * 聊天状态
 */
export interface ChatState {
  /** 消息列表 */
  messages: Message[];
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
}
