import { Hono } from "hono";
import { AIServiceFactory } from "../services/ai/factory";
import { csrfProtection } from "../middleware/csrf";
import { Bindings } from "../types/bindings";

const chat = new Hono<{ Bindings: Bindings }>();

// 游客聊天接口 - 允许未认证用户使用，功能与认证用户相同
chat.post("/guest", async (c) => {
  try {
    // 获取请求体
    const body = await c.req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return c.json(
        { error: "Missing or invalid messages in request body" },
        400
      );
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
    return c.json({
      response: result,
    });
  } catch (error) {
    console.error("Guest Chat Error:", error);
    return c.json({ error: "Failed to process chat" }, 500);
  }
});

// 认证用户聊天接口 - 需要CSRF保护
chat.use("/authenticated/*", csrfProtection);
chat.post("/authenticated", async (c) => {
  try {
    // 获取请求体
    const body = await c.req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return c.json(
        { error: "Missing or invalid messages in request body" },
        400
      );
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
    return c.json({
      response: result,
    });
  } catch (error) {
    console.error("Authenticated Chat Error:", error);
    return c.json({ error: "Failed to process chat" }, 500);
  }
});

// 保持原有的 "/" 端点以兼容现有代码，使用CSRF保护
chat.use("/*", async (c, next) => {
  // 对除 /guest 和 /authenticated 外的请求执行 CSRF 保护
  if (c.req.path.includes("/guest") || c.req.path.includes("/authenticated")) {
    return await next();
  }

  // 直接调用 CSRF 中间件（其内部会在通过校验后调用 next）
  return csrfProtection(c, next);
});

chat.post("/", async (c) => {
  try {
    // 获取请求体
    const body = await c.req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return c.json(
        { error: "Missing or invalid messages in request body" },
        400
      );
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
