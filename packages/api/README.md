# Diet API

基于 Cloudflare Workers 和多种 AI 模型的 API 服务。

## 功能特性

- 基于 Cloudflare Workers 的 Serverless 架构
- 支持多种 AI 提供商：
  - 阿里云千问（默认）
  - OpenAI（待实现）
  - Anthropic（待实现）
- Hono 高性能 Web 框架
- TypeScript 支持
- 本地开发环境支持

## 环境要求

- Node.js 18+
- pnpm
- Cloudflare 账号
- AI 服务 API Key（根据选择的提供商）

## 安装

```bash
# 安装依赖
pnpm install
```

## 配置

1. 复制 `.env.example` 到 `.env`
2. 在 `.env` 文件中配置：
   - `AI_PROVIDER`：选择 AI 提供商（qwen/openai/anthropic）
   - `AI_API_KEY`：对应提供商的 API Key

## 开发

```bash
# 启动开发服务器
pnpm dev
```

## 部署

使用 Cloudflare Wrangler 部署：

```bash
# 部署到 Cloudflare Workers
pnpm run deploy
```

## API 接口

### 健康检查
- GET /health
- 返回服务状态

### 聊天接口
- POST /api/chat/guest - 游客聊天
- POST /api/chat - 认证用户聊天
- 请求体：
```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

### 标签接口
- GET /api/tags/all - 获取所有标签和分类
- GET /api/tags - 获取标签列表（支持筛选）
- GET /api/tags/categories - 获取标签分类

### 认证接口
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册
- POST /api/auth/logout - 用户登出

## 技术栈

- **框架**: Hono - 高性能 Web 框架
- **运行时**: Cloudflare Workers
- **数据库**: Cloudflare D1 (SQLite)
- **AI 服务**: 阿里云千问 / OpenAI
- **语言**: TypeScript

## 注意事项

- 确保在生产环境中正确设置环境变量
- 建议使用 Cloudflare 密钥管理来管理 API 密钥
- 本地开发时注意不要将包含敏感信息的 .env 文件提交到版本控制系统
- 切换 AI 提供商时，确保已配置对应的 API Key

# Diet API Service

This is the API service for the Diet application, built with Hono and deployed on Cloudflare Workers.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Qwen
QWEN_API_KEY=your_qwen_api_key
```

## Development

Run the development server:
```bash
pnpm run dev
```

## Building

Build the project:
```bash
pnpm run build
```

## Deployment

Deploy to Cloudflare Workers:
```bash
pnpm run deploy
```
 