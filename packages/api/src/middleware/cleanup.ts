import { Context, Next } from 'hono';
import { CsrfService } from '../services/csrf';

// 定期清理过期数据的中间件
export const dataCleanup = async (c: Context, next: Next) => {
  // 只在每小时的第0分钟执行清理（减少频率）
  const now = new Date();
  const shouldCleanup = now.getMinutes() === 0 && Math.random() < 0.1; // 10%概率触发
  
  if (shouldCleanup) {
    try {
      // 清理过期的 CSRF tokens
      const csrfService = new CsrfService(c.env.DB);
      await csrfService.cleanupExpiredTokens();
      
      // 清理过期的会话
      await c.env.DB
        .prepare('DELETE FROM user_sessions WHERE session_expires_at <= CURRENT_TIMESTAMP')
        .run();
      
      // 清理过期的 refresh token
      await c.env.DB
        .prepare('DELETE FROM user_sessions WHERE refresh_expires_at <= CURRENT_TIMESTAMP')
        .run();
        
      console.log('🧹 数据清理完成:', now.toISOString());
    } catch (error) {
      console.error('❌ 数据清理失败:', error);
    }
  }
  
  await next();
};

export default { dataCleanup }; 
