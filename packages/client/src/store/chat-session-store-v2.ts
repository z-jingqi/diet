import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import { ChatMessage, Tag } from "@/lib/gql/graphql";
import useAuthStore from "@/store/auth-store";
import chatSessionServiceV2 from "@/services/chat-session-service-v2";
import { createUserMessageV2 } from "@/utils/chat-utils-v2";

// 1. 定义状态接口
interface ChatSessionState {
  currentSessionId: string | null;
  isTemporarySession: boolean;
  isNewSession: boolean;
}

// 2. 定义行为接口
interface ChatSessionActions {
  // 基本状态设置器
  setCurrentSession: (currentSessionId: string | null) => void;
  setTemporarySession: (isTemporarySession: boolean) => void;
  setIsNewSession: (isNewSession: boolean) => void;

  // 复杂行为
  createSession: (initialMessageContent?: string) => Promise<string>;
  createTemporarySession: () => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  renameSession: (sessionId: string, title: string) => Promise<void>;
  updateSessionTags: (sessionId: string, tags: Tag[]) => Promise<void>;
}

// 3. 合并完整的Store类型
export type ChatSessionStoreV2 = ChatSessionState & ChatSessionActions;

// 4. 初始状态
const initialSessionState: ChatSessionState = {
  currentSessionId: null,
  isTemporarySession: false,
  isNewSession: true,
};

// 5. 创建行为工厂函数 - 提供静态引用点
const createChatSessionActions = (set: any, get: any): ChatSessionActions => ({
  // 基本状态设置器
  setCurrentSession: (currentSessionId) => set({ currentSessionId }),
  setTemporarySession: (isTemporarySession) => set({ isTemporarySession }),
  setIsNewSession: (isNewSession) => set({ isNewSession }),

  // Action: Create new session
  createSession: async (initialMessageContent) => {
    const { isAuthenticated, isGuestMode } = useAuthStore.getState();

    // 先创建一个临时会话，让界面可以立即响应
    const tempSession = chatSessionServiceV2.createTemporarySession();
    const tempId = tempSession.id || nanoid();

    // 立即更新状态，使UI可以响应
    set({
      currentSessionId: tempId,
      isTemporarySession: true,
      isNewSession: false,
    });

    // 如果是游客模式或未登录用户，直接使用临时会话
    if (!isAuthenticated || isGuestMode) {
      return tempId;
    }

    // 对于已登录用户，在后台转换为永久会话
    try {
      // Convert initial message content to ChatMessage if provided
      const initialMessages: ChatMessage[] = initialMessageContent
        ? [createUserMessageV2(initialMessageContent)]
        : [];

      // 创建永久会话
      const newSession = await chatSessionServiceV2.createSession(
        "New Chat",
        initialMessages
      );

      const sessionId = newSession.id || tempId; // 如果API调用失败，保留临时ID

      // 更新状态为永久会话
      set({
        currentSessionId: sessionId,
        isTemporarySession: false,
        isNewSession: false,
      });

      return sessionId;
    } catch (error) {
      console.error("Error creating permanent session:", error);
      // 发生错误时继续使用临时会话
      return tempId;
    }
  },

  // Action: Create a temporary session
  createTemporarySession: () => {
    const tempSession = chatSessionServiceV2.createTemporarySession();
    const id = tempSession.id || nanoid(); // Ensure we always have an ID

    set({
      currentSessionId: id,
      isTemporarySession: true,
      isNewSession: true,
    });

    return id;
  },

  // Action: Switch to a different session
  switchSession: (sessionId) => {
    const { currentSessionId, isTemporarySession } = get();

    // If current session is temporary and switching to a different one,
    // we can discard the temporary session
    if (
      isTemporarySession &&
      currentSessionId &&
      currentSessionId !== sessionId
    ) {
      // No need to delete from backend as it's temporary
      // Just update state
    }

    set({
      currentSessionId: sessionId,
      isTemporarySession: false,
      isNewSession: false,
    });
  },

  // Action: Delete a session
  deleteSession: async (sessionId) => {
    const { currentSessionId, isTemporarySession } = get();
    const { isAuthenticated, isGuestMode } = useAuthStore.getState();

    // For authenticated users, delete from backend
    if (!isTemporarySession && isAuthenticated && !isGuestMode) {
      try {
        await chatSessionServiceV2.deleteSession(sessionId);
      } catch (error) {
        console.error(`Error deleting session ${sessionId}:`, error);
        // Continue with local deletion even if API call fails
      }
    }

    // If deleting current session, reset to new session state
    if (sessionId === currentSessionId) {
      set({
        currentSessionId: null,
        isTemporarySession: false,
        isNewSession: true,
      });
    }
  },

  // Action: Rename a session
  renameSession: async (sessionId, title) => {
    const { isTemporarySession } = get();
    const { isAuthenticated, isGuestMode } = useAuthStore.getState();

    // For authenticated users, update on backend
    if (!isTemporarySession && isAuthenticated && !isGuestMode) {
      try {
        await chatSessionServiceV2.updateSession(sessionId, { title });
      } catch (error) {
        console.error(`Error renaming session ${sessionId}:`, error);
      }
    }
  },

  // Action: Update session tags
  updateSessionTags: async (sessionId, tags) => {
    const { isTemporarySession } = get();
    const { isAuthenticated, isGuestMode } = useAuthStore.getState();

    // For authenticated users, update on backend
    if (!isTemporarySession && isAuthenticated && !isGuestMode) {
      try {
        await chatSessionServiceV2.updateSessionTags(sessionId, tags);
      } catch (error) {
        console.error(`Error updating tags for session ${sessionId}:`, error);
      }
    }
  },
});

// 6. 创建选择器 - 提供更好的性能和引用追踪
export const chatSessionSelectors = {
  // 状态选择器
  currentSessionId: (state: ChatSessionStoreV2) => state.currentSessionId,
  isTemporarySession: (state: ChatSessionStoreV2) => state.isTemporarySession,
  isNewSession: (state: ChatSessionStoreV2) => state.isNewSession,

  // 行为选择器
  setCurrentSession: (state: ChatSessionStoreV2) => state.setCurrentSession,
  setTemporarySession: (state: ChatSessionStoreV2) => state.setTemporarySession,
  setIsNewSession: (state: ChatSessionStoreV2) => state.setIsNewSession,
  createSession: (state: ChatSessionStoreV2) => state.createSession,
  createTemporarySession: (state: ChatSessionStoreV2) =>
    state.createTemporarySession,
  switchSession: (state: ChatSessionStoreV2) => state.switchSession,
  deleteSession: (state: ChatSessionStoreV2) => state.deleteSession,
  renameSession: (state: ChatSessionStoreV2) => state.renameSession,
  updateSessionTags: (state: ChatSessionStoreV2) => state.updateSessionTags,
};

// 7. 创建自定义Hook - 提供更好的封装和模块化
export const useChatSession = () => {
  const currentSessionId = useChatSessionStoreV2(
    chatSessionSelectors.currentSessionId
  );
  const isTemporarySession = useChatSessionStoreV2(
    chatSessionSelectors.isTemporarySession
  );
  const isNewSession = useChatSessionStoreV2(chatSessionSelectors.isNewSession);

  const setCurrentSession = useChatSessionStoreV2(
    chatSessionSelectors.setCurrentSession
  );
  const setTemporarySession = useChatSessionStoreV2(
    chatSessionSelectors.setTemporarySession
  );
  const setIsNewSession = useChatSessionStoreV2(
    chatSessionSelectors.setIsNewSession
  );
  const createSession = useChatSessionStoreV2(
    chatSessionSelectors.createSession
  );
  const createTemporarySession = useChatSessionStoreV2(
    chatSessionSelectors.createTemporarySession
  );
  const switchSession = useChatSessionStoreV2(
    chatSessionSelectors.switchSession
  );
  const deleteSession = useChatSessionStoreV2(
    chatSessionSelectors.deleteSession
  );
  const renameSession = useChatSessionStoreV2(
    chatSessionSelectors.renameSession
  );
  const updateSessionTags = useChatSessionStoreV2(
    chatSessionSelectors.updateSessionTags
  );

  return {
    // 状态
    currentSessionId,
    isTemporarySession,
    isNewSession,

    // 行为
    setCurrentSession,
    setTemporarySession,
    setIsNewSession,
    createSession,
    createTemporarySession,
    switchSession,
    deleteSession,
    renameSession,
    updateSessionTags,
  };
};

// 8. 创建Store
const useChatSessionStoreV2 = create<ChatSessionStoreV2>()(
  devtools(
    (set, get) => ({
      ...initialSessionState,
      ...createChatSessionActions(set, get),
    }),
    {
      name: "chat-session-store-v2",
    }
  )
);

export default useChatSessionStoreV2;
