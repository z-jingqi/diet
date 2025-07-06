import { useQueryClient } from "@tanstack/react-query";

// ============================================================================
// 通用工具函数
// ============================================================================

// Placeholder for potential common utility functions (e.g., auth helpers)

/**
 * 获取 QueryClient 实例
 */
export function useQueryClientInstance() {
  return useQueryClient();
}

/**
 * 通用的错误处理
 */
export function useErrorHandler() {
  return {
    handleGraphQLError: (error: any) => {
      console.error("GraphQL Error:", error);

      if (error.response?.errors) {
        const graphQLErrors = error.response.errors;
        return graphQLErrors.map((err: any) => err.message).join(", ");
      }

      return error.message || "An error occurred";
    },

    handleNetworkError: (error: any) => {
      console.error("Network Error:", error);
      return "Network error. Please check your connection.";
    },
  };
}

// ============================================================================
// 查询键常量
// ============================================================================
export const QUERY_KEYS = {
  GET_TAGS: ["GetTags"] as const,
  GET_TAG_CATEGORIES: ["GetTagCategories"] as const,
  GET_TAG_CONFLICTS: ["GetTagConflicts"] as const,
  GET_MY_CHAT_SESSIONS: ["GetMyChatSessions"] as const,
  GET_ME: ["GetMe"] as const,
} as const;

// ============================================================================
// 类型定义
// ============================================================================
export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
