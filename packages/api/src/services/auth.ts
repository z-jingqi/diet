import { D1Database } from "@cloudflare/workers-types";
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

// 扩展User类型以包含password_hash字段（仅在内部使用）
interface UserWithPassword extends User {
  password_hash: string;
}

export class AuthService {
  private csrfService: CsrfService;

  constructor(private db: D1Database) {
    this.csrfService = new CsrfService(db);
  }

  // 密码加密（使用简单的哈希，生产环境建议使用bcrypt）
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // 验证密码
  private async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // 生成会话token
  private generateSessionToken(): string {
    return crypto.randomUUID();
  }

  // 生成refresh token
  private generateRefreshToken(): string {
    return crypto.randomUUID();
  }

  // 用户注册
  async register(request: RegisterRequest): Promise<User> {
    const { username, email, password, nickname } = request;

    // 检查用户名是否已存在
    const existingUser = await this.db
      .prepare("SELECT id FROM users WHERE username = ?")
      .bind(username)
      .first<{ id: string }>();

    if (existingUser) {
      throw new Error("用户名已存在");
    }

    // 检查邮箱是否已存在（如果提供了邮箱）
    if (email) {
      const existingEmail = await this.db
        .prepare("SELECT id FROM users WHERE email = ?")
        .bind(email)
        .first<{ id: string }>();

      if (existingEmail) {
        throw new Error("邮箱已被使用");
      }
    }

    const userId = generateId();
    const passwordHash = await this.hashPassword(password);

    const result = await this.db
      .prepare(
        `
        INSERT INTO users (id, username, email, password_hash, nickname)
        VALUES (?, ?, ?, ?, ?)
      `
      )
      .bind(userId, username, email || null, passwordHash, nickname || null)
      .run();

    if (!result.success) {
      throw new Error("注册失败");
    }

    return this.getUserById(userId);
  }

  // 用户名密码登录
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;

    const user = await this.db
      .prepare(
        `
        SELECT id, username, email, password_hash, nickname, avatar_url, phone, 
               is_active, is_verified, last_login_at, created_at, updated_at
        FROM users 
        WHERE username = ? AND is_active = true
      `
      )
      .bind(username)
      .first<UserWithPassword>();

    if (!user) {
      throw new Error("用户不存在或已被禁用");
    }

    const isValidPassword = await this.verifyPassword(
      password,
      user.password_hash
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
      .prepare(
        "UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
      )
      .bind(user.id)
      .run();

    // 返回不包含password_hash的用户信息
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      session_token: session.session_token,
      refresh_token: session.refresh_token,
      session_expires_at: session.session_expires_at,
      refresh_expires_at: session.refresh_expires_at,
      csrf_token: csrfToken,
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

    const result = await this.db
      .prepare(
        `
        INSERT INTO user_sessions (id, user_id, session_token, refresh_token, session_expires_at, refresh_expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .bind(
        sessionId,
        userId,
        sessionToken,
        refreshToken,
        sessionExpiresAt.toISOString(),
        refreshExpiresAt.toISOString(),
        ipAddress || null,
        userAgent || null
      )
      .run();

    if (!result.success) {
      throw new Error("创建会话失败");
    }

    return {
      id: sessionId,
      user_id: userId,
      session_token: sessionToken,
      refresh_token: refreshToken,
      session_expires_at: sessionExpiresAt.toISOString(),
      refresh_expires_at: refreshExpiresAt.toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // 验证会话
  async validateSession(sessionToken: string): Promise<AuthContext | null> {
    const session = await this.db
      .prepare(
        `
        SELECT s.*, u.id as user_id, u.username, u.email, u.nickname, u.avatar_url, u.phone,
               u.is_active, u.is_verified, u.last_login_at, u.created_at, u.updated_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ? AND s.session_expires_at > CURRENT_TIMESTAMP AND u.is_active = true
      `
      )
      .bind(sessionToken)
      .first<any>();

    if (!session) {
      return null;
    }

    const user: User = {
      id: session.user_id,
      username: session.username,
      email: session.email,
      nickname: session.nickname,
      avatar_url: session.avatar_url,
      phone: session.phone,
      is_active: session.is_active,
      is_verified: session.is_verified,
      last_login_at: session.last_login_at,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };

    const userSession: UserSession = {
      id: session.id,
      user_id: session.user_id,
      session_token: session.session_token,
      refresh_token: session.refresh_token,
      session_expires_at: session.session_expires_at,
      refresh_expires_at: session.refresh_expires_at,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };

    return { user, session: userSession };
  }

  // 验证 refresh token
  async validateRefreshToken(
    refreshToken: string
  ): Promise<AuthContext | null> {
    const session = await this.db
      .prepare(
        `
        SELECT s.*, u.id as user_id, u.username, u.email, u.nickname, u.avatar_url, u.phone,
               u.is_active, u.is_verified, u.last_login_at, u.created_at, u.updated_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.refresh_token = ? AND s.refresh_expires_at > CURRENT_TIMESTAMP AND u.is_active = true
      `
      )
      .bind(refreshToken)
      .first<any>();

    if (!session) {
      return null;
    }

    const user: User = {
      id: session.user_id,
      username: session.username,
      email: session.email,
      nickname: session.nickname,
      avatar_url: session.avatar_url,
      phone: session.phone,
      is_active: session.is_active,
      is_verified: session.is_verified,
      last_login_at: session.last_login_at,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };

    const userSession: UserSession = {
      id: session.id,
      user_id: session.user_id,
      session_token: session.session_token,
      refresh_token: session.refresh_token,
      session_expires_at: session.session_expires_at,
      refresh_expires_at: session.refresh_expires_at,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };

    return { user, session: userSession };
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
      .prepare(
        `
        UPDATE user_sessions 
        SET session_token = ?, session_expires_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE refresh_token = ?
      `
      )
      .bind(newSessionToken, newSessionExpiresAt.toISOString(), refreshToken)
      .run();

    // 创建新的 CSRF token
    const csrfToken = await this.csrfService.createCsrfToken(
      authContext.user.id
    );

    return {
      session_token: newSessionToken,
      session_expires_at: newSessionExpiresAt.toISOString(),
      csrf_token: csrfToken,
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
      .prepare("DELETE FROM user_sessions WHERE session_token = ?")
      .bind(sessionToken)
      .run();
  }

  // 注销所有会话（通过 refresh token）
  async logoutByRefreshToken(refreshToken: string): Promise<void> {
    const authContext = await this.validateRefreshToken(refreshToken);
    if (authContext) {
      // 清理用户的 CSRF token
      await this.csrfService.cleanupExpiredTokens();
    }
    await this.db
      .prepare("DELETE FROM user_sessions WHERE refresh_token = ?")
      .bind(refreshToken)
      .run();
  }

  // 根据ID获取用户
  async getUserById(userId: string): Promise<User> {
    const user = await this.db
      .prepare(
        `
        SELECT id, username, email, nickname, avatar_url, phone, 
               is_active, is_verified, last_login_at, created_at, updated_at
        FROM users 
        WHERE id = ? AND is_active = true
      `
      )
      .bind(userId)
      .first<User>();

    if (!user) {
      throw new Error("用户不存在");
    }

    return user;
  }

  // 微信登录（简化实现）
  async wechatLogin(_code: string): Promise<LoginResponse> {
    // 这里应该实现真正的微信登录逻辑
    // 目前返回模拟数据
    throw new Error("微信登录功能暂未实现");
  }
}
