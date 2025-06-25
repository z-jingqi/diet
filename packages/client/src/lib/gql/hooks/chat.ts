import { useQueryClient } from '@tanstack/react-query';
import { createAuthenticatedClient, graphqlClient } from '../client';
import {
  useGetMyChatSessionsQuery,
  useCreateChatSessionMutation,
  useUpdateChatSessionMutation,
  useDeleteChatSessionMutation
} from '../graphql';

// 获取当前用户的聊天会话
export function useMyChatSessions() {
  const { sessionToken } = useAuth();
  
  const client = sessionToken ? createAuthenticatedClient(sessionToken) : graphqlClient;
  return useGetMyChatSessionsQuery(client);
}

// 创建聊天会话
export function useCreateChatSession() {
  const queryClient = useQueryClient();
  
  return useCreateChatSessionMutation(graphqlClient, {
    onSuccess: () => {
      // 刷新聊天会话列表
      queryClient.invalidateQueries({ queryKey: ['GetMyChatSessions'] });
    },
  });
}

// 更新聊天会话
export function useUpdateChatSession() {
  const queryClient = useQueryClient();
  
  return useUpdateChatSessionMutation(graphqlClient, {
    onSuccess: () => {
      // 刷新聊天会话列表
      queryClient.invalidateQueries({ queryKey: ['GetMyChatSessions'] });
    },
  });
}

// 删除聊天会话
export function useDeleteChatSession() {
  const queryClient = useQueryClient();
  
  return useDeleteChatSessionMutation(graphqlClient, {
    onSuccess: () => {
      // 刷新聊天会话列表
      queryClient.invalidateQueries({ queryKey: ['GetMyChatSessions'] });
    },
  });
}

// 获取用户认证状态
function useAuth() {
  const sessionToken = localStorage.getItem('session_token');
  return { sessionToken, isAuthenticated: !!sessionToken };
} 
