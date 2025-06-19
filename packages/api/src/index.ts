import { Hono } from "hono";
import { cors } from "hono/cors";
import { AIServiceFactory } from "./services/ai/factory";
import type { KVNamespace, R2Bucket, Fetcher, Ai, D1Database } from "@cloudflare/workers-types";
import type { AIProvider } from "./services/ai/types";
import tags from "./routes/tags";

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

// 创建 Hono 应用
const app = new Hono<{ Bindings: Bindings }>();

// 启用 CORS
app.use("*", cors());

// 挂载标签路由
app.route("/tags", tags);

// 全局错误处理
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// 健康检查接口
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// 获取用户意图接口
app.post("/intent", async (c) => {
  try {
    // 打印请求头，用于调试
    const headers: Record<string, string> = {};
    c.req.raw.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 获取请求体
    const body = await c.req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return c.json({ error: "Missing or invalid messages in request body" }, 400);
    }

    // 根据配置选择 AI 服务
    const aiService = AIServiceFactory.create(
      {
        type: c.env.AI_SERVICE || "cloudflare",
      },
      c.env
    );

    const result = await aiService.getIntent(body.messages);
    return c.json({ response: result });
  } catch (error) {
    console.error("Intent Error:", error);
    return c.json({ error: "Failed to process intent" }, 500);
  }
});

// 聊天接口
app.post("/chat", async (c) => {
  try {
    // 打印请求头，用于调试
    const headers: Record<string, string> = {};
    c.req.raw.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 获取请求体
    const body = await c.req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return c.json({ error: "Missing or invalid messages in request body" }, 400);
    }

    if (!body.intent) {
      return c.json({ error: "Missing intent in request body" }, 400);
    }

    // 根据配置选择 AI 服务
    const aiService = AIServiceFactory.create(
      {
        type: c.env.AI_SERVICE || "cloudflare",
      },
      c.env
    );

    const result = await aiService.chat(body.messages, body.intent, body.format);

    // 如果是流式响应，直接返回流
    if (result instanceof ReadableStream) {
      return new Response(result, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // 如果是普通响应，返回 JSON
    return c.json({ response: result });
  } catch (error) {
    console.error("Chat Error:", error);
    return c.json({ error: "Failed to process chat" }, 500);
  }
});

// 导出 Hono 应用
export default app;
