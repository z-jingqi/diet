import { AIService } from './base';
import { ChatMessage, ChatResponse } from '../../types';
import OpenAI from 'openai';

const OPENAI_MODEL = 'gpt-3.5-turbo';
const MAX_TOKENS = 4096;

export class OpenAIService implements AIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || 'mock-key';
    if (apiKey === 'mock-key') {
      this.client = null as any;
    } else {
      this.client = new OpenAI({ apiKey });
    }
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.client) {
      return this.mockResponse(messages);
    }

    const response = await this.client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      max_tokens: MAX_TOKENS,
    });

    return {
      role: 'assistant',
      content: response.choices[0].message.content || '',
    };
  }

  private mockResponse(messages: ChatMessage[]): ChatResponse {
    const lastMessage = messages[messages.length - 1];
    return {
      role: 'assistant',
      content: `[OpenAI Mock] 这是对 "${lastMessage.content}" 的模拟回复。\n\n在开发环境中，我们使用模拟数据。当您配置了实际的 API 密钥后，这里将返回真实的 AI 响应。`,
    };
  }
} 
