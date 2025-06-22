# 用户类型迁移说明

## 概述

已将用户相关的TypeScript类型定义从 `packages/api/src/types/user.ts` 迁移到 `packages/shared/src/types/user.ts`，实现了前后端类型共享。

## 迁移内容

### 移动的类型定义

以下类型已从API包移动到shared包：

- `User` - 用户信息接口
- `OAuthAccount` - 第三方登录账户接口
- `UserSession` - 用户会话接口
- `LoginRequest` - 登录请求接口
- `RegisterRequest` - 注册请求接口
- `WechatLoginRequest` - 微信登录请求接口
- `LoginResponse` - 登录响应接口
- `AuthContext` - 认证上下文接口

### 更新的文件

#### API包 (`packages/api/`)
- ✅ `src/services/auth.ts` - 更新导入路径
- ✅ `src/middleware/auth.ts` - 更新导入路径
- ✅ `src/routes/auth.ts` - 更新导入路径
- ✅ `src/types/user.ts` - 已删除

#### 前端包 (`packages/client/`)
- ✅ `src/lib/api/auth-api.ts` - 新增认证API
- ✅ `src/lib/api/base-api.ts` - 添加认证支持
- ✅ `src/lib/api/tags-api.ts` - 添加认证支持

#### Shared包 (`packages/shared/`)
- ✅ `src/types/user.ts` - 新增用户类型定义
- ✅ `src/index.ts` - 导出用户类型

## 使用方式

### 后端使用
```typescript
import { User, LoginRequest, RegisterRequest } from '@diet/shared';
```

### 前端使用
```typescript
import { User, LoginRequest, RegisterRequest } from '@diet/shared';
```

## 构建验证

- ✅ Shared包构建成功
- ✅ API包构建成功
- ✅ 前端包构建成功

## 优势

1. **类型一致性**: 前后端使用相同的类型定义，确保数据格式一致
2. **开发体验**: 前端开发时可以获得完整的类型提示
3. **维护性**: 类型定义集中管理，修改时只需更新一处
4. **安全性**: 编译时类型检查，减少运行时错误

## 注意事项

1. 修改用户类型时，需要重新构建shared包
2. 前端和后端都需要重新构建以获取最新的类型定义
3. 确保所有使用用户类型的文件都已更新导入路径 