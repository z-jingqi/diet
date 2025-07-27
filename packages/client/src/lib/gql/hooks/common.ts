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
// Auth related query keys
export const AUTH_QUERY_KEYS = {
  GET_ME: ["GetMe"] as const,
} as const;

// Recipe specific query keys
export const RECIPE_QUERY_KEYS = {
  RECIPE: (id: string) => ["GetRecipe", { id }] as const,
  MY_RECIPES: ["MyRecipes"] as const,
  RECIPE_PREFERENCES: ["GetRecipePreferences"] as const,
} as const;

// Chat specific query keys
export const CHAT_QUERY_KEYS = {
  MY_CHAT_SESSIONS: ["GetMyChatSessions"] as const,
  CHAT_SESSION: (id: string) => ["GetChatSession", { id }] as const,
} as const;

// Tag specific query keys
export const TAG_QUERY_KEYS = {
  TAGS: ["GetTags"] as const,
  TAG_CATEGORIES: ["GetTagCategories"] as const,
  TAG_CONFLICTS: ["GetTagConflicts"] as const,
  TAG: (id: string) => ["GetTag", { id }] as const,
  CHECK_CONFLICTS: (tagIds: string[]) =>
    ["CheckTagConflicts", { tagIds }] as const,
} as const;

// ============================================================================
// 类型定义
// ============================================================================
export type QueryKey =
  | (typeof AUTH_QUERY_KEYS)[keyof typeof AUTH_QUERY_KEYS]
  | (typeof RECIPE_QUERY_KEYS)[keyof typeof RECIPE_QUERY_KEYS]
  | (typeof CHAT_QUERY_KEYS)[keyof typeof CHAT_QUERY_KEYS]
  | (typeof TAG_QUERY_KEYS)[keyof typeof TAG_QUERY_KEYS];
