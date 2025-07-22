import { useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedClient } from "../client";
import {
  useGetMyChatSessionsQuery,
  useCreateChatSessionMutation,
  useUpdateChatSessionMutation,
  useDeleteChatSessionMutation,
  useGetChatSessionQuery,
  type ChatSession,
  type GetChatSessionQueryVariables,
  type ChatMessage,
  MessageType,
  MessageStatus,
} from "../graphql";
import { useState, useCallback } from "react";
import {
  sendChatMessage,
  sendRecipeChatMessage,
  sendHealthAdviceChatMessage,
  getIntent,
} from "@/lib/api/chat-api";
import type { ChatCompletionMessageParam } from "openai/resources";
import {
  createUserMessageV2,
  createAIMessageV2,
  toAIMessagesV2,
  createEmptyChatSessionV2,
} from "@/utils/chat-utils";
import { CHAT_QUERY_KEYS } from "./common";
import { useRecipePreferences } from "./recipe-hooks";
import { useMyRecipesQuery } from "../graphql";

/**
 * Options for sending a chat message
 */
interface SendMessageOptions {
  sessionId: string | null;
  content: string;
  existingMessages?: ChatMessage[];
  onChunkReceived?: (content: string) => void;
  onStreamStart?: (aiMessage: ChatMessage) => void;
  isGuestMode?: boolean;
}

// Add option types just below SendMessageOptions
type StreamSendOptions = {
  sessionId: string;
  messages: ChatMessage[];
  aiMessages: ChatCompletionMessageParam[];
  onChunkReceived?: (content: string) => void;
  isGuestMode?: boolean;
};

type DetermineIntentOptions = {
  messages: ChatCompletionMessageParam[];
  isGuestMode?: boolean;
};

/**
 * Hook to fetch current user's chat sessions (without messages)
 */
export const useChatSessions = () => {
  const client = createAuthenticatedClient();
  const result = useGetMyChatSessionsQuery(client);

  return {
    ...result,
    sessions:
      result.data?.myChatSessions?.filter(
        (session): session is NonNullable<typeof session> => session !== null
      ) || [],
  };
};

/**
 * Hook to fetch a single chat session with messages
 */
export const useChatSession = (id: string) => {
  const client = createAuthenticatedClient();
  const variables: GetChatSessionQueryVariables = { id };
  const result = useGetChatSessionQuery(client, variables);

  return {
    ...result,
    session: result.data?.chatSession,
  };
};

/**
 * Hook to create a new chat session
 */
export const useCreateChatSession = () => {
  const queryClient = useQueryClient();

  return useCreateChatSessionMutation(createAuthenticatedClient(), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS,
      });
    },
  });
};

/**
 * Hook to update an existing chat session
 */
export const useUpdateChatSession = () => {
  const queryClient = useQueryClient();

  return useUpdateChatSessionMutation(createAuthenticatedClient(), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS,
      });
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.CHAT_SESSION(variables.id),
      });
    },
  });
};

/**
 * Hook to delete a chat session
 */
export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useDeleteChatSessionMutation(createAuthenticatedClient(), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.MY_CHAT_SESSIONS,
      });
      queryClient.removeQueries({
        queryKey: CHAT_QUERY_KEYS.CHAT_SESSION(variables.id),
      });
    },
  });
};

/**
 * Internal hook for chat messaging functionality
 */
const useChatMessagingInternal = (isGuestMode = false) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingIntent, setIsGettingIntent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const { mutateAsync: updateSession } = useUpdateChatSession();

  // Abort current message
  const abortCurrentMessage = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
      setIsGettingIntent(false);
    }
  }, [abortController]);

  // Create a temporary session (for guest mode)
  const createTemporarySession = useCallback((): ChatSession => {
    return createEmptyChatSessionV2();
  }, []);

  // Determine message intent
  const determineIntent = useCallback(
    async ({
      messages,
      isGuestMode = false,
    }: DetermineIntentOptions): Promise<MessageType> => {
      const controller = new AbortController();
      setAbortController(controller);
      setIsGettingIntent(true);

      try {
        return await getIntent(messages, controller.signal, isGuestMode);
      } catch (error) {
        console.error("Error determining intent:", error);
        return MessageType.Chat;
      } finally {
        setIsGettingIntent(false);
      }
    },
    []
  );

  // Generic handler for sending messages with streaming response
  const sendWithStream = useCallback(
    async (
      sendFn: (
        aiMessages: ChatCompletionMessageParam[],
        onMessage: (data: { done: boolean; response?: string }) => void,
        onError: (error: Error) => void,
        signal: AbortSignal,
        isGuestMode: boolean
      ) => Promise<void>,
      options: StreamSendOptions
    ): Promise<string> => {
      const { aiMessages, onChunkReceived, isGuestMode = false } = options;
      const controller = new AbortController();
      setAbortController(controller);
      setIsLoading(true);
      setError(null);

      let content = "";

      try {
        await sendFn(
          aiMessages,
          (data) => {
            if (data.done) {
              setAbortController(null);
              return;
            }

            if (data.response) {
              content += data.response;
              onChunkReceived?.(data.response);
            }
          },
          (error: any) => {
            setError(error.message);
            throw error;
          },
          controller.signal,
          isGuestMode
        );

        return content;
      } finally {
        setIsLoading(false);
      }
    },
    [setAbortController, setIsLoading, setError]
  );

  // Handle sending a chat message with streaming response
  const sendChatWithStream = useCallback(
    async (options: StreamSendOptions): Promise<string> => {
      return sendWithStream(sendChatMessage, options);
    },
    [sendWithStream]
  );

  // 获取用户已有菜谱和不喜欢的菜谱（仅在非游客模式下）
  const { data: recipePreferences } = useRecipePreferences(!isGuestMode);
  const { data: myRecipesData } = useMyRecipesQuery(createAuthenticatedClient(), undefined, {
    enabled: !isGuestMode,
  });

  const sendRecipeWithStream = useCallback(
    async (options: StreamSendOptions): Promise<string> => {
      // 准备现有菜谱和不喜欢的菜谱列表
      const existingRecipes = myRecipesData?.myRecipes
        ?.map(recipe => recipe.name)
        .filter((name): name is string => Boolean(name)) || [];
      const dislikedRecipes = recipePreferences
        ?.filter(pref => pref.preference === 'DISLIKE')
        ?.map(pref => pref.recipeName)
        .filter((name): name is string => Boolean(name)) || [];

      // 创建带有菜谱限制的发送函数
      const sendRecipeWithRestrictions = (
        messages: any[],
        onMessage: any,
        onError: any,
        signal?: AbortSignal,
        isGuestMode?: boolean
      ) => sendRecipeChatMessage(
        messages, 
        onMessage, 
        onError, 
        signal, 
        isGuestMode, 
        existingRecipes, 
        dislikedRecipes
      );

      return sendWithStream(sendRecipeWithRestrictions, options);
    },
    [sendWithStream, myRecipesData, recipePreferences]
  );

  // Handle sending a health advice message with streaming response
  const sendHealthAdviceWithStream = useCallback(
    async (options: StreamSendOptions): Promise<string> => {
      return sendWithStream(sendHealthAdviceChatMessage, options);
    },
    [sendWithStream]
  );

  // Main handler for sending user messages
  const sendMessage = useCallback(
    async (options: SendMessageOptions) => {
      const {
        sessionId,
        content,
        existingMessages = [],
        onChunkReceived,
        onStreamStart,
        isGuestMode = false,
      } = options;
      if (isLoading) {
        abortCurrentMessage();
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create user message
        const userMessage = createUserMessageV2(content);
        const allMessages = [...existingMessages, userMessage];

        // Convert to AI format for intent detection
        const aiMessages = toAIMessagesV2(allMessages);

        // Determine intent
        const intent = await determineIntent({
          messages: aiMessages,
          isGuestMode,
        });

        // Create AI message based on intent
        const aiMessage = createAIMessageV2(intent);
        aiMessage.status = MessageStatus.Streaming;

        const updatedMessages = [...allMessages, aiMessage];

        // Notify UI that streaming has started with initial AI message bubble
        onStreamStart?.(aiMessage);

        // Handle response based on intent
        let responseContent = "";

        switch (intent) {
          case MessageType.Recipe:
            responseContent = await sendRecipeWithStream({
              sessionId: sessionId || "",
              messages: updatedMessages,
              aiMessages,
              onChunkReceived,
              isGuestMode,
            });
            break;

          case MessageType.HealthAdvice:
            responseContent = await sendHealthAdviceWithStream({
              sessionId: sessionId || "",
              messages: updatedMessages,
              aiMessages,
              onChunkReceived,
              isGuestMode,
            });
            break;

          default: // Chat
            responseContent = await sendChatWithStream({
              sessionId: sessionId || "",
              messages: updatedMessages,
              aiMessages,
              onChunkReceived,
              isGuestMode,
            });
        }

        // Update AI message with final content
        aiMessage.content = responseContent;
        aiMessage.status = MessageStatus.Done;

        const finalMessages = [
          ...allMessages,
          {
            ...aiMessage,
            content: responseContent,
            status: MessageStatus.Done,
          },
        ];

        // Update session with completed message if not in guest mode
        if (sessionId && !isGuestMode) {
          try {
            await updateSession({
              id: sessionId,
              messages: JSON.stringify(finalMessages),
            });
          } catch (error) {
            console.error(
              "Failed to update session with completed message:",
              error
            );
          }
        }

        return {
          userMessage,
          aiMessage: {
            ...aiMessage,
            content: responseContent,
            status: MessageStatus.Done,
          },
          intent,
          allMessages: finalMessages,
        };
      } catch (error: any) {
        console.error("Error sending message:", error);
        setError(error?.message || "Failed to send message");
        throw error;
      } finally {
        setIsLoading(false);
        setAbortController(null);
      }
    },
    [
      isLoading,
      abortCurrentMessage,
      determineIntent,
      sendChatWithStream,
      sendRecipeWithStream,
      sendHealthAdviceWithStream,
      updateSession,
    ]
  );

  return {
    isLoading,
    isGettingIntent,
    error,
    abortController,
    sendMessage,
    abortCurrentMessage,
    createTemporarySession,
  };
};

// 导出 hook
export const useChatMessaging = (isGuestMode = false) => {
  return useChatMessagingInternal(isGuestMode);
};
