import { Hono } from "hono";
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
    const loginResponse = await authService.login(body);
    
    return c.json({
      success: true,
      message: '登录成功',
      ...loginResponse
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
    const loginResponse = await authService.wechatLogin(body.code);
    
    return c.json({
      success: true,
      message: '微信登录成功',
      ...loginResponse
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '微信登录失败';
    return c.json({ success: false, message }, 400);
  }
});

// 用户注销
auth.post("/logout", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: '未提供有效的会话令牌' }, 401);
    }

    const sessionToken = authHeader.substring(7);
    const authService = new AuthService(c.env.DB);
    await authService.logout(sessionToken);
    
    return c.json({
      success: true,
      message: '注销成功'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '注销失败';
    return c.json({ success: false, message }, 400);
  }
});

// 获取当前用户信息
auth.get("/me", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: '未提供有效的会话令牌' }, 401);
    }

    const sessionToken = authHeader.substring(7);
    const authService = new AuthService(c.env.DB);
    const authContext = await authService.validateSession(sessionToken);

    if (!authContext) {
      return c.json({ success: false, message: '会话已过期' }, 401);
    }
    
    return c.json({
      success: true,
      user: authContext.user
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '获取用户信息失败';
    return c.json({ success: false, message }, 400);
  }
});

export default auth; 