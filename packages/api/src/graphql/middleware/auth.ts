import type { DB } from '../../db';
import { userSessions, users } from '../../db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import type { AuthContext } from '@diet/shared';

// 扩展 GraphQL 上下文类型
export interface GraphQLContext {
  db: DB;
  user?: AuthContext | null;
}

// 从请求头中提取 session token
function extractSessionToken(headers: Headers): string | null {
  // 优先从 Authorization header 获取
  const authHeader = headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 从 Cookie 中获取
  const cookieHeader = headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    return cookies['session_token'] || null;
  }
  
  return null;
}

// 验证 session token 并获取用户信息
async function validateSessionToken(db: DB, sessionToken: string): Promise<AuthContext | null> {
  try {
    // 查找有效的会话
    const [session] = await db
      .select({
        session: userSessions,
        user: users,
      })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          eq(userSessions.sessionExpiresAt, new Date().toISOString()),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    if (!session) {
      return null;
    }

    // 检查会话是否过期
    const expiresAt = new Date(session.session.sessionExpiresAt);
    if (expiresAt < new Date()) {
      return null;
    }

    // 构建 AuthContext
    return {
      user: session.user,
      session: {
        ...session.session,
        createdAt: session.session.createdAt || new Date().toISOString(),
        updatedAt: session.session.updatedAt || new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

// GraphQL 认证中间件
export async function createGraphQLContext(
  db: DB,
  headers: Headers
): Promise<GraphQLContext> {
  const sessionToken = extractSessionToken(headers);
  
  if (!sessionToken) {
    return { db, user: null };
  }

  const user = await validateSessionToken(db, sessionToken);
  
  return { db, user };
}

// 认证装饰器 - 用于需要认证的字段
export function requireAuth<T extends { user?: AuthContext | null }>(
  context: T
): AuthContext {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
}

// 可选认证装饰器 - 用于可选的认证字段
export function optionalAuth<T extends { user?: AuthContext | null }>(
  context: T
): AuthContext | null {
  return context.user || null;
} 
