import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
// import { AIServiceFactory } from './services/ai/factory';
// import { AIProvider } from './services/ai/types';
import { MockAIService } from "./services/ai/mock";

export type Bindings = {
  // 这里可以添加环境变量类型
};

export const createApiApp = () => {
  const app = new Hono<{ Bindings: Bindings }>();

  // 启用 CORS
  app.use("*", cors());

  // 静态资源服务
  app.use("/*", serveStatic({ root: "./", manifest: {} }));

  // API 路由
  app.get("/api/health", (c) => {
    return c.json({ status: "ok" });
  });

  // 获取用户意图接口
  app.post("/api/intent", async (c) => {
    try {
      const aiService = new MockAIService();
      const { message } = await c.req.json();
      const result = await aiService.getIntent(message);
      return c.json(result);
    } catch (error) {
      return c.json({ error: "Failed to process intent" }, 500);
    }
  });

  // 聊天接口
  app.post("/api/chat", async (c) => {
    try {
      const aiService = new MockAIService();
      const { message } = await c.req.json();
      const result = await aiService.chat(message);
      return c.json(result);
    } catch (error) {
      return c.json({ error: "Failed to process chat" }, 500);
    }
  });

  return app;
};

export type ApiApp = ReturnType<typeof createApiApp>;
