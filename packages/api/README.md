# Diet API

基于阿里云 Serverless 和多种 AI 模型的 API 服务。

## 功能特性

- 基于阿里云函数计算（FC）的 Serverless 架构
- 支持多种 AI 提供商：
  - 阿里云千问（默认）
  - OpenAI（待实现）
  - Anthropic（待实现）
- Express.js 后端服务
- TypeScript 支持
- 本地开发环境支持

## 环境要求

- Node.js 18+
- pnpm
- 阿里云账号
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

1. 安装阿里云函数计算命令行工具：
```bash
npm install @alicloud/fun -g
```

2. 配置阿里云账号信息：
```bash
fun config
```

3. 部署到阿里云：
```bash
pnpm deploy
```

## API 接口

### 健康检查
- GET /health
- 返回服务状态

### 聊天接口
- POST /api/chat
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

## 注意事项

- 确保在生产环境中正确设置环境变量
- 建议使用阿里云密钥管理服务（KMS）来管理 API 密钥
- 本地开发时注意不要将包含敏感信息的 .env 文件提交到版本控制系统
- 切换 AI 提供商时，确保已配置对应的 API Key

# Diet API Service

This is the API service for the Diet application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# Qwen
QWEN_API_KEY=your_qwen_api_key

# Baidu AI
BAIDU_API_KEY=your_baidu_api_key
BAIDU_API_SECRET=your_baidu_api_secret
```

## Development

Run the development server:
```bash
npm run dev
```

## Building

Build the project:
```bash
npm run build
```

## Running

Start the server:
```bash
npm start
```

## AI Services

The API supports multiple AI services:

1. OpenAI
   - Uses GPT-3.5/4 models
   - Requires OpenAI API key

2. Anthropic
   - Uses Claude models
   - Requires Anthropic API key

3. Qwen
   - Uses Qwen models
   - Requires Qwen API key

4. Baidu AI
   - Uses Baidu Wenxin models
   - Requires Baidu API key and secret
   - Supports both chat and embedding services
   - Free tier includes:
     - 1000万 tokens for new users
     - Monthly free quota
   - Features:
     - Strong Chinese language understanding
     - Multi-modal support
     - Complete API ecosystem

## API Endpoints

### Chat

```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ],
  "provider": "baidu" // or "openai", "anthropic", "qwen"
}
```

### Embedding

```http
POST /api/embedding
Content-Type: application/json

{
  "text": "Hello world",
  "provider": "baidu" // or "openai", "anthropic", "qwen"
}
```
 