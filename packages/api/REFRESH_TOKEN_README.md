# Refresh Token 认证机制

## 概述

本项目实现了安全的 refresh token 认证机制，提供以下特性：

- **Session Token**: 短期有效（1小时），用于日常 API 请求
- **Refresh Token**: 长期有效（30天），用于自动续期
- **自动续期**: 前端自动处理 token 刷新，用户无感知
- **HttpOnly Cookie**: 防止 XSS 攻击，提高安全性

## 数据库 Schema

### 用户会话表 (user_sessions)

```sql
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT UNIQUE NOT NULL,
  session_expires_at DATETIME NOT NULL, -- session token 过期时间（短期）
  refresh_expires_at DATETIME NOT NULL, -- refresh token 过期时间（长期）
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API 端点

### 登录
```
POST /auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "password"
}
```

**响应：**
```json
{
  "user": { ... },
  "session_token": "xxx",
  "refresh_token": "xxx", 
  "session_expires_at": "2024-01-01T12:00:00Z",
  "refresh_expires_at": "2024-02-01T12:00:00Z"
}
```

**Cookie 设置：**
- `session_token`: HttpOnly, Secure, SameSite=Lax, 1小时过期
- `refresh_token`: HttpOnly, Secure, SameSite=Lax, 30天过期

### 刷新 Session Token
```
POST /auth/refresh
```

**响应：**
```json
{
  "session_token": "new_session_token",
  "session_expires_at": "2024-01-01T13:00:00Z"
}
```

### 登出
```
POST /auth/logout
```

清除所有相关 cookie 和数据库中的会话记录。

### 获取用户信息
```
GET /auth/me
```

## 前端实现

### 自动刷新机制

前端使用 `fetchWithRefresh` 封装所有 API 请求：

```typescript
export const fetchWithRefresh = async (input: string, init?: RequestInit, retry = true): Promise<Response> => {
  let response = await fetch(input, { ...init, credentials: 'include' });
  if (response.status === 401 && retry) {
    // 尝试刷新 session token
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      // 刷新成功，重试原请求
      response = await fetch(input, { ...init, credentials: 'include' });
    }
  }
  return response;
};
```

### 使用方式

所有 API 调用都使用 `fetchWithRefresh`：

```typescript
// 登录
const response = await fetchWithRefresh('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

// 获取用户信息
const userResponse = await fetchWithRefresh('/auth/me');
```

## 安全特性

1. **HttpOnly Cookie**: 防止 JavaScript 访问 token
2. **Secure Flag**: 仅通过 HTTPS 传输
3. **SameSite=Lax**: 防止 CSRF 攻击
4. **短期 Session Token**: 减少被盗用的风险
5. **自动续期**: 用户无需手动处理 token 过期

## 部署注意事项

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **域名配置**: 确保 cookie 域名配置正确
3. **数据库迁移**: 需要更新现有的 user_sessions 表结构

## 测试

运行测试脚本验证功能：

```bash
node test-refresh-token.js
```

## 故障排除

### 常见问题

1. **Cookie 不生效**: 检查域名和 HTTPS 配置
2. **刷新失败**: 检查 refresh token 是否过期
3. **CORS 问题**: 确保 credentials 配置正确

### 调试

1. 检查浏览器开发者工具的 Application > Cookies
2. 查看网络请求的 Cookie 头
3. 检查数据库中的会话记录 