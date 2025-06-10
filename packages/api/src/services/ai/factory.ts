import { AIService } from './base';
import { QwenService } from './qwen';
import { OpenAIService } from './openai';
import { ClaudeService } from './claude';
import { BaiduAIService } from './baidu';

export type AIServiceType = 'qwen' | 'openai' | 'claude' | 'baidu';

export interface AIServiceConfig {
  type: AIServiceType;
  apiKey?: string;
  apiSecret?: string;
}

const createAIService = (config: AIServiceConfig): AIService => {
  switch (config.type) {
    case 'qwen':
      return new QwenService({ apiKey: config.apiKey });
    case 'openai':
      return new OpenAIService();
    case 'claude':
      return new ClaudeService();
    case 'baidu':
      return new BaiduAIService({ 
        apiKey: config.apiKey,
        apiSecret: config.apiSecret
      });
    default:
      throw new Error(`Unsupported AI service type: ${config.type}`);
  }
};

export default createAIService; 
 