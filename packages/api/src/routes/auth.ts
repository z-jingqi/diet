import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { AuthService } from '../services/auth';
import { LoginRequest, RegisterRequest, WechatLoginRequest } from '@diet/shared';
import { Bindings } from '../types/bindings';

const auth = new Hono<{ Bindings: Bindings }>();

// 用户注册
auth.post("/register", async (c) => {
  try {
    const body = await c.req.json() as RegisterRequest;
    
    // 验证必填字段
    if (!body.username || !body.password) {
      return c.json({ success: false, message: '用户名和密码不能为空' }, 400);
    }

    // 验证用户名长度
    if (body.username.length < 3 || body.username.length > 20) {
      return c.json({ success: false, message: '用户名长度必须在3-20个字符之间' }, 400);
    }

    // 验证密码长度
    if (body.password.length < 6) {
      return c.json({ success: false, message: '密码长度不能少于6个字符' }, 400);
    }

    const authService = new AuthService(c.env.DB);
    const user = await authService.register(body);
    
    // 注册成功后创建会话
    const session = await authService.createSession(user.id);
    
    // 设置 httpOnly cookie
    setCookie(c, 'session_token', session.session_token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      secure: true,
      expires: new Date(session.session_expires_at)
    });
    
    return c.json({
      success: true,
      message: '注册成功',
      user
    }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : '注册失败';
    return c.json({ success: false, message }, 400);
  }
});

// 用户登录
auth.post("/login", async (c) => {
  try {
    const body = await c.req.json() as LoginRequest;
    
    // 验证必填字段
    if (!body.username || !body.password) {
      return c.json({ success: false, message: '用户名和密码不能为空' }, 400);
    }

    const authService = new AuthService(c.env.DB);
    const { user, session_token, refresh_token, session_expires_at, refresh_expires_at } = await authService.login(body);
    
    // 设置 httpOnly cookie
    setCookie(c, 'session_token', session_token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      secure: true,
      expires: new Date(session_expires_at)
    });
    setCookie(c, 'refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      secure: true,
      expires: new Date(refresh_expires_at)
    });
    
    return c.json({
      success: true,
      message: '登录成功',
      user
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败';
    return c.json({ success: false, message }, 401);
  }
});

// 微信登录
auth.post("/wechat-login", async (c) => {
  try {
    const body = await c.req.json() as WechatLoginRequest;
    
    if (!body.code) {
      return c.json({ success: false, message: '微信授权码不能为空' }, 400);
    }

    const authService = new AuthService(c.env.DB);
    const { user, session_token } = await authService.wechatLogin(body.code);
    
    // 设置 httpOnly cookie
    c.header('Set-Cookie', `session_token=${session_token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
    
    return c.json({
      success: true,
      message: '微信登录成功',
      user
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '微信登录失败';
    return c.json({ success: false, message }, 400);
  }
});

// 刷新 session token
auth.post('/refresh', async (c) => {
  const refreshToken = getCookie(c, 'refresh_token');
  if (!refreshToken) {
    return c.json({ error: '未提供 refresh token' }, 401);
  }
  const authService = new AuthService(c.env.DB);
  try {
    const { session_token, session_expires_at } = await authService.refreshSession(refreshToken);
    setCookie(c, 'session_token', session_token, {
      httpOnly: true,
      sameSite: 'Lax',
      path: '/',
      secure: true,
      expires: new Date(session_expires_at)
    });
    return c.json({ session_token, session_expires_at });
  } catch {
    // refresh token 失效，清除 cookie
    deleteCookie(c, 'session_token');
    deleteCookie(c, 'refresh_token');
    return c.json({ error: 'refresh token 无效或已过期' }, 401);
  }
});

// 用户注销
auth.post("/logout", async (c) => {
  const sessionToken = getCookie(c, 'session_token');
  const refreshToken = getCookie(c, 'refresh_token');
  const authService = new AuthService(c.env.DB);
  if (sessionToken) {
    await authService.logout(sessionToken);
  }
  if (refreshToken) {
    await authService.logoutByRefreshToken(refreshToken);
  }
  deleteCookie(c, 'session_token');
  deleteCookie(c, 'refresh_token');
  return c.json({ success: true });
});

// 获取当前用户信息
auth.get("/me", async (c) => {
  const sessionToken = getCookie(c, 'session_token');
  if (!sessionToken) {
    return c.json({ error: '未登录' }, 401);
  }
  const authService = new AuthService(c.env.DB);
  const authContext = await authService.validateSession(sessionToken);
  if (!authContext) {
    return c.json({ error: '登录已过期' }, 401);
  }
  return c.json({ user: authContext.user });
});

export default auth; 