import type { DB } from '../db';
import { csrfTokens } from '../db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { generateId } from '../utils/id';

export class CsrfService {
  constructor(private db: DB) {}

  // 生成 CSRF token
  private generateCsrfToken(): string {
    return crypto.randomUUID();
  }

  // 创建 CSRF token
  async createCsrfToken(userId: string): Promise<string> {
    const tokenId = generateId();
    const token = this.generateCsrfToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时过期

    await this.db.insert(csrfTokens).values({
      id: tokenId,
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
    });

    return token;
  }

  // 验证 CSRF token
  async validateCsrfToken(userId: string, token: string): Promise<boolean> {
    const result = await this.db
      .select()
      .from(csrfTokens)
      .where(and(
        eq(csrfTokens.userId, userId),
        eq(csrfTokens.token, token),
        sql`${csrfTokens.expiresAt} > CURRENT_TIMESTAMP`
      ))
      .then((rows) => rows[0]);
    return !!result;
  }

  // 删除 CSRF token
  async deleteCsrfToken(userId: string, token: string): Promise<void> {
    await this.db.delete(csrfTokens)
      .where(and(
        eq(csrfTokens.userId, userId),
        eq(csrfTokens.token, token)
      ));
  }

  // 清理过期的 CSRF token
  async cleanupExpiredTokens(): Promise<void> {
    await this.db.delete(csrfTokens)
      .where(sql`${csrfTokens.expiresAt} <= CURRENT_TIMESTAMP`);
  }

  // 获取用户的 CSRF token
  async getCsrfToken(userId: string): Promise<string | null> {
    const result = await this.db
      .select()
      .from(csrfTokens)
      .where(and(
        eq(csrfTokens.userId, userId),
        sql`${csrfTokens.expiresAt} > CURRENT_TIMESTAMP`
      ))
      .orderBy(sql`created_at DESC`)
      .limit(1)
      .then((rows) => rows[0]);
    return result?.token || null;
  }
} 