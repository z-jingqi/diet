import { useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedClient } from "../client";
import {
  useGetMyChatSessionsQuery,
  useCreateChatSessionMutation,
  useUpdateChatSessionMutation,
  useDeleteChatSessionMutation,
  type ChatSession,
} from "../graphql";

/**
 * Query key constants for chat related queries
 */
export const CHAT_QUERY_KEYS = {
  MY_CHAT_SESSIONS: ["myChatSessions"] as const,
  CHAT_SESSION: (id: string) => ["chatSession", id] as const,
};

/**
 * Hook to fetch current user's chat sessions
 */
export const useChatSessionsV2 = () => {
  const client = createAuthenticatedClient();
  const result = useGetMyChatSessionsQuery(client);
  
  return {
    ...result,
    sessions: result.data?.myChatSessions?.filter(
      (session): session is NonNullable<typeof session> => 
        session !== null
    ) || [],
  };
};

/**
 * Hook to create a new chat session
 */
export const useCreateChatSessionV2 = () => {
  const queryClient = useQueryClient();

  return useCreateChatSessionMutation(createAuthenticatedClient(), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS });
    },
  });
};

/**
 * Hook to update an existing chat session
 */
export const useUpdateChatSessionV2 = () => {
  const queryClient = useQueryClient();

  return useUpdateChatSessionMutation(createAuthenticatedClient(), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS });
      queryClient.invalidateQueries({ 
        queryKey: CHAT_QUERY_KEYS.CHAT_SESSION(variables.id) 
      });
    },
  });
};

/**
 * Hook to delete a chat session
 */
export const useDeleteChatSessionV2 = () => {
  const queryClient = useQueryClient();

  return useDeleteChatSessionMutation(createAuthenticatedClient(), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS });
      queryClient.removeQueries({ 
        queryKey: CHAT_QUERY_KEYS.CHAT_SESSION(variables.id) 
      });
    },
  });
}; 
