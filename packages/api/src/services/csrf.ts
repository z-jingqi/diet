import type { DB } from "../db";
import { csrf_tokens } from "../db/schema";
import { eq, sql, and } from "drizzle-orm";
import { generateId } from "../utils/id";

export class CsrfService {
  constructor(private db: DB) {}

  // 生成 CSRF token
  private generateCsrfToken(): string {
    return crypto.randomUUID();
  }

  // 创建 CSRF token
  async createToken(userId: string): Promise<string> {
    const tokenId = generateId();
    const token = this.generateCsrfToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时过期

    await this.db.insert(csrf_tokens).values({
      id: tokenId,
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    });

    return token;
  }

  // 验证 CSRF token
  async validateToken(userId: string, token: string): Promise<boolean> {
    const result = await this.db
      .select()
      .from(csrf_tokens)
      .where(
        and(
          eq(csrf_tokens.user_id, userId),
          eq(csrf_tokens.token, token),
          sql`${csrf_tokens.expires_at} > CURRENT_TIMESTAMP`
        )
      )
      .then((rows) => rows[0]);
    return !!result;
  }

  // 删除 CSRF token
  async deleteToken(userId: string, token: string): Promise<void> {
    await this.db
      .delete(csrf_tokens)
      .where(
        and(eq(csrf_tokens.user_id, userId), eq(csrf_tokens.token, token))
      );
  }

  // 清理过期的 CSRF token
  async cleanupExpiredTokens(): Promise<void> {
    await this.db
      .delete(csrf_tokens)
      .where(sql`${csrf_tokens.expires_at} <= CURRENT_TIMESTAMP`);
  }

  // 获取用户的 CSRF token
  async getToken(userId: string): Promise<string | null> {
    const result = await this.db
      .select()
      .from(csrf_tokens)
      .where(
        and(
          eq(csrf_tokens.user_id, userId),
          sql`${csrf_tokens.expires_at} > CURRENT_TIMESTAMP`
        )
      )
      .orderBy(sql`created_at DESC`)
      .limit(1)
      .then((rows) => rows[0]);
    return result?.token || null;
  }
}
