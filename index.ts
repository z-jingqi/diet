import { createApiApp } from "./packages/api/src/index";

export default {
  async fetch(request: Request, env: any, ctx): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // API 路由处理
    if (path.startsWith("/api/")) {
      // 创建 API 应用实例
      const apiApp = createApiApp();

      // 创建新的请求，去掉 /api 前缀
      const apiPath = path.replace("/api", "") || "/";
      const apiUrl = new URL(apiPath, url.origin);
      apiUrl.search = url.search; // 保留查询参数

      const apiRequest = new Request(apiUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      // 调用 Hono 应用处理请求
      return apiApp.fetch(apiRequest, env, ctx);
    }

    // 前端静态资源处理
    // 对于其他所有路由，返回前端应用
    return env.ASSETS.fetch(request);
  },
};
