import { GraphQLClient } from "graphql-request";
import type { Query, Mutation } from "./graphql";
import { API_BASE } from "@/lib/constants";

// 使用统一的 API_BASE，确保 ENDPOINT 始终是有效的 URL
export const GRAPHQL_ENDPOINT = `${API_BASE}/graphql`;

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    "X-CSRF-Token": "true",
  },
});

// 类型安全的查询函数
export async function query<T extends keyof Query>(
  query: string,
  variables?: any
): Promise<Query[T]> {
  return graphqlClient.request<Query[T]>(query, variables);
}

// 类型安全的变更函数
export async function mutate<T extends keyof Mutation>(
  mutation: string,
  variables?: any
): Promise<Mutation[T]> {
  return graphqlClient.request<Mutation[T]>(mutation, variables);
}

// 认证相关的客户端（包含 session token）
export function createAuthenticatedClient(sessionToken: string) {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    headers: {
      "X-CSRF-Token": "true", // 使用与后端一致的 CSRF 头部
      Cookie: `session_token=${sessionToken}`,
    },
  });
}
