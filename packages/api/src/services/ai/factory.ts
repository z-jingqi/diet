import { AIService, AIConfig } from './types';
import { QwenService } from './qwen';
import { BaiduAIService } from './baidu';

export const AIServiceFactory = {
  create: (config: AIConfig): AIService => {
    switch (config.type) {
      case 'qwen':
        return new QwenService(config);
      case 'baidu':
        return new BaiduAIService(config);
      default:
        throw new Error(`Unsupported AI service type: ${config.type}`);
    }
  }
}; 
