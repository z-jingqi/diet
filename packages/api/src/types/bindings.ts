import type { KVNamespace, R2Bucket, Fetcher, Ai, D1Database } from "@cloudflare/workers-types";
import type { AIProvider } from "../services/ai/types";

// 定义环境变量类型
export type Bindings = {
  // 环境变量
  ENVIRONMENT: string; // 环境名称，如 'development', 'production'

  // AI 服务相关
  AI_SERVICE?: AIProvider; // 使用的 AI 服务提供商
  AI: Ai; // Cloudflare Workers AI binding
  
  QWEN_MODEL?: string;  // 千问模型
  QWEN_API_KEY?: string; // 阿里云 DashScope API Key
  CLOUDFLARE_MODEL?: string; // Cloudflare AI model

  // 数据库相关
  DATABASE_URL?: string; // 数据库连接 URL
  DB: D1Database; // D1 数据库绑定

  // 缓存相关
  CACHE_KV?: KVNamespace; // Cloudflare KV 存储

  // 对象存储相关
  BUCKET?: R2Bucket; // Cloudflare R2 存储

  // 其他服务
  ASSETS: Fetcher; // 静态资源绑定
}; 