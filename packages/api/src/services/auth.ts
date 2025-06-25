import type { DB } from "../db";
import { users, userSessions } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  User,
  UserSession,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthContext,
  RefreshTokenResponse,
} from "@diet/shared";
import { generateId } from "../utils/id";
import { CsrfService } from "./csrf";

type SessionWithUser = {
  users: typeof users.$inferSelect;
  user_sessions: typeof userSessions.$inferSelect;
};

// 扩展User类型以包含password_hash字段（仅在内部使用）
interface UserWithPassword extends User {
  password_hash: string;
}

export class AuthService {
  private csrfService: CsrfService;

  constructor(private db: DB) {
    this.csrfService = new CsrfService(db as any);
  }

  // 密码加密（使用PBKDF2和随机盐值）
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    // 生成随机盐值（16字节）
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // 使用PBKDF2进行哈希
    const key = await crypto.subtle.importKey(
      "raw",
      passwordData,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000, // 10万次迭代
        hash: "SHA-256",
      },
      key,
      256 // 32字节 = 256位
    );

    // 将盐值和哈希值组合存储
    const hashArray = new Uint8Array(hashBuffer);
    const combined = new Uint8Array(salt.length + hashArray.length);
    combined.set(salt);
    combined.set(hashArray, salt.length);

    // 转换为hex字符串
    return Array.from(combined)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // 验证密码
  private async verifyPassword(
    password: string,
    storedHash: string
  ): Promise<boolean> {
    try {
      const encoder = new TextEncoder();
      const passwordData = encoder.encode(password);

      // 从存储的哈希中提取盐值和哈希值
      const combined = new Uint8Array(
        storedHash.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
      );

      if (combined.length < 48) {
        // 16字节盐值 + 32字节哈希值
        return false;
      }

      const salt = combined.slice(0, 16);
      const hash = combined.slice(16);

      // 使用相同的参数重新计算哈希
      const key = await crypto.subtle.importKey(
        "raw",
        passwordData,
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
      );

      const hashBuffer = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        key,
        256
      );

      const newHash = new Uint8Array(hashBuffer);

      // 时间安全的比较
      return this.constantTimeCompare(hash, newHash);
    } catch (error) {
      console.error("密码验证失败:", error);
      return false;
    }
  }

  // 时间安全的字节数组比较
  private constantTimeCompare(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a[i] ^ b[i];
    }

    return result === 0;
  }

  // 生成会话token
  private generateSessionToken(): string {
    return crypto.randomUUID();
  }

  // 生成refresh token
  private generateRefreshToken(): string {
    return crypto.randomUUID();
  }

  // 获取查询结果的第一行
  private async getFirstRow<T>(query: Promise<T[]>): Promise<T | undefined> {
    return query.then((rows) => rows[0]);
  }

  // 用户注册
  async register(request: RegisterRequest): Promise<User> {
    const { username, password } = request;

    // 检查用户名是否已存在
    const existingUser = await this.getFirstRow(
      this.db
        .select()
        .from(users)
        .where(eq(users.username, username))
    );

    if (existingUser) {
      throw new Error("用户名已存在");
    }

    const userId = generateId();
    const passwordHash = await this.hashPassword(password);

    await this.db.insert(users).values({
      id: userId,
      username,
      passwordHash,
    });

    return this.getUserById(userId);
  }

  // 用户名密码登录
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;

    const user = await this.getFirstRow(
      this.db
        .select()
        .from(users)
        .where(and(eq(users.username, username), eq(users.isActive, true)))
    );

    if (!user) {
      throw new Error("用户不存在或已被禁用");
    }

    const isValidPassword = await this.verifyPassword(
      password,
      user.passwordHash!
    );
    if (!isValidPassword) {
      throw new Error("密码错误");
    }

    // 创建会话
    const session = await this.createSession(user.id);

    // 创建 CSRF token
    const csrfToken = await this.csrfService.createCsrfToken(user.id);

    // 更新最后登录时间
    await this.db
      .update(users)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(users.id, user.id));

    // 返回不包含password_hash的用户信息
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      sessionToken: session.sessionToken,
      refreshToken: session.refreshToken,
      sessionExpiresAt: session.sessionExpiresAt,
      refreshExpiresAt: session.refreshExpiresAt,
      csrfToken: csrfToken,
    };
  }

  // 创建会话
  async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserSession> {
    const sessionId = generateId();
    const sessionToken = this.generateSessionToken();
    const refreshToken = this.generateRefreshToken();
    const sessionExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1小时
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天

    await this.db.insert(userSessions).values({
      id: sessionId,
      userId,
      sessionToken,
      refreshToken,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
      refreshExpiresAt: refreshExpiresAt.toISOString(),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });

    return {
      id: sessionId,
      userId,
      sessionToken,
      refreshToken,
      sessionExpiresAt: sessionExpiresAt.toISOString(),
      refreshExpiresAt: refreshExpiresAt.toISOString(),
      ipAddress,
      userAgent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // 验证会话
  async validateSession(sessionToken: string): Promise<AuthContext | null> {
    const session = await this.getFirstRow(
      this.db
        .select()
        .from(userSessions)
        .innerJoin(users, eq(userSessions.userId, users.id))
        .where(
          and(
            eq(userSessions.sessionToken, sessionToken),
            sql`${userSessions.sessionExpiresAt} > CURRENT_TIMESTAMP`,
            eq(users.isActive, true)
          )
        )
    );

    if (!session) {
      return null;
    }

    return this.buildAuthContext(session);
  }

  // 验证 refresh token
  async validateRefreshToken(
    refreshToken: string
  ): Promise<AuthContext | null> {
    const session = await this.getFirstRow(
      this.db
        .select()
        .from(userSessions)
        .innerJoin(users, eq(userSessions.userId, users.id))
        .where(
          and(
            eq(userSessions.refreshToken, refreshToken),
            sql`${userSessions.refreshExpiresAt} > CURRENT_TIMESTAMP`,
            eq(users.isActive, true)
          )
        )
    );

    if (!session) {
      return null;
    }

    return this.buildAuthContext(session);
  }

  // 构建 AuthContext 的辅助方法
  private buildAuthContext(session: SessionWithUser): AuthContext {
    const { passwordHash, ...user } = session.users;

    return { user, session: session.user_sessions };
  }

  // 刷新 session token
  async refreshSession(refreshToken: string): Promise<RefreshTokenResponse> {
    const authContext = await this.validateRefreshToken(refreshToken);
    if (!authContext) {
      throw new Error("Refresh token 无效或已过期");
    }

    // 生成新的 session token
    const newSessionToken = this.generateSessionToken();
    const newSessionExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1小时

    // 更新数据库中的 session token
    await this.db
      .update(userSessions)
      .set({
        sessionToken: newSessionToken,
        sessionExpiresAt: newSessionExpiresAt.toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userSessions.refreshToken, refreshToken));

    // 创建新的 CSRF token
    const csrfToken = await this.csrfService.createCsrfToken(
      authContext.user.id
    );

    return {
      sessionToken: newSessionToken,
      sessionExpiresAt: newSessionExpiresAt.toISOString(),
      csrfToken: csrfToken,
    };
  }

  // 验证 CSRF token
  async validateCsrfToken(userId: string, csrfToken: string): Promise<boolean> {
    return this.csrfService.validateCsrfToken(userId, csrfToken);
  }

  // 获取 CSRF token
  async getCsrfToken(userId: string): Promise<string | null> {
    return this.csrfService.getCsrfToken(userId);
  }

  // 注销会话
  async logout(sessionToken: string): Promise<void> {
    const authContext = await this.validateSession(sessionToken);
    if (authContext) {
      // 清理用户的 CSRF token
      await this.csrfService.cleanupExpiredTokens();
    }
    await this.db
      .delete(userSessions)
      .where(eq(userSessions.sessionToken, sessionToken));
  }

  // 注销所有会话（通过 refresh token）
  async logoutByRefreshToken(refreshToken: string): Promise<void> {
    const authContext = await this.validateRefreshToken(refreshToken);
    if (authContext) {
      // 清理用户的 CSRF token
      await this.csrfService.cleanupExpiredTokens();
    }
    await this.db
      .delete(userSessions)
      .where(eq(userSessions.refreshToken, refreshToken));
  }

  // 根据ID获取用户
  async getUserById(userId: string): Promise<User> {
    const user = await this.getFirstRow(
      this.db
        .select()
        .from(users)
        .where(and(eq(users.id, userId), eq(users.isActive, true)))
    );

    if (!user) {
      throw new Error("用户不存在");
    }

    // 移除 passwordHash 字段，返回用户信息
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 微信登录（简化实现）
  async wechatLogin(_code: string): Promise<LoginResponse> {
    // 这里应该实现真正的微信登录逻辑
    // 目前返回模拟数据
    throw new Error("微信登录功能暂未实现");
  }
}
