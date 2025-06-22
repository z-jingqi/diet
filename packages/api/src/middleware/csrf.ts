import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { AuthService } from '../services/auth';

// CSRF 保护中间件
export const csrfProtection = async (c: Context, next: Next) => {
  const authService = new AuthService(c.get('db'));
  
  // 获取 session token
  const sessionToken = getCookie(c, 'session_token');
  if (!sessionToken) {
    return c.json({ error: '未登录' }, 401);
  }

  // 验证 session
  const authContext = await authService.validateSession(sessionToken);
  if (!authContext) {
    return c.json({ error: '登录已过期' }, 401);
  }

  // 对于非 GET 请求，验证 CSRF token
  if (c.req.method !== 'GET') {
    const csrfToken = c.req.header('X-CSRF-Token');
    if (!csrfToken) {
      return c.json({ error: '缺少 CSRF token' }, 403);
    }

    const isValidCsrf = await authService.validateCsrfToken(authContext.user.id, csrfToken);
    if (!isValidCsrf) {
      return c.json({ error: 'CSRF token 无效' }, 403);
    }
  }

  // 将用户信息添加到上下文
  c.set('user', authContext.user);
  c.set('session', authContext.session);
  
  await next();
};

// 可选的 CSRF 保护（仅在有 token 时验证）
export const optionalCsrfProtection = async (c: Context, next: Next) => {
  const authService = new AuthService(c.get('db'));
  
  // 获取 session token
  const sessionToken = getCookie(c, 'session_token');
  if (!sessionToken) {
    await next();
    return;
  }

  // 验证 session
  const authContext = await authService.validateSession(sessionToken);
  if (!authContext) {
    await next();
    return;
  }

  // 对于非 GET 请求，验证 CSRF token
  if (c.req.method !== 'GET') {
    const csrfToken = c.req.header('X-CSRF-Token');
    if (csrfToken) {
      const isValidCsrf = await authService.validateCsrfToken(authContext.user.id, csrfToken);
      if (!isValidCsrf) {
        return c.json({ error: 'CSRF token 无效' }, 403);
      }
    }
  }

  // 将用户信息添加到上下文
  c.set('user', authContext.user);
  c.set('session', authContext.session);
  
  await next();
}; 