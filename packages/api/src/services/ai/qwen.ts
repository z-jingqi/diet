import { AIService, Message, AIConfig, ResponseFormat } from './types';

interface QwenChatResponse {
  output: {
    text: string;
  };
}

interface QwenEmbeddingResponse {
  output: {
    embeddings: number[][];
  };
}

export class QwenService implements AIService {
  private apiKey: string;
  private baseUrl = 'https://dashscope.aliyuncs.com/api/v1';
  private defaultFormat: ResponseFormat = 'json';

  constructor(config?: AIConfig) {
    this.apiKey = config?.apiKey || process.env.QWEN_API_KEY || '';
    this.defaultFormat = config?.defaultResponseFormat || (process.env.QWEN_DEFAULT_RESPONSE_FORMAT as ResponseFormat) || 'json';
  }

  async chat(messages: Message[], format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    try {
      const response = await fetch(`${this.baseUrl}/services/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': responseFormat === 'event-stream' ? 'text/event-stream' : 'application/json',
        },
        body: JSON.stringify({
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
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (responseFormat === 'event-stream') {
        return response.body as ReadableStream;
      }

      const data = await response.json() as QwenChatResponse;
      return data.output.text;
    } catch (error) {
      console.error('Qwen chat error:', error);
      throw new Error('Failed to get response from Qwen');
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/services/embeddings/text-embedding/text-embedding`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-v1',
          input: {
            texts: [text]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as QwenEmbeddingResponse;
      return data.output.embeddings[0];
    } catch (error) {
      console.error('Qwen embedding error:', error);
      throw new Error('Failed to get embedding from Qwen');
    }
  }
} 
 