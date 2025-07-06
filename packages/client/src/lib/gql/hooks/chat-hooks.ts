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
import { nanoid } from "nanoid";
import {
  createUserMessageV2,
  createAIMessageV2,
  toAIMessagesV2,
  createEmptyChatSessionV2,
} from "@/utils/chat-utils-v2";

/**
 * Query key constants for chat related queries
 */
export const CHAT_QUERY_KEYS = {
  MY_CHAT_SESSIONS: ["GetMyChatSessions"] as const,
  CHAT_SESSION: (id: string) => ["GetChatSession", { id }] as const,
};

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
 * Hook for chat message handling including streaming responses
 */
export const useChatMessaging = () => {
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

  // Handle sending a chat message with streaming response
  const sendChatWithStream = useCallback(
    async (options: StreamSendOptions): Promise<string> => {
      const {
        sessionId,
        messages,
        aiMessages,
        onChunkReceived,
        isGuestMode = false,
      } = options;
      const controller = new AbortController();
      setAbortController(controller);
      setIsLoading(true);
      setError(null);

      let content = "";

      try {
        await sendChatMessage(
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
          (error) => {
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
    []
  );

  // Handle sending a recipe message with streaming response
  const sendRecipeWithStream = useCallback(
    async (options: StreamSendOptions): Promise<string> => {
      const {
        sessionId,
        messages,
        aiMessages,
        onChunkReceived,
        isGuestMode = false,
      } = options;
      const controller = new AbortController();
      setAbortController(controller);
      setIsLoading(true);
      setError(null);

      let content = "";

      try {
        await sendRecipeChatMessage(
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
          (error) => {
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
    []
  );

  // Handle sending a health advice message with streaming response
  const sendHealthAdviceWithStream = useCallback(
    async (options: StreamSendOptions): Promise<string> => {
      const {
        sessionId,
        messages,
        aiMessages,
        onChunkReceived,
        isGuestMode = false,
      } = options;
      const controller = new AbortController();
      setAbortController(controller);
      setIsLoading(true);
      setError(null);

      let content = "";

      try {
        await sendHealthAdviceChatMessage(
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
          (error) => {
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
    []
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
