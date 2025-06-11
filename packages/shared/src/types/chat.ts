import { Recipe } from './recipe';

/**
 * 消息类型
 */
export type MessageType = 'chat' | 'recipe' | 'food_availability';

/**
 * 食物可食性结论
 */
export type FoodAvailability = '可吃' | '不可吃' | '适量';

/**
 * 建议类型
 */
export type SuggestionType = '替代食物' | '食用建议' | '注意事项';

/**
 * 注意事项类型
 */
export type PrecautionType = '食用量' | '烹饪方式' | '搭配禁忌' | '其他';

/**
 * 食物可食性查询结果
 */
export interface FoodAvailabilityResult {
  availability: FoodAvailability;
  reason: string;
  suggestions?: {
    type: SuggestionType;
    content: string;
  }[];
}

/**
 * 食材分析
 */
export interface IngredientAnalysis {
  name: string;
  availability: FoodAvailability;
  reason: string;
  suggestions?: {
    type: SuggestionType;
    content: string;
  }[];
}

/**
 * 营养成分分析
 */
export interface NutritionAnalysis {
  key_nutrients: {
    name: string;
    amount: string;
    impact: string;
  }[];
  daily_value_percentage?: {
    protein: number;
    potassium: number;
    phosphorus: number;
    sodium: number;
  };
}

/**
 * 食物可食性查询响应
 */
export interface FoodAvailabilityResponse {
  type: 'single_food' | 'recipe';
  query: string;
  result: FoodAvailabilityResult;
  ingredients?: IngredientAnalysis[];
  nutrition_analysis: NutritionAnalysis;
  precautions?: {
    type: PrecautionType;
    content: string;
  }[];
}

/**
 * AI 响应内容
 */
export interface AIResponse {
  intent_type: 'chat' | 'recipe' | 'food_availability';
  content_body: string | {
    description: string;
    recipes: Recipe[];
  } | FoodAvailabilityResponse;
}

/**
 * 聊天消息
 */
export interface Message {
  /** 消息唯一标识 */
  id: string;
  /** 消息内容 */
  content: string;
  /** 消息类型：普通对话、菜谱或食物可食性查询 */
  type: MessageType;
  /** 是否为用户发送的消息 */
  isUser: boolean;
  /** 消息创建时间 */
  createdAt: Date;
  /** 菜谱列表（仅当 type 为 recipe 时有效） */
  recipes?: Recipe[];
  /** 食物可食性查询结果（仅当 type 为 food_availability 时有效） */
  foodAvailability?: FoodAvailabilityResponse;
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
