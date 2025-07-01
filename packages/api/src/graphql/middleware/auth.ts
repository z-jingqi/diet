import type { AuthContext } from "../../types";

// 认证装饰器 - 用于需要认证的字段
export function requireAuth<T extends { user?: AuthContext | null }>(
  context: T
): AuthContext {
  if (!context.user) {
    throw new Error("Authentication required");
  }
  return context.user;
}

// 可选认证装饰器 - 用于可选的认证字段
export function optionalAuth<T extends { user?: AuthContext | null }>(
  context: T
): AuthContext | null {
  return context.user || null;
}
