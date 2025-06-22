import { D1Database } from '@cloudflare/workers-types';
import { User, UserSession, LoginRequest, RegisterRequest, LoginResponse, AuthContext } from '@diet/shared';
import { generateId } from '../utils/id';

// 扩展User类型以包含password_hash字段（仅在内部使用）
interface UserWithPassword extends User {
  password_hash: string;
}

export class AuthService {
  constructor(private db: D1Database) {}

  // 密码加密（使用简单的哈希，生产环境建议使用bcrypt）
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // 验证密码
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  // 生成会话token
  private generateSessionToken(): string {
    return crypto.randomUUID();
  }

  // 用户注册
  async register(request: RegisterRequest): Promise<User> {
    const { username, email, password, nickname } = request;

    // 检查用户名是否已存在
    const existingUser = await this.db
      .prepare('SELECT id FROM users WHERE username = ?')
      .bind(username)
      .first<{ id: string }>();

    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 检查邮箱是否已存在（如果提供了邮箱）
    if (email) {
      const existingEmail = await this.db
        .prepare('SELECT id FROM users WHERE email = ?')
        .bind(email)
        .first<{ id: string }>();

      if (existingEmail) {
        throw new Error('邮箱已被使用');
      }
    }

    const userId = generateId();
    const passwordHash = await this.hashPassword(password);

    const result = await this.db
      .prepare(`
        INSERT INTO users (id, username, email, password_hash, nickname)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(userId, username, email || null, passwordHash, nickname || null)
      .run();

    if (!result.success) {
      throw new Error('注册失败');
    }

    return this.getUserById(userId);
  }

  // 用户名密码登录
  async login(request: LoginRequest): Promise<LoginResponse> {
    const { username, password } = request;

    const user = await this.db
      .prepare(`
        SELECT id, username, email, password_hash, nickname, avatar_url, phone, 
               is_active, is_verified, last_login_at, created_at, updated_at
        FROM users 
        WHERE username = ? AND is_active = true
      `)
      .bind(username)
      .first<UserWithPassword>();

    if (!user) {
      throw new Error('用户不存在或已被禁用');
    }

    const isValidPassword = await this.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('密码错误');
    }

    // 创建会话
    const session = await this.createSession(user.id);

    // 更新最后登录时间
    await this.db
      .prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(user.id)
      .run();

    // 返回不包含password_hash的用户信息
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      session_token: session.session_token,
      expires_at: session.expires_at
    };
  }

  // 创建会话
  async createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<UserSession> {
    const sessionId = generateId();
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天

    const result = await this.db
      .prepare(`
        INSERT INTO user_sessions (id, user_id, session_token, expires_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(sessionId, userId, sessionToken, expiresAt.toISOString(), ipAddress || null, userAgent || null)
      .run();

    if (!result.success) {
      throw new Error('创建会话失败');
    }

    return {
      id: sessionId,
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    };
  }

  // 验证会话
  async validateSession(sessionToken: string): Promise<AuthContext | null> {
    const session = await this.db
      .prepare(`
        SELECT s.*, u.id as user_id, u.username, u.email, u.nickname, u.avatar_url, u.phone,
               u.is_active, u.is_verified, u.last_login_at, u.created_at, u.updated_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = ? AND s.expires_at > CURRENT_TIMESTAMP AND u.is_active = true
      `)
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
      updated_at: session.updated_at
    };

    const userSession: UserSession = {
      id: session.id,
      user_id: session.user_id,
      session_token: session.session_token,
      expires_at: session.expires_at,
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      created_at: session.created_at
    };

    return { user, session: userSession };
  }

  // 注销会话
  async logout(sessionToken: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM user_sessions WHERE session_token = ?')
      .bind(sessionToken)
      .run();
  }

  // 根据ID获取用户
  async getUserById(userId: string): Promise<User> {
    const user = await this.db
      .prepare(`
        SELECT id, username, email, nickname, avatar_url, phone, 
               is_active, is_verified, last_login_at, created_at, updated_at
        FROM users 
        WHERE id = ?
      `)
      .bind(userId)
      .first<User>();

    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  }

  // 微信登录（需要实现微信OAuth逻辑）
  async wechatLogin(_code: string): Promise<LoginResponse> {
    // TODO: 实现微信OAuth登录逻辑
    // 1. 使用code获取微信access_token
    // 2. 获取用户信息
    // 3. 查找或创建用户
    // 4. 创建会话
    throw new Error('微信登录功能待实现');
  }
} 