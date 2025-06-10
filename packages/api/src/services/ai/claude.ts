import { AIService } from './base';
import { ChatMessage, ChatResponse } from '../../types';
import Anthropic from '@anthropic-ai/sdk';

const CLAUDE_MODEL = 'claude-3-sonnet-20240229';
const MAX_TOKENS = 4096;

export class ClaudeService implements AIService {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY || 'mock-key';
    if (apiKey === 'mock-key') {
      this.client = null as any;
    } else {
      this.client = new Anthropic({ apiKey });
    }
  }

  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    if (!this.client) {
      return this.mockResponse(messages);
    }

    const response = await this.client.messages.create({
      model: CLAUDE_MODEL,
      messages: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      })),
      max_tokens: MAX_TOKENS,
    });

    return {
      role: 'assistant',
      content: response.content[0].text,
    };
  }

  private mockResponse(messages: ChatMessage[]): ChatResponse {
    const lastMessage = messages[messages.length - 1];
    return {
      role: 'assistant',
      content: `[Claude Mock] 这是对 "${lastMessage.content}" 的模拟回复。\n\n在开发环境中，我们使用模拟数据。当您配置了实际的 API 密钥后，这里将返回真实的 AI 响应。`,
    };
  }
} 
