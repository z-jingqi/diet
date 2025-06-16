import { AIService, Message, AIConfig, ResponseFormat, DEFAULT_MODELS } from './types';
import { INTENT_PROMPT } from './prompts/intent-prompt';
import { CHAT_PROMPT } from './prompts/chat-prompt';
import { RECIPE_PROMPT } from './prompts/recipe-prompt';
import { HEALTH_ADVICE_PROMPT } from './prompts/health-advice-prompt';
import { BaseAIService, ServiceEnv } from './base';

interface CloudflareAIResponse {
  result: {
    response: string;
  };
  success: boolean;
}

interface CloudflareServiceEnv extends ServiceEnv {
  CLOUDFLARE_WORKERS_AI_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_MODEL?: string;
}

export class CloudflareAIService extends BaseAIService {
  private accountId: string;

  constructor(config?: AIConfig, env?: CloudflareServiceEnv) {
    super(config, env);
    this.apiKey = config?.apiKey || env?.CLOUDFLARE_WORKERS_AI_API_TOKEN || '';
    this.accountId = config?.accountId || env?.CLOUDFLARE_ACCOUNT_ID || '';
    this.model = config?.model || env?.CLOUDFLARE_MODEL || DEFAULT_MODELS.cloudflare;
    
    if (!this.apiKey || !this.accountId) {
      throw new Error('Cloudflare API Token and Account ID are required');
    }

    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run`;
  }

  protected parseResponse(data: any): string {
    return (data as CloudflareAIResponse).result.response;
  }

  async chat(messages: Message[], intent: string, format?: ResponseFormat): Promise<string | ReadableStream> {
    const responseFormat = format || this.defaultFormat;
    try {
      // 根据 intent 选择对应的 prompt
      let systemPrompt = CHAT_PROMPT;
      switch (intent) {
        case 'recipe':
          systemPrompt = RECIPE_PROMPT;
          break;
        case 'health_advice':
          systemPrompt = HEALTH_ADVICE_PROMPT;
          break;
      }

      // 添加系统提示到消息列表的开头
      const messagesWithPrompt = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const requestBody = {
        messages: messagesWithPrompt.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: responseFormat === 'event-stream'
      };

      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': responseFormat === 'event-stream' ? 'text/event-stream' : 'application/json',
        'Content-Type': 'application/json'
      };

      const response = await this.makeRequest(
        `${this.baseUrl}/${this.model}`,
        requestBody,
        responseFormat,
        headers
      );

      // 如果是流式响应，直接返回流
      if (response instanceof ReadableStream) {
        return response;
      }

      // 如果是普通响应，解析并返回文本
      return this.parseResponse(response);
    } catch (error) {
      console.error('Cloudflare AI chat error:', error);
      throw new Error('Failed to get response from Cloudflare AI');
    }
  }

  async getIntent(messages: Message[]): Promise<string> {
    try {
      const result = await this.makeRequest(
        `${this.baseUrl}/${this.model}`,
        {
          messages: [
            {
              role: 'system',
              content: INTENT_PROMPT
            },
            ...messages
          ]
        },
        'json',
        {
          'Authorization': `Bearer ${this.apiKey}`
        }
      ) as string;

      const intent = result.trim().toLowerCase();
      
      // Ensure the returned intent is valid
      if (!['chat', 'recipe', 'health_advice'].includes(intent)) {
        return 'chat';
      }
      
      return intent;
    } catch (error) {
      console.error('Cloudflare AI intent detection error:', error);
      throw new Error('Failed to get intent from Cloudflare AI');
    }
  }
} 
