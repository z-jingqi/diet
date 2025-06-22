# 用户认证功能说明

## 概述

本项目已集成完整的用户认证系统，支持用户名密码登录和微信登录（待实现）。所有API请求都需要用户认证（除了认证相关的API）。

## 数据库表结构

### 用户表 (users)
- `id`: 用户唯一标识
- `username`: 用户名（唯一）
- `email`: 邮箱（可选，唯一）
- `password_hash`: 密码哈希
- `nickname`: 昵称
- `avatar_url`: 头像URL
- `phone`: 手机号
- `is_active`: 是否激活
- `is_verified`: 是否已验证
- `last_login_at`: 最后登录时间
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 第三方登录表 (oauth_accounts)
- `id`: 记录唯一标识
- `user_id`: 关联的用户ID
- `provider`: 第三方平台（wechat, qq, github等）
- `provider_user_id`: 第三方平台的用户ID
- `provider_user_data`: 第三方用户信息（JSON）
- `access_token`: 访问令牌
- `refresh_token`: 刷新令牌
- `expires_at`: 过期时间

### 用户会话表 (user_sessions)
- `id`: 会话唯一标识
- `user_id`: 关联的用户ID
- `session_token`: 会话令牌
- `expires_at`: 过期时间
- `ip_address`: IP地址
- `user_agent`: 用户代理

## API 接口

### 认证相关接口

#### 1. 用户注册
```
POST /auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "nickname": "测试用户"
}
```

#### 2. 用户登录
```
POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### 3. 微信登录（待实现）
```
POST /auth/wechat-login
Content-Type: application/json

{
  "code": "微信授权码"
}
```

#### 4. 用户注销
```
POST /auth/logout
Authorization: Bearer <session_token>
```

#### 5. 获取当前用户信息
```
GET /auth/me
Authorization: Bearer <session_token>
```

### 需要认证的接口

所有以下接口都需要在请求头中包含有效的会话令牌：

```
Authorization: Bearer <session_token>
```

#### 聊天接口
```
POST /chat
Authorization: Bearer <session_token>
Content-Type: application/json

{
  "messages": [...],
  "format": "text"
}
```

#### 标签相关接口
```
GET /tags/categories
GET /tags/
GET /tags/all
GET /tags/:id
```

## 认证流程

1. **注册/登录**: 用户通过注册或登录获取会话令牌
2. **API调用**: 在后续请求中使用 `Authorization: Bearer <session_token>` 头
3. **会话验证**: 服务器验证会话令牌的有效性
4. **会话过期**: 会话默认30天过期，过期后需要重新登录

## 安全特性

- 密码使用SHA-256哈希存储（生产环境建议使用bcrypt）
- 会话令牌使用UUID生成，确保唯一性
- 支持会话过期机制
- 支持用户状态管理（激活/禁用）
- 支持IP地址和用户代理记录

## 部署说明

1. 确保D1数据库已创建并配置
2. 运行数据库初始化脚本创建表结构
3. 配置环境变量（如微信OAuth配置等）
4. 部署到Cloudflare Workers

## 微信登录实现

微信登录功能需要以下步骤：

1. 在微信开放平台注册应用
2. 获取AppID和AppSecret
3. 实现OAuth授权流程
4. 获取用户信息并创建或关联用户账户

具体实现代码在 `AuthService.wechatLogin()` 方法中。 