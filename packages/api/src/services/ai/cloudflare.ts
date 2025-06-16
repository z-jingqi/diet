import { AIService, Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from './types';
import axios from 'axios';

interface CloudflareAIResponse {
  result: {
    response: string;
  };
  success: boolean;
}

interface ServiceEnv {
  CLOUDFLARE_WORKERS_AI_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_MODEL?: string;
}

export class CloudflareAIService implements AIService {
  private apiKey: string;
  private accountId: string;
  private baseUrl: string;
  private model: string;
  private defaultFormat: ResponseFormat = 'json';
  private axiosInstance;

  constructor(config?: AIConfig, env?: ServiceEnv) {
    // 优先使用配置中的值，然后是环境变量
    this.apiKey = config?.apiKey || env?.CLOUDFLARE_WORKERS_AI_API_TOKEN || process.env.CLOUDFLARE_WORKERS_AI_API_TOKEN || '';
    this.accountId = config?.accountId || env?.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.model = config?.model || env?.CLOUDFLARE_MODEL || DEFAULT_MODELS.cloudflare;
    
    if (!this.apiKey || !this.accountId) {
      throw new Error('Cloudflare API Token and Account ID are required');
    }

    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run`;
    this.defaultFormat = config?.defaultResponseFormat || 'json';
    
    this.axiosInstance = axios.create({
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      }
    });
  }

  async chat(messages: Message[], format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    
    try {
      const response = await this.axiosInstance.post(
        `${this.baseUrl}/${this.model}`,
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          stream: responseFormat === 'event-stream'
        },
        {
          headers: {
            'Accept': responseFormat === 'event-stream' ? 'text/event-stream' : 'application/json',
          },
          responseType: responseFormat === 'event-stream' ? 'stream' : 'json'
        }
      );

      if (responseFormat === 'event-stream') {
        return response.data as ReadableStream;
      }

      const data = response.data as CloudflareAIResponse;
      return data.result.response;
    } catch (error) {
      console.error('Cloudflare AI chat error:', error);
      throw new Error('Failed to get response from Cloudflare AI');
    }
  }

  async getIntent(prompt: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post(
        `${this.baseUrl}/${this.model}`,
        {
          messages: [
            {
              role: 'system',
              content: 'You are an intent classifier. Your task is to analyze user input and return exactly one of these words: "chat", "recipe", or "food_availability".'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        }
      );

      const data = response.data as CloudflareAIResponse;
      const intent = data.result.response.trim().toLowerCase();
      
      // Ensure the returned intent is valid
      if (!['chat', 'recipe', 'food_availability'].includes(intent)) {
        return 'chat';
      }
      
      return intent;
    } catch (error) {
      console.error('Cloudflare AI intent detection error:', error);
      return 'chat'; // Default to chat on error
    }
  }
} 
