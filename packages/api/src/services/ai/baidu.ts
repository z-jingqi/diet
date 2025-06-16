import { AIService, Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from './types';
import axios from 'axios';

interface BaiduTokenResponse {
  access_token: string;
}

interface BaiduChatResponse {
  result: string;
}

interface ServiceEnv {
  BAIDU_API_KEY?: string;
  BAIDU_SECRET_KEY?: string;
  BAIDU_MODEL?: string;
}

export class BaiduAIService implements AIService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat';
  private model: string;
  private defaultFormat: ResponseFormat;
  private axiosInstance;

  constructor(config?: AIConfig, env?: ServiceEnv) {
    // 优先使用配置中的值，然后是环境变量
    this.apiKey = config?.apiKey || env?.BAIDU_API_KEY || process.env.BAIDU_API_KEY || '';
    this.apiSecret = config?.apiSecret || env?.BAIDU_SECRET_KEY || process.env.BAIDU_SECRET_KEY || '';
    this.model = config?.model || env?.BAIDU_MODEL || DEFAULT_MODELS.baidu;
    
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Baidu API Key and Secret are required');
    }

    this.defaultFormat = config?.defaultResponseFormat || 'json';
    
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  private async getAccessToken(): Promise<string> {
    try {
      const response = await this.axiosInstance.post(
        `https://aip.baidubce.com/oauth/2.0/token`,
        null,
        {
          params: {
            grant_type: 'client_credentials',
            client_id: this.apiKey,
            client_secret: this.apiSecret
          }
        }
      );

      const data = response.data as BaiduTokenResponse;
      return data.access_token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Failed to get access token');
    }
  }

  async chat(messages: Message[], format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    try {
      const accessToken = await this.getAccessToken();
      const body: Record<string, unknown> = {
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      };
      if (responseFormat === 'event-stream') {
        body.stream = true;
      }

      const response = await this.axiosInstance.post(
        `${this.baseUrl}/${this.model}?access_token=${accessToken}`,
        body,
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

      const data = response.data as BaiduChatResponse;
      return data.result;
    } catch (error) {
      console.error('Baidu AI chat error:', error);
      throw new Error('Failed to get response from Baidu AI');
    }
  }

  async getIntent(prompt: string): Promise<string> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await this.axiosInstance.post(
        `${this.baseUrl}/${this.model}?access_token=${accessToken}`,
        {
          messages: [{
            role: 'user',
            content: prompt
          }]
        }
      );

      const data = response.data as BaiduChatResponse;
      const intent = data.result.trim().toLowerCase();
      
      // 确保返回的意图是有效的
      if (!['chat', 'recipe', 'food_availability'].includes(intent)) {
        return 'chat';
      }
      
      return intent;
    } catch (error) {
      console.error('Baidu AI intent detection error:', error);
      return 'chat'; // 发生错误时默认返回普通对话
    }
  }
} 
 