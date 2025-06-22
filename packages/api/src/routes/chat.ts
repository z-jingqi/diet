import { Hono } from "hono";
import { AIServiceFactory } from "../services/ai/factory";
import { AuthService } from "../services/auth";
import { authMiddleware } from "../middleware/auth";
import { Bindings } from "../types/bindings";

const chat = new Hono<{ Bindings: Bindings }>();

// 认证中间件 - 应用到所有聊天路由
chat.use("*", async (c, next) => {
  try {
    const authService = new AuthService(c.env.DB);
    await authMiddleware(c.req.raw, authService);
    await next();
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      return error;
    }
    return c.json({ error: "Authentication failed" }, 401);
  }
});

// 聊天接口 - 需要认证
chat.post("/", async (c) => {
  try {
    // 获取请求体
    const body = await c.req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return c.json({ error: "Missing or invalid messages in request body" }, 400);
    }

    // 根据配置选择 AI 服务
    const aiService = AIServiceFactory.create(
      {
        type: c.env.AI_SERVICE || "qwen",
      },
      c.env
    );

    const result = await aiService.chat(body.messages, body.format);

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
    
    // 如果是认证错误，返回401
    if (error instanceof Response && error.status === 401) {
      return error;
    }
    
    return c.json({ error: "Failed to process chat" }, 500);
  }
});

export default chat; 