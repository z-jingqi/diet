import { Recipe, HealthAdvice } from "@diet/shared/src/schemas";
import { RecipeResponse, HealthAdviceResponse } from "./base";

export interface Message {
  role: 'user' | 'assistant' | 'system';
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

export type ResponseFormat = 'json' | 'event-stream';

export interface AIService {
  chat: (messages: Message[], intent: string, format?: ResponseFormat) => Promise<string | ReadableStream | RecipeResponse | HealthAdviceResponse>;
  getIntent: (messages: Message[]) => Promise<string>;
}

export type AIProvider = 'openai' | 'anthropic' | 'qwen' | 'baidu' | 'cloudflare';

export interface AIConfig {
  type: AIProvider;
  apiKey?: string;  // Optional for Cloudflare
  apiSecret?: string; // For Baidu AI
  accountId?: string; // For Cloudflare AI
  model?: string;    // Model name/ID for the AI service
  baseUrl?: string;
  defaultResponseFormat?: ResponseFormat;
}

// 添加默认模型配置
export const DEFAULT_MODELS = {
  cloudflare: '@cf/meta/llama-3.1-8b-instruct',
  qwen: 'qwen-turbo',
  baidu: 'ERNIE-Bot-4'
} as const; 
 