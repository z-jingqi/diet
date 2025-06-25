import { GraphQLClient } from 'graphql-request';
import type { Query, Mutation } from './graphql';

// 创建 GraphQL 客户端
export const graphqlClient = new GraphQLClient('/api/graphql', {
  headers: {
    'X-CSRF-Token': 'true', // 使用与后端一致的 CSRF 头部
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
  return new GraphQLClient('/api/graphql', {
    headers: {
      'X-CSRF-Token': 'true', // 使用与后端一致的 CSRF 头部
      'Cookie': `session_token=${sessionToken}`,
    },
  });
} 
