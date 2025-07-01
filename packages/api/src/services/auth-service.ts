import type { DB } from "../db";
import { users, user_sessions } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateId } from "../utils/id";
import type {
  User,
  UserSession,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  AuthContext,
  RefreshTokenResponse,
} from "../types";

type SessionWithUser = {
  users: typeof users.$inferSelect;
  user_sessions: typeof user_sessions.$inferSelect;
};

export class AuthService {
  constructor(private db: DB) {}

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
      this.db.select().from(users).where(eq(users.username, username))
    );

    if (existingUser) {
      throw new Error("用户名已存在");
    }

    const userId = generateId();
    const passwordHash = await this.hashPassword(password);

    await this.db.insert(users).values({
      id: userId,
      username,
      password_hash: passwordHash,
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
        .where(and(eq(users.username, username), eq(users.is_active, true)))
    );

    if (!user) {
      throw new Error("用户不存在或已被禁用");
    }

    const isValidPassword = await this.verifyPassword(
      password,
      user.password_hash!
    );

    if (!isValidPassword) {
      throw new Error("密码错误");
    }

    // 创建会话
    const session = await this.createSession(user.id);

    // 生成 CSRF token（无状态）
    const csrfToken = this.generateCsrfToken();

    // 更新最后登录时间
    await this.db
      .update(users)
      .set({ last_login_at: new Date().toISOString() })
      .where(eq(users.id, user.id));

    return {
      user: this.mapUserToResponse(user),
      sessionToken: session.sessionToken,
      csrfToken,
    };
  }

  // 创建用户会话
  async createSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<UserSession> {
    const sessionToken = this.generateSessionToken();
    const refreshToken = this.generateRefreshToken();
    const sessionExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString(); // 24小时
    const refreshExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(); // 7天

    const [session] = await this.db
      .insert(user_sessions)
      .values({
        id: generateId(),
        user_id: userId,
        session_token: sessionToken,
        refresh_token: refreshToken,
        session_expires_at: sessionExpiresAt,
        refresh_expires_at: refreshExpiresAt,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      })
      .returning();

    return {
      id: session.id,
      userId: session.user_id,
      sessionToken: session.session_token,
      refreshToken: session.refresh_token,
      sessionExpiresAt: session.session_expires_at,
      refreshExpiresAt: session.refresh_expires_at,
      ipAddress: session.ip_address || null,
      userAgent: session.user_agent || null,
      createdAt: session.created_at || null,
      updatedAt: session.updated_at || null,
    };
  }

  // 验证会话token
  async validateSession(sessionToken: string): Promise<AuthContext | null> {
    const session = await this.getFirstRow(
      this.db
        .select({
          users: users,
          user_sessions: user_sessions,
        })
        .from(user_sessions)
        .innerJoin(users, eq(user_sessions.user_id, users.id))
        .where(
          and(
            eq(user_sessions.session_token, sessionToken),
            sql`${user_sessions.session_expires_at} > CURRENT_TIMESTAMP`
          )
        )
    );

    if (!session) {
      return null;
    }

    return this.buildAuthContext(session);
  }

  // 验证refresh token
  async validateRefreshToken(
    refreshToken: string
  ): Promise<AuthContext | null> {
    const session = await this.getFirstRow(
      this.db
        .select({
          users: users,
          user_sessions: user_sessions,
        })
        .from(user_sessions)
        .innerJoin(users, eq(user_sessions.user_id, users.id))
        .where(
          and(
            eq(user_sessions.refresh_token, refreshToken),
            sql`${user_sessions.refresh_expires_at} > CURRENT_TIMESTAMP`
          )
        )
    );

    if (!session) {
      return null;
    }

    return this.buildAuthContext(session);
  }

  // 构建认证上下文
  private buildAuthContext(session: SessionWithUser): AuthContext {
    return {
      user: this.mapUserToResponse(session.users),
      session: {
        id: session.user_sessions.id,
        userId: session.user_sessions.user_id,
        sessionToken: session.user_sessions.session_token,
        refreshToken: session.user_sessions.refresh_token,
        sessionExpiresAt: session.user_sessions.session_expires_at,
        refreshExpiresAt: session.user_sessions.refresh_expires_at,
        ipAddress: session.user_sessions.ip_address || null,
        userAgent: session.user_sessions.user_agent || null,
        createdAt: session.user_sessions.created_at || null,
        updatedAt: session.user_sessions.updated_at || null,
      },
    };
  }

  // 刷新会话
  async refreshSession(refreshToken: string): Promise<RefreshTokenResponse> {
    const session = await this.getFirstRow(
      this.db
        .select()
        .from(user_sessions)
        .where(eq(user_sessions.refresh_token, refreshToken))
    );

    if (!session) {
      throw new Error("Invalid refresh token");
    }

    // 检查refresh token是否过期
    const expiresAt = new Date(session.refresh_expires_at);
    if (expiresAt < new Date()) {
      throw new Error("Refresh token has expired");
    }

    // 生成新的session token
    const newSessionToken = this.generateSessionToken();
    const newSessionExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString(); // 24小时

    // 更新会话
    await this.db
      .update(user_sessions)
      .set({
        session_token: newSessionToken,
        session_expires_at: newSessionExpiresAt,
        updated_at: new Date().toISOString(),
      })
      .where(eq(user_sessions.id, session.id));

    // 生成新的 CSRF token
    const csrfToken = this.generateCsrfToken();

    return {
      sessionToken: newSessionToken,
      sessionExpiresAt: newSessionExpiresAt,
      csrfToken,
    };
  }

  // 生成 CSRF token（无需持久化）
  private generateCsrfToken(): string {
    return crypto.randomUUID();
  }

  // 登出（删除会话）
  async logout(sessionToken: string): Promise<void> {
    await this.db
      .delete(user_sessions)
      .where(eq(user_sessions.session_token, sessionToken));
  }

  // 通过refresh token登出
  async logoutByRefreshToken(refreshToken: string): Promise<void> {
    await this.db
      .delete(user_sessions)
      .where(eq(user_sessions.refresh_token, refreshToken));
  }

  // 根据ID获取用户
  async getUserById(userId: string): Promise<User> {
    const user = await this.getFirstRow(
      this.db.select().from(users).where(eq(users.id, userId))
    );

    if (!user) {
      throw new Error("用户不存在");
    }

    return this.mapUserToResponse(user);
  }

  // 微信登录（待实现）
  async wechatLogin(_code: string): Promise<LoginResponse> {
    // TODO: 实现微信登录逻辑
    throw new Error("WeChat login not implemented yet");
  }

  // 检查用户名是否存在
  async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.getFirstRow(
      this.db.select().from(users).where(eq(users.username, username))
    );
    return !!user;
  }

  // 将数据库用户映射为响应格式
  private mapUserToResponse(user: typeof users.$inferSelect): User {
    return {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      nickname: user.nickname || undefined,
      avatarUrl: user.avatar_url || undefined,
      phone: user.phone || undefined,
      isActive: user.is_active || false,
      isVerified: user.is_verified || false,
      lastLoginAt: user.last_login_at || undefined,
      createdAt: user.created_at || undefined,
      updatedAt: user.updated_at || undefined,
    };
  }

  // 以下方法在无状态 CSRF 策略下不再需要，但保留空实现以兼容旧调用
  async validateCsrfToken(
    _userId: string,
    _csrfToken: string
  ): Promise<boolean> {
    // 始终返回 true，因为验证交由中间件等值比较
    return true;
  }

  async getCsrfToken(_userId: string): Promise<string | null> {
    return null;
  }
}
