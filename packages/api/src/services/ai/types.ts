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
  chat: (messages: Message[], format?: ResponseFormat) => Promise<string | ReadableStream>;
  getIntent: (prompt: string) => Promise<string>;
}

export type AIProvider = 'openai' | 'anthropic' | 'qwen' | 'baidu';

export interface AIConfig {
  type: AIProvider;
  apiKey: string;
  apiSecret?: string; // For Baidu AI
  model?: string;
  baseUrl?: string;
  defaultResponseFormat?: ResponseFormat;
} 
 