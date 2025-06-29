import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

// CSRF 保护中间件
export const csrfProtection = async (c: Context, next: Next) => {
  // 获取 session token
  const sessionToken = getCookie(c, "session_token");
  if (!sessionToken) {
    return c.json({ error: "未登录" }, 401);
  }

  // CSRF token 双提交校验
  if (c.req.method !== "GET") {
    const headerToken = c.req.header("X-CSRF-Token");
    const cookieToken = getCookie(c, "csrf-token");
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      return c.json({ error: "CSRF token 校验失败" }, 403);
    }
  }

  await next();
};

// 可选的 CSRF 保护（仅在有 token 时验证）
export const optionalCsrfProtection = async (c: Context, next: Next) => {
  // 获取 session token
  const sessionToken = getCookie(c, "session_token");
  if (!sessionToken) {
    await next();
    return;
  }

  // CSRF token 双提交校验
  if (c.req.method !== "GET") {
    const headerToken = c.req.header("X-CSRF-Token");
    const cookieToken = getCookie(c, "csrf-token");
    if (headerToken && cookieToken && headerToken !== cookieToken) {
      return c.json({ error: "CSRF token 校验失败" }, 403);
    }
  }

  await next();
};

export default { csrfProtection, optionalCsrfProtection };
