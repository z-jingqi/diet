import { builder } from "../builder";
import { users, oauth_accounts, user_sessions } from "../../db/schema/auth";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

// Drizzle model types
type UserModel = InferSelectModel<typeof users>;
type OAuthAccountModel = InferSelectModel<typeof oauth_accounts>;
type UserSessionModel = InferSelectModel<typeof user_sessions>;

// GraphQL User type (excluding sensitive fields)
type GraphQLUser = Omit<UserModel, "password_hash">;

// ----------------------
// OAuthAccount type (defined first to avoid circular refs)
// ----------------------
export const OAuthAccountRef = builder
  .objectRef<OAuthAccountModel>("OAuthAccount")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      provider: t.exposeString("provider"),
      providerUserId: t.exposeString("provider_user_id"),
      providerUserData: t.exposeString("provider_user_data", {
        nullable: true,
      }),
      accessToken: t.exposeString("access_token", { nullable: true }),
      refreshToken: t.exposeString("refresh_token", { nullable: true }),
      expiresAt: t.expose("expires_at", { type: "DateTime", nullable: true }),
      createdAt: t.expose("created_at", { type: "DateTime", nullable: true }),
      updatedAt: t.expose("updated_at", { type: "DateTime", nullable: true }),
    }),
  });

// ----------------------
// UserSession type
// ----------------------
export const UserSessionRef = builder
  .objectRef<UserSessionModel>("UserSession")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      sessionToken: t.exposeString("session_token"),
      refreshToken: t.exposeString("refresh_token"),
      sessionExpiresAt: t.expose("session_expires_at", { type: "DateTime" }),
      refreshExpiresAt: t.expose("refresh_expires_at", { type: "DateTime" }),
      ipAddress: t.exposeString("ip_address", { nullable: true }),
      userAgent: t.exposeString("user_agent", { nullable: true }),
      createdAt: t.expose("created_at", { type: "DateTime", nullable: true }),
      updatedAt: t.expose("updated_at", { type: "DateTime", nullable: true }),
    }),
  });

// ----------------------
// User type (GraphQL safe version)
// ----------------------
export const UserRef = builder.objectRef<GraphQLUser>("User").implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    username: t.exposeString("username"),
    email: t.exposeString("email", { nullable: true }),
    nickname: t.exposeString("nickname", { nullable: true }),
    avatarUrl: t.exposeString("avatar_url", { nullable: true }),
    phone: t.exposeString("phone", { nullable: true }),
    isActive: t.exposeBoolean("is_active", { nullable: true }),
    isVerified: t.exposeBoolean("is_verified", { nullable: true }),
    lastLoginAt: t.expose("last_login_at", {
      type: "DateTime",
      nullable: true,
    }),
    createdAt: t.expose("created_at", { type: "DateTime", nullable: true }),
    updatedAt: t.expose("updated_at", { type: "DateTime", nullable: true }),

    // Relations
    oauthAccounts: t.field({
      type: [OAuthAccountRef],
      resolve: async (parent, _args, ctx) => {
        return await ctx.db
          .select()
          .from(oauth_accounts)
          .where(eq(oauth_accounts.user_id, parent.id));
      },
    }),

    sessions: t.field({
      type: [UserSessionRef],
      resolve: async (parent, _args, ctx) => {
        return await ctx.db
          .select()
          .from(user_sessions)
          .where(eq(user_sessions.user_id, parent.id));
      },
    }),
  }),
});

// Helper function to convert database user to GraphQL user
function toGraphQLUser(user: UserModel): GraphQLUser {
  const { password_hash, ...graphQLUser } = user;
  return graphQLUser;
}

// Now add user relations to other types
builder.objectField(OAuthAccountRef, "user", (t) =>
  t.field({
    type: UserRef,
    resolve: async (parent, _args, ctx) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, parent.user_id))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  })
);

builder.objectField(UserSessionRef, "user", (t) =>
  t.field({
    type: UserRef,
    resolve: async (parent, _args, ctx) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, parent.user_id))
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
      const [user] = await ctx.db
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
      const [user] = await ctx.db
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
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return user ? toGraphQLUser(user) : null;
    },
  }),

  // Get user sessions
  userSessions: t.field({
    type: [UserSessionRef],
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { userId }, ctx) => {
      return await ctx.db
        .select()
        .from(user_sessions)
        .where(eq(user_sessions.user_id, userId));
    },
  }),

  // Get OAuth accounts
  oauthAccounts: t.field({
    type: [OAuthAccountRef],
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (_root, { userId }, ctx) => {
      return await ctx.db
        .select()
        .from(oauth_accounts)
        .where(eq(oauth_accounts.user_id, userId));
    },
  }),
}));

// ----------------------
// Additional response types for authentication flow
// ----------------------

interface LoginResponse {
  user: GraphQLUser | null;
  sessionToken?: string | null;
  csrfToken?: string | null;
}

interface RefreshResponse {
  sessionToken?: string | null;
  sessionExpiresAt?: string | null;
}

// LoginResponse GraphQL type
export const LoginResponseRef = builder
  .objectRef<LoginResponse>("LoginResponse")
  .implement({
    fields: (t) => ({
      user: t.field({
        type: UserRef,
        nullable: true,
        resolve: (parent) => parent.user,
      }),
      sessionToken: t.exposeString("sessionToken", { nullable: true }),
      csrfToken: t.exposeString("csrfToken", { nullable: true }),
    }),
  });

// RefreshResponse GraphQL type
export const RefreshResponseRef = builder
  .objectRef<RefreshResponse>("RefreshResponse")
  .implement({
    fields: (t) => ({
      sessionToken: t.exposeString("sessionToken", { nullable: true }),
      sessionExpiresAt: t.expose("sessionExpiresAt", {
        type: "DateTime",
        nullable: true,
      }),
    }),
  });

// ----------------------
// Helper: set cookies & build LoginResponse
// ----------------------
function issueLoginResponse(ctx: any, result: any) {
  const secure = process.env.NODE_ENV === "production" ? "Secure" : "";

  if (result.sessionToken) {
    ctx.responseCookies.push(
      [
        `session_token=${result.sessionToken}`,
        "Path=/",
        "HttpOnly",
        secure,
        "SameSite=Lax",
        "Max-Age=604800", // 7 天
      ]
        .filter(Boolean)
        .join("; ")
    );
  }

  if (result.refreshToken) {
    ctx.responseCookies.push(
      [
        `refresh_token=${result.refreshToken}`,
        "Path=/",
        "HttpOnly",
        secure,
        "SameSite=Lax",
        "Max-Age=2592000", // 30 天
      ]
        .filter(Boolean)
        .join("; ")
    );
  }

  if (result.csrfToken) {
    ctx.responseCookies.push(
      [`csrf-token=${result.csrfToken}`, "Path=/", secure, "SameSite=Lax"]
        .filter(Boolean)
        .join("; ")
    );
  }

  return {
    user: result.user
      ? (toGraphQLUser(result.user as any) as GraphQLUser)
      : null,
    sessionToken: result.sessionToken,
    csrfToken: result.csrfToken,
  };
}

// ----------------------
// Mutations
// ----------------------
builder.mutationFields((t) => ({
  // Create user
  createUser: t.field({
    type: UserRef,
    args: {
      username: t.arg.string({ required: true }),
      email: t.arg.string(),
      passwordHash: t.arg.string(),
      nickname: t.arg.string(),
      avatarUrl: t.arg.string(),
      phone: t.arg.string(),
    },
    resolve: async (_root, args, ctx) => {
      const { generateId } = await import("../../utils/id");
      const userId = generateId();

      const [user] = await ctx.db
        .insert(users)
        .values({
          id: userId,
          username: args.username,
          email: args.email || null,
          password_hash: args.passwordHash || null,
          nickname: args.nickname || null,
          avatar_url: args.avatarUrl || null,
          phone: args.phone || null,
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
      username: t.arg.string(),
      email: t.arg.string(),
      nickname: t.arg.string(),
      avatarUrl: t.arg.string(),
      phone: t.arg.string(),
    },
    resolve: async (_root, args, ctx) => {
      const updateData: any = {};
      if (args.username !== undefined) updateData.username = args.username;
      if (args.email !== undefined) updateData.email = args.email;
      if (args.nickname !== undefined) updateData.nickname = args.nickname;
      if (args.avatarUrl !== undefined) updateData.avatar_url = args.avatarUrl;
      if (args.phone !== undefined) updateData.phone = args.phone;

      const [user] = await ctx.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, args.id as string))
        .returning();

      return user ? toGraphQLUser(user) : null;
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
      ipAddress: t.arg.string(),
      userAgent: t.arg.string(),
    },
    resolve: async (_root, args, ctx) => {
      const { generateId } = await import("../../utils/id");
      const sessionId = generateId();

      const [session] = await ctx.db
        .insert(user_sessions)
        .values({
          id: sessionId,
          user_id: args.userId,
          session_token: args.sessionToken,
          refresh_token: args.refreshToken,
          session_expires_at: args.sessionExpiresAt,
          refresh_expires_at: args.refreshExpiresAt,
          ip_address: args.ipAddress || null,
          user_agent: args.userAgent || null,
        })
        .returning();

      return session;
    },
  }),

  // Delete user session
  deleteUserSession: t.field({
    type: "Boolean",
    args: {
      sessionToken: t.arg.string({ required: true }),
    },
    resolve: async (_root, { sessionToken }, ctx) => {
      await ctx.db
        .delete(user_sessions)
        .where(eq(user_sessions.session_token, sessionToken));
      return true;
    },
  }),

  // Create OAuth account
  createOAuthAccount: t.field({
    type: OAuthAccountRef,
    args: {
      userId: t.arg.string({ required: true }),
      provider: t.arg.string({ required: true }),
      providerUserId: t.arg.string({ required: true }),
      providerUserData: t.arg.string(),
      accessToken: t.arg.string(),
      refreshToken: t.arg.string(),
      expiresAt: t.arg.string(),
    },
    resolve: async (_root, args, ctx) => {
      const { generateId } = await import("../../utils/id");
      const oauthId = generateId();

      const [oauthAccount] = await ctx.db
        .insert(oauth_accounts)
        .values({
          id: oauthId,
          user_id: args.userId,
          provider: args.provider,
          provider_user_id: args.providerUserId,
          provider_user_data: args.providerUserData || null,
          access_token: args.accessToken || null,
          refresh_token: args.refreshToken || null,
          expires_at: args.expiresAt || null,
        })
        .returning();

      return oauthAccount;
    },
  }),

  // ----------------------
  // Authentication mutations compatible with client
  // ----------------------

  register: t.field({
    type: LoginResponseRef,
    args: {
      username: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, { username, password }, ctx) => {
      // 1. 创建用户
      await ctx.services.auth.register({ username, password });

      // 2. 直接登录获取 session & tokens
      const result = await ctx.services.auth.login({ username, password });

      return issueLoginResponse(ctx, result);
    },
  }),

  login: t.field({
    type: LoginResponseRef,
    args: {
      username: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, { username, password }, ctx) => {
      const result = await ctx.services.auth.login({ username, password });
      return issueLoginResponse(ctx, result);
    },
  }),

  logout: t.field({
    type: "Boolean",
    resolve: async (_root, _args, ctx) => {
      const auth = requireAuth(ctx);
      await ctx.services.auth.logout(auth.session.sessionToken);

      // Clear cookie
      ctx.responseCookies.push(
        [
          "session_token=",
          "Path=/",
          "HttpOnly",
          "Secure",
          "SameSite=Lax",
          "Max-Age=0",
        ].join("; ")
      );

      return true;
    },
  }),

  refreshSession: t.field({
    type: RefreshResponseRef,
    args: {
      refreshToken: t.arg.string(), // optional, fallback to cookie
    },
    resolve: async (_root, { refreshToken }, ctx) => {
      let token = refreshToken;
      if (!token) {
        // try from cookie
        const cookieHeader = ctx.headers.get("cookie") || "";
        const cookieMap = Object.fromEntries(
          cookieHeader.split(";").map((c: string) => {
            const [k, v] = c.trim().split("=");
            return [k, v];
          })
        );
        token = cookieMap["refresh_token"];
      }

      if (!token) {
        throw new Error("Refresh token not provided");
      }

      const result = await ctx.services.auth.refreshSession(token);

      // Set new cookies
      const secure2 = process.env.NODE_ENV === "production" ? "Secure" : "";

      if (result.sessionToken) {
        ctx.responseCookies.push(
          [
            `session_token=${result.sessionToken}`,
            "Path=/",
            "HttpOnly",
            secure2,
            "SameSite=Lax",
            "Max-Age=604800", // 7 天
          ]
            .filter(Boolean)
            .join("; ")
        );
      }

      if (result.csrfToken) {
        ctx.responseCookies.push(
          [`csrf-token=${result.csrfToken}`, "Path=/", secure2, "SameSite=Lax"]
            .filter(Boolean)
            .join("; ")
        );
      }

      return result;
    },
  }),

  wechatLogin: t.field({
    type: LoginResponseRef,
    args: {
      code: t.arg.string({ required: true }),
    },
    resolve: async (_root, { code }, ctx) => {
      const result = await ctx.services.auth.wechatLogin(code);
      return {
        ...result,
        user: result.user
          ? (toGraphQLUser(result.user as any) as GraphQLUser)
          : null,
      };
    },
  }),
}));
