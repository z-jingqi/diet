import { useQueryClient } from '@tanstack/react-query';

// ============================================================================
// 通用工具函数
// ============================================================================

/**
 * 获取用户认证状态
 */
export function useAuth() {
  const sessionToken = localStorage.getItem('session_token');
  return { sessionToken, isAuthenticated: !!sessionToken };
}

/**
 * 获取 QueryClient 实例
 */
export function useQueryClientInstance() {
  return useQueryClient();
}

/**
 * 通用的缓存失效函数
 */
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return {
    invalidateTags: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),
    invalidateTagCategories: () => queryClient.invalidateQueries({ queryKey: ['tagCategories'] }),
    invalidateChatSessions: () => queryClient.invalidateQueries({ queryKey: ['myChatSessions'] }),
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}

/**
 * 通用的错误处理
 */
export function useErrorHandler() {
  return {
    handleGraphQLError: (error: any) => {
      console.error('GraphQL Error:', error);
      
      if (error.response?.errors) {
        const graphQLErrors = error.response.errors;
        return graphQLErrors.map((err: any) => err.message).join(', ');
      }
      
      return error.message || 'An error occurred';
    },
    
    handleNetworkError: (error: any) => {
      console.error('Network Error:', error);
      return 'Network error. Please check your connection.';
    },
  };
}

// ============================================================================
// 查询键常量
// ============================================================================
export const QUERY_KEYS = {
  TAGS: ['tags'] as const,
  TAG_CATEGORIES: ['tagCategories'] as const,
  ME: ['me'] as const,
  MY_CHAT_SESSIONS: ['myChatSessions'] as const,
} as const;

// ============================================================================
// 类型定义
// ============================================================================
export type QueryKey = typeof QUERY_KEYS[keyof typeof QUERY_KEYS]; 
