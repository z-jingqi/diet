import type { DB } from "../db";
import { user_sessions, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import type { AuthContext, GraphQLContext } from "../types";
import type { Bindings } from "../types/bindings";

// Services are created per-request to avoid connection/state sharing
export type { GraphQLContext };

// ----- helpers -------------------------------------------------------------
function extractSessionToken(headers: Headers): string | null {
  const authHeader = headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const cookieHeader = headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader
      .split(";")
      .reduce<Record<string, string>>((acc, cookie) => {
        const [k, v] = cookie.trim().split("=");
        acc[k] = v;
        return acc;
      }, {});
    return cookies["session_token"] ?? null;
  }
  return null;
}

async function validateSessionToken(
  db: DB,
  sessionToken: string
): Promise<AuthContext | null> {
  try {
    const [session] = await db
      .select({ session: user_sessions, user: users })
      .from(user_sessions)
      .innerJoin(users, eq(user_sessions.user_id, users.id))
      .where(and(eq(user_sessions.session_token, sessionToken)))
      .limit(1);

    if (!session) return null;

    const expires = new Date(session.session.session_expires_at);
    if (expires < new Date()) return null;

    return {
      user: {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email || null,
        nickname: session.user.nickname || null,
        avatarUrl: session.user.avatar_url || null,
        phone: session.user.phone || null,
        isActive: session.user.is_active || false,
        isVerified: session.user.is_verified || false,
        lastLoginAt: session.user.last_login_at || null,
        createdAt: session.user.created_at || null,
        updatedAt: session.user.updated_at || null,
      },
      session: {
        id: session.session.id,
        userId: session.user.id,
        sessionToken: session.session.session_token,
        refreshToken: session.session.refresh_token,
        sessionExpiresAt: session.session.session_expires_at,
        refreshExpiresAt: session.session.refresh_expires_at,
        ipAddress: session.session.ip_address || null,
        userAgent: session.session.user_agent || null,
        createdAt: session.session.created_at || null,
        updatedAt: session.session.updated_at || null,
      },
    };
  } catch (err) {
    console.error("Session validation error", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
export async function createGraphQLContext(
  db: DB,
  headers: Headers,
  env: Bindings
): Promise<GraphQLContext> {
  const sessionToken = extractSessionToken(headers);

  const { AuthService } = await import("../services/auth-service");
  const { ChatService } = await import("../services/chat-service");
  const { TagService } = await import("../services/tag-service");

  const services = {
    auth: new AuthService(db, env),
    chat: new ChatService(db),
    tag: new TagService(db),
  } as const;

  if (!sessionToken) {
    return { db, user: null, responseCookies: [], headers, services };
  }

  const user = await validateSessionToken(db, sessionToken);
  return { db, user, responseCookies: [], headers, services };
}
