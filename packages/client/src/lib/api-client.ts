import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { apiConfig } from '../config/api';

// AI 对话消息类型
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// AI 对话请求
export interface ChatRequest {
  messages: ChatMessage[];
  provider?: 'qwen' | 'openai' | 'claude' | 'baidu';
}

// AI 对话响应
export interface ChatResponse {
  response: ChatMessage;
  error?: string;
}

// 速率限制错误响应
interface RateLimitErrorResponse {
  error: string;
  message: string;
  retryAfter: number;
}

// 速率限制错误
export class RateLimitError extends Error {
  retryAfter: number;

  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors = () => {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (apiConfig.platform === 'cloudflare') {
          config.headers['X-Platform'] = 'cloudflare';
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // 处理速率限制错误
        if (error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers['retry-after'] || '60', 10);
          const data = error.response.data as RateLimitErrorResponse;
          throw new RateLimitError(
            data?.message || 'Rate limit exceeded',
            retryAfter
          );
        }

        // 处理超时错误
        if (error.response?.status === 524 || error.response?.status === 504) {
          console.error('Request timeout error');
        }

        return Promise.reject(error);
      }
    );
  };

  // AI 对话
  chat = async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await this.client.post<ChatResponse>('/api/chat', request);
      return response.data;
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to get AI response');
      }
      throw error;
    }
  };
}

export const apiClient = new ApiClient(); 
