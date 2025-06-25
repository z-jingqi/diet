// ============================================================================
// GraphQL Hooks - 主入口文件
// ============================================================================

// 重新导出所有 hooks
export * from './hooks/auth';
export * from './hooks/tags';
export * from './hooks/chat';
export * from './hooks/common';

// 为了向后兼容，保留原有的导出
export { useAuth } from './hooks/common'; 
