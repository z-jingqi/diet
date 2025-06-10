import { AIService } from './base';
import { ChatMessage, ChatResponse } from '../../types';

const QWEN_MODEL = 'qwen-max';
const MAX_TOKENS = 4096;

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

export interface QwenConfig {
  apiKey?: string;
}

export class QwenService implements AIService {
  private apiKey: string;
  private baseUrl = 'https://dashscope.aliyuncs.com/api/v1';

  constructor(config?: QwenConfig) {
    this.apiKey = config?.apiKey || process.env.QWEN_API_KEY || 'mock-key';
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.apiKey || this.apiKey === 'mock-key') {
      return this.mockResponse(messages);
    }

    try {
      const response = await fetch(`${this.baseUrl}/services/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: QWEN_MODEL,
          input: {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          },
          parameters: {
            max_tokens: MAX_TOKENS
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as QwenChatResponse;
      return {
        role: 'assistant',
        content: data.output.text
      };
    } catch (error) {
      console.error('Qwen chat error:', error);
      throw new Error('Failed to get response from Qwen');
    }
  }

  private mockResponse(messages: ChatMessage[]): ChatResponse {
    const lastMessage = messages[messages.length - 1];
    return {
      role: 'assistant',
      content: `[Qwen Mock] 这是对 "${lastMessage.content}" 的模拟回复。\n\n在开发环境中，我们使用模拟数据。当您配置了实际的 API 密钥后，这里将返回真实的 AI 响应。`,
    };
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
 