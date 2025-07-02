import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  ChatStoreV2,
  ChatMessagingState,
  ChatSessionState,
  ChatMessagingOperations,
  ChatSessionOperations,
  ChatActions,
  ChatIntentHandlers,
} from "./chat-types-v2";
import {
  ChatMessage,
  ChatSession,
  MessageRole,
  MessageStatus,
  MessageType,
} from "@/lib/gql/graphql";
import useAuthStore from "@/store/auth-store";
import chatServiceV2 from "@/services/chat-service-v2";
import chatSessionServiceV2 from "@/services/chat-session-service-v2";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";
import {
  createUserMessageV2,
  createAIMessageV2,
  toAIMessagesV2,
} from "@/utils/chat-utils-v2";

// Initial state for chat messaging
const initialMessagingState: ChatMessagingState = {
  isLoading: false,
  gettingIntent: false,
  abortController: undefined,
  error: null,
};

// Initial state for chat sessions
const initialSessionState: ChatSessionState = {
  currentSessionId: null,
  isTemporarySession: false,
  isNewSession: true,
};

/**
 * Main chat store using Zustand with devtools middleware
 */
const useChatStoreV2 = create<ChatStoreV2>()(
  devtools(
    (set, get) => ({
      // State
      ...initialMessagingState,
      ...initialSessionState,

      // Basic state setters
      setLoading: (isLoading) => set({ isLoading }),
      setGettingIntent: (gettingIntent) => set({ gettingIntent }),
      setAbortController: (abortController) => set({ abortController }),
      setError: (error) => set({ error }),
      setCurrentSession: (currentSessionId) => set({ currentSessionId }),
      setTemporarySession: (isTemporarySession) => set({ isTemporarySession }),
      setIsNewSession: (isNewSession) => set({ isNewSession }),

      // Action: Abort current message
      abortCurrentMessage: () => {
        const { abortController } = get();
        if (abortController) {
          abortController.abort();
          set({
            abortController: undefined,
            gettingIntent: false,
            isLoading: false,
          });
        }
      },

      // Action: Clear messages in current session
      clearMessages: async (sessionId: string) => {
        try {
          if (!sessionId) return;

          const { isTemporarySession } = get();

          if (!isTemporarySession) {
            await chatSessionServiceV2.clearSessionMessages(sessionId);
          }
        } catch (error) {
          console.error("Error clearing messages:", error);
          set({ error: "Failed to clear messages" });
        }
      },

      // Helper: Fetch session messages
      fetchSessionMessages: async (
        sessionId: string
      ): Promise<ChatMessage[]> => {
        // In a real implementation, this would fetch from API or cache
        // For now, we'll return an empty array
        return [];
      },

      // Action to handle user messages
      handleUserMessage: (content: string) => {
        // This would typically add the message to the current session
        // In the new architecture, this is handled by sendMessage
      },

      // Main action: Send message
      sendMessage: async (content: string) => {
        const {
          currentSessionId,
          isTemporarySession,
          isNewSession,
          abortCurrentMessage,
        } = get();

        // Abort any ongoing requests first
        abortCurrentMessage();

        const { isAuthenticated, isGuestMode } = useAuthStore.getState();
        set({ isLoading: true, error: null });

        try {
          // Create user message
          const userMessage = createUserMessageV2(content);

          let sessionId = currentSessionId;
          let sessionMessages: ChatMessage[] = [userMessage];

          // Create new session or use existing
          if (isNewSession || !sessionId) {
            if (isAuthenticated && !isGuestMode) {
              // For logged-in users, create a persistent session
              const newSession = await chatSessionServiceV2.createSession(
                "New Chat",
                [userMessage]
              );
              sessionId = newSession.id || "";
              set({
                currentSessionId: sessionId,
                isTemporarySession: false,
                isNewSession: false,
              });
            } else {
              // For guest mode, create a temporary session
              const tempSession = chatSessionServiceV2.createTemporarySession();
              sessionId = tempSession.id || "";
              sessionMessages = [userMessage];
              set({
                currentSessionId: sessionId,
                isTemporarySession: true,
                isNewSession: false,
              });
            }
          } else if (!isTemporarySession && isAuthenticated && !isGuestMode) {
            // Update existing persistent session
            const allMessages = await get().fetchSessionMessages(sessionId);
            sessionMessages = [...allMessages, userMessage];
            await chatSessionServiceV2.updateSession(sessionId, {
              messages: sessionMessages,
            });
          }

          // Begin intent detection
          set({ gettingIntent: true });

          // Create abort controller for the new request
          const controller = new AbortController();
          set({ abortController: controller });

          // Convert messages to AI format
          const AIMessages = toAIMessagesV2(sessionMessages);

          // Determine message intent
          const intent = await chatServiceV2.determineIntent(
            AIMessages,
            controller.signal,
            isGuestMode
          );

          set({ gettingIntent: false });

          // Create AI message based on intent
          const aiMessage = createAIMessageV2(intent);
          aiMessage.status = MessageStatus.Streaming;

          // Add AI message to session
          if (
            !isTemporarySession &&
            sessionId &&
            isAuthenticated &&
            !isGuestMode
          ) {
            const updatedMessages = [...sessionMessages, aiMessage];
            await chatSessionServiceV2.updateSession(sessionId, {
              messages: updatedMessages,
            });
          }

          // Handle message based on intent type
          switch (intent) {
            case MessageType.Recipe:
              await get().handleRecipeIntent(
                sessionId,
                [...sessionMessages, aiMessage],
                AIMessages,
                isGuestMode
              );
              break;

            case MessageType.HealthAdvice:
              await get().handleHealthAdviceIntent(
                sessionId,
                [...sessionMessages, aiMessage],
                AIMessages,
                isGuestMode
              );
              break;

            default:
              await get().handleChatIntent(
                sessionId,
                [...sessionMessages, aiMessage],
                AIMessages,
                isGuestMode
              );
          }
        } catch (error) {
          console.error("Error sending message:", error);
          set({
            error: "Failed to send message",
            isLoading: false,
            gettingIntent: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Intent handlers
      handleChatIntent: async (
        sessionId: string,
        messages: ChatMessage[],
        aiMessages: any,
        isGuestMode = false
      ) => {
        const aiMessage = messages[messages.length - 1];
        let content = "";

        try {
          const controller = new AbortController();
          set({ abortController: controller });

          await chatServiceV2.sendChatMessage(
            aiMessages,
            (data) => {
              if (data.done) {
                set({ abortController: undefined });
                return;
              }

              if (data.response) {
                content += data.response;
                // Update message content as it streams
                // This would be handled by the UI component
              }
            },
            (error) => {
              set({ abortController: undefined });
              throw error;
            },
            controller.signal,
            isGuestMode
          );

          // Update AI message with final content
          aiMessage.content = content;
          aiMessage.status = MessageStatus.Done;

          // Persist updates for logged-in users
          if (
            !get().isTemporarySession &&
            !isGuestMode &&
            useAuthStore.getState().isAuthenticated
          ) {
            await chatSessionServiceV2.updateSessionMessage(
              sessionId,
              aiMessage.id ?? "",
              { content, status: MessageStatus.Done },
              messages
            );
          }
        } catch (error) {
          console.error("Error in chat intent:", error);
          aiMessage.status = MessageStatus.Error;
          set({ error: "Failed to process chat" });
        }
      },

      handleRecipeIntent: async (
        sessionId: string,
        messages: ChatMessage[],
        aiMessages: any,
        isGuestMode = false
      ) => {
        const aiMessage = messages[messages.length - 1];
        let content = "";

        try {
          const controller = new AbortController();
          set({ abortController: controller });

          await chatServiceV2.sendRecipeMessage(
            aiMessages,
            (data) => {
              if (data.done) {
                set({ abortController: undefined });
                return;
              }

              if (data.response) {
                content += data.response;
                // Update message content as it streams
                // This would be handled by the UI component
              }
            },
            (error) => {
              set({ abortController: undefined });
              throw error;
            },
            controller.signal,
            isGuestMode
          );

          // Update AI message with final content
          aiMessage.content = content;
          aiMessage.status = MessageStatus.Done;

          // Persist updates for logged-in users
          if (
            !get().isTemporarySession &&
            !isGuestMode &&
            useAuthStore.getState().isAuthenticated
          ) {
            await chatSessionServiceV2.updateSessionMessage(
              sessionId,
              aiMessage.id ?? "",
              { content, status: MessageStatus.Done },
              messages
            );
          }
        } catch (error) {
          console.error("Error in recipe intent:", error);
          aiMessage.status = MessageStatus.Error;
          set({ error: "Failed to generate recipe" });
        }
      },

      handleHealthAdviceIntent: async (
        sessionId: string,
        messages: ChatMessage[],
        aiMessages: any,
        isGuestMode = false
      ) => {
        const aiMessage = messages[messages.length - 1];
        let content = "";

        try {
          const controller = new AbortController();
          set({ abortController: controller });

          await chatServiceV2.sendHealthAdviceMessage(
            aiMessages,
            (data) => {
              if (data.done) {
                set({ abortController: undefined });
                return;
              }

              if (data.response) {
                content += data.response;
                // Update message content as it streams
                // This would be handled by the UI component
              }
            },
            (error) => {
              set({ abortController: undefined });
              throw error;
            },
            controller.signal,
            isGuestMode
          );

          // Update AI message with final content
          aiMessage.content = content;
          aiMessage.status = MessageStatus.Done;

          // Persist updates for logged-in users
          if (
            !get().isTemporarySession &&
            !isGuestMode &&
            useAuthStore.getState().isAuthenticated
          ) {
            await chatSessionServiceV2.updateSessionMessage(
              sessionId,
              aiMessage.id ?? "",
              { content, status: MessageStatus.Done },
              messages
            );
          }
        } catch (error) {
          console.error("Error in health advice intent:", error);
          aiMessage.status = MessageStatus.Error;
          set({ error: "Failed to generate health advice" });
        }
      },
    }),
    { name: "chat-store-v2" }
  )
);

export default useChatStoreV2;
