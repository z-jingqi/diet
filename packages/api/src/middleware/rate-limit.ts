import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number;  // 时间窗口（毫秒）
  max: number;       // 最大请求次数
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private max: number;

  constructor(config: RateLimitConfig) {
    this.windowMs = config.windowMs;
    this.max = config.max;
  }

  private getKey(req: Request): string {
    // 使用 IP 地址作为限制键
    return req.ip || 'unknown';
  }

  private isRateLimited(key: string): boolean {
    const now = Date.now();
    const record = this.store[key];

    if (!record) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return false;
    }

    if (now > record.resetTime) {
      // 重置时间窗口
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return false;
    }

    if (record.count >= this.max) {
      return true;
    }

    record.count += 1;
    return false;
  }

  middleware = (req: Request, res: Response, next: NextFunction) => {
    const key = this.getKey(req);

    if (this.isRateLimited(key)) {
      const record = this.store[key];
      const retryAfter = Math.ceil((record.resetTime - Date.now()) / 1000);
      
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter
      });
    }

    next();
  };

  // 清理过期的记录
  cleanup = () => {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  };
}

// 创建默认的速率限制器
export const defaultRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1分钟
  max: 60 // 每分钟最多60次请求
}); 
