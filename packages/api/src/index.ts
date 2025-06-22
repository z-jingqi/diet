import { Hono } from "hono";
import { cors } from "hono/cors";
import tags from "./routes/tags";
import auth from "./routes/auth";
import chat from "./routes/chat";
import { Bindings } from "./types/bindings";

// 创建 Hono 应用
const app = new Hono<{ Bindings: Bindings }>();

// 启用 CORS
app.use("*", cors());

// 挂载认证路由（不需要认证）
app.route("/auth", auth);

// 挂载聊天路由（需要认证）
app.route("/chat", chat);

// 挂载标签路由（需要认证）
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

// 导出 Hono 应用
export default app;
