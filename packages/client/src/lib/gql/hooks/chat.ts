import { useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedClient, graphqlClient } from "../client";
import { QUERY_KEYS } from "./common";
import {
  useGetMyChatSessionsQuery,
  useCreateChatSessionMutation,
  useUpdateChatSessionMutation,
  useDeleteChatSessionMutation,
  type ChatSession,
} from "../graphql";

// 获取当前用户的聊天会话
export function useMyChatSessions() {
  const client = createAuthenticatedClient();
  return useGetMyChatSessionsQuery(client);
}

// 创建聊天会话
export function useCreateChatSession() {
  const queryClient = useQueryClient();

  return useCreateChatSessionMutation(graphqlClient, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.GET_MY_CHAT_SESSIONS,
      });

      const previous = queryClient.getQueryData<{
        myChatSessions?: ChatSession[] | null;
      }>(QUERY_KEYS.GET_MY_CHAT_SESSIONS);

      const optimisticSession: ChatSession = {
        id: `temp-${Date.now()}`,
        title: variables.title,
        messages: JSON.parse(variables.messages) ?? [],
        tagIds: (variables.tagIds as string[]) ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __typename: "ChatSession",
      } as any;

      queryClient.setQueryData(QUERY_KEYS.GET_MY_CHAT_SESSIONS, (old) => {
        const list = (old as any)?.myChatSessions ?? [];
        return { myChatSessions: [...list, optimisticSession] };
      });

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.GET_MY_CHAT_SESSIONS,
          context.previous
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_MY_CHAT_SESSIONS,
      });
    },
  });
}

// 更新聊天会话
export function useUpdateChatSession() {
  const queryClient = useQueryClient();

  return useUpdateChatSessionMutation(graphqlClient, {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.GET_MY_CHAT_SESSIONS,
      });
      const previous = queryClient.getQueryData<any>(
        QUERY_KEYS.GET_MY_CHAT_SESSIONS
      );
      queryClient.setQueryData(QUERY_KEYS.GET_MY_CHAT_SESSIONS, (old: any) => {
        const list: ChatSession[] = old?.myChatSessions ?? [];
        return {
          myChatSessions: list.map((s) =>
            s.id === variables.id
              ? {
                  ...s,
                  title: variables.title ?? s.title,
                  updatedAt: new Date().toISOString(),
                }
              : s
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _variables, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.GET_MY_CHAT_SESSIONS, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_MY_CHAT_SESSIONS,
      });
    },
  });
}

// 删除聊天会话
export function useDeleteChatSession() {
  const queryClient = useQueryClient();

  return useDeleteChatSessionMutation(graphqlClient, {
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.GET_MY_CHAT_SESSIONS,
      });
      const previous = queryClient.getQueryData<any>(
        QUERY_KEYS.GET_MY_CHAT_SESSIONS
      );
      queryClient.setQueryData(QUERY_KEYS.GET_MY_CHAT_SESSIONS, (old: any) => {
        return {
          myChatSessions: (old?.myChatSessions ?? []).filter(
            (s: ChatSession) => s.id !== id
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(QUERY_KEYS.GET_MY_CHAT_SESSIONS, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_MY_CHAT_SESSIONS,
      });
    },
  });
}
