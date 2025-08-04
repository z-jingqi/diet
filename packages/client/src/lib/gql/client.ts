import { GraphQLClient } from "graphql-request";
import type { Query, Mutation } from "./graphql";
import { API_BASE } from "@/lib/constants";

// 使用统一的 API_BASE，确保 ENDPOINT 始终是有效的 URL
export const GRAPHQL_ENDPOINT = `${API_BASE}/graphql`;

// Helper to read cookie value by name
const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: "include",
  // 每次请求前动态注入 CSRF 头
  fetch: async (input, init) => {
    const csrfToken = getCookie("csrf-token");
    // 保留 graphql-request 设定的所有原始头（尤其是 Content-Type: application/json）
    const headers = new Headers(init?.headers);
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
    return fetch(input, { ...init, headers });
  },
});

// 类型安全的查询函数
export async function query<T extends keyof Query>(
  query: string,
  variables?: any,
): Promise<Query[T]> {
  return graphqlClient.request<Query[T]>(query, variables);
}

// 类型安全的变更函数
export async function mutate<T extends keyof Mutation>(
  mutation: string,
  variables?: any,
): Promise<Mutation[T]> {
  return graphqlClient.request<Mutation[T]>(mutation, variables);
}

// 认证相关的客户端（包含 session token）
export function createAuthenticatedClient() {
  return graphqlClient; // cookie already included
}
