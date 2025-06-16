import { AIService, AIConfig } from './types';
import { QwenService } from './qwen';
import { BaiduAIService } from './baidu';
import { CloudflareAIService } from './cloudflare';

interface ServiceEnv {
  // Cloudflare
  CLOUDFLARE_WORKERS_AI_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  // Baidu
  BAIDU_API_KEY?: string;
  BAIDU_SECRET_KEY?: string;
  // Qwen
  DASHSCOPE_API_KEY?: string;
}

export const AIServiceFactory = {
  create: (config: AIConfig, env?: ServiceEnv): AIService => {
    switch (config.type) {
      case 'qwen':
        return new QwenService(config, env);
      case 'baidu':
        return new BaiduAIService(config, env);
      case 'cloudflare':
        return new CloudflareAIService(config, env);
      default:
        throw new Error(`Unsupported AI service type: ${config.type}`);
    }
  }
}; 
 