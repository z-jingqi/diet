import { builder } from '../builder';
import { users, oauthAccounts, userSessions, csrfTokens } from '../../db/schema/auth';
import { eq, and, isNull } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';

// Drizzle model types
type UserModel = InferSelectModel<typeof users>;
type OAuthAccountModel = InferSelectModel<typeof oauthAccounts>;
type UserSessionModel = InferSelectModel<typeof userSessions>;
type CSRFTokenModel = InferSelectModel<typeof csrfTokens>;

// GraphQL User type (excluding sensitive fields)
type GraphQLUser = Omit<UserModel, 'passwordHash'>;

// ----------------------
// OAuthAccount type (defined first to avoid circular refs)
// ----------------------
export const OAuthAccountRef = builder.objectRef<OAuthAccountModel>('OAuthAccount').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    provider: t.exposeString('provider'),
    providerUserId: t.exposeString('providerUserId'),
    providerUserData: t.exposeString('providerUserData', { nullable: true }),
    accessToken: t.exposeString('accessToken', { nullable: true }),
    refreshToken: t.exposeString('refreshToken', { nullable: true }),
    expiresAt: t.exposeString('expiresAt', { nullable: true }),
    createdAt: t.exposeString('createdAt', { nullable: true }),
    updatedAt: t.exposeString('updatedAt', { nullable: true }),
  }),
});

// ----------------------
// UserSession type
// ----------------------
export const UserSessionRef = builder.objectRef<UserSessionModel>('UserSession').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    sessionToken: t.exposeString('sessionToken'),
    refreshToken: t.exposeString('refreshToken'),
    sessionExpiresAt: t.exposeString('sessionExpiresAt'),
    refreshExpiresAt: t.exposeString('refreshExpiresAt'),
    ipAddress: t.exposeString('ipAddress', { nullable: true }),
    userAgent: t.exposeString('userAgent', { nullable: true }),
    createdAt: t.exposeString('createdAt', { nullable: true }),
    updatedAt: t.exposeString('updatedAt', { nullable: true }),
  }),
});

// ----------------------
// CSRFToken type
// ----------------------
export const CSRFTokenRef = builder.objectRef<CSRFTokenModel>('CSRFToken').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    token: t.exposeString('token'),
    expiresAt: t.exposeString('expiresAt'),
    createdAt: t.exposeString('createdAt', { nullable: true }),
  }),
});

// ----------------------
// User type (GraphQL safe version)
// ----------------------
export const UserRef = builder.objectRef<GraphQLUser>('User').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    email: t.exposeString('email', { nullable: true }),
    nickname: t.exposeString('nickname', { nullable: true }),
    avatarUrl: t.exposeString('avatarUrl', { nullable: true }),
    phone: t.exposeString('phone', { nullable: true }),
    isActive: t.exposeBoolean('isActive', { nullable: true }),
    isVerified: t.exposeBoolean('isVerified', { nullable: true }),
    lastLoginAt: t.exposeString('lastLoginAt', { nullable: true }),
    createdAt: t.exposeString('createdAt', { nullable: true }),
    updatedAt: t.exposeString('updatedAt', { nullable: true }),
    
    // Relations
    oauthAccounts: t.field({
      type: [OAuthAccountRef],
      resolve: async (parent, _args, ctx) => {
        return await ctx.context.db
          .select()
          .from(oauthAccounts)
          .where(eq(oauthAccounts.userId, parent.id));
      },
    }),
    
    sessions: t.field({
      type: [UserSessionRef],
      resolve: async (parent, _args, ctx) => {
        return await ctx.context.db
          .select()
          .from(userSessions)
          .where(eq(userSessions.userId, parent.id));
      },
    }),
  }),
});

// Helper function to convert database user to GraphQL user
function toGraphQLUser(user: UserModel): GraphQLUser {
  const { passwordHash, ...graphQLUser } = user;
  return graphQLUser;
}

// Now add user relations to other types
builder.objectField(OAuthAccountRef, 'user', (t) =>
  t.field({
    type: UserRef,
    resolve: async (parent, _args, ctx) => {
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.id, parent.userId))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  })
);

builder.objectField(UserSessionRef, 'user', (t) =>
  t.field({
    type: UserRef,
    resolve: async (parent, _args, ctx) => {
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.id, parent.userId))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  })
);

builder.objectField(CSRFTokenRef, 'user', (t) =>
  t.field({
    type: UserRef,
    resolve: async (parent, _args, ctx) => {
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.id, parent.userId))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  })
);

// ----------------------
// Queries
// ----------------------
builder.queryFields((t) => ({
  // Get current user (me)
  me: t.field({
    type: UserRef,
    resolve: async (_root, _args, ctx) => {
      // 使用认证中间件获取当前用户
      const auth = requireAuth(ctx);
      
      // 从数据库重新获取用户信息，确保返回完整的数据库模型
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.id, auth.user.id))
        .limit(1);
      
      return user ? toGraphQLUser(user) : null;
    },
  }),

  // Get user by ID
  user: t.field({
    type: UserRef,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (_root, { id }, ctx) => {
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.id, id as string))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  }),

  // Get user by username
  userByUsername: t.field({
    type: UserRef,
    args: {
      username: t.arg.string({ required: true }),
    },
    resolve: async (_root, { username }, ctx) => {
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  }),

  // Get OAuth accounts for a user
  oauthAccounts: t.field({
    type: [OAuthAccountRef],
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { userId }, ctx) => {
      return await ctx.context.db
        .select()
        .from(oauthAccounts)
        .where(eq(oauthAccounts.userId, userId));
    },
  }),

  // Get user sessions
  userSessions: t.field({
    type: [UserSessionRef],
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { userId }, ctx) => {
      return await ctx.context.db
        .select()
        .from(userSessions)
        .where(eq(userSessions.userId, userId));
    },
  }),
}));

// ----------------------
// Mutations
// ----------------------
builder.mutationFields((t) => ({
  // Create new user
  createUser: t.field({
    type: UserRef,
    args: {
      username: t.arg.string({ required: true }),
      email: t.arg.string({ required: false }),
      passwordHash: t.arg.string({ required: false }),
      nickname: t.arg.string({ required: false }),
      avatarUrl: t.arg.string({ required: false }),
      phone: t.arg.string({ required: false }),
    },
    resolve: async (_root, { username, email, passwordHash, nickname, avatarUrl, phone }, ctx) => {
      const [user] = await ctx.context.db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          username,
          email: email ?? null,
          passwordHash: passwordHash ?? null,
          nickname: nickname ?? null,
          avatarUrl: avatarUrl ?? null,
          phone: phone ?? null,
        })
        .returning();
      
      return toGraphQLUser(user);
    },
  }),

  // Update user
  updateUser: t.field({
    type: UserRef,
    args: {
      id: t.arg.id({ required: true }),
      username: t.arg.string({ required: false }),
      email: t.arg.string({ required: false }),
      nickname: t.arg.string({ required: false }),
      avatarUrl: t.arg.string({ required: false }),
      phone: t.arg.string({ required: false }),
    },
    resolve: async (_root, { id, username, email, nickname, avatarUrl, phone }, ctx) => {
      const updateData: any = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (nickname !== undefined) updateData.nickname = nickname;
      if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
      if (phone !== undefined) updateData.phone = phone;
      updateData.updatedAt = new Date().toISOString();

      const [user] = await ctx.context.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id as string))
        .returning();
      
      return user ? toGraphQLUser(user) : null;
    },
  }),

  // Create OAuth account
  createOAuthAccount: t.field({
    type: OAuthAccountRef,
    args: {
      userId: t.arg.string({ required: true }),
      provider: t.arg.string({ required: true }),
      providerUserId: t.arg.string({ required: true }),
      providerUserData: t.arg.string({ required: false }),
      accessToken: t.arg.string({ required: false }),
      refreshToken: t.arg.string({ required: false }),
      expiresAt: t.arg.string({ required: false }),
    },
    resolve: async (_root, { userId, provider, providerUserId, providerUserData, accessToken, refreshToken, expiresAt }, ctx) => {
      const [account] = await ctx.context.db
        .insert(oauthAccounts)
        .values({
          id: crypto.randomUUID(),
          userId,
          provider,
          providerUserId,
          providerUserData: providerUserData ?? null,
          accessToken: accessToken ?? null,
          refreshToken: refreshToken ?? null,
          expiresAt: expiresAt ?? null,
        })
        .returning();
      
      return account;
    },
  }),

  // Create user session
  createUserSession: t.field({
    type: UserSessionRef,
    args: {
      userId: t.arg.string({ required: true }),
      sessionToken: t.arg.string({ required: true }),
      refreshToken: t.arg.string({ required: true }),
      sessionExpiresAt: t.arg.string({ required: true }),
      refreshExpiresAt: t.arg.string({ required: true }),
      ipAddress: t.arg.string({ required: false }),
      userAgent: t.arg.string({ required: false }),
    },
    resolve: async (_root, { userId, sessionToken, refreshToken, sessionExpiresAt, refreshExpiresAt, ipAddress, userAgent }, ctx) => {
      const [session] = await ctx.context.db
        .insert(userSessions)
        .values({
          id: crypto.randomUUID(),
          userId,
          sessionToken,
          refreshToken,
          sessionExpiresAt,
          refreshExpiresAt,
          ipAddress: ipAddress ?? null,
          userAgent: userAgent ?? null,
        })
        .returning();
      
      return session;
    },
  }),

  // Delete user session (logout)
  deleteUserSession: t.field({
    type: 'Boolean',
    args: {
      sessionToken: t.arg.string({ required: true }),
    },
    resolve: async (_root, { sessionToken }, ctx) => {
      const [session] = await ctx.context.db
        .delete(userSessions)
        .where(eq(userSessions.sessionToken, sessionToken))
        .returning();
      
      return !!session;
    },
  }),

  // Create CSRF token
  createCSRFToken: t.field({
    type: CSRFTokenRef,
    args: {
      userId: t.arg.string({ required: true }),
      token: t.arg.string({ required: true }),
      expiresAt: t.arg.string({ required: true }),
    },
    resolve: async (_root, { userId, token, expiresAt }, ctx) => {
      const [csrfToken] = await ctx.context.db
        .insert(csrfTokens)
        .values({
          id: crypto.randomUUID(),
          userId,
          token,
          expiresAt,
        })
        .returning();
      
      return csrfToken;
    },
  }),

  // Delete CSRF token
  deleteCSRFToken: t.field({
    type: 'Boolean',
    args: {
      token: t.arg.string({ required: true }),
    },
    resolve: async (_root, { token }, ctx) => {
      const [csrfToken] = await ctx.context.db
        .delete(csrfTokens)
        .where(eq(csrfTokens.token, token))
        .returning();
      
      return !!csrfToken;
    },
  }),

  // User registration
  register: t.field({
    type: 'String', // 返回成功消息
    args: {
      username: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, { username, password }, ctx) => {
      // 验证用户名长度
      if (username.length < 3 || username.length > 20) {
        throw new Error('用户名长度必须在3-20个字符之间');
      }

      // 验证密码长度
      if (password.length < 6) {
        throw new Error('密码长度不能少于6个字符');
      }

      // 检查用户名是否已存在
      const existingUser = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existingUser.length > 0) {
        throw new Error('用户名已存在');
      }

      // 创建用户（这里简化处理，实际应该使用 AuthService）
      const [user] = await ctx.context.db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          username,
          passwordHash: 'temp_hash', // 实际应该使用 AuthService.hashPassword
          isActive: true,
        })
        .returning();

      return '注册成功';
    },
  }),

  // User login
  login: t.field({
    type: builder.objectRef<{ user: GraphQLUser; sessionToken: string; csrfToken: string }>('LoginResponse').implement({
      fields: (t) => ({
        user: t.field({ 
          type: UserRef,
          resolve: (parent) => parent.user,
        }),
        sessionToken: t.exposeString('sessionToken'),
        csrfToken: t.exposeString('csrfToken'),
      }),
    }),
    args: {
      username: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, { username, password }, ctx) => {
      // 查找用户
      const [user] = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (!user) {
        throw new Error('用户名或密码错误');
      }

      // 验证密码（这里简化处理，实际应该使用 AuthService.verifyPassword）
      if (user.passwordHash !== 'temp_hash') {
        throw new Error('用户名或密码错误');
      }

      // 生成 session token
      const sessionToken = crypto.randomUUID();
      const refreshToken = crypto.randomUUID();
      const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24小时
      const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7天

      // 创建用户会话
      await ctx.context.db
        .insert(userSessions)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          sessionToken,
          refreshToken,
          sessionExpiresAt,
          refreshExpiresAt,
          ipAddress: null, // 暂时设为 null，后续可以从请求中获取
          userAgent: null, // 暂时设为 null，后续可以从请求中获取
        });

      // 生成 CSRF token
      const csrfToken = crypto.randomUUID();
      await ctx.context.db
        .insert(csrfTokens)
        .values({
          id: crypto.randomUUID(),
          userId: user.id,
          token: csrfToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时
        });

      // 更新最后登录时间
      await ctx.context.db
        .update(users)
        .set({ lastLoginAt: new Date().toISOString() })
        .where(eq(users.id, user.id));

      return {
        user: toGraphQLUser(user),
        sessionToken,
        csrfToken,
      };
    },
  }),

  // User logout
  logout: t.field({
    type: 'Boolean',
    resolve: async (_root, _args, ctx) => {
      // 使用认证中间件获取当前用户
      const auth = requireAuth(ctx);
      
      // 删除当前会话
      await ctx.context.db
        .delete(userSessions)
        .where(eq(userSessions.sessionToken, auth.session.sessionToken));

      // 删除相关的 CSRF tokens
      await ctx.context.db
        .delete(csrfTokens)
        .where(eq(csrfTokens.userId, auth.user.id));

      return true;
    },
  }),

  // WeChat login
  wechatLogin: t.field({
    type: builder.objectRef<{ user: GraphQLUser; sessionToken: string; csrfToken: string }>('WechatLoginResponse').implement({
      fields: (t) => ({
        user: t.field({ 
          type: UserRef,
          resolve: (parent) => parent.user,
        }),
        sessionToken: t.exposeString('sessionToken'),
        csrfToken: t.exposeString('csrfToken'),
      }),
    }),
    args: {
      code: t.arg.string({ required: true }),
    },
    resolve: async (_root, { code }, ctx) => {
      // TODO: 实现微信登录逻辑
      // 这里需要集成微信 OAuth 服务
      throw new Error('WeChat login not implemented yet');
    },
  }),

  // Refresh session token
  refreshSession: t.field({
    type: builder.objectRef<{ sessionToken: string; sessionExpiresAt: string }>('RefreshResponse').implement({
      fields: (t) => ({
        sessionToken: t.exposeString('sessionToken'),
        sessionExpiresAt: t.exposeString('sessionExpiresAt'),
      }),
    }),
    args: {
      refreshToken: t.arg.string({ required: true }),
    },
    resolve: async (_root, { refreshToken }, ctx) => {
      // 查找有效的 refresh token
      const [session] = await ctx.context.db
        .select()
        .from(userSessions)
        .where(
          and(
            eq(userSessions.refreshToken, refreshToken),
            eq(userSessions.refreshExpiresAt, new Date().toISOString())
          )
        )
        .limit(1);

      if (!session) {
        throw new Error('Invalid or expired refresh token');
      }

      // 检查 refresh token 是否过期
      const expiresAt = new Date(session.refreshExpiresAt);
      if (expiresAt < new Date()) {
        throw new Error('Refresh token has expired');
      }

      // 生成新的 session token
      const newSessionToken = crypto.randomUUID();
      const newSessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24小时

      // 更新会话
      await ctx.context.db
        .update(userSessions)
        .set({
          sessionToken: newSessionToken,
          sessionExpiresAt: newSessionExpiresAt,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(userSessions.id, session.id));

      return {
        sessionToken: newSessionToken,
        sessionExpiresAt: newSessionExpiresAt,
      };
    },
  }),

  // Check username availability
  checkUsername: t.field({
    type: 'Boolean',
    args: {
      username: t.arg.string({ required: true }),
    },
    resolve: async (_root, { username }, ctx) => {
      // 验证用户名长度
      if (username.length < 3 || username.length > 20) {
        throw new Error('用户名长度必须在3-20个字符之间');
      }

      const existingUser = await ctx.context.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      return existingUser.length === 0; // 返回 true 表示用户名可用
    },
  }),
})); 
