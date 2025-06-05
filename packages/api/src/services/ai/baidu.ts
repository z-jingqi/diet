import { AIService, Message, AIConfig, ResponseFormat } from './types';

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

export class BaiduAIService implements AIService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat';
  private defaultFormat: ResponseFormat;

  constructor(config?: AIConfig) {
    this.apiKey = config?.apiKey || process.env.BAIDU_API_KEY || '';
    this.apiSecret = config?.apiSecret || process.env.BAIDU_API_SECRET || '';
    this.defaultFormat = config?.defaultResponseFormat || (process.env.BAIDU_DEFAULT_RESPONSE_FORMAT as ResponseFormat) || 'json';
  }

  private async getAccessToken(): Promise<string> {
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
      const response = await fetch(`${this.baseUrl}?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': responseFormat === 'event-stream' ? 'text/event-stream' : 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (responseFormat === 'event-stream') {
        return response.body as ReadableStream;
      }

      const data = await response.json() as BaiduChatResponse;
      return data.result;
    } catch (error) {
      console.error('Baidu AI chat error:', error);
      throw new Error('Failed to get response from Baidu AI');
    }
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
 