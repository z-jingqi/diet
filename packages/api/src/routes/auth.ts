import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { createDB } from "../db";
import type { Bindings } from "../types/bindings";
import { AuthService } from "../services/auth-service";

// REST routes under /auth
const auth = new Hono<{ Bindings: Bindings }>();

// POST /auth/refresh – refresh session & csrf tokens using refresh_token cookie (or body)
auth.post("/refresh", async (c) => {
  try {
    // 1. 获取 refresh token，优先 body，其次 cookie
    let refreshToken: string | undefined;

    if (c.req.header("content-type")?.includes("application/json")) {
      try {
        const body = await c.req.json();
        if (body && typeof body.refreshToken === "string") {
          refreshToken = body.refreshToken;
        }
      } catch {
        // ignore parse error – fallback to cookie
      }
    }

    if (!refreshToken) {
      refreshToken = getCookie(c, "refresh_token") ?? undefined;
    }

    if (!refreshToken) {
      return c.json({ error: "Refresh token not provided" }, 400);
    }

    // 2. 刷新 session
    const db = createDB(c.env.DB);
    const authService = new AuthService(db, c.env);
    const result = await authService.refreshSession(refreshToken);

    // 3. 写入新的 cookies（与 issueLoginResponse 保持一致）
    const secureAttr = process.env.NODE_ENV === "production" ? "Secure" : "";
    const setCookies: string[] = [];

    if (result.sessionToken) {
      setCookies.push(
        [
          `session_token=${result.sessionToken}`,
          "Path=/",
          "HttpOnly",
          secureAttr,
          "SameSite=Lax",
          "Max-Age=604800", // 7 天
        ]
          .filter(Boolean)
          .join("; "),
      );
    }

    if (result.csrfToken) {
      setCookies.push(
        [
          `csrf-token=${result.csrfToken}`,
          "Path=/",
          secureAttr,
          "SameSite=Lax",
          "Max-Age=604800",
        ]
          .filter(Boolean)
          .join("; "),
      );
    }

    for (const ck of setCookies) {
      c.header("Set-Cookie", ck, { append: true });
    }

    return c.json({
      session_token: result.sessionToken,
      session_expires_at: result.sessionExpiresAt,
      csrf_token: result.csrfToken,
    });
  } catch (err) {
    console.error("Refresh token error", err);
    return c.json({ error: "Failed to refresh session" }, 500);
  }
});

export default auth;
