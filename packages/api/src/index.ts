import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { securityHeaders, rateLimit } from "./middleware/security";
import { dataCleanup } from "./middleware/cleanup";
import chat from "./routes/chat";
import auth from "./routes/auth";
import { Bindings } from "./types/bindings";
import { createYoga } from "graphql-yoga";
import { useCSRFPrevention } from "@graphql-yoga/plugin-csrf-prevention";
import { schema } from "./graphql/schema";
import { createDB } from "./db";
import { createGraphQLContext } from "./graphql/context";

// 创建 Hono 应用
const app = new Hono<{ Bindings: Bindings }>();

// 数据清理（定期任务）
app.use("*", dataCleanup);

// 安全头（所有响应）
app.use("*", securityHeaders);

// 启用 CORS，支持携带凭证（cookies）
app.use(
  "*",
  cors({
    // 运行在本地开发模式时允许所有源，
    // 生产环境建议通过环境变量显式配置允许的前端地址
    origin: (origin) => origin ?? "*",
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
    maxAge: 86400, // 24h
  })
);

// 基础速率限制
app.use(
  "*",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    maxRequests: 100, // 每15分钟最多100个请求
  })
);

// 启用压缩，但跳过 GraphQL 端点（防止 introspection 无法被工具解析）
app.use("*", async (c, next) => {
  if (c.req.path.startsWith("/graphql")) {
    await next();
    return;
  }

  // Cloudflare Workers 会在最外层自动根据 Accept-Encoding 对响应进行压缩。
  // 如果我们在 Worker 内再次手动压缩，Cloudflare 会剥离 Content-Encoding
  // 头部但保留 gzip 字节流，导致前端 fetch 无法正常解析。
  // 因此在 Worker 环境（通过检测 WebSocketPair 是否存在来判断）下跳过手动压缩，
  // 仅在本地 Node.js 运行时使用 hono/compress。
  const isCloudflareWorker =
    typeof (globalThis as unknown as { WebSocketPair?: unknown })
      .WebSocketPair !== "undefined";

  if (!isCloudflareWorker) {
    const compressionMiddleware = compress();
    return compressionMiddleware(c, next);
  }

  await next();
});

// 挂载聊天路由（需要认证）
app.route("/chat", chat);

// 挂载认证路由（刷新 token 等）
app.route("/auth", auth);

// 挂载 GraphQL Yoga
const yoga = createYoga({
  schema,
  graphiql: process.env.NODE_ENV !== "production",
  plugins: [
    useCSRFPrevention({
      requestHeaders: ["X-CSRF-Token"], // 使用现有的 CSRF 头部
    }),
  ],
});

// GraphQL 端点
app.all("/graphql", async (c) => {
  // GraphQL 端点使用 Yoga 的 CSRF 保护，跳过 REST CSRF 中间件
  // 为每个请求创建独立的 DB 实例
  const db = createDB(c.env.DB);

  // 创建 GraphQL 上下文（包含认证信息）
  const context = await createGraphQLContext(db, c.req.raw.headers, c.env);

  // Pass the GraphQLContext as the **third** parameter so Yoga uses it directly
  const response = (await yoga.fetch(
    c.req.raw,
    {},
    context
  )) as unknown as Response;

  // Append cookies set during resolvers
  if (context.responseCookies.length) {
    context.responseCookies.forEach((cookie: string) => {
      response.headers.append("Set-Cookie", cookie);
    });
  }

  return response;
});

// 全局错误处理
app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// 健康检查接口
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// 导出 Hono 应用
export default app;
