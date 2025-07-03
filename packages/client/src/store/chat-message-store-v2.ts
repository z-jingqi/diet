import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatMessage, MessageStatus, ChatSession } from "@/lib/gql/graphql";
import chatSessionServiceV2 from "@/services/chat-session-service-v2";
import useAuthStore from "@/store/auth-store";
import useChatSessionStoreV2 from "@/store/chat-session-store-v2";

// 1. 定义状态接口
interface ChatMessageState {
  // Messages per session ID
  messagesBySessionId: Record<string, ChatMessage[]>;
  isUpdating: boolean;
}

// 2. 定义行为接口
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

// 3. 合并完整的Store类型
export type ChatMessageStoreV2 = ChatMessageState & ChatMessageActions;

// 4. 初始状态
const initialState: ChatMessageState = {
  messagesBySessionId: {},
  isUpdating: false,
};

// 5. 创建行为工厂函数 - 提供静态引用点
const createChatMessageActions = (set: any, get: any): ChatMessageActions => ({
  // Add message to a session
  addMessage: (sessionId: string, message: ChatMessage) => {
    set((state: ChatMessageState) => {
      // Get existing messages or empty array
      const existingMessages = state.messagesBySessionId[sessionId] || [];
      const updatedMessages = [...existingMessages, message];

      // Persist to backend if authenticated
      const { isAuthenticated, isGuestMode } = useAuthStore.getState();
      const { isTemporarySession } = useChatSessionStoreV2.getState();
      if (isAuthenticated && !isGuestMode && !isTemporarySession && sessionId) {
        chatSessionServiceV2
          .updateSession(sessionId, {
            messages: updatedMessages,
          })
          .catch((err) => console.error("Failed to persist message:", err));
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
  updateMessage: (
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ) => {
    set((state: ChatMessageState) => {
      const messages = state.messagesBySessionId[sessionId] || [];
      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );

      // Persist to backend if authenticated
      const { isAuthenticated, isGuestMode } = useAuthStore.getState();
      const { isTemporarySession } = useChatSessionStoreV2.getState();
      if (isAuthenticated && !isGuestMode && !isTemporarySession && sessionId) {
        chatSessionServiceV2
          .updateSession(sessionId, {
            messages: updatedMessages,
          })
          .catch((err) => console.error("Failed to update message:", err));
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
  setMessages: (sessionId: string, messages: ChatMessage[]) => {
    set((state: ChatMessageState) => ({
      messagesBySessionId: {
        ...state.messagesBySessionId,
        [sessionId]: messages,
      },
    }));
  },

  // Clear all messages for a session
  clearMessages: (sessionId: string) => {
    set((state: ChatMessageState) => {
      // Persist to backend if authenticated
      const { isAuthenticated, isGuestMode } = useAuthStore.getState();
      const { isTemporarySession } = useChatSessionStoreV2.getState();
      if (isAuthenticated && !isGuestMode && !isTemporarySession && sessionId) {
        chatSessionServiceV2
          .updateSession(sessionId, {
            messages: [],
          })
          .catch((err) => console.error("Failed to clear messages:", err));
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
  appendToMessage: (sessionId: string, messageId: string, content: string) => {
    set((state: ChatMessageState) => {
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
  completeMessage: (sessionId: string, messageId: string) => {
    get().updateMessage(sessionId, messageId, {
      status: MessageStatus.Done,
    });
  },

  // Mark a message as errored
  errorMessage: (sessionId: string, messageId: string) => {
    get().updateMessage(sessionId, messageId, {
      status: MessageStatus.Error,
    });
  },

  // Get all messages for a session
  getMessagesForSession: (sessionId: string) => {
    return get().messagesBySessionId[sessionId] || [];
  },
});

// 6. 创建选择器 - 提供更好的性能和引用追踪
export const chatMessageSelectors = {
  // 状态选择器
  messagesBySessionId: (state: ChatMessageStoreV2) => state.messagesBySessionId,
  isUpdating: (state: ChatMessageStoreV2) => state.isUpdating,

  // 行为选择器
  addMessage: (state: ChatMessageStoreV2) => state.addMessage,
  updateMessage: (state: ChatMessageStoreV2) => state.updateMessage,
  setMessages: (state: ChatMessageStoreV2) => state.setMessages,
  clearMessages: (state: ChatMessageStoreV2) => state.clearMessages,
  appendToMessage: (state: ChatMessageStoreV2) => state.appendToMessage,
  completeMessage: (state: ChatMessageStoreV2) => state.completeMessage,
  errorMessage: (state: ChatMessageStoreV2) => state.errorMessage,
  getMessagesForSession: (state: ChatMessageStoreV2) =>
    state.getMessagesForSession,
};

// 7. 创建自定义Hook - 提供更好的封装和模块化
export const useChatMessage = () => {
  const messagesBySessionId = useChatMessageStoreV2(
    chatMessageSelectors.messagesBySessionId
  );
  const isUpdating = useChatMessageStoreV2(chatMessageSelectors.isUpdating);

  const addMessage = useChatMessageStoreV2(chatMessageSelectors.addMessage);
  const updateMessage = useChatMessageStoreV2(
    chatMessageSelectors.updateMessage
  );
  const setMessages = useChatMessageStoreV2(chatMessageSelectors.setMessages);
  const clearMessages = useChatMessageStoreV2(
    chatMessageSelectors.clearMessages
  );
  const appendToMessage = useChatMessageStoreV2(
    chatMessageSelectors.appendToMessage
  );
  const completeMessage = useChatMessageStoreV2(
    chatMessageSelectors.completeMessage
  );
  const errorMessage = useChatMessageStoreV2(chatMessageSelectors.errorMessage);
  const getMessagesForSession = useChatMessageStoreV2(
    chatMessageSelectors.getMessagesForSession
  );

  return {
    // 状态
    messagesBySessionId,
    isUpdating,

    // 行为
    addMessage,
    updateMessage,
    setMessages,
    clearMessages,
    appendToMessage,
    completeMessage,
    errorMessage,
    getMessagesForSession,
  };
};

// 8. 创建Store
const useChatMessageStoreV2 = create<ChatMessageStoreV2>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createChatMessageActions(set, get),
    }),
    {
      name: "chat-message-store-v2",
    }
  )
);

export default useChatMessageStoreV2;
