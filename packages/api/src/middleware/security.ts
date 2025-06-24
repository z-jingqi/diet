import { Context, Next } from 'hono';

// 安全头中间件
export const securityHeaders = async (c: Context, next: Next) => {
  await next();
  
  // 设置安全头
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // 内容安全策略 (适用于API)
  c.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';");
};

// 速率限制中间件（简化版）
interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (options: RateLimitOptions) => {
  return async (c: Context, next: Next) => {
    const clientIP = c.req.header('CF-Connecting-IP') || 
                     c.req.header('X-Forwarded-For') || 
                     'unknown';
    
    const now = Date.now();
    const key = `${clientIP}`;
    const entry = rateLimitStore.get(key);
    
    if (!entry || now > entry.resetTime) {
      // 创建新的限制窗口
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + options.windowMs
      });
      await next();
      return;
    }
    
    if (entry.count >= options.maxRequests) {
      return c.json(
        { 
          error: 'Too Many Requests',
          message: '请求过于频繁，请稍后再试'
        }, 
        429
      );
    }
    
    entry.count++;
    await next();
  };
};

export default { securityHeaders, rateLimit }; 
