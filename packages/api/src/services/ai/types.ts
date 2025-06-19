import { HealthAdvice, RecipeRecommendation } from "@shared/schemas";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export type ResponseFormat = "json" | "stream";

export type AIProvider = "openai" | "anthropic" | "qwen" | "cloudflare";

export interface AIConfig {
  type: AIProvider;
  apiKey?: string; // Optional for Cloudflare
  accountId?: string; // For Cloudflare AI
  model?: string; // Model name/ID for the AI service
  baseUrl?: string;
  defaultResponseFormat?: ResponseFormat;
}

// 添加默认模型配置
export const DEFAULT_MODELS = {
  cloudflare: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
  qwen: "qwen-turbo",
} as const;

export type RecipeResponse = RecipeRecommendation;
export type HealthAdviceResponse = HealthAdvice;
