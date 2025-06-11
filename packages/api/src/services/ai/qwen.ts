import { AIService, Message, AIConfig, ResponseFormat } from './types';
import axios from 'axios';

interface QwenChatResponse {
  output: {
    text: string;
  };
}

export class QwenService implements AIService {
  private apiKey: string;
  private baseUrl = 'https://dashscope.aliyuncs.com/api/v1';
  private defaultFormat: ResponseFormat = 'json';
  private axiosInstance;

  constructor(config?: AIConfig) {
    this.apiKey = config?.apiKey || process.env.QWEN_API_KEY || '';
    this.defaultFormat = config?.defaultResponseFormat || (process.env.QWEN_DEFAULT_RESPONSE_FORMAT as ResponseFormat) || 'json';
    
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
        `${this.baseUrl}/services/aigc/text-generation/generation`,
        {
          model: 'qwen-turbo',
          input: {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          },
          parameters: {
            stream: responseFormat === 'event-stream'
          }
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

      const data = response.data as QwenChatResponse;
      return data.output.text;
    } catch (error) {
      console.error('Qwen chat error:', error);
      throw new Error('Failed to get response from Qwen');
    }
  }

  async getIntent(prompt: string): Promise<string> {
    try {
      const response = await this.axiosInstance.post(
        `${this.baseUrl}/services/aigc/text-generation/generation`,
        {
          model: 'qwen-turbo',
          input: {
            messages: [{
              role: 'user',
              content: prompt
            }]
          }
        }
      );

      const data = response.data as QwenChatResponse;
      const intent = data.output.text.trim().toLowerCase();
      
      // 确保返回的意图是有效的
      if (!['chat', 'recipe', 'food_availability'].includes(intent)) {
        return 'chat';
      }
      
      return intent;
    } catch (error) {
      console.error('Qwen intent detection error:', error);
      return 'chat'; // 发生错误时默认返回普通对话
    }
  }
} 
 