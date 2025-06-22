import { D1Database } from '@cloudflare/workers-types';
import { generateId } from '../utils/id';

export class CsrfService {
  constructor(private db: D1Database) {}

  // 生成 CSRF token
  private generateCsrfToken(): string {
    return crypto.randomUUID();
  }

  // 创建 CSRF token
  async createCsrfToken(userId: string): Promise<string> {
    const tokenId = generateId();
    const token = this.generateCsrfToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时过期

    await this.db
      .prepare(`
        INSERT INTO csrf_tokens (id, user_id, token, expires_at)
        VALUES (?, ?, ?, ?)
      `)
      .bind(tokenId, userId, token, expiresAt.toISOString())
      .run();

    return token;
  }

  // 验证 CSRF token
  async validateCsrfToken(userId: string, token: string): Promise<boolean> {
    const result = await this.db
      .prepare(`
        SELECT id FROM csrf_tokens 
        WHERE user_id = ? AND token = ? AND expires_at > CURRENT_TIMESTAMP
      `)
      .bind(userId, token)
      .first<{ id: string }>();

    return !!result;
  }

  // 删除 CSRF token
  async deleteCsrfToken(userId: string, token: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM csrf_tokens WHERE user_id = ? AND token = ?')
      .bind(userId, token)
      .run();
  }

  // 清理过期的 CSRF token
  async cleanupExpiredTokens(): Promise<void> {
    await this.db
      .prepare('DELETE FROM csrf_tokens WHERE expires_at <= CURRENT_TIMESTAMP')
      .run();
  }

  // 获取用户的 CSRF token
  async getCsrfToken(userId: string): Promise<string | null> {
    const result = await this.db
      .prepare(`
        SELECT token FROM csrf_tokens 
        WHERE user_id = ? AND expires_at > CURRENT_TIMESTAMP
        ORDER BY created_at DESC
        LIMIT 1
      `)
      .bind(userId)
      .first<{ token: string }>();

    return result?.token || null;
  }
} 