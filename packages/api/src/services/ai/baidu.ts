import { AIService } from './base';
import { ChatMessage, ChatResponse } from '../../types';

const BAIDU_MODEL = 'ERNIE-Bot-4';
const MAX_TOKENS = 4096;

interface BaiduTokenResponse {
  access_token: string;
}

interface BaiduChatResponse {
  result: string;
}

interface BaiduEmbeddingResponse {
  data: Array<{
    embedding: number[];
  }>;
}

export interface BaiduConfig {
  apiKey?: string;
  apiSecret?: string;
}

export class BaiduAIService implements AIService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat';

  constructor(config?: BaiduConfig) {
    this.apiKey = config?.apiKey || process.env.BAIDU_API_KEY || 'mock-key';
    this.apiSecret = config?.apiSecret || process.env.BAIDU_API_SECRET || 'mock-key';
  }

  private async getAccessToken(): Promise<string> {
    if (this.apiKey === 'mock-key' || this.apiSecret === 'mock-key') {
      return 'mock-token';
    }

    const response = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`);
    }

    const data = await response.json() as BaiduTokenResponse;
    return data.access_token;
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    if (this.apiKey === 'mock-key' || this.apiSecret === 'mock-key') {
      return this.mockResponse(messages);
    }

    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(`${this.baseUrl}?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          parameters: {
            max_tokens: MAX_TOKENS
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as BaiduChatResponse;
      return {
        role: 'assistant',
        content: data.result
      };
    } catch (error) {
      console.error('Baidu AI chat error:', error);
      throw new Error('Failed to get response from Baidu AI');
    }
  }

  private mockResponse(messages: ChatMessage[]): ChatResponse {
    const lastMessage = messages[messages.length - 1];
    return {
      role: 'assistant',
      content: `[Baidu AI Mock] 这是对 "${lastMessage.content}" 的模拟回复。\n\n在开发环境中，我们使用模拟数据。当您配置了实际的 API 密钥后，这里将返回真实的 AI 响应。`,
    };
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await fetch(
        `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/embeddings/embedding-v1?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: text
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as BaiduEmbeddingResponse;
      return data.data[0].embedding;
    } catch (error) {
      console.error('Baidu AI embedding error:', error);
      throw new Error('Failed to get embedding from Baidu AI');
    }
  }
} 
 