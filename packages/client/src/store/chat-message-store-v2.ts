import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatMessage, MessageStatus } from "@/lib/gql/graphql";
import chatSessionServiceV2 from "@/services/chat-session-service-v2";
import useAuthStore from "@/store/auth-store";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";

interface ChatMessageState {
  // Messages per session ID
  messagesBySessionId: Record<string, ChatMessage[]>;
  isUpdating: boolean;
}

interface ChatMessageActions {
  // CRUD actions
  addMessage: (sessionId: string, message: ChatMessage) => void;
  updateMessage: (
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ) => void;
  setMessages: (sessionId: string, messages: ChatMessage[]) => void;
  clearMessages: (sessionId: string) => void;

  // Stream-related actions
  appendToMessage: (
    sessionId: string,
    messageId: string,
    content: string
  ) => void;
  completeMessage: (sessionId: string, messageId: string) => void;
  errorMessage: (sessionId: string, messageId: string) => void;

  // Getters
  getMessagesForSession: (sessionId: string) => ChatMessage[];
}

const useChatMessageStoreV2 = create<ChatMessageState & ChatMessageActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      messagesBySessionId: {},
      isUpdating: false,

      // Add message to a session
      addMessage: (sessionId, message) => {
        set((state) => {
          // Get existing messages or empty array
          const existingMessages = state.messagesBySessionId[sessionId] || [];
          const updatedMessages = [...existingMessages, message];

          // Persist to backend if authenticated
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          const { isTemporarySession } = useChatSessionStoreV2.getState();
          if (isAuthenticated && !isGuestMode && !isTemporarySession && sessionId) {
            chatSessionServiceV2.updateSession(sessionId, {
              messages: updatedMessages,
            }).catch(err => console.error("Failed to persist message:", err));
          }

          return {
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: updatedMessages,
            },
          };
        });
      },

      // Update a specific message
      updateMessage: (sessionId, messageId, updates) => {
        set((state) => {
          const messages = state.messagesBySessionId[sessionId] || [];
          const updatedMessages = messages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );

          // Persist to backend if authenticated
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          const { isTemporarySession } = useChatSessionStoreV2.getState();
          if (isAuthenticated && !isGuestMode && !isTemporarySession && sessionId) {
            chatSessionServiceV2.updateSession(sessionId, {
              messages: updatedMessages,
            }).catch(err => console.error("Failed to update message:", err));
          }

          return {
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: updatedMessages,
            },
          };
        });
      },

      // Set all messages for a session
      setMessages: (sessionId, messages) => {
        set((state) => ({
          messagesBySessionId: {
            ...state.messagesBySessionId,
            [sessionId]: messages,
          },
        }));
      },

      // Clear all messages for a session
      clearMessages: (sessionId) => {
        set((state) => {
          // Persist to backend if authenticated
          const { isAuthenticated, isGuestMode } = useAuthStore.getState();
          const { isTemporarySession } = useChatSessionStoreV2.getState();
          if (isAuthenticated && !isGuestMode && !isTemporarySession && sessionId) {
            chatSessionServiceV2.updateSession(sessionId, {
              messages: [],
            }).catch(err => console.error("Failed to clear messages:", err));
          }

          return {
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: [],
            },
          };
        });
      },

      // Append content to a streaming message
      appendToMessage: (sessionId, messageId, content) => {
        set((state) => {
          const messages = state.messagesBySessionId[sessionId] || [];
          
          const updatedMessages = messages.map((msg) => {
            if (msg.id === messageId) {
              return {
                ...msg,
                content: (msg.content || "") + content,
              };
            }
            return msg;
          });

          return {
            messagesBySessionId: {
              ...state.messagesBySessionId,
              [sessionId]: updatedMessages,
            },
          };
        });
      },

      // Mark a message as complete
      completeMessage: (sessionId, messageId) => {
        get().updateMessage(sessionId, messageId, {
          status: MessageStatus.Done,
        });
      },

      // Mark a message as errored
      errorMessage: (sessionId, messageId) => {
        get().updateMessage(sessionId, messageId, {
          status: MessageStatus.Error,
        });
      },

      // Get all messages for a session
      getMessagesForSession: (sessionId) => {
        return get().messagesBySessionId[sessionId] || [];
      },
    }),
    {
      name: "chat-message-store-v2",
    }
  )
);

export default useChatMessageStoreV2; 
