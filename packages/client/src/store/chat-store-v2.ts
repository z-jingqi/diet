import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ChatMessagingState, ChatSessionState } from "./chat-types-v2";
import { ChatMessage, MessageStatus, MessageType } from "@/lib/gql/graphql";
import useAuthStore from "@/store/auth-store";
import chatServiceV2 from "@/services/chat-service-v2";
import chatSessionServiceV2 from "@/services/chat-session-service-v2";
import {
  createUserMessageV2,
  createAIMessageV2,
  toAIMessagesV2,
} from "@/utils/chat-utils-v2";

// 1. 定义状态接口
export interface ChatState extends ChatMessagingState, ChatSessionState {}

// 2. 定义行为接口
export interface ChatActions {
  // 基本状态设置器
  setLoading: (isLoading: boolean) => void;
  setGettingIntent: (gettingIntent: boolean) => void;
  setAbortController: (abortController?: AbortController) => void;
  setError: (error: string | null) => void;
  setCurrentSession: (currentSessionId: string | null) => void;
  setTemporarySession: (isTemporarySession: boolean) => void;
  setIsNewSession: (isNewSession: boolean) => void;

  // 核心操作
  abortCurrentMessage: () => void;
  clearMessages: (sessionId: string) => Promise<void>;
  fetchSessionMessages: (sessionId: string) => Promise<ChatMessage[]>;
  handleUserMessage: (content: string) => void;
  sendMessage: (content: string) => Promise<void>;

  // Intent handlers
  handleChatIntent: (
    sessionId: string,
    messages: ChatMessage[],
    aiMessages: any,
    isGuestMode?: boolean
  ) => Promise<void>;

  handleRecipeIntent: (
    sessionId: string,
    messages: ChatMessage[],
    aiMessages: any,
    isGuestMode?: boolean
  ) => Promise<void>;

  handleHealthAdviceIntent: (
    sessionId: string,
    messages: ChatMessage[],
    aiMessages: any,
    isGuestMode?: boolean
  ) => Promise<void>;
}

// 3. 合并完整的Store类型
export type ChatStoreV2 = ChatState & ChatActions;

// 4. 初始状态
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

const initialState: ChatState = {
  ...initialMessagingState,
  ...initialSessionState,
};

// 5. 创建行为工厂函数 - 提供静态引用点
const createChatActions = (set: any, get: any): ChatActions => ({
  // Basic state setters
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setGettingIntent: (gettingIntent: boolean) => set({ gettingIntent }),
  setAbortController: (abortController?: AbortController) =>
    set({ abortController }),
  setError: (error: string | null) => set({ error }),
  setCurrentSession: (currentSessionId: string | null) =>
    set({ currentSessionId }),
  setTemporarySession: (isTemporarySession: boolean) =>
    set({ isTemporarySession }),
  setIsNewSession: (isNewSession: boolean) => set({ isNewSession }),

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
  fetchSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
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
      if (!isTemporarySession && sessionId && isAuthenticated && !isGuestMode) {
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
});

// 6. 创建选择器 - 提供更好的性能和引用追踪
export const chatSelectors = {
  // 状态选择器
  isLoading: (state: ChatStoreV2) => state.isLoading,
  gettingIntent: (state: ChatStoreV2) => state.gettingIntent,
  abortController: (state: ChatStoreV2) => state.abortController,
  error: (state: ChatStoreV2) => state.error,
  currentSessionId: (state: ChatStoreV2) => state.currentSessionId,
  isTemporarySession: (state: ChatStoreV2) => state.isTemporarySession,
  isNewSession: (state: ChatStoreV2) => state.isNewSession,

  // 行为选择器
  setLoading: (state: ChatStoreV2) => state.setLoading,
  setGettingIntent: (state: ChatStoreV2) => state.setGettingIntent,
  setAbortController: (state: ChatStoreV2) => state.setAbortController,
  setError: (state: ChatStoreV2) => state.setError,
  setCurrentSession: (state: ChatStoreV2) => state.setCurrentSession,
  setTemporarySession: (state: ChatStoreV2) => state.setTemporarySession,
  setIsNewSession: (state: ChatStoreV2) => state.setIsNewSession,
  abortCurrentMessage: (state: ChatStoreV2) => state.abortCurrentMessage,
  clearMessages: (state: ChatStoreV2) => state.clearMessages,
  fetchSessionMessages: (state: ChatStoreV2) => state.fetchSessionMessages,
  handleUserMessage: (state: ChatStoreV2) => state.handleUserMessage,
  sendMessage: (state: ChatStoreV2) => state.sendMessage,
  handleChatIntent: (state: ChatStoreV2) => state.handleChatIntent,
  handleRecipeIntent: (state: ChatStoreV2) => state.handleRecipeIntent,
  handleHealthAdviceIntent: (state: ChatStoreV2) =>
    state.handleHealthAdviceIntent,
};

// 7. 创建自定义Hook - 提供更好的封装和模块化
export const useChat = () => {
  const isLoading = useChatStoreV2(chatSelectors.isLoading);
  const gettingIntent = useChatStoreV2(chatSelectors.gettingIntent);
  const abortController = useChatStoreV2(chatSelectors.abortController);
  const error = useChatStoreV2(chatSelectors.error);
  const currentSessionId = useChatStoreV2(chatSelectors.currentSessionId);
  const isTemporarySession = useChatStoreV2(chatSelectors.isTemporarySession);
  const isNewSession = useChatStoreV2(chatSelectors.isNewSession);

  const setLoading = useChatStoreV2(chatSelectors.setLoading);
  const setGettingIntent = useChatStoreV2(chatSelectors.setGettingIntent);
  const setAbortController = useChatStoreV2(chatSelectors.setAbortController);
  const setError = useChatStoreV2(chatSelectors.setError);
  const setCurrentSession = useChatStoreV2(chatSelectors.setCurrentSession);
  const setTemporarySession = useChatStoreV2(chatSelectors.setTemporarySession);
  const setIsNewSession = useChatStoreV2(chatSelectors.setIsNewSession);
  const abortCurrentMessage = useChatStoreV2(chatSelectors.abortCurrentMessage);
  const clearMessages = useChatStoreV2(chatSelectors.clearMessages);
  const fetchSessionMessages = useChatStoreV2(
    chatSelectors.fetchSessionMessages
  );
  const handleUserMessage = useChatStoreV2(chatSelectors.handleUserMessage);
  const sendMessage = useChatStoreV2(chatSelectors.sendMessage);
  const handleChatIntent = useChatStoreV2(chatSelectors.handleChatIntent);
  const handleRecipeIntent = useChatStoreV2(chatSelectors.handleRecipeIntent);
  const handleHealthAdviceIntent = useChatStoreV2(
    chatSelectors.handleHealthAdviceIntent
  );

  return {
    // 状态
    isLoading,
    gettingIntent,
    abortController,
    error,
    currentSessionId,
    isTemporarySession,
    isNewSession,

    // 行为
    setLoading,
    setGettingIntent,
    setAbortController,
    setError,
    setCurrentSession,
    setTemporarySession,
    setIsNewSession,
    abortCurrentMessage,
    clearMessages,
    fetchSessionMessages,
    handleUserMessage,
    sendMessage,
    handleChatIntent,
    handleRecipeIntent,
    handleHealthAdviceIntent,
  };
};

// 8. 创建Store
const useChatStoreV2 = create<ChatStoreV2>()(
  devtools(
    (set, get) => ({
      ...initialState,
      ...createChatActions(set, get),
    }),
    { name: "chat-store-v2" }
  )
);

export default useChatStoreV2;
