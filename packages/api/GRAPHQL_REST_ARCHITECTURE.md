# GraphQL + REST 混合架构

## 架构概述

本项目采用混合架构，根据功能特性选择最适合的技术：

- **GraphQL**: 用于数据查询和管理操作
- **REST API**: 用于 AI 聊天交互（支持 event stream）

## 功能分配

### 🚀 GraphQL 负责的功能

#### 认证管理 (Auth)
- ✅ 用户注册 (`register`)
- ✅ 用户登录 (`login`) 
- ✅ 用户登出 (`logout`)
- ✅ 获取当前用户信息 (`me`)
- ✅ 检查用户名可用性 (`checkUsername`)
- ✅ 微信登录 (`wechatLogin`)
- ✅ 刷新 session token (`refreshSession`)

#### 聊天会话管理 (Chat Sessions)
- ✅ 获取用户聊天会话 (`myChatSessions`)
- ✅ 获取指定用户聊天会话 (`chatSessions`)
- ✅ 获取单个聊天会话 (`chatSession`)
- ✅ 创建聊天会话 (`createChatSession`)
- ✅ 更新聊天会话 (`updateChatSession`)
- ✅ 删除聊天会话 (`deleteChatSession`)

#### 标签管理 (Tags)
- ✅ 获取标签分类 (`tagCategories`)
- ✅ 获取标签列表 (`tags`) - 支持分类和搜索过滤
- ✅ 获取单个标签 (`tag`)
- ✅ 按分类获取标签 (`tagsByCategory`)
- ✅ 获取标签冲突关系 (`tagConflicts`)
- ✅ 检查标签组合冲突 (`checkTagConflicts`)
- ✅ 完整的 CRUD mutations（create, update, delete）

### 🌊 REST API 负责的功能

#### AI 聊天交互
- ✅ 游客聊天 (`POST /chat/guest`) - 支持 event stream
- ✅ 认证用户聊天 (`POST /chat/authenticated`) - 支持 event stream
- ✅ 兼容性聊天端点 (`POST /chat/`) - 支持 event stream

## 技术优势

### GraphQL 优势
1. **类型安全**: 强类型系统，编译时错误检查
2. **精确查询**: 客户端只获取需要的数据
3. **单一端点**: 所有数据操作通过一个端点
4. **实时更新**: 支持订阅和实时数据同步
5. **开发体验**: 优秀的开发工具和调试体验

### REST API 优势
1. **流式响应**: 原生支持 Server-Sent Events 和流式响应
2. **简单直接**: AI 聊天场景下更简单直观
3. **兼容性好**: 与现有 AI 服务集成更容易
4. **性能优化**: 流式传输减少延迟

## 使用场景

### 使用 GraphQL 的场景
- 用户认证和会话管理
- 聊天会话的 CRUD 操作
- 标签和分类管理
- 复杂的数据查询和关联
- 需要精确控制返回字段的场景

### 使用 REST API 的场景
- AI 聊天交互（需要流式响应）
- 文件上传/下载
- 简单的 CRUD 操作
- 与第三方 AI 服务集成

## 前端集成

### GraphQL 客户端
```typescript
// 使用生成的 GraphQL hooks
import { useMe, useMyChatSessions, useTags } from '@/lib/gql/hooks';

// 在组件中使用
const { data: user } = useMe();
const { data: sessions } = useMyChatSessions();
```

### REST API 客户端
```typescript
// AI 聊天使用 REST API
const chatWithAI = async (messages: string[], format?: string) => {
  const response = await fetch('/api/chat/authenticated', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, format })
  });
  
  // 处理流式响应
  const reader = response.body?.getReader();
  // ... 流式处理逻辑
};
```

## 迁移策略

### 第一阶段：并行运行
- GraphQL 和 REST API 同时提供服务
- 前端逐步迁移到 GraphQL
- 保持向后兼容性

### 第二阶段：功能分离
- 数据管理功能完全迁移到 GraphQL
- AI 聊天功能保持使用 REST API
- 清理不再使用的 REST 端点

### 第三阶段：优化完善
- 优化 GraphQL 查询性能
- 完善错误处理和缓存策略
- 添加实时订阅功能

## 部署说明

1. **GraphQL 端点**: `/api/graphql`
2. **REST API 端点**: `/api/chat/*`, `/api/auth/*`, `/api/tags/*`
3. **GraphiQL 调试**: `/api/graphql` (开发环境)

## 注意事项

1. **认证统一**: GraphQL 和 REST API 使用相同的认证机制
2. **CSRF 保护**: REST API 端点需要 CSRF 保护
3. **错误处理**: 统一错误处理格式
4. **缓存策略**: GraphQL 使用 React Query 缓存，REST API 使用 HTTP 缓存
5. **类型安全**: 确保 GraphQL 生成的类型与 REST API 响应类型一致

## 未来规划

1. **实时功能**: 添加 GraphQL 订阅支持
2. **性能优化**: 实现 GraphQL 查询优化
3. **监控告警**: 添加性能监控和错误告警
4. **文档完善**: 自动生成 API 文档 
